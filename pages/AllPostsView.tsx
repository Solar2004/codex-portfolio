
import React from 'react';
import type { Post, Language } from '../types';
import PostCard from '../components/PostCard';
import { RESOURCES } from '../constants';

interface AllPostsViewProps {
  posts: Post[];
  lang: Language;
}

const AllPostsView: React.FC<AllPostsViewProps> = ({ posts, lang }) => {
  const t = RESOURCES[lang].common;

  return (
    <section className="py-6">
      <h2 className="font-display text-xl mb-4">/blog/all</h2>
      {posts.length === 0 && (
        <div className="opacity-60 text-sm">{t.empty}</div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <PostCard key={`${p.id}-${lang}`} post={p} lang={lang} />
        ))}
      </div>
    </section>
  );
};

export default AllPostsView;
