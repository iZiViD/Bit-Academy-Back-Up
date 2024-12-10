"use client";

import { useState, useRef, useEffect } from "react";

const Home = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
        videoRef.current.play();
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
    }
    setIsCameraOn(false);
    cancelAnimationFrame(animationFrameId);
  };

  const drawToCanvas = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    animationFrameId = requestAnimationFrame(drawToCanvas);
  };

  useEffect(() => {
    if (isCameraOn) {
      drawToCanvas();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraOn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Camera Viewer on Canvas</h1>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="border border-gray-300"
      ></canvas>
      <video ref={videoRef} className="hidden"></video>
      <div className="mt-4">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
