// Content script for monitoring Twitch chat messages
(async function() {
  'use strict';

  const filter = new MessageFilter();
  await filter.loadBlockedTerms();

  // Track if filter is enabled
  let filterEnabled = await filter.isEnabled();

  // Listen for storage changes to update filter state
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.filterEnabled) {
      filterEnabled = changes.filterEnabled.newValue;
      console.log('Filter enabled status changed:', filterEnabled);
    }
  });

  // Function to check and filter a message element
  function filterMessage(messageElement) {
    if (!filterEnabled) {
      return;
    }

    // Get message text content
    const textElement = messageElement.querySelector('[data-a-target="chat-line-message-body"]');
    if (!textElement) {
      return;
    }

    const messageText = textElement.textContent || textElement.innerText;
    
    // Check if message should be filtered
    if (filter.shouldFilterMessage(messageText)) {
      // Hide the entire message container
      const messageContainer = messageElement.closest('.chat-line__message');
      if (messageContainer) {
        messageContainer.style.display = 'none';
        messageContainer.setAttribute('data-filtered', 'true');
        console.log('Filtered message:', messageText.substring(0, 50));
      }
    }
  }

  // Function to show all filtered messages (when filter is disabled)
  function showAllFilteredMessages() {
    const filteredMessages = document.querySelectorAll('[data-filtered="true"]');
    filteredMessages.forEach(element => {
      element.style.display = '';
      element.removeAttribute('data-filtered');
    });
  }

  // Watch for filter state changes to show/hide messages
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.filterEnabled) {
      if (changes.filterEnabled.newValue === false) {
        showAllFilteredMessages();
      } else {
        // Re-scan all messages when filter is re-enabled
        scanExistingMessages();
      }
    }
  });

  // Function to scan existing messages
  function scanExistingMessages() {
    const messages = document.querySelectorAll('.chat-line__message');
    messages.forEach(filterMessage);
  }

  // Set up MutationObserver to watch for new messages
  function observeChatMessages() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    
    if (!chatContainer) {
      // Retry after a delay if chat container not found
      setTimeout(observeChatMessages, 1000);
      return;
    }

    // Scan existing messages first
    scanExistingMessages();

    // Create observer for new messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself is a message
            if (node.classList && node.classList.contains('chat-line__message')) {
              filterMessage(node);
            }
            // Check if the node contains messages
            const messages = node.querySelectorAll('.chat-line__message');
            messages.forEach(filterMessage);
          }
        });
      });
    });

    // Start observing
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });

    console.log('Twitch chat filter initialized and observing messages');
  }

  // Wait for page to load and start observing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeChatMessages);
  } else {
    observeChatMessages();
  }
})();
