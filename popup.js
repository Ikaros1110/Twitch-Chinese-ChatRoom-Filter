// Popup script for enabling/disabling the filter
document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('filterToggle');
  const statusDiv = document.getElementById('status');

  // Load current filter state
  const result = await chrome.storage.sync.get(['filterEnabled']);
  const filterEnabled = result.filterEnabled !== false; // Default to true
  
  toggleSwitch.checked = filterEnabled;
  updateStatus(filterEnabled);

  // Handle toggle change
  toggleSwitch.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    
    // Save to storage
    await chrome.storage.sync.set({ filterEnabled: enabled });
    
    // Update status display
    updateStatus(enabled);
    
    console.log('Filter toggled:', enabled);
  });

  // Update status display
  function updateStatus(enabled) {
    if (enabled) {
      statusDiv.textContent = 'Filter is ENABLED';
      statusDiv.className = 'status enabled';
    } else {
      statusDiv.textContent = 'Filter is DISABLED';
      statusDiv.className = 'status disabled';
    }
  }
});
