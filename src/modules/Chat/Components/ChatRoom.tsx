import React from 'react'
import type { Socket } from 'socket.io-client';
import type { Message } from '../types';

const ChatRoom: React.FC<{
    roomId: string | null;
    messages: Message[];
    text: string;
    socketRef: React.RefObject<Socket | null>;
    messagesRef: React.RefObject<HTMLDivElement | null>;
    setText: React.Dispatch<React.SetStateAction<string>>;
    send: () => void;
}> = ({
    roomId, messages, text, socketRef, messagesRef, setText, send
}) => {
    
  return (
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
  )
}

export default ChatRoom