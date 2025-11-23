import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathFormulas: React.FC = () => {
  return (
    <div className="absolute bottom-20 left-8 opacity-6 pointer-events-none transition-transform duration-300 ease-out">
      <div className="space-y-3">
        {/* Integral gaussiana */}
        <div className="text-accent-400">
          <BlockMath math="\int_{-\infty}^{\infty} e^{-x^{2}} \, dx = \sqrt{\pi}" />
        </div>

        {/* Serie de Fourier */}
        <div className="text-accent-300">
          <BlockMath math="f(x) = \sum_{n=-\infty}^{\infty} c_{n} e^{i n \pi x / L}" />
        </div>

        {/* Ecuación de calor */}
        <div className="text-accent-500">
          <BlockMath math="\frac{\partial u}{\partial t} = \kappa \frac{\partial^{2} u}{\partial x^{2}}" />
        </div>

        {/* Transformada de Fourier */}
        <div className="text-purple-400">
          <BlockMath math="\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-i 2\pi \xi x} \, dx" />
        </div>

        {/* Ecuación de Schrödinger */}
        <div className="text-cyan-400">
          <BlockMath math="i\hbar\frac{\partial}{\partial t} \Psi = -\frac{\hbar^{2}}{2m} \frac{\partial^{2}}{\partial x^{2}} \Psi + V \Psi" />
        </div>
      </div>
    </div>
  );
};

export default MathFormulas;
