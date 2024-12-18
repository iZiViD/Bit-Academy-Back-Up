"use client";

import React, { useState } from "react";
import Meet from "../_components/organisms/Meet";
import PeerConnector from "../_components/organisms/Peer";

const Home = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="">I'm Dad</h1>
            <div>
                <PeerConnector />
            </div>
        </div>
    );
}

export default Home;