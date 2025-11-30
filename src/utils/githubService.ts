/**
 * GitHub API Service with localStorage caching
 * Handles rate limiting by caching results for 1 hour
 */

export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    fork: boolean;
    archived: boolean;
}

export interface ProcessedProject {
    name: string;
    description: string;
    tech: string[];
    github: string;
    live?: string;
    stars: number;
    forks: number;
    language: string | null;
    updatedAt: string;
    isFromGitHub: true;
}

interface CacheData {
    repos: ProcessedProject[];
    timestamp: number;
}

const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Check if cache is still valid
 */
function isCacheValid(cacheData: CacheData | null): boolean {
    if (!cacheData) return false;
    const now = Date.now();
    return now - cacheData.timestamp < CACHE_DURATION;
}

/**
 * Get cached repos from localStorage
 */
function getCachedRepos(): ProcessedProject[] | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const cacheData: CacheData = JSON.parse(cached);
        if (isCacheValid(cacheData)) {
            console.log('[GitHub] Using cached repos, expires in',
                Math.round((CACHE_DURATION - (Date.now() - cacheData.timestamp)) / 1000 / 60), 'minutes');
            return cacheData.repos;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Save repos to localStorage cache
 */
function setCachedRepos(repos: ProcessedProject[]): void {
    try {
        const cacheData: CacheData = {
            repos,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('[GitHub] Cached', repos.length, 'repos');
    } catch (error) {
        console.warn('[GitHub] Failed to cache repos:', error);
    }
}

/**
 * Process raw GitHub repo data into our project format
 */
function processRepo(repo: GitHubRepo): ProcessedProject {
    // Combine topics and language for tech stack
    const tech: string[] = [];

    if (repo.language) {
        tech.push(repo.language);
    }

    if (repo.topics && repo.topics.length > 0) {
        // Add topics that aren't already included (avoid duplicates)
        repo.topics.forEach(topic => {
            const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
            if (!tech.includes(formattedTopic) && !tech.includes(topic)) {
                tech.push(formattedTopic);
            }
        });
    }

    return {
        name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
        description: repo.description || 'No description provided',
        tech: tech.slice(0, 6), // Limit to 6 technologies
        github: repo.html_url,
        live: repo.homepage || undefined,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        isFromGitHub: true
    };
}

/**
 * Fetch public repos from GitHub API
 */
export async function fetchGitHubRepos(username: string): Promise<ProcessedProject[]> {
    // Check cache first
    const cached = getCachedRepos();
    if (cached) {
        return cached;
    }

    console.log('[GitHub] Fetching repos for', username);

    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${username}/repos?type=public&sort=updated&per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    // Optional: Add token for higher rate limits
                    // 'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
                }
            }
        );

        if (!response.ok) {
            if (response.status === 403) {
                console.warn('[GitHub] Rate limit exceeded, using fallback');
                throw new Error('RATE_LIMITED');
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos: GitHubRepo[] = await response.json();

        // Filter and process repos
        const processedRepos = repos
            .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived
            .map(processRepo)
            .sort((a, b) => {
                // Sort by stars first, then by update date
                if (b.stars !== a.stars) return b.stars - a.stars;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });

        // Cache the results
        setCachedRepos(processedRepos);

        return processedRepos;
    } catch (error) {
        console.error('[GitHub] Failed to fetch repos:', error);
        throw error;
    }
}

/**
 * Get remaining rate limit info
 */
export async function getRateLimitInfo(): Promise<{ remaining: number; reset: Date } | null> {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/rate_limit`);
        if (!response.ok) return null;

        const data = await response.json();
        return {
            remaining: data.rate.remaining,
            reset: new Date(data.rate.reset * 1000)
        };
    } catch {
        return null;
    }
}

/**
 * Clear the cache (useful for forcing refresh)
 */
export function clearRepoCache(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('[GitHub] Cache cleared');
}

/**
 * Get cache status
 */
export function getCacheStatus(): { isCached: boolean; expiresIn: number | null } {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return { isCached: false, expiresIn: null };

        const cacheData: CacheData = JSON.parse(cached);
        const expiresIn = CACHE_DURATION - (Date.now() - cacheData.timestamp);

        return {
            isCached: expiresIn > 0,
            expiresIn: expiresIn > 0 ? expiresIn : null
        };
    } catch {
        return { isCached: false, expiresIn: null };
    }
}
