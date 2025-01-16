"use client";

import { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

export default function ScreenSharing() {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", id => {
      setPeerId(id);
      console.log("Screen sharing peer ID is: " + id);
    });

    peer.on("call", call => {
      console.log("Receiving a call");
      call.answer();
      call.on("stream", remoteStream => {
        console.log("Receiving remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    });

    return () => {
      if (localVideoRef.current) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const askForScreenSharing = async () => {
    const constraints: MediaStreamConstraints = { video: true, audio: true };

    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        throw new Error("getDisplayMedia is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.addEventListener('ended', () => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = null;
            }
          });
        }

        if (peerRef.current && remotePeerId) {
          console.log("Calling remote peer ID: " + remotePeerId);
          const call = peerRef.current.call(remotePeerId, stream);
          call.on("stream", remoteStream => {
            console.log("Receiving remote stream from call");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        } else {
          console.error("Peer or remotePeerId is not set");
        }
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Failed to share screen: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div className="container">
      <button onClick={askForScreenSharing} className="btn bg-yellow-500 text-white">
        Share Screen
      </button>
      <div className="video-container">
        <video ref={localVideoRef} id="localVideo" className="video" autoPlay muted></video>
        <video ref={remoteVideoRef} id="remoteVideo" className="video" autoPlay></video>
      </div>
    </div>
  );
}