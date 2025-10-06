import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const SERVER = 'http://localhost:5000';

// Define types for messages and socket events
type Message = {
  sender: string;
  text: string;
};

type ChatStartedPayload = {
  roomId: string;
  adminId: string;
  adminName?: string;
};

type ChatEndedPayload = {
  by?: string;
};

type SendMessagePayload = {
  roomId: string;
  sender: 'user' | 'admin';
  text: string;
};

type EndChatPayload = {
  roomId: string;
  by: string;
};

// Type for URL params
type RouteParams = {
  userId: string;
};

export default function UserChat() {
  const { userId } = useParams<RouteParams>();
  const [status, setStatus] = useState<'requesting' | 'waiting' | 'connected' | 'ended'>('requesting');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io(SERVER);
    socketRef.current = socket;
    console.log(userId);
const userName = `User-${userId?.slice(-4) || '0000'}`;

    socket.emit('chatRequest', { userId, userName });

    socket.on('waitingForAdmin', () => setStatus('waiting'));

    socket.on('chatStarted', ({ roomId: rId, adminId, adminName }: ChatStartedPayload) => {
      setRoomId(rId);
      setStatus('connected');
      setMessages((prev) => [
        ...prev,
        { sender: 'system', text: `Connected to ${adminName || adminId}` }
      ]);
    });

    socket.on('receiveMessage', (m: Message) => {
      setMessages((prev) => [...prev, m]);
    });

    socket.on('chatEnded', ({ by }: ChatEndedPayload) => {
      setStatus('ended');
      setMessages((prev) => [
        ...prev,
        { sender: 'system', text: `Chat ended (${by || 'unknown'})` }
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  function send() {
    if (!roomId || !text.trim()) return;
    const payload: SendMessagePayload = {
      roomId,
      sender: 'user',
      text: text.trim()
    };
    socketRef.current?.emit('sendMessage', payload);
    setMessages((prev) => [...prev, { sender: 'user', text: text.trim() }]);
    setText('');
  }

  function endChat() {
    if (roomId) {
      const payload: EndChatPayload = { roomId, by: 'user' };
      socketRef.current?.emit('endChat', payload);
    }
  }

  return (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 800,
    margin: '0 auto',
    padding: '1rem',
    fontFamily: 'Segoe UI, sans-serif'
  }}>
    <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 10 }}>
      Live Chat <span style={{ fontSize: 16, color: '#555' }}> (You: {userId})</span>
    </h2>

    <div style={{
      padding: '10px 16px',
      backgroundColor: '#f1f5f9',
      borderRadius: 8,
      border: '1px solid #ccc',
      marginBottom: 16
    }}>
      Status: <strong style={{
        color: status === 'connected' ? 'green' :
               status === 'waiting' ? 'orange' :
               status === 'ended' ? 'red' : '#000'
      }}>{status}</strong>
    </div>

    <div
      ref={messagesRef}
      style={{
        flex: 1,
        maxHeight: 400,
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '12px',
        backgroundColor: '#ffffff',
        marginBottom: 16
      }}
    >
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: m.sender === 'user' ? 'flex-end' :
                          m.sender === 'admin' ? 'flex-start' : 'center',
            marginBottom: 10
          }}
        >
          <div style={{
            padding: '8px 12px',
            borderRadius: 12,
            maxWidth: '70%',
            backgroundColor:
              m.sender === 'user' ? '#3b82f6' :
              m.sender === 'admin' ? '#e5e7eb' : '#facc15',
            color: m.sender === 'user' ? '#fff' : '#000',
            fontSize: 14,
            lineHeight: 1.4
          }}>
            <strong>{m.sender}</strong>: {m.text}
          </div>
        </div>
      ))}
    </div>

    {status === 'waiting' && (
      <div style={{
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#9ca3af'
      }}>
        Waiting for an admin to accept your request...
      </div>
    )}

    {status === 'connected' && (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 14
          }}
        />
        <button
          onClick={send}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Send
        </button>
        <button
          onClick={endChat}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          End
        </button>
      </div>
    )}

    {status === 'ended' && (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <p>Chat ended. <Link to="/" style={{ color: '#3b82f6' }}>Back home</Link></p>
      </div>
    )}
  </div>
);
}
