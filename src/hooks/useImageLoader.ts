import { useState, useEffect } from 'react';
import { extractImagesFromPage } from '../utils/imageExtractors';
import { validateImage } from '../utils/imageUtils';
import { useDebounce } from '../utils/useDebounce';
import { IMAGE_LOAD_TIMEOUT_MS, SCROLL_STEP_PIXELS, SCROLL_STEP_DELAY_MS } from '../constants/gallery';
import type { ImageItem } from '../types/gallery';

async function loadImageWithDimensions(
  url: string,
  isGif: boolean,
  minSize: number,
  maxSize: number
): Promise<ImageItem | null> {
  if (isGif) {
    return validateImage(url, 0, Infinity, IMAGE_LOAD_TIMEOUT_MS);
  }
  return validateImage(url, minSize, maxSize, IMAGE_LOAD_TIMEOUT_MS);
}

async function autoScrollPage(
  duration: number,
  onProgress?: (percent: number) => void
): Promise<void> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const scroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (onProgress) {
        onProgress(progress * 100);
      }

      if (progress < 1) {
        window.scrollBy(0, SCROLL_STEP_PIXELS);
        setTimeout(scroll, SCROLL_STEP_DELAY_MS);
      } else {
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

export function useImageLoader(
  minImageSize: number,
  maxImageSize: number,
  autoScrollDuration: number
) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    loadImages(minImageSize, maxImageSize, autoScrollDuration > 0);
  }, []);

  // Auto-refetch when debounced values change
  useEffect(() => {
    if (loading) return;
    loadImages(debouncedMinSize, debouncedMaxSize, debouncedScrollDuration > 0);
  }, [debouncedMinSize, debouncedMaxSize, debouncedScrollDuration]);

  const handleReload = () => {
    loadImages(minImageSize, maxImageSize, false);
  };

  const toggleImageSelection = (url: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.url === url ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const selectAll = () => {
    setImages((prevImages) =>
      prevImages.map((img) => ({ ...img, selected: true }))
    );
  };

  const deselectAll = () => {
    setImages((prevImages) =>
      prevImages.map((img) => ({ ...img, selected: false }))
    );
  };

  return {
    images,
    loading,
    isReloading,
    isAutoScrolling,
    scrollProgress,
    handleReload,
    toggleImageSelection,
    selectAll,
    deselectAll,
  };
}
