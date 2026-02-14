import { useEffect, useRef, useState } from 'react';
import { hideGallery } from '../content';
import type { ImageItem } from '../types/gallery';
import { createTransform } from '../utils/isolationHelpers';

export function useLightbox(images: ImageItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex] || images[0];

  const applyTransform = () => {
    if (imageRef.current) {
      // Use safe transform helper to prevent invalid values
      imageRef.current.style.transform = createTransform(
        imgOffset.x,
        imgOffset.y,
        zoomLevel,
      );
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

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handleWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement;

    const isMainImage = target === imageRef.current;

    e.preventDefault();

    if (isMainImage) {
      // Zoom on the main image
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoom(delta);
    } else {
      // Navigate when wheel is outside the main image
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - imgOffset.x,
      y: e.clientY - imgOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setImgOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleLightboxBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetZoom();
      hideGallery();
    }
  };

  const handleImageDoubleClick = () => {
    resetZoom();
  };

  // Apply transform when zoom or offset changes
  useEffect(() => {
    applyTransform();
  }, [zoomLevel, imgOffset]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
    // Force transform application after a brief delay to ensure image element is ready
    const timeoutId = setTimeout(() => {
      if (imageRef.current) {
        imageRef.current.style.transform = createTransform(0, 0, 1);
        imageRef.current.style.cursor = 'default';
      }
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  // Attach wheel event listener
  useEffect(() => {
    const lightbox = lightboxRef.current;
    if (lightbox) {
      lightbox.addEventListener('wheel', handleWheel as EventListener);
      return () =>
        lightbox.removeEventListener('wheel', handleWheel as EventListener);
    }
  }, [currentIndex, zoomLevel]);

  return {
    currentIndex,
    currentImage,
    zoomLevel,
    isDragging,
    imageRef,
    lightboxRef,
    goToNext,
    goToPrevious,
    goToIndex,
    resetZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleLightboxBackdropClick,
    handleImageDoubleClick,
  };
}
