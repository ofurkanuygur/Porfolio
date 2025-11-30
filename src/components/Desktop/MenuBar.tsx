import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useOS } from '../../context/OSContext';
import PreviewApp from '../../apps/Preview/PreviewApp';
import { FileText, Sun, Moon, Volume2, VolumeX, Lock, ChevronRight, Wifi, WifiOff, Battery, BatteryCharging, Zap } from 'lucide-react';
import { cvData } from '../../data/cv_data';

// Funny WiFi network names
const funnyWifiNetworks = [
    { name: "Ağlarsa Kablosuz Ağlar", signal: 4, locked: true },
    { name: "Yükleniyor...", signal: 3, locked: true },
    { name: "MIT İstihbarat Aracı #3", signal: 4, locked: true },
    { name: "Şifreyi Bil Kazan", signal: 2, locked: true },
    { name: "Bi Dakika Yükleniyor", signal: 3, locked: false },
    { name: "Virus.exe", signal: 1, locked: true },
    { name: "Komşunun WiFi'ı", signal: 4, locked: true },
    { name: "404 Network Not Found", signal: 2, locked: true },
    { name: "Bağlantı Hatası", signal: 3, locked: true },
    { name: "WiFi Değil Bu Tuzak", signal: 1, locked: true },
];

// Enhanced Notification component with glassmorphism
interface NotificationProps {
    show: boolean;
    title: string;
    message: string;
    icon: React.ReactNode;
    isDarkMode: boolean;
}

const Notification: React.FC<NotificationProps> = ({ show, title, message, icon, isDarkMode }) => (
    <div
        className={`fixed top-14 right-2 sm:right-4 z-[9999] w-[calc(100vw-1rem)] sm:w-80 max-w-80 rounded-2xl overflow-hidden ${show ? 'notification-enter' : 'translate-x-full opacity-0'}`}
        style={{
            backgroundColor: isDarkMode ? 'rgba(30, 32, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: isDarkMode
                ? '0 20px 60px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)'
                : '0 20px 60px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)',
        }}
    >
        {/* Gradient accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="flex items-start gap-3 p-4">
            <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{
                    background: 'linear-gradient(135deg, #0a84ff 0%, #bf5af2 100%)',
                    boxShadow: '0 4px 12px rgba(10, 132, 255, 0.4)',
                }}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-semibold text-sm tracking-tight">{title}</p>
                <p className="text-xs mt-1 opacity-60 leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-medium opacity-40 uppercase tracking-wider">now</span>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
        </div>
    </div>
);

const MenuBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [wifiOpen, setWifiOpen] = useState(false);
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [visibleNetworks, setVisibleNetworks] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean; title: string; message: string } | null>(null);
    const [batteryOpen, setBatteryOpen] = useState(false);
    const [batteryLevel] = useState(87);
    const [isCharging] = useState(false);
    const wifiRef = useRef<HTMLDivElement>(null);
    const batteryRef = useRef<HTMLDivElement>(null);
    const { openWindow, isDarkMode, toggleTheme, isSoundEnabled, toggleSound } = useOS();

    // Show notification
    const showNotification = (title: string, message: string) => {
        setNotification({ show: true, title, message });
        setTimeout(() => {
            setNotification(prev => prev ? { ...prev, show: false } : null);
        }, 3000);
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    // Toggle WiFi with notification
    const handleWifiToggle = () => {
        const newState = !wifiEnabled;
        setWifiEnabled(newState);
        if (newState) {
            showNotification('Wi-Fi', 'Wi-Fi açıldı. Ağlar taranıyor...');
        } else {
            showNotification('Wi-Fi', 'Wi-Fi kapatıldı. Bir ağa bağlı değilsiniz.');
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wifiRef.current && !wifiRef.current.contains(event.target as Node)) {
                setWifiOpen(false);
            }
            if (batteryRef.current && !batteryRef.current.contains(event.target as Node)) {
                setBatteryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Animate networks appearing when WiFi is enabled
    useEffect(() => {
        if (wifiEnabled && wifiOpen) {
            setVisibleNetworks(0);
            setIsScanning(true);

            const totalNetworks = 4;
            let currentNetwork = 0;

            const interval = setInterval(() => {
                currentNetwork++;
                setVisibleNetworks(currentNetwork);

                if (currentNetwork >= totalNetworks) {
                    clearInterval(interval);
                    setIsScanning(false);
                }
            }, 300);

            return () => clearInterval(interval);
        } else if (!wifiEnabled) {
            setVisibleNetworks(0);
            setIsScanning(false);
        }
    }, [wifiEnabled, wifiOpen]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openResume = () => {
        openWindow('resume', 'Resume', <PreviewApp />, <FileText size={18} />);
    };

    const openContact = () => {
        window.location.href = `mailto:${cvData.personal.email}`;
    };

    return (
        <>
            {/* macOS-style Notification */}
            {notification && (
                <Notification
                    show={notification.show}
                    title={notification.title}
                    message={notification.message}
                    icon={wifiEnabled ? <Wifi size={20} /> : <WifiOff size={20} />}
                    isDarkMode={isDarkMode}
                />
            )}

            <header
                className="flex w-full items-center justify-between whitespace-nowrap px-3 sm:px-5 py-1.5 glass-panel-strong"
                style={{ color: 'var(--text-primary)' }}
            >
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Apple-style logo with gradient */}
                    <div className="size-5 relative">
                        <div
                            className="absolute inset-0 rounded-full blur-md opacity-50"
                            style={{ background: 'linear-gradient(135deg, #0a84ff, #bf5af2)' }}
                        />
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="relative">
                            <path clipRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM8.28 15.22a.75.75 0 001.06 0l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25a.75.75 0 00-1.06 1.06L11.94 10l-3.66 3.66a.75.75 0 000 1.06z" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-sm font-bold tracking-tight">Portfolio</h2>
                    <nav className="hidden items-center gap-1 pl-2 md:flex">
                        <button
                            onClick={openContact}
                            className="menubar-btn text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            Contact
                        </button>
                        <button
                            onClick={openResume}
                            className="menubar-btn text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            Resume
                        </button>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="menubar-btn flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? (
                                <Sun size={17} className="text-amber-400" />
                            ) : (
                                <Moon size={17} className="text-indigo-400" />
                            )}
                        </button>
                        {/* Sound Toggle */}
                        <button
                            onClick={toggleSound}
                            className="menubar-btn flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                            aria-label={isSoundEnabled ? 'Mute sounds' : 'Enable sounds'}
                        >
                            {isSoundEnabled ? (
                                <Volume2 size={17} className="text-green-400" />
                            ) : (
                                <VolumeX size={17} className="opacity-50" />
                            )}
                        </button>
                        {/* WiFi Dropdown */}
                        <div className="relative" ref={wifiRef}>
                            <button
                                onClick={() => setWifiOpen(!wifiOpen)}
                                className="menubar-btn flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                                aria-label="WiFi menu"
                                aria-expanded={wifiOpen}
                                aria-haspopup="menu"
                            >
                                {wifiEnabled ? (
                                    <div className="relative">
                                        <Wifi size={17} className="text-blue-400" />
                                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full status-pulse" />
                                    </div>
                                ) : (
                                    <WifiOff size={17} className="opacity-40" />
                                )}
                            </button>

                            {wifiOpen && (
                                <div
                                    className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-12 sm:top-full sm:mt-2 w-auto sm:w-72 rounded-xl shadow-2xl overflow-hidden z-50"
                                    style={{
                                        backgroundColor: isDarkMode ? 'rgba(40, 40, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                    }}
                                    role="menu"
                                >
                                    {/* Wi-Fi Toggle */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                        <span className="font-semibold">Wi-Fi</span>
                                        <div
                                            className={`w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${wifiEnabled ? 'bg-blue-500 justify-end' : 'bg-gray-500 justify-start'}`}
                                            onClick={() => handleWifiToggle()}
                                            role="switch"
                                            aria-checked={wifiEnabled}
                                            aria-label={wifiEnabled ? 'Disable WiFi' : 'Enable WiFi'}
                                        >
                                            <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300" />
                                        </div>
                                    </div>

                                    {/* WiFi Off Warning */}
                                    {!wifiEnabled && (
                                        <div className="px-4 py-6 text-center">
                                            <WifiOff size={32} className="mx-auto mb-3 text-gray-400" />
                                            <p className="text-sm font-medium mb-1">Wi-Fi Kapalı</p>
                                            <p className="text-xs text-gray-500">Bir ağa bağlı değilsiniz</p>
                                        </div>
                                    )}

                                    {wifiEnabled && (
                                        <>
                                            {/* Personal Hotspot */}
                                            <div className="px-4 py-2">
                                                <p className="text-xs text-gray-500 font-medium mb-2">Personal Hotspot</p>
                                                <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">📱</span>
                                                        <span className="text-sm">Oktay's iPhone</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>4G</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Known Networks */}
                                            <div className="px-4 py-2 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-500 font-medium">Known Networks</p>
                                                    {isScanning && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-xs text-gray-500">Taranıyor...</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    {funnyWifiNetworks.slice(0, 4).map((network, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 ${index < visibleNetworks ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none h-0 py-0 overflow-hidden'
                                                                }`}
                                                            role="menuitem"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Wifi size={16} className={index === 0 ? 'text-blue-500' : ''} />
                                                                <span className="text-sm">{network.name}</span>
                                                            </div>
                                                            {network.locked && <Lock size={12} className="text-gray-500" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Other Networks */}
                                            <div className={`px-4 py-2 border-t transition-all duration-300 ${visibleNetworks >= 4 ? 'opacity-100' : 'opacity-0'}`} style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                                <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer" role="menuitem">
                                                    <span className="text-sm">Other Networks</span>
                                                    <ChevronRight size={16} className="text-gray-500" />
                                                </div>
                                            </div>

                                            {/* Wi-Fi Settings */}
                                            <div className={`px-4 py-2 border-t transition-all duration-300 ${visibleNetworks >= 4 ? 'opacity-100' : 'opacity-0'}`} style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                                <div className="py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer text-sm" role="menuitem">
                                                    Wi-Fi Settings...
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Battery Dropdown */}
                        <div className="relative" ref={batteryRef}>
                            <button
                                onClick={() => setBatteryOpen(!batteryOpen)}
                                className="menubar-btn flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                                aria-label="Battery menu"
                                aria-expanded={batteryOpen}
                                aria-haspopup="menu"
                            >
                                <div className="relative flex items-center gap-1">
                                    {isCharging ? (
                                        <BatteryCharging size={17} className="text-green-400" />
                                    ) : (
                                        <Battery size={17} className={batteryLevel > 20 ? 'text-green-400' : 'text-red-400'} />
                                    )}
                                    <span className="text-[10px] font-medium opacity-60 hidden sm:inline">{batteryLevel}%</span>
                                </div>
                            </button>

                            {batteryOpen && (
                                <div
                                    className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-12 sm:top-full sm:mt-2 w-auto sm:w-72 rounded-xl shadow-2xl overflow-hidden z-50"
                                    style={{
                                        backgroundColor: isDarkMode ? 'rgba(40, 40, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                    }}
                                    role="menu"
                                >
                                    {/* Battery Status */}
                                    <div className="px-4 py-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">Pil</span>
                                            <span className="text-sm font-medium">{batteryLevel}%</span>
                                        </div>
                                        {/* Battery Bar */}
                                        <div className="w-full h-6 bg-gray-700 rounded-lg overflow-hidden relative">
                                            <div
                                                className={`h-full transition-all duration-500 ${batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${batteryLevel}%` }}
                                            />
                                            {isCharging && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Zap size={14} className="text-yellow-400" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {isCharging ? 'Şarj oluyor - Tahmini 1 saat 23 dakika' : 'Pilde - Yaklaşık 5 saat 42 dakika kaldı'}
                                        </p>
                                    </div>

                                    {/* Power Mode */}
                                    <div className="px-4 py-2">
                                        <p className="text-xs text-gray-500 font-medium mb-2">Güç Modu</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer">
                                                <span className="text-sm">Düşük Güç Modu</span>
                                                <div
                                                    className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 bg-gray-500 justify-start`}
                                                    role="switch"
                                                    aria-checked={false}
                                                >
                                                    <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Apps Using Energy */}
                                    <div className="px-4 py-2 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                        <p className="text-xs text-gray-500 font-medium mb-2">Önemli Ölçüde Enerji Kullanan</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🌐</span>
                                                    <span className="text-sm">Chrome</span>
                                                </div>
                                                <span className="text-xs text-gray-500">12%</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">💻</span>
                                                    <span className="text-sm">VS Code</span>
                                                </div>
                                                <span className="text-xs text-gray-500">8%</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">🎵</span>
                                                    <span className="text-sm">Spotify</span>
                                                </div>
                                                <span className="text-xs text-gray-500">3%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Battery Settings */}
                                    <div className="px-4 py-2 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                        <div className="py-2 px-2 rounded-lg hover:bg-white/10 cursor-pointer text-sm" role="menuitem">
                                            Pil Ayarları...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Separator */}
                        <div className="w-px h-4 bg-current opacity-10 mx-1 hidden sm:block" />

                        {/* Social Links */}
                        <a
                            href="https://github.com/ofurkanuygur"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            className="menubar-btn flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                        >
                            <svg aria-hidden="true" className="h-[17px] w-[17px]" fill="currentColor" viewBox="0 0 24 24">
                                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.286 2.893 7.917 6.838 9.139.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.81.61-3.4-1.355-3.4-1.355-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd" />
                            </svg>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/oktay-furkan-uygur/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            className="menubar-btn hidden sm:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer transition-all active:scale-90"
                        >
                            <svg aria-hidden="true" className="h-[17px] w-[17px] text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-.5-2.5-1.8-2.5-1 0-1.5.7-1.7 1.3-.1.2-.1.5-.1.8V19h-3v-9h3v1.5c.5-.7 1.3-1.5 2.8-1.5 2 0 3.3 1.3 3.3 4.1V19z" />
                            </svg>
                        </a>
                    </div>

                    {/* Clock with enhanced styling */}
                    <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-current/10">
                        <p className="text-xs sm:text-sm font-semibold tracking-tight tabular-nums">
                            {format(time, 'h:mm')}
                            <span className="opacity-50 ml-0.5">{format(time, 'a')}</span>
                        </p>
                    </div>
                </div>
            </header>
        </>
    );
};

export default MenuBar;
