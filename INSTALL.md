# Spek Tools Chrome Extension - Installation Guide

## Quick Install (For Users)

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Download the Extension**
   - Download all extension files to a folder on your computer
   - Make sure you have: `manifest.json`, `popup.html`, `popup.css`, `popup.js`, and the `icons/` folder

2. **Open Chrome Extensions**
   - Open Google Chrome
   - Type `chrome://extensions/` in the address bar and press Enter
   - OR click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" ON in the top-right corner of the extensions page

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing your extension files
   - The Spek Tools extension will appear in your extensions list

5. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Spek Tools - Design Assistant"
   - Click the pin icon to keep it visible in your toolbar

## Using the Extension

1. **Access Tools**
   - Click the Spek Tools icon in your Chrome toolbar
   - A popup will open with three tool options

2. **Font Finder**
   - Click "Font Finder"
   - Upload an image containing text
   - Get AI-powered font identification results

3. **Color Palette**
   - Click "Color Palette"  
   - Upload any image
   - Extract dominant colors and copy hex codes

4. **Background Remover**
   - Click "Background Remover"
   - Upload an image
   - AI removes the background automatically
   - Download the result as a transparent PNG

## Troubleshooting

### Extension Won't Load
- Make sure all files are in the same folder
- Check that `manifest.json` is present and valid
- Refresh the extensions page and try again

### Tools Not Working
- Check your internet connection (background removal needs API access)
- Make sure you're uploading valid image files (JPG, PNG, WebP)
- Try refreshing the extension popup

### Permissions Issues
- The extension needs minimal permissions for functionality
- Background removal requires internet access for Hugging Face API

## Privacy & Security

- **Local Processing**: Font identification and color extraction happen in your browser
- **API Usage**: Background removal uses Hugging Face's free API
- **No Storage**: No images are stored on our servers
- **No Tracking**: No user data is collected or tracked

## Browser Support

- **Chrome**: Version 88+
- **Edge**: Version 88+
- **Other Chromium browsers**: Any version supporting Manifest V3

## File Structure

```
spek-tools-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Extension functionality
├── icons/
│   └── icon-large.png    # Extension icon
├── README-extension.md   # Extension documentation
└── INSTALL.md           # This installation guide
```

## Development

To modify the extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Spek Tools extension
4. Test your changes in the popup

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Spek Tools - Design Assistant"
3. Click "Remove"
4. Confirm removal

## Support

For help or issues:
- Check this installation guide
- Visit our website for more support
- Contact our support team

---

**Note**: This extension is in development mode. For production use, it would need to be published to the Chrome Web Store.