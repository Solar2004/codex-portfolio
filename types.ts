
export type Language = 'en' | 'es';

export interface PostVariant {
  title: string;
  description: string;
}

export interface Post {
  id: string;
  date: string;
  category: string;
  langs: {
    en?: PostVariant;
    es?: PostVariant;
    [key: string]: PostVariant | undefined;
  };
}

export interface HeaderMessage {
  en: string;
  es: string;
}

export interface Resources {
  [key: string]: {
    common: {
      [key: string]: string;
    };
  };
}

export interface KnowledgeFile {
  type: 'md' | 'pdf';
  name: string;
  path: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  files: KnowledgeFile[];
}

export interface Organization {
  id: string;
  name: string;
  position: string;
  project: string;
  logo: string;
  dates: {
    start: string;
    end: string;
    duration: string;
  };
  workInfo: {
    workStyle: string;
    teamSize: string;
    responsibilities: string[];
  };
  technologies: string[];
  links: {
    github: string;
    twitter: string;
    website: string;
  };
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  logo: string;
  dates: {
    start: string;
    end: string;
    duration: string;
  };
  workInfo: {
    workStyle: string;
    status: string;
    complexity: string;
  };
  technologies: string[];
  features: string[];
  links: {
    github?: {
      url: string;
      repo: string;
      hasRepo: boolean;
    };
    demo?: string;
    documentation?: string;
  };
  github: {
    hasRepo: boolean;
    repo?: string;
    views?: string;
    stars?: string;
    forks?: string;
  };
  challenges: string[];
}
