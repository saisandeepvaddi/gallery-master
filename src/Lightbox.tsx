import { useEffect, useRef, useState } from 'react';

interface ImageItem {
  url: string;
  selected: boolean;
  width: number;
  height: number;
}

interface LightboxProps {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lightboxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImage = images[currentIndex];

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
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
    applyTransform();
  }, [zoomLevel, imgOffset]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === '0' || e.key === 'r') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose]);

  const handleWheel = (e: WheelEvent) => {
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
    if (lightbox) {
      lightbox.addEventListener('wheel', handleWheel as EventListener);
      return () =>
        lightbox.removeEventListener('wheel', handleWheel as EventListener);
    }
  }, [currentIndex, zoomLevel]);

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

  // Handle click outside image to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={lightboxRef}
      className='fixed inset-0 bg-black/95 flex flex-col'
      style={{ zIndex: 2147483647 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
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
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image Area */}
      <div
        className='flex-1 relative w-full h-full overflow-hidden flex items-center justify-center'
        onClick={handleBackdropClick}
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

        {currentIndex < images.length - 1 && (
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
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className='flex-shrink-0 bg-black/80 border-t border-white/10'>
        <div
          className='flex gap-2 overflow-x-auto p-4'
          style={{ maxHeight: '120px' }}
        >
          {images.map((img, index) => (
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
        Wheel on image: zoom | Wheel outside: navigate | Arrow keys: navigate |
        Double-click: reset | ESC: close
      </div>
    </div>
  );
}
