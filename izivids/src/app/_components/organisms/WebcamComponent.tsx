"use client";

import { useState, useRef, useEffect } from "react";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

const Home = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [filter, setFilter] = useState<
    "none" | "grayscale" | "sepia" | "invert"
  >("none");
  const [isMirrored, setIsMirrored] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  let animationFrameId: number;
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [frame, setFrame] = useState<string | null>();

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          console.log("Video play interrupted");
        });
      }
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
      videoRef.current.pause();
    }
    setIsCameraOn(false);
    cancelAnimationFrame(animationFrameId);
  };

  const applyFilter = (data: Uint8ClampedArray) => {
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i] ?? 0;
      const green = data[i + 1] ?? 0;
      const blue = data[i + 2] ?? 0;

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

    const context = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    if (context) {
      context.save();

      if (isMirrored) {
        context.scale(-1, 1);
        context.translate(-canvasRef.current.width, 0);
      }

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      context.restore();

      const imageData = context.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const data = imageData.data;

      applyFilter(data);

      context.putImageData(imageData, 0, 0);
    }

    if (
      frameImageRef.current &&
      canvasRef.current &&
      context &&
      isFrameLoaded
    ) {
      context.drawImage(
        frameImageRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
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

  function activateGoldFrame() {
    setFrame("/assets/frames/golden-frame.svg");
  }

  function activateBirthdayFrame() {
    setFrame("/assets/frames/birthday-frame.png");
  }

  function disableFrame() {
    setFrame(null);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Camera Viewer with Filters</h1>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border border-gray-300"
      ></canvas>
      <video ref={videoRef} className="hidden"></video>

      {frame && (
        <img ref={frameImageRef} src={frame} alt="Frame" className="hidden" />
      )}
      <div className="mt-4">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Open Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Stop Camera
          </button>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setFilter("none")}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          No Filter
        </button>
        <button
          onClick={() => setFilter("grayscale")}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Grayscale
        </button>
        <button
          onClick={() => setFilter("sepia")}
          className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          Sepia
        </button>
        <button
          onClick={() => setFilter("invert")}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Invert
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
        >
          {isMirrored ? "Unmirror" : "Mirror"} Camera
        </button>
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <button
          className="btn btn-circle btn-outline btn-active"
          onClick={disableFrame}
        >
          <HideImageOutlinedIcon />
        </button>
        <button className="btn btn-active" onClick={activateGoldFrame}>
          Golden frame
        </button>
        <button className="btn btn-active" onClick={activateBirthdayFrame}>
          Birthday frame
        </button>
      </div>
    </div>
  );
};

export default Home;
