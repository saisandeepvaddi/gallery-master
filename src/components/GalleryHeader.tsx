import type { LayoutMode } from '../types/gallery';

interface GalleryHeaderProps {
  columnCount: number;
  minImageSize: number;
  maxImageSize: number;
  autoScrollDuration: number;
  layoutMode: LayoutMode;
  imageCount: number;
  selectedCount: number;
  isReloading: boolean;
  isAutoScrolling: boolean;
  onColumnCountChange: (count: number) => void;
  onMinSizeChange: (size: number) => void;
  onMaxSizeChange: (size: number) => void;
  onScrollDurationChange: (duration: number) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDownload: () => void;
  onReload: () => void;
  onClose: () => void;
}

export function GalleryHeader({
  columnCount,
  minImageSize,
  maxImageSize,
  autoScrollDuration,
  layoutMode,
  imageCount,
  selectedCount,
  isReloading,
  isAutoScrolling,
  onColumnCountChange,
  onMinSizeChange,
  onMaxSizeChange,
  onScrollDurationChange,
  onLayoutModeChange,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onReload,
  onClose,
}: GalleryHeaderProps) {
  return (
    <div className='flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5'>
      <div className='flex items-center gap-3 text-xs'>
        <span className='font-bold text-sm mr-2'>Gallery</span>

        <div className='flex items-center gap-1.5'>
          <label className='font-medium'>Cols:</label>
          <input
            type='range'
            min='2'
            max='12'
            value={columnCount}
            onChange={(e) => onColumnCountChange(Number(e.target.value))}
            className='w-16'
          />
          <span className='font-bold w-5 text-center'>{columnCount}</span>
        </div>

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
              onMinSizeChange(isNaN(val) ? 0 : val);
            }}
            className='w-16 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
            placeholder='px'
          />
        </div>

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
              onMaxSizeChange(isNaN(val) ? 100 : val);
            }}
            className='w-16 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
            placeholder='px'
          />
        </div>

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
              onScrollDurationChange(isNaN(val) ? 0 : val);
            }}
            className='w-12 px-1.5 py-0.5 text-xs rounded bg-white/20 border border-white/30 text-white placeholder-white/60'
            placeholder='s'
          />
          <span className='text-xs'>s</span>
        </div>

        <div className='flex items-center gap-1'>
          <label className='font-medium'>Layout:</label>
          <button
            onClick={() =>
              onLayoutModeChange(layoutMode === 'grid' ? 'masonry' : 'grid')
            }
            className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs font-medium'
            title={
              layoutMode === 'grid' ? 'Switch to Masonry' : 'Switch to Grid'
            }
          >
            {layoutMode === 'grid' ? '⊞' : '⊟'}
          </button>
        </div>

        <div className='flex-1'></div>

        <div className='flex items-center gap-2'>
          <button
            onClick={onSelectAll}
            className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs'
          >
            All
          </button>
          <button
            onClick={onDeselectAll}
            className='px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-xs'
          >
            None
          </button>
          <button
            onClick={onDownload}
            disabled={selectedCount === 0}
            className='px-2 py-0.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded transition-colors text-xs font-medium'
          >
            ⬇ {selectedCount}
          </button>
          <button
            onClick={onReload}
            disabled={isReloading || isAutoScrolling}
            className='px-2 py-0.5 bg-white/20 hover:bg-white/30 disabled:bg-white/10 rounded transition-colors text-xs'
            title='Reload images'
          >
            {isReloading ? '⟳' : '↻'}
          </button>
          <span className='font-medium text-xs'>{imageCount} imgs</span>
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
  );
}
