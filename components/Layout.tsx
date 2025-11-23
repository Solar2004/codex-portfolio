
import React, { useState, useEffect } from 'react';
import { HEADER_MESSAGES, RESOURCES } from '../constants';
import type { Language } from '../types';

interface ScrollingHeaderProps {
  lang: Language;
}

const ScrollingHeader: React.FC<ScrollingHeaderProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % HEADER_MESSAGES.length);
    }, 12500);
    return () => clearInterval(interval);
  }, []);

  const message = HEADER_MESSAGES[currentIndex]?.[lang] || HEADER_MESSAGES[0]?.[lang] || "";

  return (
    <div className="bg-accent-500/10 border-b border-accent-500/20 py-2 scroll-container">
      <div className="scroll-text text-sm opacity-80 text-center">
        {message}
      </div>
    </div>
  );
};

const SocialButtons: React.FC = () => {
  const socials = [
    { name: "Twitter", icon: "🐦", url: "https://twitter.com/TheLorianOMG" },
    { name: "GitHub", icon: "🐱", url: "https://github.com/Solar2004" },
  ];

  return (
    <div className="flex items-center gap-2">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-lg hover:bg-accent-500/10 transition-all"
          title={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

const navigate = (path: string) => {
  window.location.hash = path;
};

interface LayoutProps {
  children: React.ReactNode;
  allActive: boolean;
  onAll: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onAll, allActive, lang, setLang }) => {
  const t = RESOURCES[lang].common;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ScrollingHeader lang={lang} />
      <header className="sticky top-0 z-10 backdrop-blur-md bg-bg/80 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("#/")}>
            <span className="w-2 h-2 rounded-full bg-accent-500 shadow-soft animate-pulse"></span>
            <h1 className="font-display text-lg md:text-xl tracking-tight font-bold">{t.siteName}</h1>
          </div>

          <button
            className="md:hidden p-2 rounded-xl border border-white/15 text-sm flex items-center gap-2 hover:border-accent-500/60 transition-all"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wide">Menu</span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("#/blog")}
                className="text-sm px-3 py-1.5 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 backdrop-blur-sm"
              >
                /blog
              </button>
              <button
                onClick={() => navigate("#/blog/all")}
                className="text-sm px-3 py-1.5 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 backdrop-blur-sm"
              >
                /all
              </button>
              <button
                onClick={() => navigate("#/knowledge")}
                className="text-sm px-3 py-1.5 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 backdrop-blur-sm"
              >
                /knowledge
              </button>
            </div>
            <div className="flex items-center gap-3">
              <SocialButtons />
              <div className="w-px h-6 bg-white/15"></div>
              <select
                className="bg-bg/50 border border-white/15 rounded-xl px-3 py-1.5 text-sm hover:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/40 appearance-none backdrop-blur-sm"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-white/15 cursor-pointer hover:border-accent-500/60 transition-all backdrop-blur-sm">
                <input
                  type="checkbox"
                  className="accent-accent-500"
                  checked={allActive}
                  onChange={onAll}
                />
                <span className="opacity-80">{t.showAllLangs}</span>
              </label>
            </div>
          </div>
        </div>

        <div className={`md:hidden transition-max-height duration-300 overflow-hidden border-t border-white/10 bg-bg/90 backdrop-blur-sm ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate("#/blog"); setMenuOpen(false); }}
                className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 text-left"
              >
                /blog
              </button>
              <button
                onClick={() => { navigate("#/blog/all"); setMenuOpen(false); }}
                className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 text-left"
              >
                /all
              </button>
              <button
                onClick={() => { navigate("#/knowledge"); setMenuOpen(false); }}
                className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:border-accent-500/60 transition-all hover:bg-accent-500/10 text-left"
              >
                /knowledge
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wide text-white/60">Social</span>
              <SocialButtons />
            </div>

            <div className="flex flex-col gap-3">
              <select
                className="bg-bg/50 border border-white/15 rounded-xl px-3 py-2 text-sm hover:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/40 appearance-none backdrop-blur-sm"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <label className="inline-flex items-center gap-3 text-sm px-3 py-2 rounded-xl border border-white/15 cursor-pointer hover:border-accent-500/60 transition-all backdrop-blur-sm">
                <input
                  type="checkbox"
                  className="accent-accent-500"
                  checked={allActive}
                  onChange={onAll}
                />
                <span className="opacity-80">{t.showAllLangs}</span>
              </label>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 relative z-10">{children}</main>
      <footer className="max-w-6xl mx-auto px-4 py-12 text-xs opacity-60 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
          {t.byline}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
