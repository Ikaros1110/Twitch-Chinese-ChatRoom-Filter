# Testing Guide

## Manual Testing Instructions

### Setup
1. Load the extension in your browser (Chrome/Edge/Brave):
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

2. For Firefox:
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

### Test Cases

#### Test 1: Basic Filtering
1. Navigate to any Twitch channel (e.g., https://www.twitch.tv/shroud)
2. Find the chat section on the right side
3. Look for messages containing Chinese characters
4. Expected: Messages with Chinese characters should be hidden (if using default "hide" mode)

#### Test 2: Toggle Filter On/Off
1. Click the extension icon in the browser toolbar
2. Toggle "Enable Filter" off
3. Expected: Previously hidden Chinese messages should now be visible
4. Toggle "Enable Filter" back on
5. Expected: Chinese messages should be hidden again

#### Test 3: Filter Mode - Hide
1. Click the extension icon
2. Ensure "Enable Filter" is ON
3. Select "Hide Messages" from the Filter Mode dropdown
4. Expected: Chinese messages should completely disappear from chat

#### Test 4: Filter Mode - Blur
1. Click the extension icon
2. Ensure "Enable Filter" is ON
3. Select "Blur Messages" from the Filter Mode dropdown
4. Expected: Chinese messages should be visible but blurred out

#### Test 5: Real-time Filtering
1. Open a Twitch channel with active chat
2. Ensure filter is enabled
3. Watch for new messages in real-time
4. Expected: New Chinese messages should be filtered immediately as they appear

#### Test 6: Mixed Content
1. Look for messages that mix English and Chinese text
2. Expected: Any message containing at least one Chinese character should be filtered

#### Test 7: Settings Persistence
1. Change filter settings (toggle on/off, change mode)
2. Close the browser completely
3. Reopen browser and navigate to Twitch
4. Expected: Previous settings should be remembered

#### Test 8: Non-Chinese Characters
1. Verify that messages with Japanese Hiragana/Katakana are NOT filtered
2. Verify that messages with Korean Hangul are NOT filtered
3. Verify that messages with English, numbers, or emojis only are NOT filtered
4. Expected: Only messages with actual Chinese characters (CJK Unified Ideographs) are filtered

## Automated Testing

Run the character detection tests:
```bash
node test.js
```

This tests the core Chinese character detection regex against various input cases.

## Expected Behavior

### What Gets Filtered
- ✓ Simplified Chinese characters (简体中文)
- ✓ Traditional Chinese characters (繁體中文)
- ✓ Messages mixing Chinese with English/numbers
- ✓ Any message containing at least one Chinese character

### What Does NOT Get Filtered
- ✓ Pure English messages
- ✓ Numbers and special characters
- ✓ Emojis
- ✓ Japanese Hiragana/Katakana (unless they contain actual Chinese characters/Kanji)
- ✓ Korean Hangul

## Troubleshooting

### Extension Not Working
1. Check browser console for errors (F12 → Console tab)
2. Verify extension is enabled in `chrome://extensions/`
3. Try reloading the extension
4. Check if you're on a Twitch.tv page

### Messages Not Filtering
1. Verify filter is enabled (click extension icon)
2. Check that you're on a Twitch channel page (not homepage)
3. Wait a few seconds for chat to load
4. Check browser console for any error messages

### Settings Not Saving
1. Ensure browser has permission to store data
2. Check browser's extension storage permissions
3. Try clearing extension storage and reconfiguring

## Performance

The extension should have minimal impact on browser performance:
- Content script only runs on Twitch.tv pages
- Uses efficient MutationObserver for real-time updates
- Regex pattern is optimized for fast matching
- No external API calls or network requests

## Debug Mode

To see debug logs:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages prefixed with "Twitch Chinese ChatRoom Filter:"
