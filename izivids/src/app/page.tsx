"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { LatestPost } from "#/app/_components/post";
import { auth } from "#/server/auth";
import { api, HydrateClient } from "#/trpc/server";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  const askForScreenSharing = async () => {
    const constraints = { video: { cursor: "always" }, audio: true };

    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        throw new Error("getDisplayMedia is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        stream.getVideoTracks()[0].addEventListener('ended', () => {
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        });
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Failed to share screen: " + error.message);
    }
  };

  return (
    <div>
      {isClient && (
        <>
            <button onClick={askForScreenSharing} className="btn btn-circle btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 437.24" className="h-10 w-10">
              <path d="M16.03 0h479.94C504.8 0 512 7.2 512 16.03v317.62c0 8.83-7.2 16.03-16.03 16.03H16.03C7.2 349.68 0 342.48 0 333.65V16.03C0 7.2 7.2 0 16.03 0zm279.34 72.67c18.8 0 34.03 15.25 34.03 34.02 0 18.81-15.23 34.03-34.03 34.03-8 0-15.71-2.82-21.8-7.89l-45.19 18.83c.14 1.28.23 2.57.25 3.87l46.98 21.65a33.98 33.98 0 0 1 19.59-6.24c18.66 0 33.87 15.17 33.87 33.89 0 18.71-15.21 33.87-33.87 33.87-18.73 0-33.89-15.16-33.89-33.87 0-2.58.29-5.17.89-7.72l-41.76-19.23a34.06 34.06 0 0 1-25.87 11.94c-18.76 0-34.01-15.25-34.01-34.04 0-18.78 15.25-34.01 34.01-34.01 8.45 0 16.59 3.13 22.83 8.76l44.35-18.5c-.27-1.76-.4-3.54-.4-5.34 0-18.77 15.21-34.02 34.02-34.02zm29.03 299.14c.39 25.16 10.76 47.72 38.84 65.43H140.12c22.61-16.38 38.93-36.18 38.84-65.43H324.4zM35.19 22.9h441.67c7.83 0 14.16 6.38 14.16 14.16v237.26c0 7.78-6.38 14.16-14.16 14.16H35.19c-7.78 0-14.16-6.38-14.16-14.16V37.06c-.05-7.82 6.37-14.16 14.16-14.16z"/>
            </svg>
          </button>
        </>
      )}
      <video ref={videoRef} id="previewVideo" style={{ width: '100%', height: 'auto' }}></video>
    </div>
  );
}