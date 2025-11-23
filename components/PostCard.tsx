
import React from 'react';
import type { Post, Language } from '../types';
import { getCoverUrl } from '../services/api';
import { RESOURCES } from '../constants';

interface PostCardProps {
  post: Post;
  lang: Language;
}

const getVariant = (post: Post, lang: Language) => {
    return post.langs[lang] || post.langs["en"];
};

const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
};

const PostCard: React.FC<PostCardProps> = ({ post, lang }) => {
  const variant = getVariant(post, lang);
  const coverUrl = getCoverUrl(post.id);
  const t = RESOURCES[lang].common;
  
  if (!variant) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMEIwQjBDIi8+CjxyZWN0IHg9IjE3NSIgeT0iOTciIHdpZHRoPSI1MCIgaGVpZZ2h0PSIzMSIgZmlsbD0iI0ZGN0NBQyIvPgo8L3N2Zz4K";
  }

  return (
    <article className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/7 transition-all hover:shadow-soft">
      <div className="aspect-[16/9] bg-white/5 cute-outline overflow-hidden">
        <img
          src={coverUrl}
          alt="cover"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-wider opacity-60">
          {formatDate(post.date)} · {lang.toUpperCase()}
        </div>
        <h3 className="font-display text-lg">{variant.title}</h3>
        <p className="text-sm opacity-80 line-clamp-2">
          {variant.description}
        </p>
        <div className="pt-2">
          <a
            href={`#/blog/post/${post.id}`}
            className="text-sm underline decoration-dotted underline-offset-4 hover:text-accent-400 transition-colors"
          >
            {t.read} →
          </a>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
