import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import type { Language, KnowledgeArticle } from '../types';
import { fetchKnowledgeBase, fetchKnowledgeContent, getKnowledgeAssetUrl } from '../services/api';
import { useHash } from '../hooks/useHash';
import { RESOURCES } from '../constants';
import TableOfContents, { Heading } from '../components/TableOfContents';
import DocumentGraph3D from '../components/DocumentGraph3D';
import PDFViewer from '../components/PDFViewer';

const slugify = (text: any) => {
  // Convertir a string y extraer solo el texto sin HTML
  const textString = typeof text === 'string' ? text : String(text);
  const cleanText = textString.replace(/<[^>]*>/g, ''); // Remover tags HTML
  return `kn-heading-${cleanText
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u00C0-\u00FF-]+/g, '')}`; // Allow accented characters
};

const KnowledgeView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const t = RESOURCES[lang].common;

  // --- HASH-BASED ROUTING ---
  const hash = useHash();

  const { articleId, filePath } = useMemo(() => {
    const parts = hash.replace("#/knowledge", "").split('/').filter(Boolean);
    return { articleId: parts[0] || null, filePath: parts.slice(1).join('/') || null };
  }, [hash]);

  const handleFileSelect = (newArticleId: string, newFilePath: string) => {
    window.location.hash = `#/knowledge/${newArticleId}/${newFilePath}`;
  };

  const currentArticle = useMemo(() => knowledgeBase.find(a => a.id === articleId), [knowledgeBase, articleId]);
  const currentFile = useMemo(() => currentArticle?.files.find(f => f.path === filePath), [currentArticle, filePath]);

  // Fetch the knowledge base structure once on component mount
  useEffect(() => {
    fetchKnowledgeBase().then(data => {
      setKnowledgeBase(data);
      setLoading(false);
    });
  }, []);

  // Effect to automatically open the category of the currently viewed article
  useEffect(() => {
    if (articleId) {
      const article = knowledgeBase.find(a => a.id === articleId);
      if (article && !openCategories[article.category]) {
        setOpenCategories(prev => ({ ...prev, [article.category]: true }));
      }
    }
  }, [articleId, knowledgeBase, openCategories]);


  useEffect(() => {
    if (currentFile && currentFile.type === 'md' && articleId && filePath) {
      setContent('');
      setHeadings([]);
      fetchKnowledgeContent(articleId, filePath).then(md => {
        setContent(md);

        // Use marked lexer for consistent heading extraction
        const tokens = marked.lexer(md);
        const extractedHeadings: Heading[] = [];

        tokens.forEach(token => {
          if (token.type === 'heading') {
            const cleanText = token.text.replace(/<[^>]*>/g, '');
            extractedHeadings.push({
              level: token.depth,
              text: cleanText,
              id: slugify(cleanText)
            });
          }
        });

        setHeadings(extractedHeadings);
      });
    }
  }, [currentFile, articleId, filePath]);

  const html = useMemo(() => {
    if (!content) return "";

    const renderer = new marked.Renderer();

    // Fix: Use regular functions to access 'this' context and match new Marked API
    renderer.heading = function ({ tokens, depth }: any) {
      const text = this.parser.parseInline(tokens);
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = slugify(cleanText);
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };

    renderer.link = function ({ href, title, tokens }: any) {
      const text = this.parser.parseInline(tokens);
      // Check if it's an internal anchor link
      if (href.startsWith('#')) {
        const id = href.substring(1);
        // Prepend the prefix to match the heading IDs
        return `<a href="#kn-heading-${id}" title="${title || ''}">${text}</a>`;
      }
      return `<a href="${href}" title="${title || ''}">${text}</a>`;
    };

    marked.use({
      renderer,
      gfm: true,
      breaks: true,
    });

    return marked.parse(content) as string;
  }, [content]);

  useEffect(() => {
    if (content && window.Prism) {
      (window.Prism as any).highlightAll();
    }
  }, [html]);

  // ScrollSpy for Active TOC
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, html]);

  const articlesByCategory = useMemo(() => {
    return knowledgeBase.reduce((acc, article) => {
      (acc[article.category] = acc[article.category] || []).push(article);
      return acc;
    }, {} as Record<string, KnowledgeArticle[]>);
  }, [knowledgeBase]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (loading) return <div className="py-12 opacity-60">{t.loading}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6">
      <aside className="w-full lg:w-64 flex-shrink-0 border-r-0 lg:border-r border-white/10 pr-0 lg:pr-6 mb-6 lg:mb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg">{t.knowledge}</h2>
          <button
            className="lg:hidden text-white/50 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <nav>
            {Object.entries(articlesByCategory).map(([category, articles]) => (
              <div key={category} className="mb-4">
                <button onClick={() => toggleCategory(category)} className="w-full text-left font-display text-sm uppercase tracking-wider text-white/50 mb-2 flex justify-between items-center">
                  {category}
                  <span className={`transition-transform transform ${openCategories[category] ? 'rotate-90' : 'rotate-0'}`}>›</span>
                </button>
                {openCategories[category] && (
                  <ul className="space-y-1 pl-2 border-l border-white/10">
                    {articles.map(article => (
                      <li key={article.id}>
                        <span className={`text-sm font-bold block py-1 ${article.id === articleId ? 'text-accent-400' : ''}`}>{article.title}</span>
                        <ul className="space-y-1 pl-2">
                          {article.files.map(file => (
                            <li key={file.path}>
                              <a
                                href={`#/knowledge/${article.id}/${file.path}`}
                                className={`block text-xs py-1 rounded-md px-2 transition-colors ${filePath === file.path && articleId === article.id ? 'bg-accent-500/10 text-accent-400' : 'text-white/70 hover:bg-white/5'}`}
                              >
                                {file.type === 'pdf' ? '📄' : '📝'} {file.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-grow min-w-0">
        {!currentFile ? (
          <div className="flex items-center justify-center h-full text-white/50">
            {t.selectAnArticle}
          </div>
        ) : currentFile.type === 'md' ? (
          <div className="flex flex-col xl:flex-row gap-6">
            <div
              className="prose prose-invert max-w-none flex-grow min-w-0"
              onClick={(e) => {
                const target = (e.target as HTMLElement).closest('a');
                if (!target) return;

                const href = target.getAttribute('href');
                if (!href) return;

                // 1. Handle Anchor Links (Internal Page Navigation)
                if (href.startsWith('#')) {
                  e.preventDefault();
                  const id = href.substring(1);

                  // Try exact match first
                  let element = document.getElementById(id);

                  // If not found, try with prefix (for manually written links in markdown)
                  if (!element) {
                    element = document.getElementById(`kn-heading-${id}`);
                  }

                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  return;
                }

                // 2. Handle External Links
                if (href.startsWith('http')) {
                  target.setAttribute('target', '_blank');
                  target.setAttribute('rel', 'noopener noreferrer');
                  return; // Let default behavior happen (open in new tab)
                }

                // 3. Handle Internal Markdown Links
                // If it doesn't start with # and isn't absolute, assume it's a relative file link
                if (!href.startsWith('/')) {
                  e.preventDefault();
                  // Construct new hash path
                  // Assuming href is something like "other-file.md" or "subfolder/file.md"
                  // We need to keep the current articleId
                  window.location.hash = `#/knowledge/${articleId}/${href}`;
                }
              }}
            >
              <div className="max-w-4xl" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <div className="w-full xl:w-64 flex-shrink-0 space-y-6">
              <DocumentGraph3D
                headings={headings}
                content={content}
                onNodeClick={(nodeId) => {
                  const element = document.getElementById(nodeId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
              <TableOfContents headings={headings} activeId={activeId} />
            </div>
          </div>
        ) : (
          <PDFViewer
            url={getKnowledgeAssetUrl(articleId!, filePath!)}
            fileName={currentFile.name}
          />
        )}
      </main>
    </div>
  );
};

export default KnowledgeView;