import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, FileText, FolderOpen, Sun, Moon, Trash2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { getAllSkills } from '../../data/cv_data';
import TerminalApp from '../../apps/Terminal/TerminalApp';
import PreviewApp from '../../apps/Preview/PreviewApp';
import FinderApp from '../../apps/Finder/FinderApp';

interface SearchItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    keywords: string[];
    action: () => void;
    category: 'apps' | 'actions' | 'skills' | 'info';
}

const Spotlight: React.FC = () => {
    const {
        isSpotlightOpen,
        closeSpotlight,
        openWindow,
        toggleTheme,
        isDarkMode,
        windows,
        closeWindow,
    } = useOS();

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build search items
    const searchItems = useMemo<SearchItem[]>(() => {
        const items: SearchItem[] = [
            // Apps
            {
                id: 'terminal',
                title: 'Chatbot',
                subtitle: 'Chat with AI assistant',
                icon: <MessageSquare size={20} className="text-blue-500" />,
                keywords: ['chat', 'terminal', 'ai', 'assistant', 'bot'],
                action: () => openWindow('terminal', 'Chat', <TerminalApp />, <MessageSquare size={18} />),
                category: 'apps',
            },
            {
                id: 'cv',
                title: 'CV Preview',
                subtitle: 'View resume',
                icon: <FileText size={20} className="text-green-500" />,
                keywords: ['cv', 'resume', 'preview', 'document'],
                action: () => openWindow('cv', 'CV Preview', <PreviewApp />, <FileText size={18} />),
                category: 'apps',
            },
            {
                id: 'projects',
                title: 'Projects',
                subtitle: 'Browse projects',
                icon: <FolderOpen size={20} className="text-yellow-500" />,
                keywords: ['projects', 'finder', 'work', 'portfolio'],
                action: () => openWindow('projects', 'Projects', <FinderApp />, <FolderOpen size={18} />),
                category: 'apps',
            },
            // Actions
            {
                id: 'theme',
                title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
                subtitle: 'Toggle theme',
                icon: isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />,
                keywords: ['dark', 'light', 'theme', 'mode', 'toggle'],
                action: () => toggleTheme(),
                category: 'actions',
            },
            {
                id: 'clear',
                title: 'Close All Windows',
                subtitle: 'Clear desktop',
                icon: <Trash2 size={20} className="text-red-500" />,
                keywords: ['close', 'clear', 'trash', 'windows', 'all'],
                action: () => windows.forEach(w => closeWindow(w.id)),
                category: 'actions',
            },
            // Skills from CV data
            ...getAllSkills().map((skill) => ({
                id: `skill-${skill}`,
                title: skill,
                subtitle: 'Technical skill',
                icon: <span className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{skill[0]}</span>,
                keywords: [skill.toLowerCase(), 'skill', 'tech'],
                action: () => openWindow('terminal', 'Chat', <TerminalApp />, <MessageSquare size={18} />),
                category: 'skills' as const,
            })),
        ];
        return items;
    }, [isDarkMode, openWindow, toggleTheme, windows, closeWindow]);

    // Filter items based on query
    const filteredItems = useMemo(() => {
        if (!query.trim()) {
            // Show apps and actions when no query
            return searchItems.filter(item => item.category === 'apps' || item.category === 'actions');
        }
        const lowerQuery = query.toLowerCase();
        return searchItems.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.keywords.some(k => k.includes(lowerQuery))
        ).slice(0, 8);
    }, [query, searchItems]);

    // Reset state when spotlight opens/closes
    useEffect(() => {
        if (isSpotlightOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isSpotlightOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isSpotlightOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredItems[selectedIndex]) {
                        filteredItems[selectedIndex].action();
                        closeSpotlight();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeSpotlight();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSpotlightOpen, filteredItems, selectedIndex, closeSpotlight]);

    // Reset selection when filtered items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleItemClick = (item: SearchItem) => {
        item.action();
        closeSpotlight();
    };

    return (
        <AnimatePresence>
            {isSpotlightOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh]"
                    onClick={closeSpotlight}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Spotlight Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="relative w-[600px] max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                            backgroundColor: 'var(--bg-window)',
                            borderColor: 'var(--border-color)',
                            borderWidth: '1px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <Search size={22} style={{ color: 'var(--text-secondary)' }} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search apps, actions, or skills..."
                                className="flex-1 bg-transparent outline-none text-lg font-light"
                                style={{ color: 'var(--text-primary)' }}
                                autoFocus
                            />
                            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                                ESC
                            </kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[400px] overflow-y-auto py-2">
                            {filteredItems.length === 0 ? (
                                <div className="px-5 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                                    No results found
                                </div>
                            ) : (
                                filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${index === selectedIndex ? 'bg-blue-500/20' : 'hover:bg-white/5'
                                            }`}
                                        onClick={() => handleItemClick(item)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <div className="flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                                {item.title}
                                            </div>
                                            {item.subtitle && (
                                                <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                                    {item.subtitle}
                                                </div>
                                            )}
                                        </div>
                                        {index === selectedIndex && (
                                            <kbd className="hidden sm:inline-flex items-center px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                                                ↵
                                            </kbd>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-5 py-2 border-t text-xs flex items-center gap-4" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                            <span>↑↓ Navigate</span>
                            <span>↵ Select</span>
                            <span>ESC Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Spotlight;
