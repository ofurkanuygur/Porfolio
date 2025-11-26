import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initSounds, playSound, setSoundEnabled } from '../utils/sounds';

export interface WindowState {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    component: React.ReactNode;
    icon?: React.ReactNode;
    // Window bounds
    width: number;
    height: number;
    x: number;
    y: number;
}

interface OSContextType {
    windows: WindowState[];
    openWindow: (id: string, title: string, component: React.ReactNode, icon?: React.ReactNode) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    // Theme
    isDarkMode: boolean;
    toggleTheme: () => void;
    // Sound
    isSoundEnabled: boolean;
    toggleSound: () => void;
    // Spotlight
    isSpotlightOpen: boolean;
    toggleSpotlight: () => void;
    closeSpotlight: () => void;
    // Window bounds
    updateWindowBounds: (id: string, bounds: Partial<{ width: number; height: number; x: number; y: number }>) => void;
    // Responsive
    isMobile: boolean;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [zIndexCounter, setZIndexCounter] = useState(10);

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved !== 'light'; // Default to dark mode
    });

    // Apply theme class to document
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Sound state
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('sound');
        return saved !== 'false'; // Default to enabled
    });

    // Initialize sounds on mount
    useEffect(() => {
        initSounds();
    }, []);

    // Sync sound enabled state
    useEffect(() => {
        setSoundEnabled(isSoundEnabled);
        localStorage.setItem('sound', isSoundEnabled ? 'true' : 'false');
    }, [isSoundEnabled]);

    const toggleSound = () => {
        setIsSoundEnabled(prev => !prev);
    };

    // Spotlight state
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

    const toggleSpotlight = () => {
        setIsSpotlightOpen(prev => !prev);
    };

    const closeSpotlight = () => {
        setIsSpotlightOpen(false);
    };

    // Responsive state
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openWindow = (id: string, title: string, component: React.ReactNode, icon?: React.ReactNode) => {
        playSound('open');
        setWindows((prev) => {
            const existing = prev.find((w) => w.id === id);
            if (existing) {
                // If minimized, restore it. If open, just focus.
                return prev.map((w) =>
                    w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: zIndexCounter + 1 } : w
                );
            }
            // Calculate centered position with slight offset for stacking
            const windowCount = prev.length;
            const defaultWidth = 800;
            const defaultHeight = 600;
            const offsetX = windowCount * 30;
            const offsetY = windowCount * 30;
            return [
                ...prev,
                {
                    id,
                    title,
                    isOpen: true,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: zIndexCounter + 1,
                    component,
                    icon,
                    width: defaultWidth,
                    height: defaultHeight,
                    x: Math.max(50, (window.innerWidth - defaultWidth) / 2 + offsetX),
                    y: Math.max(50, 100 + offsetY),
                },
            ];
        });
        setZIndexCounter((prev) => prev + 1);
    };

    const updateWindowBounds = (id: string, bounds: Partial<{ width: number; height: number; x: number; y: number }>) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, ...bounds } : w))
        );
    };

    const closeWindow = (id: string) => {
        playSound('close');
        setWindows((prev) => prev.filter((w) => w.id !== id));
    };

    const minimizeWindow = (id: string) => {
        playSound('minimize');
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
        );
    };

    const maximizeWindow = (id: string) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
        );
    };

    const focusWindow = (id: string) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w))
        );
        setZIndexCounter((prev) => prev + 1);
    };

    return (
        <OSContext.Provider
            value={{
                windows,
                openWindow,
                closeWindow,
                minimizeWindow,
                maximizeWindow,
                focusWindow,
                isDarkMode,
                toggleTheme,
                isSoundEnabled,
                toggleSound,
                isSpotlightOpen,
                toggleSpotlight,
                closeSpotlight,
                updateWindowBounds,
                isMobile,
            }}
        >
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (!context) {
        throw new Error('useOS must be used within an OSProvider');
    }
    return context;
};
