'use client';

import { useEffect, useState } from 'react';
import { MediaConnection, Peer, type DataConnection } from 'peerjs';
import { WebcamComponent, StreamDisplayComponent } from './_index';

const PeerConnector = () => {
    // Core peer state
    const [peer, setPeer] = useState<Peer | null>(null);
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connection, setConnection] = useState<DataConnection | null>(null);
    
    // Message state
    const [messages, setMessages] = useState<string[]>([]);
    
    // Call state
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [activeCall, setActiveCall] = useState<MediaConnection | null>(null);

    // Initialize peer connection
    useEffect(() => {
        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            console.log('My peer ID is:', id);
            setPeer(newPeer);
        });

        newPeer.on('connection', handleIncomingConnection);
        newPeer.on('call', handleIncomingCall);
        newPeer.on('error', (error) => console.error('Peer error:', error));

        return () => {
            // Clean up streams when component unmounts
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
            newPeer.destroy();
        };
    }, []);

    // Handle incoming data connection
    const handleIncomingConnection = (conn: DataConnection) => {
        setConnection(conn);
        setupConnectionHandlers(conn);
    };

    // Handle incoming call
    const handleIncomingCall = (call: MediaConnection) => {
        console.log('Incoming call received');
        setActiveCall(call);
        
        console.log(localStream);
        // Auto-answer the call, optionally with stream
        if (localStream) {
            console.log('Answering call with local stream');
            call.answer(localStream);
        } else {
            console.log('Answering call without local stream');
            call.answer();
        }
        
        call.on('stream', (incomingStream) => {
            console.log('Received remote stream');
            setRemoteStream(incomingStream);
        });
    };

    // Connect to a remote peer
    const connectToPeer = () => {
        if (!peer || !remotePeerId) return;
        
        const conn = peer.connect(remotePeerId);
        setConnection(conn);
        setupConnectionHandlers(conn);
    };

    // Set up connection event handlers
    const setupConnectionHandlers = (conn: DataConnection) => {
        conn.on('open', () => {
            console.log('Connected to peer:', conn.peer);
        });

        conn.on('data', (data) => {
            if (typeof data === 'string') {
                setMessages(prev => [...prev, `Them: ${data}`]);
            }
        });

        conn.on('close', () => {
            setConnection(null);
            setMessages(prev => [...prev, 'Connection closed']);
        });
    };

    // Send a message
    const sendMessage = (message: string) => {
        if (!connection) return;
        
        connection.send(message);
        setMessages(prev => [...prev, `Me: ${message}`]);
    };

    // Initiate a call
    const startCall = () => {
        console.log('Starting call');
        console.log(localStream);
        if (!peer || !remotePeerId || !localStream) return;
        
        const call: MediaConnection = peer.call(remotePeerId, localStream);

        call.on('stream', (incomingStream) => {
            console.log('Call started:', call);
            console.log(call.metadata);
            console.log('Received remote stream');

            setActiveCall(call);
            setRemoteStream(incomingStream);
        });

        call.on('error', (error) => {
            console.log('Error:', error);
        });

        call.on('close', () => {
            console.log('Call closed');
            setActiveCall(null);
            setRemoteStream(null);
        });
    };

    return (
        <div className="space-y-4 p-4">
            {/* Connection Status */}
            <div className="border p-4 rounded">
                <h2 className="font-bold">Connection Status</h2>
                <p>My Peer ID: {peer?.id || 'Connecting...'}</p>
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
                    <button 
                        onClick={() => sendMessage('Hello!')}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Send Hello
                    </button>
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
