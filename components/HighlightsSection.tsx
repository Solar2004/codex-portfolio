import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchOrgProjects, fetchGithubViews } from '../services/api';
import type { Organization, Project } from '../types';
import ProjectDrawer from './ProjectDrawer';

// Using the real types from types.ts
type HighlightItem = Organization;
type ProjectItem = Project;

interface HighlightsSectionProps {
  lang: 'en' | 'es';
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ lang }) => {
  const highlightsSwiperRef = useRef<any>(null);
  const projectsSwiperRef = useRef<any>(null);
  const closeTimerRef = useRef<number | null>(null);

  // Data state
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HighlightItem | ProjectItem | null>(null);
  const [drawerType, setDrawerType] = useState<'highlight' | 'project'>('highlight');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const { organizations, projects: projectsData } = await fetchOrgProjects();

        // Update highlights with organizations
        const highlightsWithViews = await Promise.all(
          organizations.map(async (org) => {
            if (org.links?.github) {
              const githubData = await fetchGithubViews(org.links.github);
              return {
                ...org,
                views: githubData.views
              };
            }
            return org;
          })
        );

        // Update projects with GitHub data
        const projectsWithViews = await Promise.all(
          projectsData.map(async (project) => {
            if (project.github?.hasRepo && project.github?.repo) {
              const githubData = await fetchGithubViews(project.github.repo);
              return {
                ...project,
                github: {
                  ...project.github,
                  views: githubData.views
                }
              };
            }
            return project;
          })
        );

        setHighlights(highlightsWithViews);
        setProjects(projectsWithViews);
      } catch (error) {
        console.error('Error loading org-projects data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const nextHighlight = () => {
    highlightsSwiperRef.current?.swiper.slideNext();
  };

  const prevHighlight = () => {
    highlightsSwiperRef.current?.swiper.slidePrev();
  };

  const nextProject = () => {
    projectsSwiperRef.current?.swiper.slideNext();
  };

  const prevProject = () => {
    projectsSwiperRef.current?.swiper.slidePrev();
  };

  // Drawer functions
  const openDrawer = (item: HighlightItem | ProjectItem, type: 'highlight' | 'project') => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedItem(item);
    setDrawerType(type);
    setIsDrawerVisible(true);
    requestAnimationFrame(() => setIsDrawerOpen(true));
  };

  const closeDrawer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    setIsDrawerOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsDrawerVisible(false);
      setSelectedItem(null);
      closeTimerRef.current = null;
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleShare = async (item: HighlightItem | ProjectItem, type: 'highlight' | 'project') => {
    const title = item.name;

    // Get the best link to share
    let shareUrl = window.location.href; // fallback
    let shareText = `Check out ${title}`;

    if (type === 'project' && 'links' in item) {
      const projectLinks = item.links as Project['links'];
      // For projects, prioritize GitHub, then demo, then documentation
      if (projectLinks.github?.hasRepo && projectLinks.github?.url) {
        shareUrl = projectLinks.github.url;
        shareText = `Check out the ${title} project on GitHub`;
      } else if (projectLinks.demo) {
        shareUrl = projectLinks.demo;
        shareText = `Check out the ${title} project demo`;
      } else if (projectLinks.documentation) {
        shareUrl = projectLinks.documentation;
        shareText = `Check out the ${title} project documentation`;
      }
    } else if (type === 'highlight' && 'links' in item) {
      const orgLinks = item.links as Organization['links'];
      // For organizations, prioritize GitHub, then website
      if (orgLinks.github) {
        shareUrl = orgLinks.github;
        shareText = `Check out ${title} on GitHub`;
      } else if (orgLinks.website) {
        shareUrl = orgLinks.website;
        shareText = `Check out ${title} website`;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
          console.log('Link copied to clipboard');
        } catch (clipboardError) {
          console.log('Error copying to clipboard:', clipboardError);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
        // You could show a toast notification here
        console.log('Link copied to clipboard');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
      {/* Highlights Section */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-display text-4xl font-bold text-fg">
            {lang === 'es' ? 'Destacados' : 'Highlights'}
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-accent-500 to-transparent flex-1"></div>
          <span className="text-accent-400 font-medium">
            {lang === 'es' ? 'ORG - Éxito' : 'ORG - Success'}
          </span>
        </div>

        {/* Highlights Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevHighlight}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex-shrink-0"
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextHighlight}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex-shrink-0"
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Highlights Cards */}
        <div className="overflow-hidden">
          <Swiper
            ref={highlightsSwiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16
              },
              768: {
                slidesPerView: 1.8,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 2.2,
                spaceBetween: 24
              },
              1280: {
                slidesPerView: 2.8,
                spaceBetween: 24
              },
              1536: {
                slidesPerView: 3.2,
                spaceBetween: 24
              }
            }}
            pagination={false}
            className="highlights-swiper"
          >
            {highlights.map((highlight, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden h-80 cursor-pointer hover:bg-white/10 transition-colors duration-300"
                  onClick={() => openDrawer(highlight, 'highlight')}
                >
                  {/* Background Image Section - Top Half */}
                  <div className="relative h-1/2 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                    {/* Logo/Icon as background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={`/org-projects/organizations/${highlight.id}/${highlight.logo}`}
                        alt={`${highlight.name} logo`}
                        className="w-full h-full object-cover opacity-20"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'block';
                        }}
                      />
                      <div className="w-full h-full text-6xl opacity-20 hidden flex items-center justify-center">
                        {highlight.name.charAt(0)}
                      </div>
                    </div>

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Organization name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-bold text-white">
                        {highlight.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section - Bottom Half */}
                  <div className="h-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-fg/70 mb-2">
                        {highlight.position}
                      </p>
                      <p className="text-xs text-accent-400 mb-2">
                        {highlight.project}
                      </p>
                      <p className="text-xs text-fg/60 leading-relaxed line-clamp-2">
                        {highlight.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleShare(highlight, 'highlight')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4 text-fg/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-4xl font-bold text-fg">
            {lang === 'es' ? 'Proyectos' : 'Projects'}
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-accent-500 to-transparent flex-1"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-fg/60">
              {lang === 'es' ? '256 Completados de 500 Planificados' : '256 Done from 500 Planned'}
            </span>
            <span className="text-sm text-accent-400">51%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full transition-all duration-500"
              style={{ width: '51%' }}
            ></div>
          </div>
        </div>

        {/* Projects Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prevProject}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex-shrink-0"
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextProject}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex-shrink-0"
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Projects Cards */}
        <div className="overflow-hidden">
          <Swiper
            ref={projectsSwiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16
              },
              768: {
                slidesPerView: 1.8,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 2.2,
                spaceBetween: 24
              },
              1280: {
                slidesPerView: 2.8,
                spaceBetween: 24
              },
              1536: {
                slidesPerView: 3.2,
                spaceBetween: 24
              }
            }}
            pagination={false}
            className="projects-swiper"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden h-80 cursor-pointer hover:bg-white/10 transition-colors duration-300"
                  onClick={() => openDrawer(project, 'project')}
                >
                  {/* Background Image Section - Top Half */}
                  <div className="relative h-1/2 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                    {/* Logo/Icon as background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={`/org-projects/projects/${project.id}/${project.logo}`}
                        alt={`${project.name} logo`}
                        className="w-full h-full object-cover opacity-20"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'block';
                        }}
                      />
                      <div className="w-full h-full text-6xl opacity-20 hidden flex items-center justify-center">
                        {project.name.charAt(0)}
                      </div>
                    </div>

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Project name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-bold text-white">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section - Bottom Half */}
                  <div className="h-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-accent-400 mb-2">
                        {project.type}
                      </p>
                      <p className="text-xs text-fg/60 leading-relaxed line-clamp-2 mb-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Row: Views left, Share button right */}
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-fg/50">
                        {project.github?.views || '0'} views
                      </p>
                      <button
                        onClick={() => handleShare(project, 'project')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4 text-fg/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-slide {
          height: auto !important;
        }

        .highlights-swiper,
        .projects-swiper {
          overflow: visible !important;
          width: 100% !important;
        }

        .highlights-swiper .swiper-wrapper,
        .projects-swiper .swiper-wrapper {
          width: 100% !important;
          display: flex !important;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Project Drawer */}
      {isDrawerVisible && (
        <ProjectDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          item={selectedItem!}
          type={drawerType}
          lang={lang}
        />
      )}
    </div>
  );
};

export default HighlightsSection;
