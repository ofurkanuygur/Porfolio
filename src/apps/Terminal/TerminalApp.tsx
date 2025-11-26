import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../../utils/aiService';

interface Message {
    type: 'user' | 'bot';
    text: string;
}

const TerminalApp: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Message[]>([
        { type: 'bot', text: "Welcome to the interactive CV terminal. Type 'help' or ask me anything about Oktay." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');

        // Add user message to history
        setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await getAIResponse(userMsg, history);

            if (response === 'CLEAR_COMMAND') {
                setHistory([]);
            } else {
                setHistory(prev => [...prev, { type: 'bot', text: response }]);
            }
        } catch (error) {
            console.error('Error getting response:', error);
            setHistory(prev => [...prev, { type: 'bot', text: 'Sorry, an error occurred. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-black/90 text-green-400 font-mono p-4 flex flex-col text-sm sm:text-base">
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar min-h-0">
                {history.map((msg, i) => (
                    <div key={i} className={`${msg.type === 'user' ? 'text-white' : 'text-green-400'}`}>
                        <span className="opacity-50 mr-2">{msg.type === 'user' ? '>' : '$'}</span>
                        <span className="whitespace-pre-wrap">{msg.text}</span>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="text-green-400 flex items-center">
                        <span className="opacity-50 mr-2">$</span>
                        <span className="inline-flex gap-1">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse animation-delay-200">.</span>
                            <span className="animate-pulse animation-delay-400">.</span>
                        </span>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 flex-shrink-0 pb-2">
                <span className="text-white opacity-50">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                    autoFocus
                    placeholder={isLoading ? "Waiting for response..." : "Type a command or question..."}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
};

export default TerminalApp;
