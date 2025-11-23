import React, { useState } from 'react';

interface TimelineItem {
  data: string;
  status: string;
  statusB: string;
  statusE: string;
  description: string;
  detail: string;
  icon: string;
}

interface SkillsSectionProps {
  lang: 'en' | 'es';
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ lang }) => {
  const [curIdx, setCurIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(-1);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timelineData: TimelineItem[] = [
    {
      data: "2001",
      status: "status",
      statusB: "MIT",
      statusE: "Massachusetts Institute of Technology",
      description: lang === 'es' ? "Inicio de estudios en ingeniería" : "Started engineering studies",
      detail: lang === 'es'
        ? "Llegué a MIT con una curiosidad inagotable por la automatización y los sistemas inteligentes. Entre laboratorios interminables y noches en la Media Lab, aprendí a unir matemática pura con hardware real, construyendo los fundamentos de todo mi trabajo posterior."
        : "I arrived at MIT with an endless curiosity for automation and intelligent systems. Between late nights at the Media Lab and countless lab hours, I learned how to blend pure mathematics with tangible hardware, laying the foundation for everything I do now.",
      icon: "🎓"
    },
    {
      data: "2005",
      status: "status", 
      statusB: "Bachelor's Degree",
      statusE: "Computer Science",
      description: lang === 'es' ? "Graduación en Ciencias de la Computación" : "Computer Science graduation",
      detail: lang === 'es'
        ? "Mi tesis de licenciatura exploró cómo optimizar redes distribuidas a gran escala. El proyecto me abrió puertas en la industria y me enseñó la importancia de construir soluciones robustas que puedan escalar sin perder calidad."
        : "My bachelor's thesis explored how to optimize large-scale distributed networks. That project opened industry doors and taught me the importance of building robust solutions that can scale without sacrificing quality.",
      icon: "💻"
    },
    {
      data: "2007",
      status: "status",
      statusB: "Master's Degree", 
      statusE: "Cybersecurity",
      description: lang === 'es' ? "Especialización en Ciberseguridad" : "Cybersecurity specialization",
      detail: lang === 'es'
        ? "Durante la maestría lideré investigaciones sobre detección temprana de amenazas y respuesta automatizada. Aprendí a pensar como atacante y defensor, diseñando sistemas que permanecen resilientes incluso en escenarios complejos."
        : "During my master's I led research on early threat detection and automated response. I learned to think like both attacker and defender, designing systems that stay resilient even under complex conditions.",
      icon: "🔒"
    },
    {
      data: "2010",
      status: "status",
      statusB: "PhD",
      statusE: "Mathematics & Automation",
      description: lang === 'es' ? "Doctorado en Matemáticas y Automatización" : "PhD in Mathematics & Automation",
      detail: lang === 'es'
        ? "El doctorado me llevó a desarrollar modelos matemáticos aplicados a robots colaborativos. Publicamos varios papers que hoy son referencia en automatización industrial, combinando teoría rigurosa con prototipos funcionales."
        : "My PhD centered on mathematical models applied to collaborative robots. We published papers that became references in industrial automation, merging rigorous theory with working prototypes.",
      icon: "⚡"
    },
    {
      data: "2012",
      status: "status",
      statusB: "Research",
      statusE: "Advanced Systems",
      description: lang === 'es' ? "Investigación en sistemas avanzados" : "Advanced systems research",
      detail: lang === 'es'
        ? "A partir de 2012 colaboré con laboratorios y empresas para llevar la investigación a productos reales: desde controladores inteligentes hasta plataformas seguras en la nube. Esta etapa consolidó mi enfoque multidisciplinario."
        : "From 2012 onwards I partnered with labs and companies to bring research into real products—from smart controllers to secure cloud platforms. This stage cemented my multidisciplinary approach.",
      icon: "🔬"
    }
  ];

  const mainSkills = [
    {
      name: "Automation",
      description: lang === 'es' ? "Automatización de procesos industriales y sistemas inteligentes" : "Industrial process automation and intelligent systems",
      icon: "🤖"
    },
    {
      name: "Cyber Security",
      description: lang === 'es' ? "Seguridad informática y protección de sistemas" : "Cybersecurity and system protection",
      icon: "🛡️"
    },
    {
      name: "Mathematics",
      description: lang === 'es' ? "Matemáticas aplicadas y modelado computacional" : "Applied mathematics and computational modeling",
      icon: "📊"
    },
    {
      name: "Electronics",
      description: lang === 'es' ? "Diseño de circuitos y sistemas embebidos" : "Circuit design and embedded systems",
      icon: "⚡"
    },
    {
      name: "Programming",
      description: lang === 'es' ? "Desarrollo de software y arquitecturas de sistemas" : "Software development and system architectures",
      icon: "💻"
    }
  ];

  // Skills categories for navigation
  const skillsCategories = [
    {
      title: lang === 'es' ? 'Lenguajes' : 'Languages',
      skills: [
        { name: "Spanish", level: 5, maxLevel: 6, levelText: "B1 Native", icon: "🇪🇸" },
        { name: "German", level: 5, maxLevel: 6, levelText: "B1 Native", icon: "🇩🇪" },
        { name: "English", level: 2, maxLevel: 6, levelText: "A1", icon: "🇺🇸" },
        { name: "French", level: 3, maxLevel: 6, levelText: "A2", icon: "🇫🇷" }
      ]
    },
    {
      title: lang === 'es' ? 'Tecnologías' : 'Technologies',
      skills: [
        { name: "Machine Learning", level: 7, maxLevel: 8, levelText: "University Grade", icon: "🤖" },
        { name: "React", level: 6, maxLevel: 8, levelText: "Advanced", icon: "⚛️" },
        { name: "Electron", level: 5, maxLevel: 8, levelText: "Intermediate", icon: "⚡" },
        { name: "TypeScript", level: 6, maxLevel: 8, levelText: "Advanced", icon: "📘" }
      ]
    },
    {
      title: lang === 'es' ? 'Frameworks' : 'Frameworks',
      skills: [
        { name: "Next.js", level: 5, maxLevel: 8, levelText: "Intermediate", icon: "▲" },
        { name: "Vue.js", level: 4, maxLevel: 8, levelText: "Intermediate", icon: "💚" },
        { name: "Node.js", level: 6, maxLevel: 8, levelText: "Advanced", icon: "🟢" },
        { name: "Express", level: 5, maxLevel: 8, levelText: "Intermediate", icon: "🚀" }
      ]
    },
    {
      title: lang === 'es' ? 'Herramientas' : 'Tools',
      skills: [
        { name: "Git", level: 7, maxLevel: 8, levelText: "Expert", icon: "📝" },
        { name: "Docker", level: 5, maxLevel: 8, levelText: "Intermediate", icon: "🐳" },
        { name: "AWS", level: 4, maxLevel: 8, levelText: "Intermediate", icon: "☁️" },
        { name: "Figma", level: 6, maxLevel: 8, levelText: "Advanced", icon: "🎨" }
      ]
    }
  ];

  const handleTimelineClick = (index: number) => {
    setPrevIdx(curIdx);
    setCurIdx(index);
  };

  const nextCategory = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % skillsCategories.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const prevCategory = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategoryIndex((prev) => (prev - 1 + skillsCategories.length) % skillsCategories.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const currentItem = timelineData[curIdx];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Skills Section Header */}
      <div className="text-left mb-16">
        <h2 className="font-display font-bold text-5xl md:text-6xl tracking-tighter bg-gradient-to-b from-fg to-fg/60 bg-clip-text text-transparent !leading-tight mb-6">
          {lang === 'es' ? 'Skills' : 'Skills'}
        </h2>
        <p className="text-lg text-fg/60 max-w-2xl">
          {lang === 'es' 
            ? 'Mi trayectoria académica y profesional a lo largo de los años'
            : 'My academic and professional journey over the years'
          }
        </p>
      </div>

      {/* Study Section - Simple Layout like image */}
      <div className="mb-16">
        
        {/* Simple Horizontal Timeline */}
        <div className="relative w-full mb-8">
          {/* Continuous Timeline Line */}
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500/30 via-accent-500/50 to-accent-500/30"></div>
          
          {/* Timeline Items Container */}
          <div className="relative flex justify-between items-center">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center relative">
                 {/* Timeline Dot */}
                 <button
                   onClick={() => handleTimelineClick(index)}
                   className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                     index === curIdx
                       ? 'bg-accent-500 border-accent-500 scale-125 shadow-lg shadow-accent-500/50'
                       : 'bg-gray-600 border-gray-500 hover:border-accent-400 hover:scale-110'
                   }`}
                 >
                   <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                     index === curIdx ? 'bg-accent-500 animate-pulse' : 'bg-gray-700'
                   }`}></div>
                 </button>
                
                {/* Year Label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    index === curIdx ? 'text-accent-400' : 'text-fg/60'
                  }`}>
                    {item.data}
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${
                    index === curIdx ? 'text-accent-400' : 'text-fg/50'
                  }`}>
                    {item.statusB}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Arrow at the end */}
          <div className="absolute top-2 right-0 transform translate-x-4">
            <div className="w-0 h-0 border-l-4 border-l-accent-500/60 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
          </div>
        </div>
      </div>

      {/* Timeline Detail Card */}
      <div className="mb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-sm transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">{currentItem.icon}</span>
            <div>
              <h3 className="text-2xl font-display font-semibold text-fg">
                {currentItem.statusB}
              </h3>
              <p className="text-sm text-fg/60">
                {currentItem.data} · {currentItem.statusE}
              </p>
            </div>
          </div>
          <p className="text-lg text-fg/65 leading-relaxed">
            {currentItem.detail}
          </p>
        </div>
      </div>
      
      {/* Skills Categories - Simple vertical list like image */}
      <div className="space-y-8">
        {mainSkills.map((skill, index) => (
          <div key={index} className="text-left">
            <h4 className="font-display text-3xl font-bold text-fg mb-3">
              {skill.name}
            </h4>
            <p className="text-fg/70 text-base leading-relaxed">
              {skill.description}
            </p>
          </div>
        ))}
      </div>

      {/* New Skills with Progress Bars Section */}
      <div className="mt-20">
        <h3 className="font-display text-4xl font-bold text-fg mb-12 text-center">
          {lang === 'es' ? 'Conocimientos Técnicos' : 'Technical Skills'}
        </h3>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <button
            onClick={prevCategory}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            disabled={skillsCategories.length <= 1}
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center min-w-[200px] max-w-[300px] px-4">
            <h4 className={`font-display text-2xl font-bold text-fg mb-2 truncate transition-all duration-300 ${
              isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}>
              {skillsCategories[currentCategoryIndex].title}
            </h4>
            <div className="flex gap-2 justify-center">
              {skillsCategories.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentCategoryIndex ? 'bg-accent-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={nextCategory}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            disabled={skillsCategories.length <= 1}
          >
            <svg className="w-6 h-6 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Skills Display */}
        <div className="max-w-2xl mx-auto">
          <div className={`space-y-4 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}>
            {skillsCategories[currentCategoryIndex].skills.map((skill, index) => (
              <SkillBar 
                key={index}
                name={skill.name} 
                level={skill.level} 
                maxLevel={skill.maxLevel} 
                levelText={skill.levelText} 
                icon={skill.icon}
              />
            ))}
          </div>
        </div>

        {/* See More Link */}
        <div className="text-center mt-12">
          <a 
            href="#/knowledge"
            className="inline-flex items-center gap-2 text-fg/60 hover:text-accent-400 transition-colors duration-300 group"
          >
            <span>
              {lang === 'es' 
                ? 'Ver más sobre estudios o papers en' 
                : 'See more about study or papers in'
              }
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Codex →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Skill Bar Component
interface SkillBarProps {
  name: string;
  level: number;
  maxLevel: number;
  levelText: string;
  icon: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, maxLevel, levelText, icon }) => {
  const percentage = (level / maxLevel) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-fg">{name}</span>
        </div>
        <span className="text-sm text-fg/60">{levelText}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: maxLevel }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
              i < level 
                ? 'bg-gradient-to-r from-accent-500 to-accent-400' 
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;

