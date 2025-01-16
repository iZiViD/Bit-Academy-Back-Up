'use client';

import { useEffect, useState } from 'react';
import { type MediaConnection, Peer, type DataConnection } from 'peerjs';
import { WebcamComponent, StreamDisplayComponent } from './_index';
import { get } from 'http';

const PeerConnector = () => {
    // Core peer state
    const [peerId, setPeerId] = useState<string>('');
    const [peer, setPeer] = useState<Peer | null>(null);

    // Connection state
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connection, setConnection] = useState<DataConnection | null>(null);

    // Message state
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    // Call state
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [activeCall, setActiveCall] = useState<MediaConnection | null>(null);

    // Initialize peer connection
    useEffect(() => {
        console.log('useEffect');

        if (peer == null) {
            console.log('Creating new peer');
            const newPeer = new Peer({
                debug: 3,
            });

            newPeer.on('open', (id) => {
                console.log('My peer ID is:', id);
                setPeerId(id);
            });
            newPeer.on('connection', (conn) => {
                conn.on('open', () => {
                    console.log('Connected to peer:', conn.peer);
                    setRemotePeerId(conn.peer);
                });

                conn.on('data', (data) => {
                    if (typeof data === 'string') {
                        setMessages((prev) => [...prev, `Them: ${data}`]);
                    }
                });
                setConnection(conn);
            });

            newPeer.on('call', (call) => {
                call.on('stream', (incomingStream) => {
                    console.log('Received remote stream');
                    setRemoteStream(incomingStream);
                });

                call.on('error', (error) => {
                    console.log('Error:', error);
                });

                call.on('close', () => {
                    console.log('Call closed');
                    setRemoteStream(null);
                });
                console.log('Answering call');
                answerCall(call);
            });
            newPeer.on('error', (error) => console.error('Peer error:', error));

            setPeer(newPeer);
        }
    }, []);

    // Connect to a remote peer
    const connectToPeer = () => {
        if (!peer || !remotePeerId) return;

        const conn = peer.connect(remotePeerId);

        conn.on('open', () => { console.log('Connected to peer:', conn.peer); });

        conn.on('data', (data) => {
            if (typeof data === 'string') {
                setMessages((prev) => [...prev, `Them: ${data}`]);
            }
        });

        setConnection(conn);
    };

    const answerCall = async (call: MediaConnection) => {
        const stream = await getLocalStream()
        call.answer(stream);
        setActiveCall(call);
    }

    const getLocalStream = async (): Promise<MediaStream> => {
        if (localStream) {
            return localStream;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Camera started, tracks:', stream.getTracks());
        return stream;
    };

    // Send a message
    const sendMessage = (message: string) => {
        if (!connection) return;

        connection.send(message);
        setMessages((prev) => [...prev, `Me: ${message}`]);
    };

    // Initiate a call
    const startCall = () => {
        console.log('Starting call');
        console.log(localStream);
        if (!peer || !remotePeerId || !localStream) return;

        const call: MediaConnection = peer.call(remotePeerId, localStream);
        call.on('stream', (incomingStream) => {
            console.log('Received remote stream');
            setRemoteStream(incomingStream);
        });

        call.on('error', (error) => {
            console.log('Error:', error);
        });

        call.on('close', () => {
            console.log('Call closed');
            setRemoteStream(null);
        });
        setActiveCall(call);
    };

    return (
        <div className="space-y-4 p-4">
            {/* Connection Status */}
            <div className="border p-4 rounded">
                <h2 className="font-bold">Connection Status</h2>
                <p>My Peer ID: {peerId || 'Connecting...'}</p>
                {!connection && (
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={remotePeerId}
                            onChange={(e) => setRemotePeerId(e.target.value)}
                            placeholder="Remote Peer ID"
                            className="border p-2"
                        />
                        <button
                            onClick={connectToPeer}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={!peer || !remotePeerId}
                        >
                            Connect
                        </button>
                    </div>
                )}
            </div>

            {/* Messages */}
            {connection && (
                <div className="border p-4 rounded">
                    <h2 className="font-bold">Messages</h2>
                    <div className="h-40 overflow-y-auto border p-2 mb-2">
                        {messages.map((msg, i) => (
                            <p key={i}>{msg}</p>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                    <input
        type="text"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                sendMessage(message);
                setMessage('');
            }
        }}
        className="border p-2 flex-1 rounded-md"
    />
    <button
        onClick={() => {
            sendMessage(message);
            setMessage('');
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!message || !connection}
    >
        Send
    </button>
</div>
                </div>
            )}

            {/* Video Call */}
            {connection && (
                <div className="border p-4 rounded">
                    <h2 className="font-bold">Video Call</h2>
                    <div className="space-y-2">
                        <WebcamComponent onStreamReady={setLocalStream} />
                        {localStream && (
                            <>
                                <StreamDisplayComponent stream={localStream} />
                                <button
                                    onClick={startCall}
                                    disabled={!localStream || !!activeCall}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {activeCall ? 'Call Active' : 'Start Call'}
                                </button>
                            </>
                        )}
                        {remoteStream && (
                            <StreamDisplayComponent stream={remoteStream} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerConnector;
