import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MessageSquare,
    FileText,
    FolderOpen,
    Sun,
    Moon,
    Trash2,
    Command,
    Sparkles,
    Code2,
    Zap
} from 'lucide-react';
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

// Category configuration with icons and colors
const categoryConfig = {
    apps: {
        label: 'Applications',
        icon: <Sparkles size={12} />,
        gradient: 'from-blue-500 to-cyan-400'
    },
    actions: {
        label: 'Quick Actions',
        icon: <Zap size={12} />,
        gradient: 'from-amber-500 to-orange-400'
    },
    skills: {
        label: 'Technical Skills',
        icon: <Code2 size={12} />,
        gradient: 'from-purple-500 to-pink-400'
    },
    info: {
        label: 'Information',
        icon: <FileText size={12} />,
        gradient: 'from-green-500 to-emerald-400'
    }
};

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
                title: 'AI Chatbot',
                subtitle: 'Chat with AI about my experience',
                icon: (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                        <MessageSquare size={18} className="text-white" />
                    </div>
                ),
                keywords: ['chat', 'terminal', 'ai', 'assistant', 'bot'],
                action: () => openWindow('terminal', 'Chat', <TerminalApp />, <MessageSquare size={18} />),
                category: 'apps',
            },
            {
                id: 'cv',
                title: 'Resume / CV',
                subtitle: 'View my full curriculum vitae',
                icon: (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                        <FileText size={18} className="text-white" />
                    </div>
                ),
                keywords: ['cv', 'resume', 'preview', 'document', 'pdf'],
                action: () => openWindow('cv', 'CV Preview', <PreviewApp />, <FileText size={18} />),
                category: 'apps',
            },
            {
                id: 'projects',
                title: 'Projects',
                subtitle: 'Browse my portfolio work',
                icon: (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <FolderOpen size={18} className="text-white" />
                    </div>
                ),
                keywords: ['projects', 'finder', 'work', 'portfolio'],
                action: () => openWindow('projects', 'Projects', <FinderApp />, <FolderOpen size={18} />),
                category: 'apps',
            },
            // Actions
            {
                id: 'theme',
                title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
                subtitle: 'Toggle the interface theme',
                icon: (
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${isDarkMode
                        ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400'
                        : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600'
                        }`}>
                        {isDarkMode ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-white" />}
                    </div>
                ),
                keywords: ['dark', 'light', 'theme', 'mode', 'toggle', 'color'],
                action: () => toggleTheme(),
                category: 'actions',
            },
            {
                id: 'clear',
                title: 'Close All Windows',
                subtitle: 'Clear the desktop',
                icon: (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Trash2 size={18} className="text-white" />
                    </div>
                ),
                keywords: ['close', 'clear', 'trash', 'windows', 'all', 'reset'],
                action: () => windows.forEach(w => closeWindow(w.id)),
                category: 'actions',
            },
            // Skills from CV data
            ...getAllSkills().slice(0, 12).map((skill) => ({
                id: `skill-${skill}`,
                title: skill,
                subtitle: 'Technical expertise',
                icon: (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">{skill[0]}</span>
                    </div>
                ),
                keywords: [skill.toLowerCase(), 'skill', 'tech', 'technology'],
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

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, SearchItem[]> = {};
        filteredItems.forEach(item => {
            if (!groups[item.category]) {
                groups[item.category] = [];
            }
            groups[item.category].push(item);
        });
        return groups;
    }, [filteredItems]);

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

    // Calculate flat index for selection
    let flatIndex = -1;

    return (
        <AnimatePresence>
            {isSpotlightOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[10000] flex items-start justify-center pt-[12vh] sm:pt-[15vh]"
                    onClick={closeSpotlight}
                >
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                    />

                    {/* Spotlight Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="relative w-[640px] max-w-[92vw] rounded-2xl overflow-hidden glass-panel-strong"
                        style={{
                            boxShadow: isDarkMode
                                ? '0 25px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1), 0 0 40px rgba(10,132,255,0.1)'
                                : '0 25px 80px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1), 0 0 40px rgba(10,132,255,0.05)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="relative">
                                <Search size={20} className="text-blue-500" />
                                <div className="absolute inset-0 blur-md bg-blue-500/30" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search apps, actions, skills..."
                                className="flex-1 bg-transparent outline-none text-lg font-medium placeholder:font-normal"
                                style={{ color: 'var(--text-primary)' }}
                                autoFocus
                            />
                            <div className="hidden sm:flex items-center gap-1.5">
                                <kbd className="kbd-badge flex items-center gap-1">
                                    <Command size={11} />
                                    <span>Space</span>
                                </kbd>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[380px] overflow-y-auto py-2">
                            {filteredItems.length === 0 ? (
                                <div className="px-5 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                                    <Search size={40} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No results found</p>
                                    <p className="text-sm opacity-60 mt-1">Try a different search term</p>
                                </div>
                            ) : (
                                Object.entries(groupedItems).map(([category, items]) => (
                                    <div key={category} className="mb-2">
                                        {/* Category Header */}
                                        <div className="flex items-center gap-2 px-5 py-2">
                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r ${categoryConfig[category as keyof typeof categoryConfig].gradient} text-white text-[10px] font-semibold uppercase tracking-wider`}>
                                                {categoryConfig[category as keyof typeof categoryConfig].icon}
                                                <span>{categoryConfig[category as keyof typeof categoryConfig].label}</span>
                                            </div>
                                            <div className="flex-1 h-px bg-gradient-to-r from-current/10 to-transparent" />
                                        </div>

                                        {/* Category Items */}
                                        {items.map((item) => {
                                            flatIndex++;
                                            const isSelected = flatIndex === selectedIndex;

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: flatIndex * 0.02 }}
                                                    className={`spotlight-item flex items-center gap-3 px-5 py-2.5 cursor-pointer mx-2 rounded-xl ${isSelected
                                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                                                        : 'hover:bg-white/5'
                                                        }`}
                                                    onClick={() => handleItemClick(item)}
                                                    onMouseEnter={() => setSelectedIndex(flatIndex)}
                                                >
                                                    <div className="flex-shrink-0">
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-[15px] truncate" style={{ color: 'var(--text-primary)' }}>
                                                            {item.title}
                                                        </div>
                                                        {item.subtitle && (
                                                            <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                                                {item.subtitle}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <kbd className="kbd-badge text-[10px]">↵</kbd>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="px-5 py-3 border-t flex items-center justify-between text-xs"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                        >
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="kbd-badge text-[10px] px-1.5">↑</kbd>
                                    <kbd className="kbd-badge text-[10px] px-1.5">↓</kbd>
                                    <span className="opacity-60">Navigate</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="kbd-badge text-[10px] px-1.5">↵</kbd>
                                    <span className="opacity-60">Open</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="kbd-badge text-[10px]">ESC</kbd>
                                    <span className="opacity-60">Close</span>
                                </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 opacity-40">
                                <Sparkles size={12} />
                                <span>Spotlight Search</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Spotlight;
