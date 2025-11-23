
import React from 'react';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, activeId }) => {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pl-4">
      <h3 className="font-display text-sm uppercase tracking-wider text-white/50 mb-3">On this page</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`block text-sm transition-colors border-l-2 pl-3 ${activeId === heading.id
                  ? 'text-accent-400 border-accent-400 font-medium'
                  : 'text-white/70 border-transparent hover:text-accent-400 hover:border-white/20'
                }`}
              style={{ marginLeft: `${(heading.level - 1) * 0.5}rem` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
