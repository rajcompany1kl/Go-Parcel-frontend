import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import useAuth from '../../../shared/hooks/useAuth';

import type {
  Message,
  ChatStartedPayload,
  ChatEndedPayload,
  SendMessagePayload,
  EndChatPayload
} from '../usertypes';
import ChatMessages from '../Components/ChatMessages';

const SERVER = 'http://localhost:5000';

export default function UserChat() {
  const { trackingId } = useAuth(); 

  const { userId } = useParams<{ userId: string }>();
  const [status, setStatus] = useState<'requesting' | 'waiting' | 'connected' | 'ended'>('requesting');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io(SERVER);

    socketRef.current = socket;
    const userName = `User-${userId?.slice(-4) || '0000'}`;

    socket.emit('chatRequest', { userId, userName, trackingId });

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
    <div className="flex flex-col max-w-[800px] mx-auto p-4 font-['Segoe_UI',sans-serif]">
      <h2 className="text-2xl font-semibold mb-2">
        Live Chat <span className="text-base text-gray-600">(You: {userId})</span>
      </h2>

      <div className="p-3 bg-slate-100 rounded-lg border border-gray-300 mb-4">
        Status:{' '}
        <strong
          className={
            status === 'connected'
              ? 'text-green-600'
              : status === 'waiting'
              ? 'text-orange-500'
              : status === 'ended'
              ? 'text-red-600'
              : 'text-black'
          }
        >
          {status}
        </strong>
      </div>

      <ChatMessages messages={messages} messagesRef={messagesRef} />

      {status === 'waiting' && (
        <div className="text-center italic text-gray-400">
          Waiting for an admin to accept your request...
        </div>
      )}

      {status === 'connected' && (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none"
          />
          <button
            onClick={send}
            className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
          <button
            onClick={endChat}
            className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition"
          >
            End
          </button>
        </div>
      )}

      {status === 'ended' && (
        <div className="text-center mt-4">
          <p>
            Chat ended.{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Back home
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
