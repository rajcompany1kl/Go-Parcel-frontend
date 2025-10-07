// ✅ Converted to TypeScript (TSX)
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function genUserId(): string {
  return 'u-' + Math.random().toString(36).slice(2, 10);
}

// ✅ Define message type for better type safety
type Message = {
  from: 'bot' | 'user';
  text: string;
};

export default function ChatSection() {
  const navigate = useNavigate();

  const [manual, setManual] = useState<boolean>(false); 
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi — ask me anything about the delivery or payment.' },
  ]);
  const [thinking, setThinking] = useState<boolean>(false);
  const [userQuestionCount, setUserQuestionCount] = useState<number>(0); // ✅ question counter

  const boxRef = useRef<HTMLDivElement | null>(null);

  const onStart = () => {
    const userId = genUserId();
    navigate(`/chat/${userId}`);
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
  if (manual) {
    // Add connecting message
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: 'Connecting you to an admin...' },
    ]);

    // Wait 1.5 seconds before navigating
    const timeout = setTimeout(() => {
      const userId = genUserId();
      navigate(`/chat/${userId}`);
    }, 1500);

    return () => clearTimeout(timeout);
  }
}, [manual, navigate]);


 

  // ✅ Axios call with type-safe response
  async function sendQuery(q: string): Promise<void> {
    if (!q) return;

    const userMsg: Message = { from: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);

   
    setUserQuestionCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount > 2) {
        setManual(true);
      }
      return newCount;
    });

    // ✅ If manual mode is active, stop automated replies
    if (manual) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Let me connect you with a human agent for better assistance.' },
      ]);
      return;
    }

    setThinking(true);

    try {
      const res = await axios.post<{ answer?: string; suggestions?: { question: string }[] }>(
        'http://localhost:5000/api/faq/query',
        { q }
      );

      const data = res.data;

      if (data.answer) {
        setMessages((prev) => [...prev, { from: 'bot', text: data.answer! }]);
      } else {
        const suggestionsText =
          data.suggestions && data.suggestions.length
            ? `I couldn't find an exact answer. Did you mean: ${data.suggestions
                .map((s) => s.question)
                .join(' | ')}`
            : `Sorry, I couldn't find an answer. Please try rephrasing or ask a human.`;

        setMessages((prev) => [...prev, { from: 'bot', text: suggestionsText }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Something went wrong — please try again later.' },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const q = input.trim();
    if (q === '') return;
    setInput('');
    sendQuery(q);
  }

  return (
    <div className="flex flex-col items-end">
      
      {open && (
        <div className="w-80 h-[28rem] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col transition-all border border-gray-200">
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
            <span className="font-semibold">💬 Help Chat</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 text-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div
            ref={boxRef}
            className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50 space-y-2 text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg shadow text-sm text-black ${
                    m.from === 'user'
                      ? 'bg-purple-100 text-right'
                      : 'bg-gray-100 border text-left'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="text-gray-500 text-xs italic">Thinking...</div>
            )}
            {manual && (
  <div className="text-xs text-purple-600 italic text-center flex items-center justify-center gap-2">
    <span>You've asked quite a few questions. Connecting you to a human agent...</span>
    <span className="animate-pulse">⏳</span>
  </div>
)}

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t bg-white flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
              disabled={manual}
            />
            <button
              type="submit"
              disabled={thinking || manual}
              className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <div className="px-3 py-2 text-xs text-center bg-gray-50 border-t">
            <button
              onClick={onStart}
              className="text-purple-600 hover:underline"
            >
              Not helpful? Talk to a human
            </button>
          </div>
        </div>
      )}

      
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full shadow-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all"
        aria-label="Toggle Chat"
      >
        {open ? '–' : '💬'}
      </button>
    </div>
  );
}
