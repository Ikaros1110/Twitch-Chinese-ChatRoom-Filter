# Twitch Chinese ChatRoom Filter

A browser extension that filters messages containing Chinese characters in Twitch chat rooms.

## Features

- 🔍 **Automatic Detection**: Automatically detects messages containing Chinese characters (CJK Unified Ideographs)
- 🎛️ **Flexible Filtering**: Choose between hiding or blurring filtered messages
- ⚡ **Real-time Filtering**: Works in real-time as new messages appear in chat
- 🎨 **Clean UI**: Simple and intuitive popup interface for configuration
- 💾 **Persistent Settings**: Your preferences are saved across browser sessions

## Installation

### Chrome / Edge / Brave

1. Download or clone this repository
2. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/` for Edge)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your browser toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension directory and select `manifest.json`
5. The extension will be loaded temporarily

## Usage

1. Navigate to any Twitch channel (e.g., `https://www.twitch.tv/channelname`)
2. The extension will automatically start filtering chat messages containing Chinese characters
3. Click the extension icon to access settings:
   - **Enable Filter**: Toggle the filter on/off
   - **Filter Mode**: 
     - **Hide Messages**: Completely hide filtered messages
     - **Blur Messages**: Blur filtered messages (they remain visible but obscured)

## Technical Details

### Detection

The extension detects Chinese characters using Unicode ranges:
- CJK Unified Ideographs: U+4E00 to U+9FFF
- CJK Unified Ideographs Extension A: U+3400 to U+4DBF
- CJK Compatibility Ideographs: U+F900 to U+FAFF

### Files

- `manifest.json` - Extension manifest (Manifest V3)
- `content.js` - Content script that runs on Twitch pages
- `background.js` - Service worker for managing extension state
- `popup.html` - Settings popup interface
- `popup.js` - Popup logic
- `popup.css` - Popup styling
- `styles.css` - Styles injected into Twitch pages
- `icons/` - Extension icons

## Development

### Project Structure

```
Twitch-Chinese-ChatRoom-Filter/
├── manifest.json          # Extension configuration
├── content.js            # Main filtering logic
├── background.js         # Background service worker
├── popup.html           # Settings UI
├── popup.js             # Settings logic
├── popup.css            # Settings styling
├── styles.css           # Content page styles
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── LICENSE              # MIT License
└── README.md           # This file
```

### Testing

1. Load the extension in your browser
2. Navigate to a Twitch channel with Chinese messages in chat
3. Verify that messages are filtered according to your settings
4. Test toggling the filter on/off
5. Test switching between hide and blur modes

## Privacy

This extension:
- ✅ Only runs on Twitch.tv pages
- ✅ Does not collect or transmit any data
- ✅ Does not require any external permissions beyond accessing Twitch.tv
- ✅ Stores settings locally using Chrome's storage API

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

## Changelog

### Version 1.0.0
- Initial release
- Basic Chinese character detection and filtering
- Hide and blur filter modes
- Configurable settings popup