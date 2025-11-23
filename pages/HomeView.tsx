
import React, { useState, useEffect, useMemo } from 'react';
import { searchContent, type SearchResult } from '../services/api';
import type { Language, Organization, Project } from '../types';
import { useTyped } from '../hooks/useTyped';
import SkillsSection from '../components/SkillsSection';
import HighlightsSection from '../components/HighlightsSection';
import ProjectDrawer from '../components/ProjectDrawer';
import ProteanCloudsBackground from '../components/ProteanCloudsBackground';

interface HomeViewProps {
    lang: Language;
}

const HomeView: React.FC<HomeViewProps> = ({ lang }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const showResults = query.length > 0;

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Organization | Project | null>(null);
    const [drawerType, setDrawerType] = useState<'highlight' | 'project'>('highlight');

    const typedRef = useTyped(['I\'m Lorian', 'I\'m a software engineer, researcher']);

    // Efecto para realizar la búsqueda con debounce
    useEffect(() => {
        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await searchContent(query, lang);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Debounce de 300ms

        return () => clearTimeout(timeoutId);
    }, [query, lang]);

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'project' || result.type === 'organization') {
            // Open drawer for projects and organizations
            setSelectedItem(result.itemData);
            setDrawerType(result.itemType || 'highlight');
            setIsDrawerOpen(true);
        } else {
            // Navigate to URL for posts and knowledge
            window.location.hash = result.url;
        }
    };

    // Drawer functions
    const openDrawer = (item: Organization | Project, type: 'highlight' | 'project') => {
        setSelectedItem(item);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => (
        <div
            className="px-5 py-3 hover:bg-accent-500/10 transition-colors cursor-pointer rounded-lg"
            onClick={() => handleResultClick(result)}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {result.type === 'post' ? (
                        <span className="text-accent-400 text-sm">📝</span>
                    ) : result.type === 'project' ? (
                        <span className="text-green-400 text-sm">🚀</span>
                    ) : result.type === 'organization' ? (
                        <span className="text-purple-400 text-sm">🏢</span>
                    ) : (
                        <span className="text-blue-400 text-sm">
                            {result.title.includes('(PDF)') ? '📄' : '📚'}
                        </span>
                    )}
                </div>
                <div className="flex-grow min-w-0">
                    <h4 className="font-display text-base text-fg">{result.title}</h4>
                    <p className="text-xs text-fg/70 line-clamp-1">{result.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${result.type === 'post'
                            ? 'bg-accent-500/20 text-accent-400'
                            : result.type === 'project'
                                ? 'bg-green-500/20 text-green-400'
                                : result.type === 'organization'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {result.type === 'post' ? 'Blog' :
                                result.type === 'project' ? 'Project' :
                                    result.type === 'organization' ? 'Organization' :
                                        result.title.includes('(PDF)') ? 'PDF' : 'Markdown'}
                        </span>
                        <span className="text-xs text-fg/50">{result.category}</span>
                        {result.date && (
                            <span className="text-xs text-fg/50">{new Date(result.date).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col relative">
            {/* Hero Section */}
            <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 z-20 overflow-visible">
                <div className="relative flex flex-col items-center justify-center py-20 md:py-32 text-center overflow-visible">
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        <ProteanCloudsBackground />
                    </div>
                    <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
                        <h1 className="font-display font-extrabold text-7xl md:text-8xl tracking-tighter bg-gradient-to-b from-fg via-fg to-accent-500/30 bg-clip-text text-transparent !leading-tight">
                            CODEX
                        </h1>

                        {/* Technical info */}
                        <div className="flex items-center gap-4 mt-4 text-sm opacity-60">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                                <span>System Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                                <span>Neural Active</span>
                            </div>
                        </div>

                        <div className="relative w-full max-w-3xl lg:max-w-6xl xl:max-w-7xl mt-8 px-4 md:px-0">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-accent-400/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400 group-focus-within:text-accent-300 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="relative w-full bg-bg/50 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all backdrop-blur-sm shadow-soft group-focus-within:shadow-accent-500/20"
                                    aria-label="Search documents"
                                />
                            </div>

                            {showResults && (
                                <div className="absolute left-4 right-4 md:left-0 md:right-0 top-full mt-3 z-[60] bg-bg/95 border border-white/15 rounded-xl p-2 text-left animate-fade-in shadow-2xl backdrop-blur-md">
                                    {isSearching ? (
                                        <div className="px-5 py-8 text-center">
                                            <div className="inline-flex items-center gap-2 text-fg/60">
                                                <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                                                <span className="text-sm">Buscando...</span>
                                            </div>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
                                            {searchResults.map((result) => (
                                                <SearchResultItem key={`${result.type}-${result.id}`} result={result} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-8 text-center text-fg/60">
                                            <span className="text-sm">No se encontraron resultados para "{query}"</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-white/50 mt-3 font-mono">
                            &gt; Search across all documents on the web
                        </p>
                    </div>
                </div>
            </div>

            {/* About Me Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row items-start gap-12 min-w-[800px]">
                    {/* Profile Image */}
                    <div className="flex-shrink-0 relative group">
                        <img
                            src="/profile.jpg"
                            alt="Lorian Profile"
                            className="w-80 h-80 object-cover rounded-2xl shadow-2xl transition-opacity duration-500 group-hover:opacity-0"
                        />
                        <img
                            src="/profile-solar.jpg"
                            alt="Lorian Profile Solar"
                            className="absolute inset-0 w-80 h-80 object-cover rounded-2xl shadow-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-left">
                        <h2 className="font-mono font-bold text-6xl md:text-7xl tracking-tighter bg-gradient-to-b from-fg to-fg/60 bg-clip-text text-transparent !leading-tight mb-4">
                            Lorian
                        </h2>
                        <div className="text-lg md:text-xl text-fg/60 min-h-[2rem] w-full">
                            <span ref={typedRef}></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <SkillsSection lang={lang} />

            {/* Highlights Section */}
            <HighlightsSection lang={lang} />

            {/* Project Drawer */}
            <ProjectDrawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                item={selectedItem}
                type={drawerType}
                lang={lang}
            />

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default HomeView;
