"use client";

import React, { useState } from "react";
import { WebcamComponent, WebRTCComponent } from "./_index";

const Meet = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    return (
        <>
            <WebcamComponent onStreamReady={setLocalStream} />
            {localStream && <WebRTCComponent localStream={localStream} />}
        </>
    );
};

export default Meet;