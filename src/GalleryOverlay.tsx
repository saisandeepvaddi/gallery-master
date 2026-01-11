import { useState, useRef, useEffect } from 'react';
import { GalleryHeader } from './components/GalleryHeader';
import { GalleryGrid } from './components/GalleryGrid';
import { Lightbox } from './components/Lightbox';
import { useImageLoader } from './hooks/useImageLoader';
import { useLightbox } from './hooks/useLightbox';
import {
  DEFAULT_AUTO_SCROLL_DURATION,
  DEFAULT_MIN_IMAGE_SIZE,
  DEFAULT_MAX_IMAGE_SIZE,
  DEFAULT_COLUMN_COUNT,
} from './constants/gallery';
import type { ViewMode, LayoutMode } from './types/gallery';

interface GalleryOverlayProps {
  onClose: () => void;
}

export default function GalleryOverlay({ onClose }: GalleryOverlayProps) {
  // Gallery controls state
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMN_COUNT);
  const [minImageSize, setMinImageSize] = useState(DEFAULT_MIN_IMAGE_SIZE);
  const [maxImageSize, setMaxImageSize] = useState(DEFAULT_MAX_IMAGE_SIZE);
  const [autoScrollDuration, setAutoScrollDuration] = useState(
    DEFAULT_AUTO_SCROLL_DURATION
  );
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');

  // View switching state
  const [currentView, setCurrentView] = useState<ViewMode>('gallery');
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Custom hooks
  const {
    images,
    loading,
    isReloading,
    isAutoScrolling,
    handleReload,
    toggleImageSelection,
    selectAll,
    deselectAll,
  } = useImageLoader(minImageSize, maxImageSize, autoScrollDuration);

  const lightbox = useLightbox(images);

  const selectedImages = images.filter((img) => img.selected);

  // View switching functions
  const openLightbox = (index: number) => {
    if (galleryScrollRef.current) {
      setSavedScrollPosition(galleryScrollRef.current.scrollTop);
    }
    lightbox.goToIndex(index);
    setCurrentView('lightbox');
  };

  const closeLightbox = () => {
    setCurrentView('gallery');
    setTimeout(() => {
      if (galleryScrollRef.current) {
        galleryScrollRef.current.scrollTop = savedScrollPosition;
      }
    }, 0);
  };

  // Download selected images
  const downloadSelected = async () => {
    for (const img of selectedImages) {
      try {
        const response = await fetch(img.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = img.url.split('/').pop() || 'image';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };

  // Selection helper
  const handleImageSelect = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleImageSelection(url);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === 'lightbox') {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          lightbox.goToNext();
        } else if (e.key === 'ArrowLeft') {
          lightbox.goToPrevious();
        } else if (e.key === '0' || e.key === 'r') {
          lightbox.resetZoom();
        }
      } else if (currentView === 'gallery') {
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, lightbox.currentIndex, onClose]);

  return (
    <div
      className='fixed inset-0 flex flex-col overflow-hidden'
      style={{
        zIndex: 2147483640,
        backgroundColor: currentView === 'lightbox' ? '#000000' : 'transparent',
      }}
    >
      {/* Gallery View */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: currentView === 'gallery' ? 'flex' : 'none',
          flexDirection: 'column',
          opacity: currentView === 'gallery' ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          backgroundColor: '#ffffff',
        }}
      >
        <GalleryHeader
          columnCount={columnCount}
          minImageSize={minImageSize}
          maxImageSize={maxImageSize}
          autoScrollDuration={autoScrollDuration}
          layoutMode={layoutMode}
          imageCount={images.length}
          selectedCount={selectedImages.length}
          isReloading={isReloading}
          isAutoScrolling={isAutoScrolling}
          onColumnCountChange={setColumnCount}
          onMinSizeChange={setMinImageSize}
          onMaxSizeChange={setMaxImageSize}
          onScrollDurationChange={setAutoScrollDuration}
          onLayoutModeChange={setLayoutMode}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onDownload={downloadSelected}
          onReload={handleReload}
          onClose={onClose}
        />

        {/* Gallery Content */}
        <div
          ref={galleryScrollRef}
          className='flex-1 overflow-y-auto p-6 bg-gray-50'
        >
          <GalleryGrid
            images={images}
            columnCount={columnCount}
            layoutMode={layoutMode}
            loading={loading}
            onImageClick={openLightbox}
            onImageSelect={handleImageSelect}
          />
        </div>
      </div>

      {/* Lightbox View */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: currentView === 'lightbox' ? 'flex' : 'none',
          flexDirection: 'column',
          opacity: currentView === 'lightbox' ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '0.5rem',
        }}
      >
        <Lightbox
          images={images}
          currentIndex={lightbox.currentIndex}
          currentImage={lightbox.currentImage}
          isDragging={lightbox.isDragging}
          imageRef={lightbox.imageRef}
          lightboxRef={lightbox.lightboxRef}
          onClose={closeLightbox}
          onNext={lightbox.goToNext}
          onPrevious={lightbox.goToPrevious}
          onGoToIndex={lightbox.goToIndex}
          onMouseDown={lightbox.handleMouseDown}
          onMouseMove={lightbox.handleMouseMove}
          onMouseUp={lightbox.handleMouseUp}
          onBackdropClick={lightbox.handleLightboxBackdropClick}
          onImageDoubleClick={lightbox.handleImageDoubleClick}
        />
      </div>
    </div>
  );
}
