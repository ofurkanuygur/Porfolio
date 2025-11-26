import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Play, Trophy, Heart } from 'lucide-react';

interface TrashItem {
    id: number;
    x: number;
    y: number;
    emoji: string;
    speed: number;
    type: 'bug' | 'badcode' | 'error' | 'cleancode' | 'powerup';
    points: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    size: number;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
    life: number;
}

// Code Review themed items
const GAME_ITEMS = [
    { emoji: '🐛', type: 'bug' as const, points: 1, weight: 40 },
    { emoji: '💩', type: 'badcode' as const, points: 2, weight: 25 },
    { emoji: '🔥', type: 'error' as const, points: 5, weight: 15 },
    { emoji: '⭐', type: 'cleancode' as const, points: -3, weight: 10 },
    { emoji: '☕', type: 'powerup' as const, points: 0, weight: 5 },
    { emoji: '🍕', type: 'powerup' as const, points: 0, weight: 5 },
];

const CATCH_MESSAGES = [
    "Nice catch! 🎯",
    "Bug squashed! 💪",
    "QA loves you! ❤️",
    "Ship it! 🚀",
    "Clean! ✨",
    "LGTM! 👍",
    "Merged! 🎉",
    "+1 to debugging! 🧠",
];

const MISS_MESSAGES = [
    "Bu bug production'a gitti... 💀",
    "git blame: YOU",
    "Hotfix incoming! 🚨",
    "Customer ticket açıldı! 📞",
    "Senior dev ağlıyor... 😢",
];

const COMBO_MESSAGES: Record<number, string> = {
    5: "ON FIRE! 🔥",
    10: "UNSTOPPABLE! ⚡",
    15: "LEGENDARY! 🏆",
    20: "GOD MODE! 👑",
    25: "YOU'RE HIRED! 💼",
};

const BIN_WIDTH_DESKTOP = 80;
const BIN_WIDTH_MOBILE = 50;
const SPAWN_RATE = 400; // Çok daha hızlı spawn
let itemIdCounter = 0; // Unique ID için
let particleIdCounter = 0; // Unique particle ID
let textIdCounter = 0; // Unique text ID

const TrashGame: React.FC = () => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('trashGameHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [binX, setBinX] = useState(50);
    const [items, setItems] = useState<TrashItem[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const [combo, setCombo] = useState(0);
    const [powerUp, setPowerUp] = useState<string | null>(null);
    const [powerUpTimer, setPowerUpTimer] = useState(0);
    const [binSize, setBinSize] = useState(1);
    const [slowMode, setSlowMode] = useState(false);
    const [lives, setLives] = useState(3);
    const livesRef = useRef(3);

    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const lastSpawnTime = useRef<number>(0);
    const scoreRef = useRef(0);
    const comboRef = useRef(0);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        comboRef.current = combo;
    }, [combo]);

    useEffect(() => {
        livesRef.current = lives;
    }, [lives]);

    // Firework explosion effect
    const createFireworks = useCallback((x: number, y: number, color: string, count: number = 20) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            particleIdCounter++;
            const angle = (Math.PI * 2 * i) / count;
            const speed = 3 + Math.random() * 5;
            newParticles.push({
                id: particleIdCounter,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 1,
                size: 4 + Math.random() * 4,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    // Floating text effect
    const createFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
        textIdCounter++;
        setFloatingTexts(prev => [...prev, {
            id: textIdCounter,
            x,
            y,
            text,
            color,
            life: 1,
        }]);
    }, []);

    // Random weighted item selection
    const getRandomItem = useCallback(() => {
        const totalWeight = GAME_ITEMS.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (const item of GAME_ITEMS) {
            random -= item.weight;
            if (random <= 0) return item;
        }
        return GAME_ITEMS[0];
    }, []);



    const handleCatch = useCallback((item: TrashItem) => {
        const containerWidth = containerRef.current?.clientWidth || 400;
        const itemX = (item.x / 100) * containerWidth;

        // Clean code should NOT be caught
        if (item.type === 'cleancode') {
            setScore(s => Math.max(0, s + item.points));
            setCombo(0);
            createFloatingText(itemX, 300, "Don't catch clean code! 😱", '#ef4444');
            createFireworks(itemX, 300, '#ef4444', 10);
            return;
        }

        // Power-up handling
        if (item.type === 'powerup') {
            if (item.emoji === '☕') {
                setSlowMode(true);
                setPowerUp('☕ SLOW MODE');
                setPowerUpTimer(5);
                createFloatingText(itemX, 300, "Coffee Break! ☕", '#f59e0b');
            } else if (item.emoji === '🍕') {
                setBinSize(1.5);
                setPowerUp('🍕 BIG BIN');
                setPowerUpTimer(5);
                createFloatingText(itemX, 300, "Pizza Power! 🍕", '#f59e0b');
            }
            createFireworks(itemX, 300, '#f59e0b', 30);
            return;
        }

        // Regular catch
        const newCombo = comboRef.current + 1;
        setCombo(newCombo);
        setScore(s => s + item.points * (1 + Math.floor(newCombo / 5)));

        // Random catch message
        const message = CATCH_MESSAGES[Math.floor(Math.random() * CATCH_MESSAGES.length)];
        const colors = ['#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        createFloatingText(itemX, 300, `+${item.points * (1 + Math.floor(newCombo / 5))} ${message}`, color);
        createFireworks(itemX, 350, color, 15);

        // Combo milestones
        if (COMBO_MESSAGES[newCombo]) {
            setTimeout(() => {
                createFloatingText(containerWidth / 2, 200, COMBO_MESSAGES[newCombo], '#fbbf24');
                createFireworks(containerWidth / 2, 200, '#fbbf24', 50);
                createFireworks(containerWidth / 3, 200, '#ec4899', 30);
                createFireworks(containerWidth * 2 / 3, 200, '#3b82f6', 30);
            }, 200);
        }
    }, [createFireworks, createFloatingText]);

    const updateGame = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        // Spawn logic
        const spawnedItems: TrashItem[] = [];
        const spawnInterval = Math.max(250, SPAWN_RATE - scoreRef.current * 20);

        if (time - lastSpawnTime.current > spawnInterval) {
            const item = getRandomItem();
            itemIdCounter++;
            const id = itemIdCounter;
            const x = Math.random() * 80 + 10;
            const baseSpeed = slowMode ? 0.5 : 1.2;
            const randomFactor = Math.random() * Math.random() * 6;
            const speed = baseSpeed + randomFactor + (scoreRef.current / 25);

            spawnedItems.push({
                id,
                x,
                y: -10,
                emoji: item.emoji,
                speed,
                type: item.type,
                points: item.points,
            });

            lastSpawnTime.current = time;
        }

        // Update particles
        setParticles(prev => prev
            .map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.vy + 0.2,
                life: p.life - 0.02,
            }))
            .filter(p => p.life > 0)
        );

        // Update floating texts
        setFloatingTexts(prev => prev
            .map(t => ({
                ...t,
                y: t.y - 2,
                life: t.life - 0.02,
            }))
            .filter(t => t.life > 0)
        );

        // Calculate item movements and collisions
        const newItems: TrashItem[] = [];
        const caughtItems: TrashItem[] = [];
        const missedItems: TrashItem[] = [];
        const shippedCleanCodeItems: TrashItem[] = [];

        const containerWidth = containerRef.current?.clientWidth || 400;
        const isMobile = containerWidth < 640;
        const currentBinWidth = isMobile ? BIN_WIDTH_MOBILE : BIN_WIDTH_DESKTOP;

        const binLeft = binX - ((currentBinWidth * binSize) / 2 / containerWidth * 100);
        const binRight = binX + ((currentBinWidth * binSize) / 2 / containerWidth * 100);

        // Process existing items
        items.forEach(item => {
            const newY = item.y + item.speed;

            if (newY > 82 && newY < 95 && item.x > binLeft && item.x < binRight) {
                caughtItems.push(item);
            } else if (newY > 100) {
                if (item.type === 'cleancode') {
                    shippedCleanCodeItems.push(item);
                } else if (item.type !== 'powerup') {
                    missedItems.push(item);
                }
            } else {
                newItems.push({ ...item, y: newY });
            }
        });

        // Add spawned items
        newItems.push(...spawnedItems);

        // Update items state
        setItems(newItems);

        // Process caught items
        caughtItems.forEach(item => {
            handleCatch(item);
        });

        // Process missed items
        if (missedItems.length > 0) {
            const message = MISS_MESSAGES[Math.floor(Math.random() * MISS_MESSAGES.length)];
            createFloatingText(containerWidth / 2, 400, message, '#ef4444');
            createFireworks(containerWidth / 2, 400, '#ef4444', 15);

            const newLives = livesRef.current - 1;
            setLives(newLives);
            setCombo(0);

            if (newLives <= 0) {
                setGameState('gameover');
                if (scoreRef.current > highScore) {
                    setHighScore(scoreRef.current);
                    localStorage.setItem('trashGameHighScore', scoreRef.current.toString());
                }
            }
        }

        // Process shipped clean code items
        shippedCleanCodeItems.forEach(item => {
            const itemX = (item.x / 100) * containerWidth;
            createFloatingText(itemX, 400, "Clean code shipped! ✨", '#22c55e');
        });

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, binX, binSize, getRandomItem, slowMode, handleCatch, highScore, createFloatingText, createFireworks, items]); // Added 'items' to dependencies

    // Power-up timer
    useEffect(() => {
        if (powerUpTimer > 0) {
            const timer = setTimeout(() => {
                setPowerUpTimer(t => t - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (powerUp) {
            setPowerUp(null);
            setSlowMode(false);
            setBinSize(1);
        }
    }, [powerUpTimer, powerUp]);

    useEffect(() => {
        if (gameState === 'playing') {
            lastSpawnTime.current = performance.now();
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (gameState !== 'playing' || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setBinX(Math.min(Math.max(percentage, 5), 95));
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (gameState !== 'playing' || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setBinX(Math.min(Math.max(percentage, 5), 95));
    };

    const startGame = () => {
        setScore(0);
        setItems([]);
        setParticles([]);
        setFloatingTexts([]);
        setCombo(0);
        setPowerUp(null);
        setBinSize(1);
        setSlowMode(false);
        setLives(3);
        setGameState('playing');
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden select-none text-white font-sans touch-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >

            {/* Score & Lives */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <div className="text-lg sm:text-2xl font-bold bg-black/40 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    Score: {score}
                </div>
                <div className="mt-1 sm:mt-2 flex items-center gap-0.5 sm:gap-1 bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    {[...Array(3)].map((_, i) => (
                        <Heart
                            key={`heart-${i}`}
                            size={16}
                            className={`sm:w-5 sm:h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                            style={{
                                filter: i < lives ? 'drop-shadow(0 0 4px #ef4444)' : 'none',
                                transform: i < lives && lives <= 1 ? 'scale(1.1)' : 'scale(1)',
                                animation: i < lives && lives <= 1 ? 'pulse 0.5s infinite' : 'none',
                            }}
                        />
                    ))}
                </div>
                {combo > 2 && (
                    <div className="mt-1 sm:mt-2 text-sm sm:text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full animate-pulse">
                        🔥 {combo}x
                    </div>
                )}
            </div>

            {/* High Score */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex items-center gap-1 sm:gap-2 bg-yellow-500/20 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <Trophy size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                <span className="font-bold text-sm sm:text-base">{highScore}</span>
            </div>

            {/* Power-up indicator */}
            {powerUp && (
                <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 px-3 sm:px-6 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg animate-bounce shadow-lg">
                    {powerUp} ({powerUpTimer}s)
                </div>
            )}

            {/* Game Items */}
            {items.map(item => (
                <div
                    key={`item-${item.id}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform text-2xl sm:text-4xl"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        filter: item.type === 'cleancode' ? 'drop-shadow(0 0 10px gold)' : 'none',
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            {/* Particles (Fireworks) */}
            {particles.map(p => (
                <div
                    key={`particle-${p.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        opacity: p.life,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                />
            ))}

            {/* Floating Texts */}
            {floatingTexts.map(t => (
                <div
                    key={`text-${t.id}`}
                    className="absolute transform -translate-x-1/2 pointer-events-none font-bold text-xs sm:text-lg whitespace-nowrap"
                    style={{
                        left: t.x,
                        top: t.y,
                        color: t.color,
                        opacity: t.life,
                        textShadow: `0 0 10px ${t.color}`,
                    }}
                >
                    {t.text}
                </div>
            ))}

            {/* Bin */}
            <div
                className="absolute bottom-16 sm:bottom-4 transform -translate-x-1/2 transition-all duration-100"
                style={{
                    left: `${binX}%`,
                    transform: `translateX(-50%) scale(${binSize})`,
                }}
            >
                <div className="text-4xl sm:text-6xl">🗑️</div>
                {binSize > 1 && (
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-xl sm:text-2xl animate-bounce">✨</div>
                )}
            </div>

            {/* Start Screen */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-20 p-4">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🐛</div>
                    <h1 className="text-2xl sm:text-5xl font-bold mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                        Bug Catcher
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-300 mb-1 sm:mb-2">Senior Developer Simulator</p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 text-center">
                        Catch bugs 🐛 and bad code 💩<br />
                        Avoid catching clean code ⭐<br />
                        Collect power-ups ☕🍕<br />
                        <span className="text-red-400">❤️ 3 Lives</span>
                    </p>
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold text-base sm:text-xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <Play size={24} className="sm:w-7 sm:h-7" /> Start
                    </button>
                    {highScore > 0 && (
                        <p className="mt-3 sm:mt-4 text-yellow-400 flex items-center gap-2 text-sm sm:text-base">
                            <Trophy size={16} className="sm:w-[18px] sm:h-[18px]" /> Best: {highScore}
                        </p>
                    )}
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 p-4">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">💀</div>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                        Build Failed!
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">git reset --hard HEAD</p>
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 font-bold">Score: {score}</div>
                    {score === highScore && score > 0 && (
                        <div className="text-yellow-400 text-base sm:text-xl mb-2 sm:mb-4 flex items-center gap-2 animate-pulse">
                            <Trophy size={20} className="sm:w-6 sm:h-6" /> NEW HIGH SCORE!
                        </div>
                    )}
                    <div className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">Max Combo: {combo}x</div>
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-bold text-base sm:text-xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <RefreshCw size={24} className="sm:w-7 sm:h-7" /> Try Again
                    </button>
                </div>
            )}

            {/* Legend */}
            {gameState === 'playing' && (
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-[10px] sm:text-xs bg-black/40 px-2 sm:px-3 py-1 sm:py-2 rounded-lg backdrop-blur-sm">
                    <div>🐛+1 💩+2 🔥+5</div>
                    <div>⭐ DON'T CATCH!</div>
                </div>
            )}
        </div>
    );
};

export default TrashGame;
