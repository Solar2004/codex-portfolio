import React, { useEffect, useRef, useState } from 'react';

const MathVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 320;
    canvas.height = 180;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mathematical functions with different frequencies
      const functions = [
        { color: 'rgba(255, 124, 172, 0.7)', freq: 0.03, amp: 25 },
        { color: 'rgba(139, 92, 246, 0.5)', freq: 0.05, amp: 20 },
        { color: 'rgba(59, 130, 246, 0.4)', freq: 0.07, amp: 15 }
      ];

      functions.forEach((func, index) => {
        ctx.strokeStyle = func.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 1) {
          const baseY = canvas.height/2;
          const wave1 = Math.sin((x + time) * func.freq) * func.amp;
          const wave2 = Math.sin((x + time * 0.7) * func.freq * 0.5) * func.amp * 0.5;
          const y = baseY + wave1 + wave2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw technical grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw data points and technical indicators
      for (let i = 0; i < 8; i++) {
        const x = (time * 0.3 + i * 40) % (canvas.width + 30) - 15;
        const y = canvas.height/2 + Math.sin((x + time) * 0.02) * 35;

        // Data point
        ctx.fillStyle = `rgba(255, 124, 172, ${0.9 - (x / canvas.width) * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Technical label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '8px monospace';
        ctx.fillText(`D${i}`, x + 5, y - 5);
      }

      // Draw coordinate system
      ctx.strokeStyle = 'rgba(255, 124, 172, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height/2);
      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.moveTo(20, 0);
      ctx.lineTo(20, canvas.height);
      ctx.stroke();

      time++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div
      className="absolute top-1/4 right-8 opacity-15 pointer-events-none transition-transform duration-300 ease-out"
      style={{ transform: `translateY(${scrollY * 0.12}px)` }}
    >
      <canvas
        ref={canvasRef}
        className="w-40 h-28 border border-accent-500/20 rounded-lg bg-bg/20 backdrop-blur-sm shadow-md shadow-accent-500/5"
      />
      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-accent-500/60 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-accent-400/50 rounded-full animate-ping"></div>

      {/* Technical labels - minimal */}
      <div className="absolute top-1 left-1 text-xs font-mono text-accent-400/40">
        f(x)
      </div>
    </div>
  );
};

export default MathVisualization;
