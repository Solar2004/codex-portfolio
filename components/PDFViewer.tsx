import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar el worker de PDF.js
// Usar el worker desde el paquete pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  url: string;
  fileName: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, fileName }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Error al cargar el PDF: ${error.message}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages, page + 1));
  };

  const zoomIn = () => {
    setScale(scale => Math.min(2.0, scale + 0.2));
  };

  const zoomOut = () => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-8rem)] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
        <div className="text-center text-white/70">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-8rem)] rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
      {/* Header con controles */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white/90">📄 {fileName}</span>
          {!loading && (
            <span className="text-xs text-white/50">
              Página {pageNumber} de {numPages}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Controles de zoom */}
          <div className="flex items-center gap-1 border border-white/15 rounded-lg p-1">
            <button
              onClick={zoomOut}
              className="px-2 py-1 text-xs rounded hover:bg-white/10 transition-colors"
              disabled={scale <= 0.5}
            >
              -
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-1 text-xs rounded hover:bg-white/10 transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="px-2 py-1 text-xs rounded hover:bg-white/10 transition-colors"
              disabled={scale >= 2.0}
            >
              +
            </button>
          </div>
          
          {/* Controles de navegación */}
          <div className="flex items-center gap-1 border border-white/15 rounded-lg p-1">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-3 py-1 text-xs rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Anterior
            </button>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 text-xs rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </div>

      {/* Área del PDF */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/50">Cargando PDF...</div>
          </div>
        )}
        
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg rounded-lg overflow-hidden"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;