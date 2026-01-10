import { useEffect, useRef, useState } from 'react';
import { extractImagesFromPage } from './utils/imageExtractors';
import { validateImage, type ImageItem } from './utils/imageUtils';
import { useDebounce } from './utils/useDebounce';

interface GalleryOverlayProps {
  onClose: () => void;
}

async function loadImageWithDimensions(
  url: string,
  isGif: boolean,
  minSize: number,
  maxSize: number
): Promise<ImageItem | null> {
  // Use the validateImage utility from imageUtils
  // For GIFs, we'll validate but ignore size constraints
  if (isGif) {
    // Load GIF without size restrictions
    return validateImage(url, 0, Infinity, 2000);
  }

  // For other images, apply size constraints
  return validateImage(url, minSize, maxSize, 2000);
}

async function autoScrollPage(
  duration: number,
  onProgress?: (percent: number) => void
): Promise<void> {
  const startTime = Date.now();
  const scrollStep = 300; // pixels per step
  const stepDelay = 200; // ms between steps

  return new Promise((resolve) => {
    const scroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (onProgress) {
        onProgress(progress * 100);
      }

      if (progress < 1) {
        window.scrollBy(0, scrollStep);
        setTimeout(scroll, stepDelay);
      } else {
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => resolve(), 500);
      }
    };

    scroll();
  });
}

async function filterImagesBySize(
  minSize: number,
  maxSize: number
): Promise<ImageItem[]> {
  // Use the new domain-specific extractor system
  const imageUrls = await extractImagesFromPage();

  const promises = imageUrls.map((url) => {
    const isGif = url.toLowerCase().endsWith('.gif');
    return loadImageWithDimensions(url, isGif, minSize, maxSize);
  });

  const results = await Promise.allSettled(promises);
  const images = results
    .filter(
      (result): result is PromiseFulfilledResult<ImageItem> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value);

  return images;
}

const DEFAULT_AUTO_SCROLL_DURATION = 0;
const DEFAULT_MIN_IMAGE_SIZE = 500;
const DEFAULT_MAX_IMAGE_SIZE = 10000;
const DEFAULT_COLUMN_COUNT = 6;

type ViewMode = 'gallery' | 'lightbox';

export default function GalleryOverlay({ onClose }: GalleryOverlayProps) {
  // Gallery state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMN_COUNT);
  const [minImageSize, setMinImageSize] = useState(DEFAULT_MIN_IMAGE_SIZE);
  const [maxImageSize, setMaxImageSize] = useState(DEFAULT_MAX_IMAGE_SIZE);
  const [autoScrollDuration, setAutoScrollDuration] = useState(
    DEFAULT_AUTO_SCROLL_DURATION
  );
  const [isReloading, setIsReloading] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // View switching state
  const [currentView, setCurrentView] = useState<ViewMode>('gallery');
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Lightbox state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Debounced values for auto-refetch (wait 1 second after user stops typing)
  const debouncedMinSize = useDebounce(minImageSize, 1000);
  const debouncedMaxSize = useDebounce(maxImageSize, 1000);
  const debouncedScrollDuration = useDebounce(autoScrollDuration, 1000);

  const loadImages = async (
    minSize: number,
    maxSize: number,
    withAutoScroll: boolean = false
  ) => {
    setIsReloading(true);
    setScrollProgress(0);

    try {
      if (withAutoScroll && autoScrollDuration > 0) {
        setIsAutoScrolling(true);
        await autoScrollPage(autoScrollDuration * 1000, setScrollProgress);
        setIsAutoScrolling(false);
      }

      const loadedImages = await filterImagesBySize(minSize, maxSize);
      setImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
      setIsReloading(false);
      setIsAutoScrolling(false);
    }
  };

  // Initial load with auto-scroll
  useEffect(() => {
    loadImages(minImageSize, maxImageSize, true);
  }, []);

  // Auto-refetch when debounced values change (after user stops typing for 1 second)
  useEffect(() => {
    // Skip the initial render (already handled by the initial load effect)
    if (loading) return;

    // Refetch with the new debounced values
    loadImages(debouncedMinSize, debouncedMaxSize, debouncedScrollDuration > 0);
  }, [debouncedMinSize, debouncedMaxSize, debouncedScrollDuration]);

  const handleReload = () => {
    loadImages(minImageSize, maxImageSize, true);
  };

  const filteredImages = images.filter(
    (img) =>
      img.width >= minImageSize &&
      img.width <= maxImageSize &&
      img.height >= minImageSize &&
      img.height <= maxImageSize
  );

  const selectedImages = filteredImages.filter((img) => img.selected);

  const toggleImageSelection = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) =>
      prev.map((img) =>
        img.url === url ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const selectAll = () => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: true })));
  };

  const deselectAll = () => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: false })));
  };

  const downloadSelected = async () => {
    if (selectedImages.length === 0) return;

    for (const img of selectedImages) {
      try {
        const response = await fetch(img.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = img.url.split('/').pop() || 'image';
        a.click();
        URL.revokeObjectURL(url);
        // Small delay between downloads to avoid browser blocking
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to download:', img.url, error);
      }
    }
  };

  // Switch to lightbox view
  const openLightbox = (index: number) => {
    // Save gallery scroll position
    if (galleryScrollRef.current) {
      setSavedScrollPosition(galleryScrollRef.current.scrollTop);
    }
    setCurrentIndex(index);
    setCurrentView('lightbox');
  };

  // Switch back to gallery view
  const closeLightbox = () => {
    setCurrentView('gallery');
    // Restore gallery scroll position
    setTimeout(() => {
      if (galleryScrollRef.current) {
        galleryScrollRef.current.scrollTop = savedScrollPosition;
      }
    }, 0);
  };

  // Lightbox functions
  const currentImage = filteredImages[currentIndex] || filteredImages[0];

  const goToNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const applyTransform = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = `translate(${imgOffset.x}px, ${imgOffset.y}px) scale(${zoomLevel})`;
      imageRef.current.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
    }
  };

  const zoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImgOffset({ x: 0, y: 0 });
  };

  // Apply transform when zoom or offset changes
  useEffect(() => {
    if (currentView === 'lightbox') {
      applyTransform();
    }
  }, [zoomLevel, imgOffset, currentView]);

  // Reset zoom when image changes
  useEffect(() => {
    if (currentView === 'lightbox') {
      resetZoom();
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === 'lightbox') {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === '0' || e.key === 'r') {
          resetZoom();
        }
      } else if (currentView === 'gallery') {
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentIndex, onClose]);

  // Lightbox wheel handler
  const handleWheel = (e: WheelEvent) => {
    if (currentView !== 'lightbox') return;

    const target = e.target as HTMLElement;
    const isImage = target.tagName.toLowerCase() === 'img';

    e.preventDefault();

    if (isImage) {
      // Zoom on the image
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoom(delta);
    } else {
      // Navigate when wheel is outside the image
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  useEffect(() => {
    const lightbox = lightboxRef.current;
    if (lightbox && currentView === 'lightbox') {
      lightbox.addEventListener('wheel', handleWheel as EventListener);
      return () =>
        lightbox.removeEventListener('wheel', handleWheel as EventListener);
    }
  }, [currentIndex, zoomLevel, currentView]);

  // Mouse drag handlers for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - imgOffset.x,
      y: e.clientY - imgOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || zoomLevel <= 1) return;
    setImgOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  // Handle click outside image to close lightbox
  const handleLightboxBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <div
      className='fixed inset-0 flex flex-col overflow-hidden'
      style={{
        zIndex: 2147483640,
        backgroundColor: currentView === 'lightbox' ? '#000000' : 'transparent'
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
          {/* Compact Top Controls Bar */}
          <div className='flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5'>
            {/* Auto-scroll Progress Bar */}
            {isAutoScrolling && (
              <div className='mb-2'>
                <div className='w-full bg-white/20 rounded-full h-1.5'>
                  <div
                    className='bg-white h-1.5 rounded-full transition-all duration-200'
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Single Row with All Controls */}
            <div className='flex items-center gap-3 text-xs'>
              {/* Title */}
              <span className='font-bold text-sm mr-2'>Gallery</span>

              {/* Column Count */}
              <div className='flex items-center gap-1.5'>
                <label className='font-medium'>Cols:</label>
                <input
                  type='range'
                  min='2'
                  max='12'
                  value={columnCount}
                  onChange={(e) => setColumnCount(Number(e.target.value))}
                  className='w-16'
                />
                <span className='font-bold w-5 text-center'>{columnCount}</span>
              </div>

              {/* Min Size */}
              <div className='flex items-center gap-1'>
                <label className='font-medium'>Min:</label>
                <input
                  type='number'
                  min='0'
                  max='5000'
                  step='50'
                  value={minImageSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setMinImageSize(isNaN(val) ? 0 : val);
                  }}
                  className='w-16 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
                  placeholder='px'
                />
              </div>

              {/* Max Size */}
              <div className='flex items-center gap-1'>
                <label className='font-medium'>Max:</label>
                <input
                  type='number'
                  min='100'
                  max='20000'
                  step='100'
                  value={maxImageSize}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 100 : Number(e.target.value);
                    setMaxImageSize(isNaN(val) ? 100 : val);
                  }}
                  className='w-16 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
                  placeholder='px'
                />
              </div>

              {/* Auto-scroll Duration */}
              <div className='flex items-center gap-1'>
                <label className='font-medium'>Scroll:</label>
                <input
                  type='number'
                  min='0'
                  max='30'
                  step='1'
                  value={autoScrollDuration}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setAutoScrollDuration(isNaN(val) ? 0 : val);
                  }}
                  className='w-12 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
                  placeholder='s'
                />
                <span className='text-xs'>s</span>
              </div>

              {/* Spacer */}
              <div className='flex-1'></div>

              {/* Actions */}
              <div className='flex items-center gap-2'>
                <button
                  onClick={selectAll}
                  className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs'
                >
                  All
                </button>
                <button
                  onClick={deselectAll}
                  className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs'
                >
                  None
                </button>
                <button
                  onClick={downloadSelected}
                  disabled={selectedImages.length === 0}
                  className='px-2 py-0.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded transition-colors text-xs font-medium'
                >
                  ⬇ {selectedImages.length}
                </button>
                <button
                  onClick={handleReload}
                  disabled={isReloading || isAutoScrolling}
                  className='px-2 py-0.5 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded transition-colors text-xs'
                  title='Reload images'
                >
                  {isReloading ? '⟳' : '↻'}
                </button>
                <span className='font-medium text-xs'>
                  {filteredImages.length} imgs
                </span>
                <button
                  onClick={onClose}
                  className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs'
                  title='Close (ESC)'
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          <div
            ref={galleryScrollRef}
            className='flex-1 overflow-y-auto p-6 bg-gray-50'
          >
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4'></div>
                  <div className='text-gray-600 text-lg'>Loading images...</div>
                </div>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <svg
                    className='mx-auto h-16 w-16 text-gray-400 mb-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <div className='text-gray-600 text-lg font-medium'>
                    No images found
                  </div>
                  <div className='text-gray-500 text-sm mt-2'>
                    Try adjusting the size filters
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='grid gap-4'
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                }}
              >
                {filteredImages.map((img, index) => (
                  <div
                    key={img.url}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 ${
                      img.selected ? 'ring-4 ring-blue-500' : ''
                    }`}
                    onClick={() => openLightbox(index)}
                  >
                    <div
                      className='relative w-full'
                      style={{ paddingBottom: '100%' }}
                    >
                      <img
                        src={img.url}
                        alt=''
                        className='absolute inset-0 w-full h-full object-cover'
                        loading='lazy'
                      />
                      {/* Selection Checkbox */}
                      <div
                        className='absolute top-2 right-2 z-10'
                        onClick={(e) => toggleImageSelection(img.url, e)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                            img.selected
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white/80 border-white backdrop-blur-sm'
                          }`}
                        >
                          {img.selected && (
                            <svg
                              className='w-4 h-4 text-white'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={3}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Image Info */}
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
                      <div className='font-medium'>
                        {img.width} × {img.height}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox View */}
        <div
          ref={lightboxRef}
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
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors'
            aria-label='Close lightbox'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 15 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='text-white'
            >
              <path
                d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
                fill='currentColor'
                fillRule='evenodd'
                clipRule='evenodd'
              />
            </svg>
          </button>

          {/* Image Counter */}
          <div className='absolute top-4 left-4 z-50 px-4 py-2 bg-black/50 rounded-lg text-white font-medium'>
            {currentIndex + 1} / {filteredImages.length}
          </div>

          {/* Main Image Area */}
          <div
            className='flex-1 relative w-full h-full overflow-hidden flex items-center justify-center'
            onClick={handleLightboxBackdropClick}
            onMouseMove={handleMouseMove}
          >
            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className='absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white'
                >
                  <path
                    d='M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            )}

            {currentIndex < filteredImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className='absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white'
                >
                  <path
                    d='M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            )}

            {/* Image with manual zoom/pan */}
            {currentImage && (
              <img
                ref={imageRef}
                src={currentImage.url}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  userSelect: 'none',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                alt=''
                draggable={false}
                onMouseDown={handleMouseDown}
              />
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className='flex-shrink-0 bg-black/80 border-t border-white/10'>
            <div
              className='flex gap-2 overflow-x-auto p-4'
              style={{ maxHeight: '120px' }}
            >
              {filteredImages.map((img, index) => (
                <button
                  key={img.url}
                  onClick={() => goToIndex(index)}
                  className={`flex-shrink-0 rounded overflow-hidden transition-all ${
                    index === currentIndex
                      ? 'ring-4 ring-blue-500 opacity-100'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ width: '80px', height: '80px' }}
                >
                  <img
                    src={img.url}
                    alt=''
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className='absolute bottom-28 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/50 px-4 py-2 rounded-lg pointer-events-none'>
            Wheel on image: zoom | Wheel outside: navigate | Arrow keys:
            navigate | Double-click: reset | ESC: close
          </div>
        </div>
    </div>
  );
}
