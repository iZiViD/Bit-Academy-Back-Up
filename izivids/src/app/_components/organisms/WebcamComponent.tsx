import React, { useState, useRef, useEffect } from "react";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

interface WebcamComponentProps {
  onStreamReady?: (stream: MediaStream | null) => void;
}

const WebcamComponent = ({ onStreamReady }: WebcamComponentProps) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [filter, setFilter] = useState<"none" | "grayscale" | "sepia" | "invert">("none");
  const [isMirrored, setIsMirrored] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [frame, setFrame] = useState<string | null>(null);
  let animationFrameId: number;

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (onStreamReady) onStreamReady(stream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (onStreamReady) onStreamReady(null);
    setIsCameraOn(false);
    cancelAnimationFrame(animationFrameId);
  };

  const applyFilter = (data: Uint8ClampedArray) => {
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      switch (filter) {
        case "grayscale":
          const avg = (red + green + blue) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
          break;
        case "sepia":
          data[i] = red * 0.393 + green * 0.769 + blue * 0.189;
          data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168;
          data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
          break;
        case "invert":
          data[i] = 255 - red;
          data[i + 1] = 255 - green;
          data[i + 2] = 255 - blue;
          break;
        case "none":
        default:
          break;
      }
    }
  };

  const drawToCanvas = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d", { willReadFrequently: true });
    if (context) {
      context.save();

      if (isMirrored) {
        context.scale(-1, 1);
        context.translate(-canvasRef.current.width, 0);
      }

      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      context.restore();

      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const data = imageData.data;

      applyFilter(data);

      context.putImageData(imageData, 0, 0);

      if (frameImageRef.current && isFrameLoaded) {
        context.drawImage(frameImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    animationFrameId = requestAnimationFrame(drawToCanvas);
  };

  useEffect(() => {
    if (isCameraOn) {
      drawToCanvas();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraOn, filter, isMirrored, isFrameLoaded]);

  useEffect(() => {
    if (frameImageRef.current) {
      frameImageRef.current.onload = () => setIsFrameLoaded(true);
    }
  }, [frame]);

  const activateFrame = (framePath: string) => setFrame(framePath);
  const disableFrame = () => setFrame(null);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Camera Viewer</h1>
      <canvas ref={canvasRef} width={640} height={480} className="border"></canvas>
      <video ref={videoRef} className="hidden"></video>
      {frame && <img ref={frameImageRef} src={frame} alt="Frame" className="hidden" />}
      <div className="mt-4">
        <button
          onClick={isCameraOn ? stopCamera : startCamera}
          className={`px-4 py-2 rounded ${isCameraOn ? "bg-red-500" : "bg-blue-500"} text-white`}
        >
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        {["none", "grayscale", "sepia", "invert"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "none" | "grayscale" | "sepia" | "invert")}
            className="px-4 py-2 rounded bg-gray-500 text-white"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button onClick={() => setIsMirrored(!isMirrored)} className="px-4 py-2 bg-indigo-500 text-white rounded">
          {isMirrored ? "Unmirror" : "Mirror"}
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={disableFrame} className="p-2 border rounded">
          <HideImageOutlinedIcon />
        </button>
        <button onClick={() => activateFrame("/assets/frames/golden-frame.svg")} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Golden Frame
        </button>
        <button onClick={() => activateFrame("/assets/frames/birthday-frame.png")} className="px-4 py-2 bg-green-500 text-white rounded">
          Birthday Frame
        </button>
      </div>
    </div>
  );
};

export default WebcamComponent;
