export interface ImageItem {
  url: string;
  selected: boolean;
  width: number;
  height: number;
}

export type ViewMode = 'gallery' | 'lightbox';
export type LayoutMode = 'grid' | 'masonry';

export interface GalleryControls {
  columnCount: number;
  minImageSize: number;
  maxImageSize: number;
  autoScrollDuration: number;
  layoutMode: LayoutMode;
}
