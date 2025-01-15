import React, { useRef, useEffect } from "react";

interface StreamDisplayProps {
  stream: MediaStream;
  className?: string;
}

const StreamDisplayComponent = ({ stream, className = "w-full h-auto" }: StreamDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      // console log the srcObject with big red letters
      console.log('%c srcObject:', 'color: red; font-size: 16px;', videoRef.current);
    }
  }, [stream]);

  return (
    <video 
      ref={videoRef}
      autoPlay 
      playsInline
      className={className}
    />
  );
};

export default StreamDisplayComponent; 