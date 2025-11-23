import React, { useEffect, useState } from 'react';

const BlueprintBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid pattern like technical drawings */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Neural Network Diagram - top left */}
      <svg
        className="absolute top-20 left-10 w-48 h-32 opacity-6 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        viewBox="0 0 192 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Input Layer */}
        <circle cx="20" cy="32" r="4" fill="currentColor" opacity="0.8"/>
        <circle cx="20" cy="64" r="4" fill="currentColor" opacity="0.8"/>
        <circle cx="20" cy="96" r="4" fill="currentColor" opacity="0.8"/>

        {/* Hidden Layer 1 */}
        <circle cx="80" cy="32" r="5" fill="currentColor" opacity="0.9"/>
        <circle cx="80" cy="64" r="5" fill="currentColor" opacity="0.9"/>
        <circle cx="80" cy="96" r="5" fill="currentColor" opacity="0.9"/>

        {/* Hidden Layer 2 */}
        <circle cx="140" cy="48" r="5" fill="currentColor" opacity="0.9"/>
        <circle cx="140" cy="80" r="5" fill="currentColor" opacity="0.9"/>

        {/* Output Layer */}
        <circle cx="180" cy="64" r="6" fill="currentColor" opacity="1"/>

        {/* Connections */}
        <path d="M24,32 Q52,28 76,32" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M24,64 Q52,64 76,64" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M24,96 Q52,100 76,96" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>

        <path d="M85,32 Q112,30 135,48" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M85,64 Q112,64 135,64" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M85,96 Q112,98 135,80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>

        <path d="M145,48 Q160,56 174,64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <path d="M145,80 Q160,72 174,64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>

        {/* Activation indicators */}
        <circle cx="80" cy="32" r="2" fill="#ff7cac" opacity="0.8" className="animate-pulse"/>
        <circle cx="140" cy="64" r="2" fill="#ff7cac" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
      </svg>

      {/* Integral symbol - top right corner */}
      <svg
        className="absolute top-32 right-16 w-12 h-24 opacity-5 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        viewBox="0 0 48 96"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12,6 Q12,12 18,12 L30,12 Q36,12 36,18 L36,78 Q36,84 30,84 L18,84 Q12,84 12,90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6,48 L42,48"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {/* Quantum Circuit Diagram - left side */}
      <svg
        className="absolute top-1/3 left-4 w-40 h-48 opacity-5 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        viewBox="0 0 160 192"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Qubits */}
        <line x1="20" y1="32" x2="140" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="20" y1="64" x2="140" y2="64" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="20" y1="96" x2="140" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="20" y1="128" x2="140" y2="128" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <line x1="20" y1="160" x2="140" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.6"/>

        {/* Qubit labels */}
        <text x="12" y="36" fontSize="8" fill="currentColor" opacity="0.7">q₀</text>
        <text x="12" y="68" fontSize="8" fill="currentColor" opacity="0.7">q₁</text>
        <text x="12" y="100" fontSize="8" fill="currentColor" opacity="0.7">q₂</text>
        <text x="12" y="132" fontSize="8" fill="currentColor" opacity="0.7">q₃</text>
        <text x="12" y="164" fontSize="8" fill="currentColor" opacity="0.7">q₄</text>

        {/* Hadamard Gates */}
        <rect x="32" y="24" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="40" y="35" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">H</text>

        <rect x="72" y="56" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="80" y="67" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.8">H</text>

        {/* CNOT Gates */}
        <circle cx="112" cy="48" r="3" fill="currentColor" opacity="0.8"/>
        <path d="M112,51 L112,77" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <circle cx="112" cy="80" r="3" fill="currentColor" opacity="0.8"/>
        <path d="M109,54 L115,54" stroke="currentColor" strokeWidth="1" opacity="0.6"/>

        {/* Measurement */}
        <rect x="120" y="24" width="12" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="126" y="37" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.8">📏</text>

        <rect x="120" y="120" width="12" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="126" y="133" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.8">📏</text>

        {/* Quantum state indicators */}
        <circle cx="60" cy="32" r="2" fill="#ff7cac" opacity="0.8" className="animate-pulse"/>
        <path d="M65,32 L85,32" stroke="#ff7cac" strokeWidth="1" opacity="0.5"/>

        <circle cx="100" cy="64" r="2" fill="#8b5cf6" opacity="0.8" className="animate-pulse" style={{animationDelay: '1s'}}/>
        <path d="M105,64 L115,64" stroke="#8b5cf6" strokeWidth="1" opacity="0.5"/>
      </svg>

      {/* Data Processing Pipeline - bottom right */}
      <svg
        className="absolute bottom-32 right-8 w-36 h-32 opacity-5 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        viewBox="0 0 144 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Data Source */}
        <rect x="4" y="44" width="24" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <text x="16" y="54" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">DATA</text>

        {/* Processing Nodes */}
        <circle cx="48" cy="52" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="48" y="56" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.8">ETL</text>

        <circle cx="80" cy="36" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="80" y="40" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.8">ML</text>

        <circle cx="112" cy="52" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="112" y="56" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.8">AI</text>

        {/* Storage */}
        <rect x="100" y="84" width="24" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <text x="112" y="94" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">DB</text>

        {/* Data Flow Arrows */}
        <path d="M28,52 L40,52" stroke="currentColor" strokeWidth="1.5" opacity="0.5" markerEnd="url(#dataArrow)"/>
        <path d="M56,52 L64,44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" markerEnd="url(#dataArrow)"/>
        <path d="M88,44 L96,52" stroke="currentColor" strokeWidth="1.5" opacity="0.5" markerEnd="url(#dataArrow)"/>
        <path d="M120,52 L120,76" stroke="currentColor" strokeWidth="1.5" opacity="0.5" markerEnd="url(#dataArrow)"/>

        {/* Processing indicators */}
        <circle cx="64" cy="36" r="2" fill="#ff7cac" opacity="0.9" className="animate-pulse"/>
        <path d="M72,36 L88,36" stroke="#ff7cac" strokeWidth="1" opacity="0.6"/>

        <defs>
          <marker id="dataArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" opacity="0.6"/>
          </marker>
        </defs>
      </svg>

      {/* Cryptographic Hash Tree - top right */}
      <svg
        className="absolute top-1/4 right-4 w-32 h-40 opacity-4 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        viewBox="0 0 128 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Merkle Tree Structure */}
        {/* Bottom layer - data blocks */}
        <rect x="8" y="128" width="20" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <text x="18" y="136" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">Tx1</text>

        <rect x="36" y="128" width="20" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <text x="46" y="136" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">Tx2</text>

        <rect x="64" y="128" width="20" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <text x="74" y="136" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">Tx3</text>

        <rect x="92" y="128" width="20" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <text x="102" y="136" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">Tx4</text>

        {/* Middle layer - hash nodes */}
        <circle cx="28" cy="96" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="28" y="100" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.8">H₁₂</text>

        <circle cx="83" cy="96" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <text x="83" y="100" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.8">H₃₄</text>

        {/* Top layer - root hash */}
        <circle cx="55" cy="48" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
        <text x="55" y="53" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.9">Root</text>

        {/* Hash connections */}
        <path d="M18,134 L18,102" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M46,134 L46,102" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M38,102 L28,90" stroke="currentColor" strokeWidth="1" opacity="0.4"/>

        <path d="M74,134 L74,102" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M102,134 L102,102" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        <path d="M93,102 L83,90" stroke="currentColor" strokeWidth="1" opacity="0.4"/>

        <path d="M28,84 L55,60" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
        <path d="M83,84 L55,60" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>

        {/* Hash indicators */}
        <circle cx="28" cy="96" r="2" fill="#10b981" opacity="0.8" className="animate-pulse"/>
        <circle cx="83" cy="96" r="2" fill="#f59e0b" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.7s'}}/>
        <circle cx="55" cy="48" r="2" fill="#ef4444" opacity="0.9" className="animate-pulse" style={{animationDelay: '1.4s'}}/>
      </svg>

      {/* Floating technical indicators - minimal */}
      <div
        className="absolute top-1/2 right-12 opacity-4 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.16}px)` }}
      >
        <div className="w-2 h-2 bg-accent-500/50 rounded-full animate-pulse"></div>
      </div>
      <div
        className="absolute bottom-1/4 left-8 opacity-3 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.14}px)` }}
      >
        <div className="w-1.5 h-1.5 bg-accent-400/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default BlueprintBackground;
