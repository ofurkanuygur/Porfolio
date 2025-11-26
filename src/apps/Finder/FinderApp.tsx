import React, { useState } from 'react';
import { Folder, FileCode, Github, ExternalLink, X } from 'lucide-react';
import { cvData } from '../../data/cv_data';
import { safeOpenUrl } from '../../utils/security';

interface Project {
    name: string;
    description: string;
    tech: string[];
    github?: string;
    live?: string;
}

const FinderApp: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    const openLink = (url: string) => {
        if (!safeOpenUrl(url)) {
            console.error('Failed to open URL - security check failed');
        }
    };

    return (
        <div className="h-full bg-white flex flex-col text-gray-800">
            {/* Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-48 bg-gray-100/80 backdrop-blur border-r border-gray-200 p-4 hidden sm:block">
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Favorites</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 text-blue-600 rounded cursor-pointer">
                            <Folder size={16} />
                            <span className="text-sm">Projects</span>
                        </div>
                        <a
                            href="https://github.com/ofurkanuygur"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200/50 rounded cursor-pointer text-gray-600"
                        >
                            <Github size={16} />
                            <span className="text-sm">GitHub</span>
                        </a>
                        <a
                            href="https://linkedin.com/in/oktay-furkan-uygur"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200/50 rounded cursor-pointer text-gray-600"
                        >
                            <ExternalLink size={16} />
                            <span className="text-sm">LinkedIn</span>
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-6">Projects</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {cvData.projects.map((project, i) => (
                            <div
                                key={i}
                                className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={() => handleProjectClick(project)}
                            >
                                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                    <FileCode size={32} className="text-white" />
                                    {project.github && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                            <Github size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600">{project.name}</div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <FileCode size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedProject.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-xs font-semibold text-gray-500 mb-2">Technologies</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedProject.tech.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {selectedProject.github && (
                                <button
                                    onClick={() => openLink(selectedProject.github!)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                                >
                                    <Github size={18} />
                                    GitHub
                                </button>
                            )}
                            {selectedProject.live && (
                                <button
                                    onClick={() => openLink(selectedProject.live!)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    <ExternalLink size={18} />
                                    Live Demo
                                </button>
                            )}
                            {!selectedProject.github && !selectedProject.live && (
                                <div className="flex-1 text-center text-gray-500 text-sm py-2">
                                    Private project - No public links available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Bar */}
            <div className="h-6 bg-gray-50 border-t border-gray-200 flex items-center px-4 text-xs text-gray-500">
                {cvData.projects.length} projects • Click to view details
            </div>
        </div>
    );
};

export default FinderApp;
