"use client";
import { useEffect, useState } from "react";
import { Peer, DataConnection } from 'peerjs'

export default function Test() {
    const [peerId, setPeerId] = useState('');
    const [peer, setPeer] = useState<Peer|null>(null);
    const [connectToPeerId, setConnectToPeerId] = useState('');
    const [conn, setConn] = useState<DataConnection|null>(null);

    const createPeer = () => {
        const peer = new Peer();
        setPeer(peer);
        
        peer.on('open', (id: string) => {
            setPeerId(id);
        });
    }

    const connectToPeer = () => {
        if (!peer) {
            console.error('Peer not created');
            return
        }
        const conn = peer.connect(connectToPeerId);
        setConn(conn);
    }


    return (
        <div>
            <h1>test</h1>
            <button onClick={createPeer}>Create Peer</button>
            <p>Peer id: {peerId}</p>
            <hr />
            <input type="text" placeholder="Connect to Peer id" onChange={(e) => setConnectToPeerId(e.target.value)} />
            <button onClick={() => connectToPeer()}>Connect to Peer</button>
            <p>Connection id: {conn?.serialization}</p>
            <hr />
            <button onClick={() => conn?.send('Hello')}>Send</button>
        </div>
    )
}
