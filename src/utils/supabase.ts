import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if config is available
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

export interface ChatLog {
    user_message: string;
    bot_response: string;
    user_agent: string;
    language: string;
    session_id: string;
}

// Generate a simple session ID
const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
};

/**
 * Log chat interaction to Supabase
 */
export const logChatInteraction = async (
    userMessage: string,
    botResponse: string
): Promise<void> => {
    // Skip logging if Supabase is not configured
    if (!supabase) {
        console.log('[Chat Log] Supabase not configured, skipping log');
        return;
    }

    // Skip logging clear commands
    if (botResponse === 'CLEAR_COMMAND') {
        return;
    }

    try {
        const chatLog: ChatLog = {
            user_message: userMessage,
            bot_response: botResponse,
            user_agent: navigator.userAgent,
            language: navigator.language,
            session_id: getSessionId(),
        };

        const { error } = await supabase
            .from('chat_logs')
            .insert([chatLog]);

        if (error) {
            throw error;
        }

        console.log('[Chat Log] Interaction logged successfully');
    } catch (error) {
        // Don't break the app if logging fails
        console.error('[Chat Log] Failed to log interaction:', error);
    }
};
