import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import GalleryOverlay from './GalleryOverlay';
import styleText from './styles.css?inline';

console.log('Gallery Master: Content script loaded');

let shadowHost: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let reactRoot: Root | null = null;

function createShadowHost() {
  // Create shadow host element
  shadowHost = document.createElement('div');
  shadowHost.id = 'gallery-master-root';

  // Attach shadow DOM
  shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  // Inject our styles into shadow DOM
  const styleElement = document.createElement('style');
  styleElement.textContent = styleText;
  shadowRoot.appendChild(styleElement);

  // Create container for React app
  const container = document.createElement('div');
  container.id = 'gallery-container';
  shadowRoot.appendChild(container);

  // Append to document
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
}

function hideGallery() {
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
