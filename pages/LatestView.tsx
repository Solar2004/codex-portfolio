
import React from 'react';
import type { Post, Language } from '../types';
import PostCard from '../components/PostCard';
import { RESOURCES } from '../constants';

interface LatestViewProps {
  posts: Post[];
  lang: Language;
}

const LatestView: React.FC<LatestViewProps> = ({ posts, lang }) => {
  const t = RESOURCES[lang].common;
  const latest = posts.slice(0, 3);

  return (
    <section className="py-6">
      <h2 className="font-display text-xl mb-4">/blog</h2>
      {latest.length === 0 && (
        <div className="opacity-60 text-sm">{t.empty}</div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {latest.map((p) => (
          <PostCard key={`${p.id}-${lang}`} post={p} lang={lang} />
        ))}
      </div>
    </section>
  );
};

export default LatestView;
