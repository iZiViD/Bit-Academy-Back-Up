import React, { useState, useRef, useEffect } from "react";
import { WebcamLayout } from "../templates/_index";
import { VideoCanvas } from "../atoms/_index";
import { CameraControls } from "./_index";
import { FrameButtonGroup, FilterButtonGroup } from "../molecules/_index";

const WebcamComponent = ({
  onStreamReady,
}: {
  onStreamReady: (stream: MediaStream) => void;
}) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [filter, setFilter] = useState<
    "none" | "grayscale" | "sepia" | "invert"
  >("none");
  const [isMirrored, setIsMirrored] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let animationFrameId: number;
  const [frame, setFrame] = useState<string | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Stream set to video element:", stream);
        await videoRef.current.play().catch(() => {
          console.log("Video play interrupted");
        });
        onStreamReady(stream); // Pass the stream to the parent component
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
    const context = canvasRef.current.getContext("2d");
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
      applyFilter(imageData.data);
      context.putImageData(imageData, 0, 0);

      if (frameImageRef.current && frameImageRef.current.complete && frame) {
        context.drawImage(
          frameImageRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
      }
    }
    animationFrameId = requestAnimationFrame(drawToCanvas);
  };

  useEffect(() => {
    if (isCameraOn) {
      drawToCanvas();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraOn, filter, isMirrored, frame]);

  useEffect(() => {
    if (frame) {
      const img = new Image();
      img.src = frame;
      img.onload = () => {
        if (frameImageRef.current) {
          frameImageRef.current.src = frame;
          console.log("Frame image loaded:", frame);
        }
      };
    } else if (frameImageRef.current) {
      frameImageRef.current.src = ""; // Clear the image source
      console.log("Frame removed");
    }
  }, [frame]);

  return (
    <WebcamLayout
      canvas={
        <>
          <VideoCanvas canvasRef={canvasRef} isBlurred={!isCameraOn} />
          <video ref={videoRef} className="hidden" playsInline />
          <img ref={frameImageRef} alt="Frame" className="hidden" />
        </>
      }
      cameraControls={
        <CameraControls
          isCameraOn={isCameraOn}
          onCameraToggle={isCameraOn ? stopCamera : startCamera}
          onMirrorToggle={() => setIsMirrored(!isMirrored)}
          isMirrored={isMirrored}
        />
      }
      filterControls={
        <FilterButtonGroup onFilterChange={setFilter} disabled={!isCameraOn} />
      }
      frameControls={
        <FrameButtonGroup onFrameChange={setFrame} disabled={!isCameraOn} />
      }
    />
  );
};

export default WebcamComponent;
