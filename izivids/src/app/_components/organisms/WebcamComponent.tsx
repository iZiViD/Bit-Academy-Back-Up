import React, { useState, useRef, useEffect } from "react";

interface WebcamComponentProps {
  onStreamReady: (stream: MediaStream | null) => void;
}

const WebcamComponent = ({ onStreamReady }: WebcamComponentProps) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFilterOn, setIsFilterOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera started, tracks:', stream.getTracks());
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const processedStream =  canvasRef.current?.captureStream();
      if (processedStream) {
        onStreamReady(processedStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera.");
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          console.log('Stopping tracks:', stream.getTracks());
          stream.getTracks().forEach(track => {
            track.stop();
            console.log('Track stopped:', track.label);
          });
        });
    }
    onStreamReady(null);
    setIsCameraOn(false);
  };

  useEffect(() => {
    const applyFilter = () => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          if (isFilterOn) {
            const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // red
              data[i + 1] = avg; // green
              data[i + 2] = avg; // blue
            }
            context.putImageData(imageData, 0, 0);
          }
        }
      }
      requestAnimationFrame(applyFilter);
    };

    if (isCameraOn) {
      applyFilter();
    }
  }, [isCameraOn, isFilterOn]);

  return (
    <div>
      <video ref={videoRef} style={{ display: isFilterOn ? 'none' : 'block' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: isFilterOn ? 'block' : 'none' }} />
      <button 
        onClick={isCameraOn ? stopCamera : startCamera}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
      </button>
      <button 
        onClick={() => setIsFilterOn(!isFilterOn)}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        {isFilterOn ? 'Disable Filter' : 'Enable Filter'}
      </button>
    </div>
  );
};

export default WebcamComponent;
