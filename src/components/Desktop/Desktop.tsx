import React, { useEffect } from 'react';
import { OSProvider, useOS } from '../../context/OSContext';
import MenuBar from './MenuBar';
import Dock from './Dock';
import WindowManager from '../OS/WindowManager';
import Spotlight from '../OS/Spotlight';

const DesktopContent: React.FC = () => {
    const { toggleSpotlight, isSpotlightOpen, closeSpotlight } = useOS();

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+Space or Ctrl+Space to toggle Spotlight
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                toggleSpotlight();
            }
            // Escape to close Spotlight (handled in Spotlight component too, but good to have here)
            if (e.code === 'Escape' && isSpotlightOpen) {
                closeSpotlight();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSpotlight, isSpotlightOpen, closeSpotlight]);

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjQeNWmmNYCzrOMOYr_J-gJmWJrV8WLBhrXx9u7c0H18lPOqtOSylYv-0OLPl2lJIWPXKMVkpZaQBbD0Lo5MmiFqKLa6RmJZXnAEDA2mhbEnxmMJaDUb2lJVXLgoxcxiNpMGuVHf1bYkEsjGscD-xE6MCWfql5QFio2dY64ZtcIxRwOT6AypvaFuRkYzIOLthet4iweWwyj9aHOaFfT_iIalmO9lGP7Rkp8ouMEYWRchLPR25W7px7j2XA68goOfkW5vrL2awJABjj')"
                }}
            />

            <div className="relative z-10 flex h-full grow flex-col">
                <MenuBar />

                <main className="flex flex-1 items-center justify-center p-4 relative">
                    {/* Windows Layer */}
                    <WindowManager />
                </main>

                <Dock />
            </div>

            {/* Spotlight Search */}
            <Spotlight />
        </div>
    );
};

const Desktop: React.FC = () => {
    return (
        <OSProvider>
            <DesktopContent />
        </OSProvider>
    );
};

export default Desktop;
