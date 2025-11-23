
import type { Post, KnowledgeArticle, Organization, Project } from '../types';

const contentCache: { [key: string]: string } = {};
const orgProjectsCache: { [key: string]: any } = {};
const githubViewsCache: { [key: string]: any } = {};

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch("./posts.json");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts.json:", error);
    return [];
  }
};


export const fetchPostContent = async (id: string, lang: string): Promise<string> => {
  const key = `${id}_${lang}`;
  if (contentCache[key]) return contentCache[key];

  try {
    const response = await fetch(`./posts/${id}/content_${lang}.md`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    contentCache[key] = content;
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${key}:`, error);
    return `# Error loading content\n\nSorry, couldn't load the content for this post.`;
  }
};

export const getCoverUrl = (id: string): string => `./posts/${id}/thumbnail.jpg`;

// Organization and Project data functions
export const fetchOrgProjects = async (): Promise<{ organizations: Organization[], projects: Project[] }> => {
  const cacheKey = 'org-projects';
  if (orgProjectsCache[cacheKey]) {
    return orgProjectsCache[cacheKey];
  }

  try {
    const response = await fetch("./org-projects.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    orgProjectsCache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error("Error fetching org-projects.json:", error);
    return { organizations: [], projects: [] };
  }
};

export const fetchOrganizationContent = async (id: string): Promise<string> => {
  const cacheKey = `org_${id}`;
  if (contentCache[cacheKey]) return contentCache[cacheKey];

  try {
    const response = await fetch(`./org-projects/organizations/${id}/description.md`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    contentCache[cacheKey] = content;
    return content;
  } catch (error) {
    console.error(`Error fetching organization content for ${id}:`, error);
    return `# Error loading content\n\nSorry, couldn't load the content for this organization.`;
  }
};

export const fetchProjectContent = async (id: string): Promise<string> => {
  const cacheKey = `project_${id}`;
  if (contentCache[cacheKey]) return contentCache[cacheKey];

  try {
    const response = await fetch(`./org-projects/projects/${id}/description.md`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    contentCache[cacheKey] = content;
    return content;
  } catch (error) {
    console.error(`Error fetching project content for ${id}:`, error);
    return `# Error loading content\n\nSorry, couldn't load the content for this project.`;
  }
};

// GitHub views fetcher
export const fetchGithubViews = async (repo: string): Promise<{ views?: string, error?: string }> => {
  const cacheKey = `github_${repo}`;
  if (githubViewsCache[cacheKey]) {
    return githubViewsCache[cacheKey];
  }

  try {
    // GitHub API for repository traffic
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Codex-Portfolio'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Get views from traffic API (requires different endpoint)
    const trafficResponse = await fetch(`https://api.github.com/repos/${repo}/traffic/views?per=week`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Codex-Portfolio'
      }
    });

    let views = '0';
    if (trafficResponse.ok) {
      const trafficData = await trafficResponse.json();
      views = trafficData.count?.toString() || '0';
    }

    const result = {
      views: views === '0' ? undefined : views
    };

    githubViewsCache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error(`Error fetching GitHub views for ${repo}:`, error);
    return { error: 'Failed to fetch GitHub views' };
  }
};

export const fetchKnowledgeBase = async (): Promise<KnowledgeArticle[]> => {
  try {
    const response = await fetch("./knowledge.json");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching knowledge.json:", error);
    return [];
  }
};

export const fetchKnowledgeContent = async (articleId: string, filePath: string): Promise<string> => {
  const key = `knowledge_${articleId}_${filePath}`;
  if (contentCache[key]) return contentCache[key];

  try {
    const response = await fetch(`./knowledge/${articleId}/${filePath}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    contentCache[key] = content;
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${key}:`, error);
    return `# Error loading content`;
  }
};

export const getKnowledgeAssetUrl = (articleId: string, filePath: string): string => `./knowledge/${articleId}/${filePath}`;

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'knowledge' | 'project' | 'organization';
  category: string;
  url: string;
  date?: string;
  itemType?: 'highlight' | 'project'; // For drawer functionality
  itemData?: any; // Full item data for drawer
}

export const searchContent = async (query: string, lang: string = 'en'): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  try {
    // Buscar en posts
    const posts = await fetchPosts();
    const filteredPosts = posts.filter(post => {
      const postData = post.langs[lang] || post.langs['en'];
      if (!postData) return false;
      
      const searchText = `${postData.title} ${postData.description}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    // Convertir posts a SearchResult
    filteredPosts.forEach(post => {
      const postData = post.langs[lang] || post.langs['en'];
      if (postData) {
        results.push({
          id: post.id,
          title: postData.title,
          description: postData.description,
          type: 'post',
          category: post.category,
          url: `#/blog/post/${post.id}`,
          date: post.date
        });
      }
    });
    
    // Buscar en knowledge
    const knowledgeBase = await fetchKnowledgeBase();
    const filteredKnowledge = knowledgeBase.filter(article => {
      const searchText = `${article.title} ${article.category}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    // Convertir knowledge a SearchResult - crear un resultado por cada archivo
    filteredKnowledge.forEach(article => {
      article.files.forEach(file => {
        const fileExtension = file.path.split('.').pop()?.toLowerCase();
        const isPdf = fileExtension === 'pdf';
        const isMd = fileExtension === 'md';

        results.push({
          id: `${article.id}-${file.type}`,
          title: isPdf ? `${article.title} (PDF)` : article.title,
          description: `Categoría: ${article.category} - ${file.name}`,
          type: 'knowledge',
          category: article.category,
          url: `#/knowledge/${article.id}/${file.path}`
        });
      });
    });

    // Buscar en projects y organizations
    const { organizations, projects } = await fetchOrgProjects();

    // Buscar en organizations
    const filteredOrganizations = organizations.filter(org => {
      const searchText = `${org.name} ${org.position} ${org.project} ${org.technologies.join(' ')}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    // Convertir organizations a SearchResult
    filteredOrganizations.forEach(org => {
      results.push({
        id: org.id,
        title: org.name,
        description: `${org.position} - ${org.project}`,
        type: 'organization',
        category: 'Organization',
        url: `#/organization/${org.id}`,
        itemType: 'highlight',
        itemData: org
      });
    });

    // Buscar en projects
    const filteredProjects = projects.filter(project => {
      const searchText = `${project.name} ${project.type} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    // Convertir projects a SearchResult
    filteredProjects.forEach(project => {
      results.push({
        id: project.id,
        title: project.name,
        description: `${project.type} - ${project.description}`,
        type: 'project',
        category: 'Project',
        url: `#/project/${project.id}`,
        itemType: 'project',
        itemData: project
      });
    });
    
    // Ordenar por relevancia (títulos que empiecen con la query primero)
    return results.sort((a, b) => {
      const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase());
      const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase());

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Si ambos empiezan o no empiezan, ordenar por tipo (posts primero, luego projects, luego organizations, luego knowledge)
      const typeOrder = { 'post': 0, 'project': 1, 'organization': 2, 'knowledge': 3 };
      const aTypeOrder = typeOrder[a.type] ?? 4;
      const bTypeOrder = typeOrder[b.type] ?? 4;

      if (aTypeOrder !== bTypeOrder) {
        return aTypeOrder - bTypeOrder;
      }

      // Dentro del mismo tipo, ordenar por fecha (posts) o alfabéticamente (projects/organizations/knowledge)
      if (a.type === 'post' && b.type === 'post') {
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      }

      return a.title.localeCompare(b.title);
    });
    
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};
