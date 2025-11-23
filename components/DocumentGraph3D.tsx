import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import * as d3 from 'd3';
import type { Heading } from './TableOfContents';

interface DocumentGraph3DProps {
  headings: Heading[];
  content?: string; // Contenido markdown para analizar links internos
  onNodeClick?: (nodeId: string) => void;
}

interface GraphNode {
  id: string;
  name: string;
  level: number;
  color: string;
  size: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'hierarchy' | 'content'; // Tipo de conexión
  color?: string;
  width?: number;
}

const DocumentGraph3D: React.FC<DocumentGraph3DProps> = ({ headings, content, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Función para extraer links internos del contenido markdown
  const extractInternalLinks = (markdownContent: string, headings: Heading[]): GraphLink[] => {
    if (!markdownContent) return [];

    const internalLinks: GraphLink[] = [];
    const headingIds = new Set(headings.map(h => h.id));

    // Regex para encontrar links internos [texto](#heading-id)
    const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    let match;

    // Crear un mapa de contenido por sección para determinar el origen del link
    const contentSections: { [key: string]: string } = {};
    let currentSection = '';

    const lines = markdownContent.split('\n');
    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const headingText = headingMatch[2].trim().replace(/<[^>]*>/g, '');
        const headingId = headings.find(h => h.text === headingText)?.id;
        if (headingId) {
          currentSection = headingId;
          contentSections[currentSection] = '';
        }
      } else if (currentSection) {
        contentSections[currentSection] += line + '\n';
      }
    }

    // Buscar links en cada sección
    for (const [sectionId, sectionContent] of Object.entries(contentSections)) {
      while ((match = linkRegex.exec(sectionContent)) !== null) {
        const targetId = match[2];

        // Verificar que el target existe en nuestros headings
        if (headingIds.has(targetId) && sectionId !== targetId) {
          internalLinks.push({
            source: sectionId,
            target: targetId,
            type: 'content',
            color: 'rgba(255, 215, 0, 0.6)', // Dorado para links de contenido
            width: 2
          });
        }
      }
    }

    return internalLinks;
  };

  useEffect(() => {
    if (!containerRef.current || headings.length === 0) return;

    // Limpiar grafo anterior si existe
    if (graphRef.current) {
      graphRef.current._destructor?.();
    }

    // Obtener dimensiones del contenedor
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Crear nodos basados en los headings
    const nodes: GraphNode[] = headings.map((heading, index) => ({
      id: heading.id,
      name: heading.text,
      level: heading.level,
      color: getColorByLevel(heading.level),
      size: getSizeByLevel(heading.level)
    }));

    // Crear enlaces jerárquicos entre nodos
    const hierarchyLinks: GraphLink[] = [];
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];

      if (current.level > previous.level) {
        // Enlace padre-hijo
        hierarchyLinks.push({
          source: previous.id,
          target: current.id,
          type: 'hierarchy',
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1
        });
      } else {
        // Buscar el padre más cercano
        for (let j = i - 1; j >= 0; j--) {
          if (headings[j].level < current.level) {
            hierarchyLinks.push({
              source: headings[j].id,
              target: current.id,
              type: 'hierarchy',
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1
            });
            break;
          }
        }
      }
    }

    // Extraer enlaces de contenido del markdown
    const contentLinks = extractInternalLinks(content || '', headings);

    // Combinar todos los enlaces
    const links = [...hierarchyLinks, ...contentLinks];

    // Crear el grafo 3D
    const graph = (ForceGraph3D as any)()(containerRef.current)
      .width(width)
      .height(height)
      .graphData({ nodes, links })
      .nodeLabel('name')
      .nodeColor('color')
      .nodeVal('size')
      .linkColor((link: any) => link.color || 'rgba(255, 255, 255, 0.2)')
      .linkWidth((link: any) => link.width || 1)
      .backgroundColor('rgba(0, 0, 0, 0)')
      .showNavInfo(false)
      .enableNodeDrag(false)
      .enablePointerInteraction(true)
      .onNodeClick((node: any) => {
        if (onNodeClick) {
          onNodeClick(node.id);
        }
        // Scroll suave al elemento
        const element = document.getElementById(node.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .nodeThreeObject((node: any) => {
        // Create a group to hold the sphere and the text
        const group = new THREE.Group();

        // 1. Glowing Sphere
        const geometry = new THREE.SphereGeometry(node.size, 32, 32);
        const material = new THREE.MeshPhysicalMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.9,
          roughness: 0.1,
          metalness: 0.1,
          emissive: node.color,
          emissiveIntensity: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);

        // 2. Text Label (Sprite)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512; // Higher resolution
        canvas.height = 128;

        if (context) {
          // Transparent background
          context.fillStyle = 'rgba(0, 0, 0, 0)';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Text glow/shadow
          context.shadowColor = 'black';
          context.shadowBlur = 10;
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;

          context.fillStyle = 'white';
          context.font = 'bold 32px Arial'; // Larger font
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(
            node.name.length > 25 ? node.name.substring(0, 25) + '...' : node.name,
            canvas.width / 2,
            canvas.height / 2
          );
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false // Make text always visible on top? Maybe not, let's keep depthTest true for 3D feel
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(node.size * 10, node.size * 2.5, 1);
        sprite.position.set(0, node.size * 1.5, 0);

        group.add(sprite);
        return group;
      })
      .d3Force('charge', d3.forceManyBody().strength(-100)) // Less repulsion to keep it tighter
      .d3Force('link', d3.forceLink().distance(40)) // Shorter links
      .d3Force('center', d3.forceCenter(0, 0)); // Center it

    graphRef.current = graph;

    // Animar la entrada del grafo
    setTimeout(() => setIsVisible(true), 100);

    // Función para redimensionar el grafo
    const handleResize = () => {
      if (graphRef.current && containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        graphRef.current.width(newWidth).height(newHeight);
      }
    };

    // Agregar listener de redimensionamiento
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (graphRef.current) {
        graphRef.current._destructor?.();
      }
    };
  }, [headings, content, onNodeClick]);

  const getColorByLevel = (level: number): string => {
    const colors = {
      1: '#ff0055', // Neon Red
      2: '#00ffaa', // Neon Green
      3: '#00ccff', // Neon Blue
      4: '#ffcc00', // Neon Yellow
      5: '#cc00ff', // Neon Purple
      6: '#ff00cc'  // Neon Pink
    };
    return colors[level as keyof typeof colors] || '#ffffff';
  };

  const getSizeByLevel = (level: number): number => {
    return Math.max(1, 7 - level); // H1 = 6, H2 = 5, etc.
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="font-display text-sm uppercase tracking-wider text-white/50 mb-3">
        Document Structure 3D
      </h3>
      <div
        ref={containerRef}
        className="w-full h-64 rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden relative"
        style={{
          minHeight: '256px',
          maxHeight: '256px',
          width: '100%'
        }}
      />
      <div className="mt-2 text-xs text-white/50 text-center">
        Click en los cubos para navegar
      </div>
    </div>
  );
};

export default DocumentGraph3D;