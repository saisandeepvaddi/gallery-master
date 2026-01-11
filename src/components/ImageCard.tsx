import type { ImageItem, LayoutMode } from '../types/gallery';

interface ImageCardProps {
  image: ImageItem;
  index: number;
  layoutMode: LayoutMode;
  onSelect: (url: string, e: React.MouseEvent) => void;
  onClick: (index: number) => void;
}

export function ImageCard({
  image,
  index,
  layoutMode,
  onSelect,
  onClick,
}: ImageCardProps) {
  const aspectRatio = image.height / image.width;

  // Calculate row span for masonry layout
  const getRowSpan = () => {
    if (layoutMode !== 'masonry') return undefined;
    const baseWidth = 250;
    const estimatedHeight = baseWidth * aspectRatio;
    return Math.ceil(estimatedHeight / 1);
  };

  const containerStyle: React.CSSProperties =
    layoutMode === 'masonry'
      ? { gridRowEnd: `span ${getRowSpan()}` }
      : {};

  const imageWrapperStyle: React.CSSProperties =
    layoutMode === 'grid'
      ? { paddingBottom: '100%' }
      : {};

  return (
    <div
      className={`relative group cursor-pointer rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-200 ${
        image.selected ? 'ring-4 ring-blue-500' : ''
      }`}
      style={containerStyle}
      onClick={() => onClick(index)}
    >
      {layoutMode === 'grid' ? (
        <div className='relative w-full' style={imageWrapperStyle}>
          <img
            src={image.url}
            alt=''
            className='absolute inset-0 w-full h-full object-cover'
            loading='lazy'
          />
          <SelectionCheckbox
            selected={image.selected}
            onSelect={(e) => onSelect(image.url, e)}
          />
        </div>
      ) : (
        <>
          <img
            src={image.url}
            alt=''
            className='w-full h-full object-cover'
            loading='lazy'
          />
          <SelectionCheckbox
            selected={image.selected}
            onSelect={(e) => onSelect(image.url, e)}
          />
        </>
      )}

      <ImageInfo width={image.width} height={image.height} />
    </div>
  );
}

interface SelectionCheckboxProps {
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

function SelectionCheckbox({ selected, onSelect }: SelectionCheckboxProps) {
  return (
    <div className='absolute top-2 right-2 z-10' onClick={onSelect}>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
          selected
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white/80 border-white backdrop-blur-sm'
        }`}
      >
        {selected && (
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
  );
}

interface ImageInfoProps {
  width: number;
  height: number;
}

function ImageInfo({ width, height }: ImageInfoProps) {
  return (
    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
      <div className='font-medium'>
        {width} × {height}
      </div>
    </div>
  );
}
