# Twitch Chinese ChatRoom Filter

A Chrome extension that filters malicious or harassing messages in Twitch chat, including Unicode attacks and harmful content.

## Features

- **Real-time Message Filtering**: Automatically filters messages as they appear in Twitch chat
- **Unicode Attack Detection**: Identifies and blocks messages with invisible characters, RTL overrides, and homoglyph attacks
- **Blocked Terms List**: Configurable list of blocked terms stored in encoded format
- **Enable/Disable Toggle**: Easy-to-use popup interface to control the filter
- **Manifest V3**: Built using the latest Chrome Extension Manifest V3 standards
- **Chrome Web Store Compliant**: Follows all Chrome Web Store Developer Policies

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/Ikaros1110/Twitch-Chinese-ChatRoom-Filter.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

5. The extension icon should appear in your Chrome toolbar

### From Chrome Web Store

Coming soon!

## Usage

1. Navigate to any Twitch channel (e.g., `https://www.twitch.tv/[channel]`)

2. Click the extension icon in your toolbar to open the popup

3. Toggle the filter on or off using the switch

4. When enabled, malicious messages will be automatically hidden from chat

## File Structure

```
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js            # Monitors and filters Twitch chat messages
├── filter.js             # Detects blocked terms and Unicode attacks
├── blocked_terms.json    # Encoded list of blocked terms
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## How It Works

### Content Script (`content.js`)
- Runs on all Twitch pages
- Uses MutationObserver to watch for new chat messages
- Filters messages in real-time based on filter rules
- Respects user preferences stored in Chrome sync storage

### Filter Module (`filter.js`)
- Detects Unicode attacks including:
  - Invisible/zero-width characters
  - RTL (Right-to-Left) override attacks
  - Excessive combining characters
  - Homoglyph attacks
- Checks messages against blocked terms list
- Base64 decodes blocked terms for privacy

### Blocked Terms (`blocked_terms.json`)
- Stores potentially harmful terms in Base64 encoded format
- Can be updated without modifying code
- Maintains user privacy by not exposing terms in plain text

### Popup Interface (`popup.html` + `popup.js`)
- Clean, user-friendly interface
- Toggle to enable/disable filter
- Visual status indicator
- Syncs preferences across devices using Chrome storage

## Privacy & Security

- **No Data Collection**: This extension does not collect or transmit any user data
- **Local Processing**: All filtering happens locally in your browser
- **No External Requests**: Does not make any network requests except loading local resources
- **Open Source**: All code is available for review in this repository

## Chrome Web Store Compliance

This extension fully complies with Chrome Web Store Developer Policies:

- ✅ Uses Manifest V3
- ✅ Minimal permissions (only storage and Twitch host permissions)
- ✅ No remote code execution
- ✅ No data collection or tracking
- ✅ Clear, accurate description of functionality
- ✅ Respects user privacy
- ✅ Single purpose: filtering chat messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Ikaros1110/Twitch-Chinese-ChatRoom-Filter/issues) on GitHub.

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by Twitch Interactive, Inc. Twitch is a trademark of Twitch Interactive, Inc.