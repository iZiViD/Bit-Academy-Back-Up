"use client";
import { useState } from "react";
import { Peer } from 'peerjs'

export default function Test() {
    const [peer, setPeer] = useState<Peer|null>(null);
    const [peerId, setPeerId] = useState('');

    const createPeer = () => {
        const peer = new Peer();
        setPeer(peer);
        
        peer.on('open', (id: string) => {
            setPeerId(id);
        });

        peer.on('connection', (conn) => {
            console.log('connection', conn);

            conn.on('data', (data) => {
                console.log('data', data);
            });
        })
    }


    return (
        <div>
        <h1>test</h1>
        <button onClick={createPeer}>Create Peer</button>
        <p>Peer id: {peerId}</p>
        {peer && <p>Peer is created</p>}
        </div>
    )
}
