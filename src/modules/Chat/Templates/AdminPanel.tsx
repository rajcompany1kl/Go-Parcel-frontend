import React, { use, useEffect, useRef, useState } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import PendingChats from '../Components/PendingChats';
import type { ChatEndedPayload, ChatStartedPayload, Message, PendingUser, ReceiveMessagePayload } from '../types';
import ChatRoom from '../Components/ChatRoom';
import useAuth from '../../../shared/hooks/useAuth';

const SERVER = 'http://localhost:5000';

export default function AdminPanel() {
   const { user, role } = useAuth();

  // If you want admin id
  const adminId = role === 'admin' ? user?.id : null;

 // const [adminId] = useState<string>('admin-' + Math.random().toString(36).slice(2, 8));
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

    socket.on('newChatRequest', ({ userId, userName, trackingId }: PendingUser) => {
      setPending((prev) => [...prev, { userId, userName, trackingId }]);
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

 function accept(userId: string, trackingId: string) {
  if (roomId) {
    // End current chat first
    socketRef.current?.emit('endChat', { roomId, by: 'admin' });

    // Clear chat state
    setRoomId(null);
    setMessages([]);
  }

  // Accept new chat
  socketRef.current?.emit('acceptChat', { userId, adminId, adminName: 'Support', trackingId });
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
        pending.map((item) => (
          <PendingChats key={item.userId} p={item} accept={accept} />
        ))
      )}
    </section>

    {/* Active Chat */}
    {roomId && (
      <ChatRoom
        roomId={roomId}
        messages={messages}
        text={text}
        socketRef={socketRef}
        messagesRef={messagesRef}
        setText={setText}
        send={send}
      />
    )}
  </div>
);
;
}
