import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../../utils/aiService';

interface Message {
    type: 'user' | 'bot';
    text: string;
}

const TerminalApp: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Message[]>([
        { type: 'bot', text: "SYSTEM INITIALIZED...\n\nWelcome to the interactive CV terminal.\nType 'help' for available commands or ask me anything about Oktay." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [isBooting, setIsBooting] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Boot animation
    useEffect(() => {
        const timer = setTimeout(() => setIsBooting(false), 600);
        return () => clearTimeout(timer);
    }, []);

    // Cursor blink for input
    useEffect(() => {
        if (!isLoading) {
            const interval = setInterval(() => setShowCursor(prev => !prev), 530);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    // Focus input on click anywhere
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

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
            setHistory(prev => [...prev, { type: 'bot', text: 'ERROR: Connection failed. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`h-full w-full crt-monitor crt-curve crt-flicker ${isBooting ? 'crt-boot' : ''}`}
            onClick={handleContainerClick}
        >
            {/* Scan lines overlay */}
            <div className="crt-scanlines" />

            {/* Screen content */}
            <div className="relative z-10 h-full flex flex-col p-4 sm:p-5">
                {/* Terminal header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#39ff14]/20">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
                            <span className="w-2 h-2 rounded-full bg-[#39ff14]/50" />
                            <span className="w-2 h-2 rounded-full bg-[#39ff14]/30" />
                        </div>
                        <span className="crt-text text-xs opacity-60 font-mono tracking-widest">
                            OKTAY://TERMINAL v2.0
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_4px_#39ff14]" />
                        <span className="crt-text text-xs opacity-40 font-mono">CONNECTED</span>
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {history.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="font-mono"
                            >
                                {msg.type === 'user' ? (
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#ffb000] font-bold select-none">&gt;</span>
                                        <span className="text-[#ffb000] font-medium">{msg.text}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <span className="crt-text opacity-50 select-none">$</span>
                                        <span className="crt-text whitespace-pre-wrap leading-relaxed">
                                            {msg.text}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading indicator with typing dots */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 font-mono"
                        >
                            <span className="crt-text opacity-50">$</span>
                            <div className="flex items-center gap-1">
                                <span className="typing-dot w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
                                <span className="typing-dot w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
                                <span className="typing-dot w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
                            </div>
                            <span className="crt-text text-xs opacity-40 ml-2">Processing...</span>
                        </motion.div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-[#39ff14]/20 flex-shrink-0">
                    <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#ffb000] font-bold select-none">&gt;</span>
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-[#ffb000] font-mono caret-transparent"
                                autoFocus
                                disabled={isLoading}
                                spellCheck={false}
                                autoComplete="off"
                            />
                            {/* Custom cursor */}
                            <span
                                className="absolute top-0 pointer-events-none text-[#ffb000]"
                                style={{
                                    left: `${input.length * 0.6}em`,
                                    opacity: showCursor && !isLoading ? 1 : 0
                                }}
                            >
                                <span className="crt-cursor" style={{ background: '#ffb000', boxShadow: '0 0 8px #ffb000' }} />
                            </span>
                        </div>
                        {!isLoading && (
                            <span className="text-[#39ff14]/30 text-xs hidden sm:inline">
                                Press ENTER to send
                            </span>
                        )}
                    </div>
                </form>

                {/* Status bar */}
                <div className="mt-3 pt-2 border-t border-[#39ff14]/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-4">
                        <span className="crt-text opacity-30">
                            {history.length} messages
                        </span>
                        <span className="crt-text opacity-30">|</span>
                        <span className="crt-text opacity-30">
                            AI: {isLoading ? 'BUSY' : 'READY'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="crt-text opacity-20">
                            {new Date().toLocaleTimeString('en-US', { hour12: false })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalApp;
