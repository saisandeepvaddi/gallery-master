/**
 * Domain-specific image extraction strategies
 */

import { getLargestImageFromSrcset } from './imageUtils';

export interface ImageExtractor {
  /**
   * Check if this extractor can handle the current domain
   */
  canHandle(): boolean;

  /**
   * Extract image URLs from the page
   */
  extractImageUrls(): Promise<string[]>;
}

/**
 * Bing Images Extractor
 * Extracts high-resolution images from Bing's image search results
 */
class BingImagesExtractor implements ImageExtractor {
  canHandle(): boolean {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    return hostname.includes('bing.com') && pathname.includes('/images');
  }

  async extractImageUrls(): Promise<string[]> {
    const urls: string[] = [];

    // Find all <a> tags with class 'iusc' (Bing image result links)
    const linkElements = document.querySelectorAll<HTMLAnchorElement>('a.iusc');

    for (const link of Array.from(linkElements)) {
      try {
        // Get the 'm' attribute which contains JSON data
        const mAttr = link.getAttribute('m');
        if (!mAttr) continue;

        // Parse the JSON (it's HTML-encoded, so we need to decode)
        const decoded = mAttr
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');

        const data = JSON.parse(decoded);

        // Extract the high-res image URL from 'murl' property
        if (data.murl && typeof data.murl === 'string') {
          urls.push(data.murl);
        }
      } catch (error) {
        // If parsing fails, skip this element
        console.debug('Failed to parse Bing image data:', error);
      }
    }

    return urls;
  }
}

/**
 * Default Image Extractor
 * Extracts images from standard <img> tags and <a> links
 */
class DefaultImageExtractor implements ImageExtractor {
  canHandle(): boolean {
    // Always returns true - this is the fallback extractor
    return true;
  }

  async extractImageUrls(): Promise<string[]> {
    const urls = new Set<string>();

    // 1. Extract from <img> tags
    const imgElements = document.querySelectorAll<HTMLImageElement>('img');
    for (const img of Array.from(imgElements)) {
      // Check srcset first (higher quality images)
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const largestUrl = getLargestImageFromSrcset(srcset);
        if (largestUrl) {
          urls.add(largestUrl);
          continue; // Skip src if we got srcset
        }
      }

      // Fallback to src attribute
      const src = img.getAttribute('src');
      if (src && this.isImageUrl(src)) {
        urls.add(src);
      }
    }

    // 2. Extract from <a> tags linking to images
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    for (const ext of extensions) {
      const links = document.querySelectorAll<HTMLAnchorElement>(
        `a[href$='${ext}'], a[href*='${ext}?']`
      );

      for (const link of Array.from(links)) {
        const href = link.getAttribute('href');
        if (href) {
          urls.add(href);
        }
      }
    }

    return Array.from(urls).sort();
  }

  private isImageUrl(url: string): boolean {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;
    return imageExtensions.test(url);
  }
}

/**
 * Extractor Registry
 * Manages all available image extractors and selects the appropriate one
 */
class ExtractorRegistry {
  private extractors: ImageExtractor[] = [
    new BingImagesExtractor(),
    new DefaultImageExtractor(), // Always last (fallback)
  ];

  /**
   * Get the appropriate extractor for the current page
   */
  getExtractor(): ImageExtractor {
    for (const extractor of this.extractors) {
      if (extractor.canHandle()) {
        return extractor;
      }
    }

    // Should never reach here since DefaultImageExtractor always returns true
    return new DefaultImageExtractor();
  }

  /**
   * Extract images using the appropriate extractor
   */
  async extractImages(): Promise<string[]> {
    const extractor = this.getExtractor();
    console.log('Using extractor:', extractor.constructor.name);
    return extractor.extractImageUrls();
  }
}

// Export singleton instance
export const imageExtractorRegistry = new ExtractorRegistry();

/**
 * Main extraction function - use this in your component
 */
export async function extractImagesFromPage(): Promise<string[]> {
  return imageExtractorRegistry.extractImages();
}
