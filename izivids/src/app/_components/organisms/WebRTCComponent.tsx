import React, { useRef, useEffect } from "react";

const WebRTCComponent = ({ localStream }: { localStream: MediaStream }) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localStream) {
      const peerConnection = new RTCPeerConnection();

      // Add local stream tracks to the peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Set up event listener for remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = peerConnection;
    }
  }, [localStream]);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto"></video>
    </div>
  );
};

export default WebRTCComponent;