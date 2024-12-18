"use client";

import React, { useState } from "react";
import {WebcamComponent, WebRTCComponent} from "../_components/organisms/_index";

const Home = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Camera Viewer with Filters</h1>
      <WebcamComponent onStreamReady={setLocalStream} />
      {localStream && <WebRTCComponent localStream={localStream} />}
    </div>
  );
};

export default Home;
