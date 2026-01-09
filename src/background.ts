// Background service worker for Gallery Master extension

console.log('Gallery Master: Background service worker loaded');

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    console.error('No tab ID available');
    return;
  }

  try {
    // Send message to content script to show gallery
    await chrome.tabs.sendMessage(tab.id, {
      task: 'show-gallery',
      data: [],
    });
    console.log('Gallery message sent to tab:', tab.id);
  } catch (error) {
    console.error('Error sending message to content script:', error);
  }
});

// Optional: Track installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gallery Master: Extension installed/updated');
});
