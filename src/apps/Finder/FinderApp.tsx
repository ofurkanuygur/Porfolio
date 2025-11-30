import React, { useState, useEffect } from 'react';
import { Folder, FileCode, Github, ExternalLink, X, Star, GitFork, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { safeOpenUrl } from '../../utils/security';
import { fetchGitHubRepos, clearRepoCache, getCacheStatus } from '../../utils/githubService';
import type { ProcessedProject } from '../../utils/githubService';

// GitHub username - change this to your username
const GITHUB_USERNAME = 'ofurkanuygur';

const FinderApp: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<ProcessedProject | null>(null);
    const [repos, setRepos] = useState<ProcessedProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch GitHub repos on mount
    useEffect(() => {
        loadGitHubRepos();
    }, []);

    const loadGitHubRepos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await fetchGitHubRepos(GITHUB_USERNAME);
            setRepos(data);
        } catch (err) {
            if (err instanceof Error && err.message === 'RATE_LIMITED') {
                setError('GitHub API rate limit exceeded. Please try again later.');
            } else {
                setError('Failed to load GitHub repos.');
            }
            console.error('GitHub fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        clearRepoCache();
        await loadGitHubRepos();
        setIsRefreshing(false);
    };

    const openLink = (url: string) => {
        if (!safeOpenUrl(url)) {
            console.error('Failed to open URL - security check failed');
        }
    };

    const cacheStatus = getCacheStatus();

    return (
        <div className="h-full bg-white dark:bg-gray-900 flex flex-col text-gray-800 dark:text-gray-100">
            {/* Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-52 bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur border-r border-gray-200 dark:border-gray-700 p-4 hidden sm:flex flex-col">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">GitHub</div>
                    <div className="space-y-1">
                        <div className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Folder size={16} />
                            <span className="text-sm">Repositories</span>
                            <span className="ml-auto text-xs opacity-60">{repos.length}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Links</div>
                        <a
                            href={`https://github.com/${GITHUB_USERNAME}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300"
                        >
                            <Github size={16} />
                            <span className="text-sm">View Profile</span>
                            <ExternalLink size={12} className="ml-auto opacity-40" />
                        </a>

                        {/* Refresh button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="w-full flex items-center gap-2 px-2 py-1.5 mt-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                            <span className="text-sm">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">GitHub Repositories</h2>

                        {/* Mobile refresh button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 animate-pulse">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {repos.map((repo) => (
                                <div
                                    key={repo.github}
                                    className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                    onClick={() => setSelectedProject(repo)}
                                >
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                        <FileCode size={32} className="text-white" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                            <Github size={12} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 capitalize">
                                            {repo.name}
                                        </div>
                                        <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-500">
                                            {repo.stars > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                    <Star size={10} />
                                                    {repo.stars}
                                                </span>
                                            )}
                                            {repo.language && (
                                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">
                                                    {repo.language}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && repos.length === 0 && !error && (
                        <div className="text-center py-12 text-gray-500">
                            <Folder size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No public repositories found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <FileCode size={32} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                                    {selectedProject.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedProject.description}
                                </p>

                                {/* GitHub stats */}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Star size={12} />
                                        {selectedProject.stars} stars
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <GitFork size={12} />
                                        {selectedProject.forks} forks
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(selectedProject.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Technologies
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject.tech.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {selectedProject.tech.length === 0 && (
                                    <span className="text-xs text-gray-400">No technologies specified</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => openLink(selectedProject.github)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                            >
                                <Github size={18} />
                                View on GitHub
                            </button>
                            {selectedProject.live && (
                                <button
                                    onClick={() => openLink(selectedProject.live!)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    <ExternalLink size={18} />
                                    Live Demo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Bar */}
            <div className="h-7 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-500">
                <span>{repos.length} repositories</span>
                {cacheStatus.isCached && cacheStatus.expiresIn && (
                    <span className="flex items-center gap-1 opacity-60">
                        <Clock size={10} />
                        Cache: {Math.round(cacheStatus.expiresIn / 1000 / 60)}m
                    </span>
                )}
            </div>
        </div>
    );
};

export default FinderApp;
