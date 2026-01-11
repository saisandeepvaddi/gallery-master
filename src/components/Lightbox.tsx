import type { ImageItem } from '../types/gallery';

interface LightboxProps {
  images: ImageItem[];
  currentIndex: number;
  currentImage: ImageItem;
  isDragging: boolean;
  imageRef: React.RefObject<HTMLImageElement | null>;
  lightboxRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onGoToIndex: (index: number) => void;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onBackdropClick: (e: React.MouseEvent) => void;
  onImageDoubleClick: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  currentImage,
  isDragging,
  imageRef,
  lightboxRef,
  onClose,
  onNext,
  onPrevious,
  onGoToIndex,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onBackdropClick,
  onImageDoubleClick,
}: LightboxProps) {
  return (
    <div ref={lightboxRef}>
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
        onClick={onBackdropClick}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
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
              onNext();
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
                d='M6.1584 3.13514C6.35985 2.94628 6.67627 2.95648 6.86513 3.15794L10.6151 7.15794C10.7954 7.35027 10.7954 7.64955 10.6151 7.84188L6.86513 11.8419C6.67627 12.0433 6.35985 12.0535 6.1584 11.8647C5.95694 11.6758 5.94673 11.3594 6.13559 11.1579L9.565 7.49991L6.13559 3.84188C5.94673 3.64042 5.95694 3.32401 6.1584 3.13514Z'
                fill='currentColor'
                fillRule='evenodd'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}

        {/* Main Image */}
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
            onMouseDown={onMouseDown}
            onDoubleClick={onImageDoubleClick}
          />
        )}
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
              onClick={() => onGoToIndex(index)}
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
