import React, { useMemo, useEffect, useState } from 'react';
import { fetchOrganizationContent, fetchProjectContent } from '../services/api';
import type { Organization, Project } from '../types';

// Declare global window objects
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
      setOptions: (options: any) => void;
    };
    Prism: {
      highlight: (code: string, language: any, langString: string) => string;
      languages: Record<string, any>;
    };
  }
}

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: Organization | Project;
  type: 'highlight' | 'project';
  lang: 'en' | 'es';
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ isOpen, onClose, item, type, lang }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load content when item changes
  useEffect(() => {
    if (!item || !isOpen) return;

    const loadContent = async () => {
      setLoading(true);
      try {
        let content = '';
        if (type === 'highlight') {
          content = await fetchOrganizationContent(item.id);
        } else {
          content = await fetchProjectContent(item.id);
        }
        setContent(content);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent('# Error loading content\n\nSorry, couldn\'t load the content for this item.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [item, type, isOpen]);

  useEffect(() => {
    if (!item) return;
    setImageError(!item.logo);
  }, [item]);

  // Render markdown to HTML like in knowledge page
  const html = useMemo(() => {
    if (!content || !window.marked) return "";

    window.marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      headerPrefix: 'drawer-heading-',
      highlight: (code, lang) => {
        if (window.Prism && window.Prism.languages[lang]) {
          return window.Prism.highlight(code, window.Prism.languages[lang], lang);
        }
        return code;
      },
    });

    return window.marked.parse(content);
  }, [content]);

  if (!item) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-bg border-l border-white/10 z-[60] shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-2xl font-display font-bold text-fg">
            {type === 'project' ? (lang === 'es' ? 'Proyecto' : 'Project') : (lang === 'es' ? 'Organización' : 'Organization')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-64px)]">
          {/* Left Side - Image */}
          <div className="w-2/5 relative" key={item.id}>
            <div className="h-full bg-white/5 border border-white/10 flex items-center justify-center">
              {/* Logo as background */}
              <div className="relative">
                {item.logo && (
                  <img
                    key={item.logo}
                    src={`/org-projects/${type === 'highlight' ? 'organizations' : 'projects'}/${item.id}/${item.logo}`}
                    alt={`${item.name} logo`}
                    className={`w-full h-full object-cover opacity-30 ${imageError ? 'hidden' : ''}`}
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                )}
                <div className={`w-full h-full text-8xl opacity-30 ${imageError || !item.logo ? 'flex' : 'hidden'} items-center justify-center`}>
                  {item.name.charAt(0)}
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Title overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-4xl font-display font-bold text-fg mb-4">
                  {item.name}
                </h1>
                <div className="space-y-2">
                  <p className="text-lg text-fg/80">
                    {type === 'project' ? item.type : item.position}
                  </p>
                  {type === 'highlight' && (
                    <p className="text-sm text-accent-400">
                      {item.project}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-fg/60">
                      {lang === 'es' ? 'Fechas' : 'Dates'}
                    </span>
                    <span className="text-xs text-fg/60">
                      2023 - 2024
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-fg/60">
                      {type === 'project' ? (lang === 'es' ? 'Tiempo de trabajo' : 'Work time') : (lang === 'es' ? 'Otras info' : 'Other info')}
                    </span>
                  </div>
                  <p className="text-xs text-fg/60">
                    {lang === 'es' ? 'Mini descripción de proyecto o empresa' : 'Mini description of project or company'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-fg/60">
                      {lang === 'es' ? 'Estilo de trabajo' : 'Work style'}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 mt-6">
                  {type === 'highlight' && item.links?.github && (
                    <a
                      href={item.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/60 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 text-fg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {type === 'project' && 'links' in item && item.links?.github?.hasRepo && (
                    <a
                      href={item.links.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/60 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 text-fg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {type === 'highlight' && item.links?.twitter && (
                    <a
                      href={item.links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/60 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 text-fg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                  {type === 'project' && 'links' in item && item.links?.demo && (
                    <a
                      href={item.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/60 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-3/5 overflow-y-auto">
            <div className="p-8">
              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-fg/60">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                    {lang === 'es' ? 'Cargando contenido...' : 'Loading content...'}
                  </div>
                </div>
              ) : (
                /* Markdown Content */
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDrawer;
