import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import GalleryOverlay from './GalleryOverlay';
import styleText from './styles.css?inline';

console.log('Gallery Master: Content script loaded');

let shadowHost: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let reactRoot: Root | null = null;

function createShadowHost() {
  // Create shadow host element with complete isolation
  shadowHost = document.createElement('div');
  shadowHost.id = 'gallery-master-root';

  // Critical: Isolate the host element from page styles
  shadowHost.style.cssText = `
    all: initial !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    display: block !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
    color: #000000 !important;
    box-sizing: border-box !important;
  `;

  // Attach shadow DOM (this provides the main isolation)
  shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  // Inject our styles into shadow DOM
  const styleElement = document.createElement('style');
  styleElement.textContent = styleText;
  shadowRoot.appendChild(styleElement);

  // Create container for React app with explicit isolation
  const container = document.createElement('div');
  container.id = 'gallery-container';
  container.style.cssText = `
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
  `;
  shadowRoot.appendChild(container);

  // Append to document body
  document.body.appendChild(shadowHost);

  // Create React root
  reactRoot = createRoot(container);

  return { shadowHost, shadowRoot, reactRoot, container };
}

function showGallery() {
  if (!shadowHost || !reactRoot) {
    const { reactRoot: root } = createShadowHost();
    reactRoot = root;
  }

  if (reactRoot) {
    reactRoot.render(
      <React.StrictMode>
        <GalleryOverlay onClose={hideGallery} />
      </React.StrictMode>
    );
  }

  // Prevent page scroll when gallery is open
  if (shadowHost) {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';

    // Store original styles to restore later
    shadowHost.setAttribute('data-original-overflow', originalOverflow);
    shadowHost.setAttribute('data-original-position', originalPosition);
  }
}

function hideGallery() {
  // Restore original body styles
  if (shadowHost) {
    const originalOverflow = shadowHost.getAttribute('data-original-overflow') || '';
    const originalPosition = shadowHost.getAttribute('data-original-position') || '';
    document.body.style.overflow = originalOverflow;
    document.body.style.position = originalPosition;
  }

  if (reactRoot) {
    reactRoot.render(null);
  }
  if (shadowHost && shadowHost.parentNode) {
    shadowHost.parentNode.removeChild(shadowHost);
    shadowHost = null;
    shadowRoot = null;
    reactRoot = null;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);

  if (!message.task) {
    console.error('No task in message');
    return;
  }

  if (message.task === 'show-gallery') {
    showGallery();
    sendResponse({ success: true });
  }

  return true; // Keep the message channel open for async response
});
