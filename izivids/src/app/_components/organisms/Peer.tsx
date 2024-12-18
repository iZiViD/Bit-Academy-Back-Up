'use client';

import { useEffect, useState, useRef } from 'react';
import { Peer, type DataConnection } from 'peerjs';
import { WebcamComponent, WebRTCComponent } from './_index';
import { set } from 'zod';

const PeerConnector = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [connectToPeerId, setConnectToPeerId] = useState('');
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [receivedData, setData] = useState('');
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const createPeer = () => {
            const peer = new Peer();

            peer.on('open', (id: string) => {
                setPeer(peer);
                console.log('peer id', id);
            });

            peer.on('connection', registerConnection);

            peer.on('call', registerCall);
        };
        createPeer();

        return () => {
            peer?.destroy();
        };
    }, []);

    const registerConnection = (incommingConn: DataConnection) => {
        setConn(incommingConn);

        incommingConn.on('data', (data) => {
            console.log('data', data);
            setData(data);
        })
    }

    const connectToPeer = () => {
        const newConnection = peer.connect(connectToPeerId);
        registerConnection(newConnection);
    };

    const registerCall = (call: any) => {
        call.answer(localStream!);

        call.on('stream', (remoteStream) => {
            console.log('remote stream', remoteStream);
            remoteVideoRef.current!.srcObject = remoteStream;
        });
    }

    const callPeer = () => {
        const call = peer.call(connectToPeerId, localStream!);

        console.log('call', call);
        
        call.on('stream', (remoteStream) => {
            console.log('remote stream', remoteStream);
        });
    }

    const connectElement = (<>
        <input type="text" placeholder="Connect to Peer id" onChange={(e) => setConnectToPeerId(e.target.value)} />
        <button onClick={() => connectToPeer()}>Connect to Peer</button>
    </>);

    return (
        <div>
            <hr />
            {peer ? <p>Peer id: {peer.id}</p> : <p>Peer not created</p>}
            {peer ? connectElement : null}
            <hr />
            <button onClick={() => conn?.send('Hello')}>Send hello</button>
            <p>Received data: {receivedData}</p>
            <button onClick={callPeer}>Call Peer</button>
            <WebcamComponent onStreamReady={setLocalStream} />
            {localStream && <WebRTCComponent localStream={localStream} />}

            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto"></video>
        </div>
    );
};

export default PeerConnector;
