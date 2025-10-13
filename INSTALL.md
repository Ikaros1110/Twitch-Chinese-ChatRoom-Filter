# Installation Guide for Developers

This guide explains how to install and test the Twitch Chinese ChatRoom Filter extension in Chrome.

## Prerequisites

- Google Chrome browser (version 88 or higher for Manifest V3 support)
- Basic understanding of Chrome extensions

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Ikaros1110/Twitch-Chinese-ChatRoom-Filter.git
cd Twitch-Chinese-ChatRoom-Filter
```

### 2. Load the Extension in Chrome

1. Open Google Chrome and navigate to: `chrome://extensions/`

2. **Enable Developer Mode**
   - Look for the "Developer mode" toggle in the top-right corner
   - Click to enable it

3. **Load Unpacked Extension**
   - Click the "Load unpacked" button
   - Navigate to the directory where you cloned the repository
   - Select the folder containing `manifest.json`
   - Click "Select Folder" (or "Open" on Mac)

4. **Verify Installation**
   - The extension should now appear in your extensions list
   - You should see the Twitch Chat Filter icon with a purple shield
   - The extension status should show as "On"

### 3. Test the Extension

1. **Navigate to Twitch**
   - Go to any Twitch channel (e.g., `https://www.twitch.tv/any-channel`)
   - Make sure the chat is visible

2. **Open the Extension Popup**
   - Click the extension icon in your Chrome toolbar
   - You should see the filter control interface
   - The toggle switch should be in the "ON" position by default

3. **Test Filtering**
   - Try toggling the filter on and off
   - The status indicator should change between "Filter is ENABLED" and "Filter is DISABLED"
   - When enabled, messages with blocked terms or Unicode attacks will be hidden

## Troubleshooting

### Extension Not Loading

- **Error: "Manifest file is missing or unreadable"**
  - Make sure you selected the correct folder containing `manifest.json`
  - Check that all required files are present

- **Error: "Could not load icon"**
  - Verify that the `icons/` folder contains all three icon files (16, 48, and 128 pixels)

### Extension Not Working on Twitch

- **Chat messages not being filtered:**
  - Open the Chrome DevTools (F12) on the Twitch page
  - Go to the Console tab
  - Look for any error messages
  - Verify that the content script loaded by checking for initialization messages

- **Toggle not working:**
  - Check the browser console for errors
  - Try reloading the extension (`chrome://extensions/` → click the refresh icon)

### Storage Issues

- **Settings not persisting:**
  - Make sure Chrome sync is enabled
  - Check Chrome's storage settings in `chrome://settings/content/all`

## Development Tips

### Making Changes

1. **Modify Code**
   - Edit the files as needed (`content.js`, `filter.js`, etc.)

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Find your extension
   - Click the refresh/reload icon

3. **Test Changes**
   - Navigate to Twitch and test the functionality
   - Check the console for any errors

### Debugging

1. **Content Script Debugging**
   - Open Twitch in Chrome
   - Open DevTools (F12)
   - Go to Console tab
   - Look for messages from `content.js`

2. **Popup Debugging**
   - Right-click the extension icon
   - Select "Inspect popup"
   - A DevTools window will open for the popup

3. **Background Script Debugging** (if needed in future)
   - Go to `chrome://extensions/`
   - Click "Inspect views: background page" (when applicable)

## File Structure Reference

```
Twitch-Chinese-ChatRoom-Filter/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── filter.js             # Filter logic module
├── blocked_terms.json    # Blocked terms list
├── popup.html            # Popup UI
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md             # Main documentation
├── INSTALL.md            # This file
└── LICENSE               # MIT License
```

## Chrome Web Store Submission (Future)

When ready to publish:

1. Create a developer account at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Prepare store assets (screenshots, promotional images)
3. Zip the extension files (exclude `.git`, `.gitignore`, etc.)
4. Submit for review

## Support

If you encounter issues:
- Check the [GitHub Issues](https://github.com/Ikaros1110/Twitch-Chinese-ChatRoom-Filter/issues)
- Review the [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- Open a new issue with detailed error information
