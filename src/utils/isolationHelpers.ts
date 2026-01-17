/**
 * Isolation Helpers
 *
 * Utilities to protect the extension from host page interference
 */

/**
 * Prevent event propagation to the host page
 */
export function stopEventPropagation(event: Event): void {
  event.stopPropagation();
  event.stopImmediatePropagation();
}

/**
 * Create an isolated event listener that prevents host page interference
 */
export function createIsolatedEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): (() => void) | null {
  if (!element) return null;

  const isolatedHandler = (event: HTMLElementEventMap[K]) => {
    // Prevent the event from reaching the host page
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Call the actual handler
    handler(event);
  };

  element.addEventListener(eventType, isolatedHandler as EventListener, {
    ...options,
    capture: true, // Capture phase to intercept before host page handlers
  });

  // Return cleanup function
  return () => {
    element.removeEventListener(eventType, isolatedHandler as EventListener, {
      ...options,
      capture: true,
    });
  };
}

/**
 * Protect an element from CSS transforms and interference
 */
export function protectElementStyle(element: HTMLElement): void {
  // Use inline styles with !important to override any page styles
  const criticalStyles = [
    'position: fixed !important',
    'top: 0 !important',
    'left: 0 !important',
    'width: 100% !important',
    'height: 100% !important',
    'margin: 0 !important',
    'padding: 0 !important',
    'border: none !important',
    'transform: none !important',
    'filter: none !important',
    'opacity: 1 !important',
  ];

  element.style.cssText = criticalStyles.join('; ');
}

/**
 * Prevent host page from modifying our element
 */
export function makeImmutable(element: HTMLElement): void {
  // Freeze the style object to prevent modifications
  try {
    Object.freeze(element.style);
  } catch (e) {
    // Some browsers don't allow freezing
    console.debug('Could not freeze element style:', e);
  }

  // Use MutationObserver to restore styles if they're changed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        protectElementStyle(element);
      }
    });
  });

  observer.observe(element, {
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
}

/**
 * Get computed font size in pixels, ignoring host page CSS
 */
export function getStandardFontSize(): number {
  return 16; // Standard base font size
}

/**
 * Sanitize a number value to prevent NaN or invalid values
 */
export function sanitizeNumber(
  value: number | string,
  fallback: number = 0,
  min?: number,
  max?: number
): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || !isFinite(num)) {
    return fallback;
  }

  let result = num;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;

  return result;
}

/**
 * Create a protected transform string for zoom/pan
 */
export function createTransform(
  translateX: number,
  translateY: number,
  scale: number
): string {
  // Sanitize values to prevent invalid transforms
  const x = sanitizeNumber(translateX, 0);
  const y = sanitizeNumber(translateY, 0);
  const s = sanitizeNumber(scale, 1, 0.1, 10);

  return `translate(${x}px, ${y}px) scale(${s})`;
}
