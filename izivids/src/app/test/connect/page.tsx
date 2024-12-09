"use client";
import { useEffect, useState } from "react";
import { Peer } from "peerjs";

export default function Home() {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<Peer.DataConnection | null>(null);

    useEffect(() => {
        console.log('starting peer')
        const peer = new Peer('test-izivid-2');
        setPeer(peer);
        
        console.log(peer);

        console.log('starting connection')
        const conn = peer.connect('test-izivid-1');
        setConn(conn);

        console.log(conn);

    }, []);
    
    const sendData = () => {
        conn.send('hi!');
    }

    return (
        <>
            <div>test</div>
            <button onClick={sendData}>send data</button>
        </>
    );
}
