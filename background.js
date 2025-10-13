// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Twitch Chinese ChatRoom Filter: Extension installed');
  
  // Set default settings
  chrome.storage.sync.get(['filterEnabled', 'filterMode'], (result) => {
    if (result.filterEnabled === undefined) {
      chrome.storage.sync.set({ filterEnabled: true });
    }
    if (result.filterMode === undefined) {
      chrome.storage.sync.set({ filterMode: 'hide' });
    }
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['filterEnabled', 'filterMode'], (result) => {
      sendResponse(result);
    });
    return true; // Indicates async response
  }
});
