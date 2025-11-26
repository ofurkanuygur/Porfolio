/**
 * Security Utilities Module
 * Provides security functions for input validation, URL sanitization, and safe operations
 */

// Allowed URL protocols for external links
const ALLOWED_PROTOCOLS = ['https:', 'mailto:', 'tel:'];

// Allowed domains for external links (whitelist)
const ALLOWED_DOMAINS = [
    'github.com',
    'linkedin.com',
    'www.linkedin.com',
    'mail.google.com',
    'generativelanguage.googleapis.com',
];

// Blocked URL patterns
const BLOCKED_URL_PATTERNS = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /file:/i,
    /about:/i,
];

/**
 * Validates if a URL is safe to open
 * @param url - The URL to validate
 * @returns boolean - true if URL is safe
 */
export const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    // Check for blocked patterns
    if (BLOCKED_URL_PATTERNS.some(pattern => pattern.test(url))) {
        console.warn('Security: Blocked URL pattern detected:', url);
        return false;
    }

    try {
        const parsedUrl = new URL(url);

        // Check if protocol is allowed
        if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
            console.warn('Security: Blocked protocol:', parsedUrl.protocol);
            return false;
        }

        // For http/https URLs, verify domain is in whitelist
        if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
            const hostname = parsedUrl.hostname.toLowerCase();
            const isAllowed = ALLOWED_DOMAINS.some(domain =>
                hostname === domain || hostname.endsWith('.' + domain)
            );
            if (!isAllowed) {
                console.warn('Security: Domain not in whitelist:', hostname);
                return false;
            }
        }

        return true;
    } catch {
        console.warn('Security: Invalid URL format:', url);
        return false;
    }
};

/**
 * Safely opens a URL in a new tab with security protections
 * @param url - The URL to open
 * @returns boolean - true if URL was opened successfully
 */
export const safeOpenUrl = (url: string): boolean => {
    if (!isValidUrl(url)) {
        console.error('Security: Refused to open unsafe URL:', url);
        return false;
    }

    // Open with security attributes
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    // Additional protection: null out opener if somehow still accessible
    if (newWindow) {
        newWindow.opener = null;
    }

    return true;
};

/**
 * Safely navigates to a mailto or tel URL
 * @param url - The mailto: or tel: URL
 * @returns boolean - true if navigation was successful
 */
export const safeNavigate = (url: string): boolean => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const parsedUrl = new URL(url);

        // Only allow mailto: and tel: for navigation
        if (parsedUrl.protocol !== 'mailto:' && parsedUrl.protocol !== 'tel:') {
            console.warn('Security: safeNavigate only allows mailto: and tel:');
            return false;
        }

        window.location.href = url;
        return true;
    } catch {
        console.warn('Security: Invalid URL for navigation:', url);
        return false;
    }
};

/**
 * Sanitizes user input to prevent XSS
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string, maxLength: number = 500): string => {
    if (!input || typeof input !== 'string') {
        return '';
    }

    return input
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Escapes HTML special characters
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeHtml = (str: string): string => {
    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char);
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns boolean - true if valid email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Creates a safe Gmail compose URL
 * @param to - Recipient email
 * @param subject - Email subject
 * @param body - Email body
 * @returns Safe Gmail URL or null if invalid
 */
export const createSafeGmailUrl = (
    to: string,
    subject: string = '',
    body: string = ''
): string | null => {
    if (!isValidEmail(to)) {
        console.warn('Security: Invalid email address');
        return null;
    }

    const sanitizedSubject = sanitizeInput(subject, 200);
    const sanitizedBody = sanitizeInput(body, 2000);

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(sanitizedSubject)}&body=${encodeURIComponent(sanitizedBody)}`;
};

/**
 * Creates a safe mailto URL
 * @param to - Recipient email
 * @param subject - Email subject
 * @param body - Email body
 * @returns Safe mailto URL or null if invalid
 */
export const createSafeMailtoUrl = (
    to: string,
    subject: string = '',
    body: string = ''
): string | null => {
    if (!isValidEmail(to)) {
        console.warn('Security: Invalid email address');
        return null;
    }

    const sanitizedSubject = sanitizeInput(subject, 200);
    const sanitizedBody = sanitizeInput(body, 2000);

    return `mailto:${to}?subject=${encodeURIComponent(sanitizedSubject)}&body=${encodeURIComponent(sanitizedBody)}`;
};

/**
 * Checks if a string contains potential XSS payload
 * @param str - String to check
 * @returns boolean - true if potential XSS detected
 */
export const containsXSS = (str: string): boolean => {
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /expression\s*\(/i,
        /url\s*\(/i,
    ];
    return xssPatterns.some(pattern => pattern.test(str));
};
