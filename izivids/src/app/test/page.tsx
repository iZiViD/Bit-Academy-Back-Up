"use client";
import { useEffect, useState } from "react";
import { Peer } from "peerjs";

export default function Home() {
    const [peer, setPeer] = useState<Peer | null>(null);

    useEffect(() => {
        console.log('starting peer')
        const peer = new Peer('test-izivid-1');
        setPeer(peer);

        console.log(peer);
        peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on("open", () => {
                console.log("Connection opened");
            });
        });

    }, []);
// You can pick your own id or omit the id if you want to get a random one from the server.

    return (
        <div>test</div>

    );
}
