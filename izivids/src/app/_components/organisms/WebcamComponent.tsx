import React, { useState } from "react";

interface WebcamComponentProps {
  onStreamReady: (stream: MediaStream | null) => void;
}

const WebcamComponent = ({ onStreamReady }: WebcamComponentProps) => {
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera started, tracks:', stream.getTracks());
      onStreamReady(stream);
      setIsCameraOn(true);
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

  return (
    <button 
      onClick={isCameraOn ? stopCamera : startCamera}
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      {isCameraOn ? 'Stop Camera' : 'Start Camera'}
    </button>
  );
};

export default WebcamComponent;
