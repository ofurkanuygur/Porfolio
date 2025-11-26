import React from 'react';
import { useOS } from '../../context/OSContext';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

const WindowManager: React.FC = () => {
    const { windows } = useOS();

    return (
        <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
                {windows.map((window) => (
                    <div key={window.id} className="pointer-events-auto">
                        <Window
                            id={window.id}
                            title={window.title}
                            isActive={true}
                            zIndex={window.zIndex}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            width={window.width}
                            height={window.height}
                            x={window.x}
                            y={window.y}
                        >
                            {window.component}
                        </Window>
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default WindowManager;
