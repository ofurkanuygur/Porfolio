// System sounds utility for macOS-style UI effects

export type SoundType = 'open' | 'close' | 'minimize';

const audioCache = new Map<SoundType, HTMLAudioElement>();

// Base64 encoded minimal sounds (short beeps)
// These are placeholder sounds - replace with actual macOS-like sounds from freesound.org
const SOUND_DATA: Record<SoundType, string> = {
    open: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1sbJd7fGWLlI6CmZqIe35+fnuLmJuNiIeMi42PjY2LjI+Ph4KBgYODhYOBfoGDg3+AgH5+e3x8fHx7enp7e3t7fHx7e3x8fHx7e3t7e3x8fHx7e3x8fHx8fHt7fHx8fHx8e3t8fHx8fHx7e3x8fHx7e3t7e3t8fHt7e3t7e3t7e3t7e3t7e3t7e3t8fHx8fHx7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7',
    close: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdGuVeX1+hYqBgIGDg4OCgoGBf35+fn5+fn18e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7',
    minimize: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF2TcG1ufYF+f319fX19fHx8fHx8fHx7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7',
};

let soundEnabled = true;

/**
 * Initialize sounds - preload audio elements into cache
 */
export const initSounds = (): void => {
    const soundTypes: SoundType[] = ['open', 'close', 'minimize'];
    soundTypes.forEach(type => {
        const audio = new Audio(SOUND_DATA[type]);
        audio.preload = 'auto';
        audio.volume = 0.3;
        audioCache.set(type, audio);
    });
};

/**
 * Play a sound effect
 */
export const playSound = (type: SoundType): void => {
    if (!soundEnabled) return;

    const audio = audioCache.get(type);
    if (audio) {
        // Clone the audio to allow overlapping plays
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = 0.3;
        clone.play().catch(() => {
            // Ignore autoplay restrictions
        });
    }
};

/**
 * Enable or disable sounds globally
 */
export const setSoundEnabled = (enabled: boolean): void => {
    soundEnabled = enabled;
};

/**
 * Check if sounds are enabled
 */
export const isSoundEnabled = (): boolean => {
    return soundEnabled;
};
