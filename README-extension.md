# Spek Tools Chrome Extension

A professional design assistant Chrome extension with AI-powered tools for creators.

## Features

- **Font Identification**: Identify fonts from images using advanced OCR
- **Color Palette Extraction**: Extract dominant colors from any image
- **AI Background Removal**: Remove backgrounds using industry-level AI (Hugging Face)

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Spek Tools icon will appear in your toolbar

## Usage

1. Click the Spek Tools icon in your Chrome toolbar
2. Select the tool you want to use:
   - **Font Finder**: Upload an image to identify fonts
   - **Color Palette**: Upload an image to extract colors
   - **Background Remover**: Upload an image to remove the background
3. Follow the prompts for each tool

## Privacy

- All image processing happens locally when possible
- Background removal uses Hugging Face's free API
- No images are stored or tracked
- Your privacy is our priority

## Features

### Font Identification
- Upload images containing text
- AI-powered font detection
- Confidence scores for each detected font
- Support for common web and print fonts

### Color Palette Extraction
- Extract up to 8 dominant colors
- Click any color to copy hex code to clipboard
- Works with any image format
- Perfect for design inspiration

### Background Removal
- Industry-level AI using Hugging Face models
- Supports photos and graphics
- High-quality results
- Download as transparent PNG

## Technical Details

- Manifest V3 compliant
- Uses modern web APIs
- Optimized for performance
- Minimal permissions required

## Permissions

- `activeTab`: Access current tab for content scripts
- `storage`: Store user preferences
- `host_permissions`: Access Hugging Face API for background removal

## Browser Support

- Chrome 88+
- Edge 88+
- Any Chromium-based browser with Manifest V3 support

## Development

To modify or extend this extension:

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## License

MIT License - feel free to modify and distribute

## Support

For issues or feature requests, please visit our website or contact support.