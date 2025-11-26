import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
import { cvData } from '../../data/cv_data';
import {
    safeOpenUrl,
    safeNavigate,
    createSafeGmailUrl,
    createSafeMailtoUrl,
    sanitizeInput,
    containsXSS
} from '../../utils/security';

const ContactApp: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSendEmail = () => {
        // Check for XSS in inputs
        if (containsXSS(subject) || containsXSS(message)) {
            console.error('Security: Potential XSS detected in input');
            return;
        }

        const gmailUrl = createSafeGmailUrl(
            cvData.personal.email,
            sanitizeInput(subject, 200),
            sanitizeInput(message, 2000)
        );

        if (gmailUrl) {
            safeOpenUrl(gmailUrl);
        }
    };

    const handleMailto = () => {
        // Check for XSS in inputs
        if (containsXSS(subject) || containsXSS(message)) {
            console.error('Security: Potential XSS detected in input');
            return;
        }

        const mailtoUrl = createSafeMailtoUrl(
            cvData.personal.email,
            sanitizeInput(subject, 200),
            sanitizeInput(message, 2000)
        );

        if (mailtoUrl) {
            safeNavigate(mailtoUrl);
        }
    };

    return (
        <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Get in Touch
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Feel free to reach out for collaborations or just a friendly hello!
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <a
                        href={`mailto:${cvData.personal.email}`}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Mail className="text-red-500" size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                            <div className="font-medium text-gray-900 dark:text-white">{cvData.personal.email}</div>
                        </div>
                    </a>

                    <a
                        href={`tel:${cvData.personal.phone}`}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Phone className="text-green-500" size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                            <div className="font-medium text-gray-900 dark:text-white">{cvData.personal.phone}</div>
                        </div>
                    </a>

                    <a
                        href={cvData.personal.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Github className="text-gray-700 dark:text-gray-300" size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">GitHub</div>
                            <div className="font-medium text-gray-900 dark:text-white">@ofurkanuygur</div>
                        </div>
                    </a>

                    <a
                        href={cvData.personal.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Linkedin className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</div>
                            <div className="font-medium text-gray-900 dark:text-white">oktay-furkan-uygur</div>
                        </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm sm:col-span-2">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <MapPin className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                            <div className="font-medium text-gray-900 dark:text-white">{cvData.personal.location}</div>
                        </div>
                    </div>
                </div>

                {/* Email Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Mail size={20} />
                        Send a Message
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What's this about?"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message here..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSendEmail}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                                </svg>
                                Open in Gmail
                            </button>

                            <button
                                onClick={handleMailto}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                            >
                                <ExternalLink size={18} />
                                Default Mail
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Open to new opportunities
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContactApp;
