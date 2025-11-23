
import React, { useState, useEffect, useMemo } from 'react';
import { useHash } from './hooks/useHash';
import { fetchPosts } from './services/api';
import type { Post, Language } from './types';
import Layout from './components/Layout';
import Cursor from './components/Cursor';
import LatestView from './pages/LatestView';
import AllPostsView from './pages/AllPostsView';
import PostView from './pages/PostView';
import HomeView from './pages/HomeView';
import KnowledgeView from './pages/KnowledgeView';
import { RESOURCES } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [showAll, setShowAll] = useState<boolean>(false);
  const hash = useHash();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postsSorted = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (showAll) return sorted;
    return sorted.filter((p) => p.langs[lang]);
  }, [posts, lang, showAll]);

  const renderView = () => {
    if (loading) {
      const t = RESOURCES[lang].common;
      return (
        <div className="py-12 text-center opacity-60">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
            {t.loading}
          </div>
        </div>
      );
    }
    
    if (hash.startsWith("#/blog/post/")) {
      const id = hash.replace("#/blog/post/", "").trim();
      return <PostView id={id} lang={lang} posts={posts} />;
    }
    
    if (hash === "#/blog/all") {
      return <AllPostsView posts={postsSorted} lang={lang} />;
    }

    if (hash === "#/blog") {
      return <LatestView posts={postsSorted} lang={lang} />;
    }

    if (hash.startsWith("#/knowledge")) {
      return <KnowledgeView lang={lang} />;
    }

    return <HomeView lang={lang} />;
  };

  return (
    <>
      <Cursor />
      <Layout
        lang={lang}
        setLang={setLang}
        allActive={showAll}
        onAll={() => setShowAll((v) => !v)}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
