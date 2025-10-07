import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER = 'http://localhost:5000';

interface PendingUser {
  userId: string;
  userName: string;
}

interface Message {
  sender: string;
  text: string;
}

interface ChatStartedPayload {
  roomId: string;
  userId: string;
}

interface ReceiveMessagePayload extends Message {}

interface ChatEndedPayload {
  by?: string;
}

export default function AdminPanel() {
  const [adminId] = useState<string>('admin-' + Math.random().toString(36).slice(2, 8));
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket: Socket = io(SERVER);
    socketRef.current = socket;

    socket.emit('registerAsAdmin', { adminId, adminName: 'Support' });

    socket.on('pendingList', (list: PendingUser[]) => {
      setPending(list);
    });

    socket.on('newChatRequest', ({ userId, userName }: PendingUser) => {
      setPending((prev) => [...prev, { userId, userName }]);
    });

    socket.on('removePending', ({ userId }: { userId: string }) => {
      setPending((prev) => prev.filter((p) => p.userId !== userId));
    });

    socket.on('acceptFailed', ({ reason }: { reason: string }) => {
      alert('Accept failed: ' + reason);
    });

    socket.on('chatStarted', ({ roomId: rId, userId }: ChatStartedPayload) => {
      setRoomId(rId);
      setMessages((prev) => [...prev, { sender: 'system', text: `Chat started with ${userId}` }]);
    });

    socket.on('receiveMessage', (m: ReceiveMessagePayload) => setMessages((prev) => [...prev, m]));

    socket.on('chatEnded', ({ by }: ChatEndedPayload) => {
      setMessages((prev) => [...prev, { sender: 'system', text: `Chat ended (${by || 'unknown'})` }]);
      setRoomId(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [adminId]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

 function accept(userId: string) {
  if (roomId) {
    // End current chat first
    socketRef.current?.emit('endChat', { roomId, by: 'admin' });

    // Clear chat state
    setRoomId(null);
    setMessages([]);
  }

  // Accept new chat
  socketRef.current?.emit('acceptChat', { userId, adminId, adminName: 'Support' });
  setPending((prev) => prev.filter((p) => p.userId !== userId));
}


  function send() {
    if (!roomId || !text.trim()) return;
    socketRef.current?.emit('sendMessage', { roomId, sender: 'admin', text: text.trim() });
    setMessages((prev) => [...prev, { sender: 'admin', text: text.trim() }]);
    setText('');
  }
return (
  <div style={{
    maxWidth: 900,
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#1f2937'
  }}>
    <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
      Admin Panel <span style={{ fontSize: 14, color: '#6b7280' }}>({adminId})</span>
    </h2>

    {/* Pending Requests */}
    <section style={{
      marginBottom: 30,
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ fontSize: 18, marginBottom: 12 }}>Pending Chat Requests</h3>
      {pending.length === 0 ? (
        <div style={{ color: '#9ca3af' }}>No pending requests</div>
      ) : (
        pending.map((p) => (
          <div key={p.userId} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div>
              <strong>{p.userName}</strong> <small style={{ color: '#6b7280' }}>({p.userId})</small>
            </div>
            <button
              onClick={() => accept(p.userId)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Accept
            </button>
          </div>
        ))
      )}
    </section>

    {/* Active Chat */}
    {roomId && (
      <section style={{
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '1rem',
        backgroundColor: '#ffffff'
      }}>
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>
          Active Chat <span style={{ fontSize: 14, color: '#6b7280' }}>(Room ID: {roomId})</span>
        </h3>

        {/* Messages Box */}
        <div
          ref={messagesRef}
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            backgroundColor: '#f8fafc'
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent:
                  m.sender === 'admin' ? 'flex-end' :
                  m.sender === 'user' ? 'flex-start' : 'center',
                marginBottom: 10
              }}
            >
              <div style={{
                padding: '10px 14px',
                borderRadius: 12,
                maxWidth: '70%',
                backgroundColor:
                  m.sender === 'admin' ? '#3b82f6' :
                  m.sender === 'user' ? '#e5e7eb' : '#facc15',
                color: m.sender === 'admin' ? '#fff' : '#000',
                fontSize: 14,
                lineHeight: 1.4
              }}>
                <strong>{m.sender}</strong>: {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input & Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
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
            onClick={() => socketRef.current?.emit('endChat', { roomId, by: 'admin' })}
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
      </section>
    )}
  </div>
);
;
}
