
import React, { useState, useEffect, useMemo } from 'react';
import type { Post, Language } from '../types';
import { fetchPostContent, getCoverUrl } from '../services/api';
import { RESOURCES } from '../constants';

declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
      setOptions: (options: any) => void;
    };
    Prism: {
      highlight: (code: string, language: any, langString: string) => string;
      languages: { [key: string]: any };
    };
  }
}

interface PostViewProps {
  posts: Post[];
  id: string;
  lang: Language;
}

const getVariant = (post: Post, lang: Language) => {
    return post.langs[lang] || post.langs["en"];
};

const formatDate = (d: string) => {
    return new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
};

const PostView: React.FC<PostViewProps> = ({ posts, id, lang }) => {
  const [content, setContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(true);
  const post = posts.find((p) => p.id === id);
  const t = RESOURCES[lang].common;

  useEffect(() => {
    if (post) {
      setLoadingContent(true);
      const postLang = post.langs[lang] ? lang : 'en';
      fetchPostContent(id, postLang).then((fetchedContent) => {
        setContent(fetchedContent);
        setLoadingContent(false);
      });
    }
  }, [id, post, lang]);

  const html = useMemo(() => {
    if (!content) return "";
    
    if (window.marked && window.Prism) {
        window.marked.setOptions({
          highlight: (code, lang) => {
            if (window.Prism.languages[lang]) {
              return window.Prism.highlight(code, window.Prism.languages[lang], lang);
            }
            return code;
          },
          breaks: true,
          gfm: true,
          headerIds: true,
          headerPrefix: 'post-heading-',
        });
        return window.marked.parse(content);
    }
    return content;
  }, [content]);

  if (!post) {
    return <div className="py-12 opacity-60">{t.postNotFound}</div>;
  }
  
  const variant = getVariant(post, lang);
  if(!variant) {
    return <div className="py-12 opacity-60">{t.postNotFound}</div>;
  }

  const coverUrl = getCoverUrl(post.id);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMEIwQjBDIi8+CjxyZWN0IHg9IjE3NSIgeT0iOTciIHdpZHRoPSI1MCIgaGVpZZ2h0PSIzMSIgZmlsbD0iI0ZGN0NBQyIvPgo8L3N2Zz4K";
  }

  return (
    <article className="py-6">
      <button
        onClick={() => window.history.back()}
        className="text-sm mb-4 underline decoration-dotted underline-offset-4 hover:text-accent-400 transition-colors"
      >
        ← {t.back}
      </button>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 cute-outline">
        <img
          src={coverUrl}
          alt="cover"
          className="w-full max-h-[50vh] object-cover"
          onError={handleImageError}
        />
      </div>
      <h1 className="font-display text-4xl mt-6 mb-2">{variant.title}</h1>
      <div className="text-xs uppercase tracking-wider opacity-60">
        {formatDate(post.date)} · {(post.langs[lang] ? lang : 'en').toUpperCase()}
      </div>
      {loadingContent ? (
        <div className="mt-6 opacity-60 text-sm">{t.loadingContent}</div>
      ) : (
        <div
          className="prose prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </article>
  );
};

export default PostView;
