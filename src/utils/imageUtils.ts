/**
 * Shared image utility functions
 */

import type { ImageItem } from '../types/gallery';

export type { ImageItem };

/**
 * Extract the largest image URL from a srcset attribute
 */
export function getLargestImageFromSrcset(srcset: string): string | null {
  if (!srcset) return null;

  // Parse srcset: "image1.jpg 100w, image2.jpg 200w, image3.jpg 500w"
  const sources = srcset.split(',').map((s) => s.trim());
  let largestUrl = '';
  let largestWidth = 0;

  for (const source of sources) {
    const parts = source.split(/\s+/);
    const url = parts[0];
    const descriptor = parts[1] || '';

    // Extract width from descriptor (e.g., "500w" or "2x")
    let width = 0;
    if (descriptor.endsWith('w')) {
      width = parseInt(descriptor, 10);
    } else if (descriptor.endsWith('x')) {
      // For pixel density descriptors, use a multiplier
      width = parseFloat(descriptor) * 1000;
    }

    if (width > largestWidth) {
      largestWidth = width;
      largestUrl = url;
    }
  }

  return largestUrl || null;
}

/**
 * Validate and load an image to check its dimensions
 */
export async function validateImage(
  url: string,
  minSize: number,
  maxSize: number,
  timeout: number = 2000
): Promise<ImageItem | null> {
  const withTimeout = <T,>(millis: number, promise: Promise<T>): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${millis} ms.`)), millis)
    );
    return Promise.race([promise, timeoutPromise]);
  };

  const loadPromise = new Promise<ImageItem>((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      // Check if image meets size requirements
      if (
        img.naturalWidth >= minSize &&
        img.naturalWidth <= maxSize &&
        img.naturalHeight >= minSize &&
        img.naturalHeight <= maxSize
      ) {
        resolve({
          url,
          selected: false,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } else {
        reject(new Error('Image too small or too large'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });

  try {
    return await withTimeout(timeout, loadPromise);
  } catch {
    return null;
  }
}

/**
 * Get the current domain from the URL
 */
export function getCurrentDomain(): string {
  return window.location.hostname;
}

/**
 * Check if current page matches a domain pattern
 */
export function matchesDomain(pattern: string | RegExp): boolean {
  const hostname = getCurrentDomain();

  if (typeof pattern === 'string') {
    return hostname.includes(pattern);
  }

  return pattern.test(hostname);
}
