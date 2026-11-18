import React, { useState, useEffect } from 'react';
import { Building2, Home, Layers, Maximize2, X } from 'lucide-react';

interface EstateImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayGradient?: boolean;
}

export const EstateImage: React.FC<EstateImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  overlayGradient = false,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#EDE5FA]">
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${className} transition-transform duration-500`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F2ECFA] text-[#1E1333]">
          <Building2 className="w-10 h-10 text-[#6D28D9] mb-3" />
          <p className="font-serif-editorial text-lg font-medium text-center max-w-xs">
            {alt}
          </p>
        </div>
      )}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1333]/85 via-[#1E1333]/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

interface EstateDualShowcaseProps {
  exteriorUrl: string;
  interiorUrl: string;
  title: string;
  exteriorCaption: string;
  interiorCaption: string;
  heightClass?: string;
}

export const EstateDualShowcase: React.FC<EstateDualShowcaseProps> = ({
  exteriorUrl,
  interiorUrl,
  title,
  exteriorCaption,
  interiorCaption,
  heightClass = 'h-[460px] sm:h-[440px]',
}) => {
  const [focusView, setFocusView] = useState<'split' | 'exterior' | 'interior'>('split');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxView, setLightboxView] = useState<'split' | 'exterior' | 'interior'>('exterior');

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  const openLightbox = (initialMode: 'split' | 'exterior' | 'interior') => {
    setLightboxView(initialMode);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border-b-2 border-[#DFD3F5]">
      {/* Dedicated Top View Control Bar (Unobstructed Photography Below) */}
      <div className="px-4 py-2.5 bg-[#F7F4FC] border-b-2 border-[#DFD3F5] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFocusView('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              focusView === 'split'
                ? 'bg-[#5B21B6] text-white'
                : 'text-[#1E1333] hover:bg-[#EDE5FA]'
            }`}
          >
            Exterior + Interior Split
          </button>
          <button
            type="button"
            onClick={() => setFocusView('exterior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              focusView === 'exterior'
                ? 'bg-[#5B21B6] text-white'
                : 'text-[#1E1333] hover:bg-[#EDE5FA]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>House Exterior</span>
          </button>
          <button
            type="button"
            onClick={() => setFocusView('interior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              focusView === 'interior'
                ? 'bg-[#5B21B6] text-white'
                : 'text-[#1E1333] hover:bg-[#EDE5FA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>House Interior</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => openLightbox(focusView)}
          aria-label={`Enlarge photos for ${title}`}
          className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#EDE5FA] border border-[#D5C5F0] text-[#5B21B6] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Enlarge Photos</span>
        </button>
      </div>

      {/* Large Architectural Image Stage */}
      <div className={`relative w-full ${heightClass} bg-[#EDE5FA] overflow-hidden`}>
        {focusView === 'split' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#DFD3F5]">
            <div
              onClick={() => openLightbox('exterior')}
              className="relative w-full h-full overflow-hidden cursor-zoom-in group"
            >
              <EstateImage
                src={exteriorUrl}
                alt={`${title} - ${exteriorCaption}`}
                className="w-full h-full object-cover group-hover:scale-[1.02]"
                overlayGradient={true}
              />
              <div className="absolute bottom-3.5 left-4 right-4 z-10 text-white pointer-events-none">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#5B21B6] text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Architecture Exterior
                </span>
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-1">
                  {exteriorCaption}
                </p>
              </div>
            </div>

            <div
              onClick={() => openLightbox('interior')}
              className="relative w-full h-full overflow-hidden cursor-zoom-in group"
            >
              <EstateImage
                src={interiorUrl}
                alt={`${title} - ${interiorCaption}`}
                className="w-full h-full object-cover group-hover:scale-[1.02]"
                overlayGradient={true}
              />
              <div className="absolute bottom-3.5 left-4 right-4 z-10 text-white pointer-events-none">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#2E1065] text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Residence Interior
                </span>
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-1">
                  {interiorCaption}
                </p>
              </div>
            </div>
          </div>
        ) : focusView === 'exterior' ? (
          <div
            onClick={() => openLightbox('exterior')}
            className="relative w-full h-full cursor-zoom-in group"
          >
            <EstateImage
              src={exteriorUrl}
              alt={`${title} - ${exteriorCaption}`}
              className="w-full h-full object-cover group-hover:scale-[1.02]"
              overlayGradient={true}
            />
            <div className="absolute bottom-4 left-5 right-5 z-10 text-white pointer-events-none">
              <span className="inline-block px-3 py-1 rounded bg-[#5B21B6] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                Full House Exterior View
              </span>
              <p className="text-sm sm:text-base font-medium">{exteriorCaption}</p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => openLightbox('interior')}
            className="relative w-full h-full cursor-zoom-in group"
          >
            <EstateImage
              src={interiorUrl}
              alt={`${title} - ${interiorCaption}`}
              className="w-full h-full object-cover group-hover:scale-[1.02]"
              overlayGradient={true}
            />
            <div className="absolute bottom-4 left-5 right-5 z-10 text-white pointer-events-none">
              <span className="inline-block px-3 py-1 rounded bg-[#2E1065] text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                Full House Interior View
              </span>
              <p className="text-sm sm:text-base font-medium">{interiorCaption}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Architectural Lightbox Viewer */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded architectural gallery for ${title}`}
          className="fixed inset-0 z-[200] bg-[#140B26]/92 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="w-full max-w-6xl bg-[#FFFFFF] border-2 border-[#DFD3F5] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="px-5 py-4 bg-[#F7F4FC] border-b-2 border-[#DFD3F5] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#6D28D9] font-semibold">
                  High-Resolution Architectural Inspection
                </div>
                <div className="font-serif-editorial text-xl sm:text-2xl font-semibold text-[#1E1333]">
                  {title}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLightboxView('exterior')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    lightboxView === 'exterior'
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#FFFFFF] text-[#1E1333] border border-[#D5C5F0] hover:bg-[#EDE5FA]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>House Exterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxView('interior')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    lightboxView === 'interior'
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#FFFFFF] text-[#1E1333] border border-[#D5C5F0] hover:bg-[#EDE5FA]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>House Interior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxView('split')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    lightboxView === 'split'
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-[#FFFFFF] text-[#1E1333] border border-[#D5C5F0] hover:bg-[#EDE5FA]'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Close expanded photo viewer"
                  className="p-2 rounded-xl bg-[#2E1065] hover:bg-[#5B21B6] text-white transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Canvas */}
            <div className="w-full h-[62vh] sm:h-[72vh] bg-[#1E1333] overflow-hidden min-h-0">
              {lightboxView === 'split' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full min-h-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#DFD3F5]">
                  <div className="relative w-full h-full min-h-0 overflow-hidden">
                    <EstateImage
                      src={exteriorUrl}
                      alt={`${title} - ${exteriorCaption}`}
                      overlayGradient={true}
                    />
                    <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#5B21B6] text-[11px] font-semibold uppercase tracking-wider mb-1">
                        House Exterior
                      </span>
                      <p className="text-sm font-medium">{exteriorCaption}</p>
                    </div>
                  </div>
                  <div className="relative w-full h-full min-h-0 overflow-hidden">
                    <EstateImage
                      src={interiorUrl}
                      alt={`${title} - ${interiorCaption}`}
                      overlayGradient={true}
                    />
                    <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#2E1065] text-[11px] font-semibold uppercase tracking-wider mb-1">
                        House Interior
                      </span>
                      <p className="text-sm font-medium">{interiorCaption}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-0 overflow-hidden">
                  <EstateImage
                    src={lightboxView === 'exterior' ? exteriorUrl : interiorUrl}
                    alt={`${title} - ${lightboxView === 'exterior' ? exteriorCaption : interiorCaption}`}
                    overlayGradient={true}
                  />
                  <div className="absolute bottom-5 left-6 right-6 z-10 text-white">
                    <span className="inline-block px-3 py-1 rounded bg-[#5B21B6] text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {lightboxView === 'exterior' ? 'Full House Exterior' : 'Full House Interior'}
                    </span>
                    <p className="text-base sm:text-lg font-medium">
                      {lightboxView === 'exterior' ? exteriorCaption : interiorCaption}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
