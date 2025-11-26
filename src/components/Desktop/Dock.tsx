import React from 'react';
import { useOS } from '../../context/OSContext';
import TerminalApp from '../../apps/Terminal/TerminalApp';
import PreviewApp from '../../apps/Preview/PreviewApp';
import FinderApp from '../../apps/Finder/FinderApp';
import ContactApp from '../../apps/Contact/ContactApp';
import TrashGame from '../../apps/TrashGame/TrashGame';
import { FileText, FolderOpen, Mail, Trash2, Bot, Sparkles } from 'lucide-react';

const Dock: React.FC = () => {
    const { openWindow, windows } = useOS();

    const handleOpenTerminal = () => {
        openWindow('terminal', 'AI Chat', <TerminalApp />, <Bot size={18} />);
    };

    const handleOpenCV = () => {
        openWindow('cv', 'Resume', <PreviewApp />, <FileText size={18} />);
    };

    const handleOpenProjects = () => {
        openWindow('projects', 'Projects', <FinderApp />, <FolderOpen size={18} />);
    };

    const handleOpenContact = () => {
        openWindow('contact', 'Contact', <ContactApp />, <Mail size={18} />);
    };

    const handleOpenTrash = () => {
        openWindow('trash', 'Trash Game', <TrashGame />, <Trash2 size={18} />);
    };

    return (
        <footer className="flex justify-center pb-3">
            <div className="flex items-end justify-center gap-1 sm:gap-2 rounded-2xl bg-clip-padding p-1.5 sm:p-2 backdrop-blur-xl backdrop-filter" style={{ backgroundColor: 'var(--bg-dock)', borderColor: 'var(--border-color)', borderWidth: '1px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>

                {/* AI Chatbot */}
                <div className="group relative flex flex-col items-center gap-1 sm:gap-1.5">
                    <span className="pointer-events-none absolute -top-10 scale-0 rounded-md bg-gray-900/80 px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 hidden sm:block">AI Chat</span>
                    <button onClick={handleOpenTerminal} aria-label="Open AI Chatbot" className="dock-item-reflection h-12 w-12 sm:h-16 sm:w-16 transform transition-all duration-200 ease-in-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-110">
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <Bot size={28} className="text-white relative z-10" aria-hidden="true" />
                            <Sparkles size={12} className="text-yellow-300 absolute top-2 right-2 animate-pulse" aria-hidden="true" />
                        </div>
                    </button>
                    {windows.find(w => w.id === 'terminal') && <div className="h-1 w-1 rounded-full bg-white/80" aria-hidden="true"></div>}
                </div>

                {/* CV Preview */}
                <div className="group relative flex flex-col items-center gap-1 sm:gap-1.5">
                    <span className="pointer-events-none absolute -top-10 scale-0 rounded-md bg-gray-900/80 px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 hidden sm:block">Resume</span>
                    <button onClick={handleOpenCV} aria-label="Open Resume" className="dock-item-reflection h-12 w-12 sm:h-16 sm:w-16 transform transition-all duration-200 ease-in-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-110">
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <FileText size={28} className="text-white relative z-10" aria-hidden="true" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full blur-sm" />
                        </div>
                    </button>
                    {windows.find(w => w.id === 'cv') && <div className="h-1 w-1 rounded-full bg-white/80" aria-hidden="true"></div>}
                </div>

                {/* Projects Finder */}
                <div className="group relative flex flex-col items-center gap-1 sm:gap-1.5">
                    <span className="pointer-events-none absolute -top-10 scale-0 rounded-md bg-gray-900/80 px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 hidden sm:block">Projects</span>
                    <button onClick={handleOpenProjects} aria-label="Open Projects" className="dock-item-reflection h-12 w-12 sm:h-16 sm:w-16 transform transition-all duration-200 ease-in-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-110">
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <FolderOpen size={28} className="text-white relative z-10" aria-hidden="true" />
                            <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full" />
                        </div>
                    </button>
                    {windows.find(w => w.id === 'projects') && <div className="h-1 w-1 rounded-full bg-white/80" aria-hidden="true"></div>}
                </div>

                {/* Contact */}
                <div className="group relative flex flex-col items-center gap-1 sm:gap-1.5">
                    <span className="pointer-events-none absolute -top-10 scale-0 rounded-md bg-gray-900/80 px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 hidden sm:block">Contact</span>
                    <button onClick={handleOpenContact} aria-label="Open Contact" className="dock-item-reflection h-12 w-12 sm:h-16 sm:w-16 transform transition-all duration-200 ease-in-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-110">
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <Mail size={28} className="text-white relative z-10" aria-hidden="true" />
                            <div className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full" />
                        </div>
                    </button>
                    {windows.find(w => w.id === 'contact') && <div className="h-1 w-1 rounded-full bg-white/80" aria-hidden="true"></div>}
                </div>

                <div className="mx-1 sm:mx-2 h-10 sm:h-14 w-px bg-white/20" aria-hidden="true"></div>

                {/* Trash */}
                <div className="group relative flex flex-col items-center gap-1 sm:gap-1.5">
                    <span className="pointer-events-none absolute -top-10 scale-0 rounded-md bg-gray-900/80 px-2 py-1 text-xs text-white transition-all duration-200 group-hover:scale-100 hidden sm:block">Trash</span>
                    <button onClick={handleOpenTrash} aria-label="Open Trash Game" className="dock-item-reflection h-12 w-12 sm:h-16 sm:w-16 transform transition-all duration-200 ease-in-out group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:scale-110">
                        <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 flex items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <Trash2 size={28} className="text-white relative z-10" aria-hidden="true" />
                            <div className="absolute bottom-1 right-1 w-3 h-3 bg-red-400/50 rounded-full animate-pulse" />
                        </div>
                    </button>
                </div>

            </div>
        </footer>
    );
};

export default Dock;
