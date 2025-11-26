import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

const Window: React.FC<WindowProps> = ({
    id,
    title,
    children,
    isActive,
    zIndex,
    isMinimized,
    isMaximized,
    width,
    height,
    x,
    y,
}) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowBounds, isMobile } = useOS();
    const [isResizing, setIsResizing] = useState(false);

    // On mobile, windows are always fullscreen
    const effectiveMaximized = isMobile || isMaximized;

    // Handle resize
    const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = width;
        const startHeight = height;
        const startPosX = x;
        const startPosY = y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startPosX;
            let newY = startPosY;

            // Handle horizontal resize
            if (direction.includes('e')) {
                newWidth = Math.max(MIN_WIDTH, startWidth + dx);
            }
            if (direction.includes('w')) {
                const potentialWidth = startWidth - dx;
                if (potentialWidth >= MIN_WIDTH) {
                    newWidth = potentialWidth;
                    newX = startPosX + dx;
                }
            }

            // Handle vertical resize
            if (direction.includes('s')) {
                newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
            }
            if (direction.includes('n')) {
                const potentialHeight = startHeight - dy;
                if (potentialHeight >= MIN_HEIGHT) {
                    newHeight = potentialHeight;
                    newY = startPosY + dy;
                }
            }

            updateWindowBounds(id, { width: newWidth, height: newHeight, x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = getCursor(direction);
        document.body.style.userSelect = 'none';
    }, [id, width, height, x, y, updateWindowBounds]);

    // Handle drag end (update position in context)
    const handleDragEnd = useCallback((_: never, info: { offset: { x: number; y: number } }) => {
        // info.offset gives us how much the element moved from its starting position
        // Add this offset to the current position to get the new position
        updateWindowBounds(id, { x: x + info.offset.x, y: y + info.offset.y });
    }, [id, x, y, updateWindowBounds]);

    if (isMinimized) return null;

    const getCursor = (dir: ResizeDirection): string => {
        const cursors: Record<ResizeDirection, string> = {
            n: 'ns-resize',
            s: 'ns-resize',
            e: 'ew-resize',
            w: 'ew-resize',
            ne: 'nesw-resize',
            nw: 'nwse-resize',
            se: 'nwse-resize',
            sw: 'nesw-resize',
        };
        return cursors[dir];
    };

    return (
        <motion.div
            drag={!effectiveMaximized && !isResizing}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{
                scale: 1,
                opacity: 1,
                width: effectiveMaximized ? '100vw' : width,
                height: effectiveMaximized ? '100vh' : height,
                x: effectiveMaximized ? 0 : x,
                y: effectiveMaximized ? 0 : y,
                borderRadius: effectiveMaximized ? 0 : 12,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                zIndex: effectiveMaximized ? 9999 : zIndex,
                position: 'absolute',
                top: 0,
                left: 0,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                backgroundColor: 'var(--bg-window)',
                borderColor: 'var(--border-color)',
            }}
            className={`backdrop-blur-xl border overflow-hidden flex flex-col ${isActive ? 'shadow-2xl' : 'shadow-lg'}`}
            onMouseDown={() => focusWindow(id)}
            role="dialog"
            aria-label={title}
        >
            {/* Title Bar */}
            <div
                className="h-9 sm:h-10 bg-transparent flex items-center justify-between px-2 sm:px-4 select-none cursor-default flex-shrink-0"
                onDoubleClick={() => maximizeWindow(id)}
            >
                <div className="flex items-center gap-1.5 sm:gap-2 group" role="group" aria-label="Window controls">
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all border border-black/10"
                        aria-label="Close window"
                    >
                        <X size={6} className="sm:w-2 sm:h-2 opacity-0 group-hover:opacity-100 text-black/70 stroke-[3]" aria-hidden="true" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ffbd2e] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all border border-black/10"
                        aria-label="Minimize window"
                    >
                        <Minus size={6} className="sm:w-2 sm:h-2 opacity-0 group-hover:opacity-100 text-black/70 stroke-[3]" aria-hidden="true" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#27c93f] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all border border-black/10"
                        aria-label="Maximize window"
                    >
                        <Maximize2 size={5} className="sm:w-1.5 sm:h-1.5 opacity-0 group-hover:opacity-100 text-black/70 stroke-[3]" aria-hidden="true" />
                    </button>
                </div>

                <div className="font-medium text-xs sm:text-sm flex-1 text-center mr-10 sm:mr-14 truncate" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                    {title}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative">
                {children}
            </div>

            {/* Resize Handles - only show when not maximized and not mobile */}
            {!effectiveMaximized && (
                <>
                    {/* Corner handles */}
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'sw')}
                    />
                    <div
                        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'ne')}
                    />
                    <div
                        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'nw')}
                    />
                    {/* Edge handles */}
                    <div
                        className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'n')}
                    />
                    <div
                        className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 's')}
                    />
                    <div
                        className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'w')}
                    />
                    <div
                        className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-10"
                        onMouseDown={(e) => handleResizeStart(e, 'e')}
                    />
                </>
            )}
        </motion.div>
    );
};

export default Window;
