// Content script for filtering Chinese messages in Twitch chat
(function() {
  'use strict';

  // Configuration
  let filterEnabled = true;
  let filterMode = 'hide'; // 'hide' or 'blur'

  // Load settings from storage
  chrome.storage.sync.get(['filterEnabled', 'filterMode'], (result) => {
    filterEnabled = result.filterEnabled !== undefined ? result.filterEnabled : true;
    filterMode = result.filterMode || 'hide';
  });

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      if (changes.filterEnabled) {
        filterEnabled = changes.filterEnabled.newValue;
        updateChatDisplay();
      }
      if (changes.filterMode) {
        filterMode = changes.filterMode.newValue;
        updateChatDisplay();
      }
    }
  });

  // Function to detect Chinese characters
  function containsChinese(text) {
    // Unicode ranges for Chinese characters
    // CJK Unified Ideographs: 4E00-9FFF
    // CJK Unified Ideographs Extension A: 3400-4DBF
    // CJK Compatibility Ideographs: F900-FAFF
    const chineseRegex = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;
    return chineseRegex.test(text);
  }

  // Function to filter a chat message
  function filterMessage(element) {
    if (!filterEnabled) return;

    const textContent = element.textContent || '';
    
    if (containsChinese(textContent)) {
      if (filterMode === 'hide') {
        element.style.display = 'none';
        element.setAttribute('data-filtered', 'true');
      } else if (filterMode === 'blur') {
        element.style.filter = 'blur(5px)';
        element.style.userSelect = 'none';
        element.setAttribute('data-filtered', 'true');
      }
    }
  }

  // Function to update chat display based on current settings
  function updateChatDisplay() {
    const messages = document.querySelectorAll('[data-filtered="true"]');
    messages.forEach(msg => {
      if (!filterEnabled) {
        msg.style.display = '';
        msg.style.filter = '';
        msg.style.userSelect = '';
        msg.removeAttribute('data-filtered');
      } else {
        if (filterMode === 'hide') {
          msg.style.display = 'none';
          msg.style.filter = '';
          msg.style.userSelect = '';
        } else if (filterMode === 'blur') {
          msg.style.display = '';
          msg.style.filter = 'blur(5px)';
          msg.style.userSelect = 'none';
        }
      }
    });
  }

  // Observer to watch for new chat messages
  function observeChat() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    
    if (!chatContainer) {
      // Retry after delay if chat container not found
      setTimeout(observeChat, 1000);
      return;
    }

    // Filter existing messages
    const existingMessages = chatContainer.querySelectorAll('.chat-line__message');
    existingMessages.forEach(filterMessage);

    // Watch for new messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const messages = node.classList && node.classList.contains('chat-line__message')
              ? [node]
              : node.querySelectorAll('.chat-line__message');
            messages.forEach(filterMessage);
          }
        });
      });
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeChat);
  } else {
    observeChat();
  }

  console.log('Twitch Chinese ChatRoom Filter: Content script loaded');
})();
