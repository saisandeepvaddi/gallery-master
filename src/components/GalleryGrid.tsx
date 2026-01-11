import { ImageCard } from './ImageCard';
import type { ImageItem, LayoutMode } from '../types/gallery';

interface GalleryGridProps {
  images: ImageItem[];
  columnCount: number;
  layoutMode: LayoutMode;
  loading: boolean;
  onImageClick: (index: number) => void;
  onImageSelect: (url: string, e: React.MouseEvent) => void;
}

export function GalleryGrid({
  images,
  columnCount,
  layoutMode,
  loading,
  onImageClick,
  onImageSelect,
}: GalleryGridProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (images.length === 0) {
    return <EmptyState />;
  }

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    ...(layoutMode === 'masonry' && { gridAutoRows: '1px' }),
  };

  return (
    <div className='grid gap-4' style={gridStyle}>
      {images.map((img, index) => (
        <ImageCard
          key={img.url}
          image={img}
          index={index}
          layoutMode={layoutMode}
          onSelect={onImageSelect}
          onClick={onImageClick}
        />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4'></div>
        <div className='text-gray-600 text-lg'>Loading images...</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
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
  );
}
