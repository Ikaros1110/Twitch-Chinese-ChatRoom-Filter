// Popup script for handling settings
document.addEventListener('DOMContentLoaded', () => {
  const filterEnabledCheckbox = document.getElementById('filterEnabled');
  const filterModeSelect = document.getElementById('filterMode');
  const statusDiv = document.getElementById('status');

  // Load current settings
  chrome.storage.sync.get(['filterEnabled', 'filterMode'], (result) => {
    filterEnabledCheckbox.checked = result.filterEnabled !== undefined ? result.filterEnabled : true;
    filterModeSelect.value = result.filterMode || 'hide';
  });

  // Save settings when changed
  filterEnabledCheckbox.addEventListener('change', () => {
    const enabled = filterEnabledCheckbox.checked;
    chrome.storage.sync.set({ filterEnabled: enabled }, () => {
      showStatus('Settings saved!');
    });
  });

  filterModeSelect.addEventListener('change', () => {
    const mode = filterModeSelect.value;
    chrome.storage.sync.set({ filterMode: mode }, () => {
      showStatus('Settings saved!');
    });
  });

  // Show status message
  function showStatus(message) {
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 2000);
  }
});
