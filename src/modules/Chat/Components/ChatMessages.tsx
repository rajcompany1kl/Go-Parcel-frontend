import React from 'react';
import type { RefObject } from 'react';
import type { Message } from '../usertypes';

interface ChatMessagesProps {
  messages: Message[];
  messagesRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({ messages, messagesRef }: ChatMessagesProps) {
  return (
    <div
      ref={messagesRef}
      className="flex-1 max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white mb-4"
    >
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex mb-2 ${
            m.sender === 'user'
              ? 'justify-end'
              : m.sender === 'admin'
              ? 'justify-start'
              : 'justify-center'
          }`}
        >
          <div
            className={`px-3 py-2 rounded-xl max-w-[70%] text-sm leading-snug ${
              m.sender === 'user'
                ? 'bg-blue-500 text-white'
                : m.sender === 'admin'
                ? 'bg-gray-200 text-black'
                : 'bg-yellow-400 text-black'
            }`}
          >
            <strong>{m.sender}</strong>: {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}
