'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };

        // Add user message to chat
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            // For our simplified version, we'll just get the text response
            const text = await response.text();

            // Add assistant message to chat
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: text
            }]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 ">

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {
                    messages.map((m, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg ${m.role === 'user'
                                ? 'bg-blue-100 ml-auto max-w-[80%]'
                                : 'bg-gray-100 mr-auto max-w-[80%]'
                                }`}
                        >
                            <div className="font-bold">
                                {m.role === 'user' ? 'You' : 'Assistant'}
                            </div>
                            <div className="mt-1">{m.content}</div>
                        </div>
                    ))
                }
                {isLoading && (
                    <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
                        <div className="font-bold">Assistant</div>
                        <div className="mt-1">Typing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask something about Oren..."
                    className="flex-1 p-2 border border-gray-300 rounded"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
} 