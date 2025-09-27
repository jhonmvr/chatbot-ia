'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query: input }),
    });

    if (!response.ok) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'Error: Unable to get response', isUser: false }]);
      setLoading(false);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let aiMessage = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      aiMessage += decoder.decode(value, { stream: true });
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && !last.isUser) {
          return [...prev.slice(0, -1), { ...last, text: aiMessage }];
        } else {
          return [...prev, { id: (Date.now() + 2).toString(), text: aiMessage, isUser: false }];
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
            <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg h-96 overflow-y-auto p-4 mb-4">
          {messages.map(message => (
            <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-gray-500">AI is thinking...</div>}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}