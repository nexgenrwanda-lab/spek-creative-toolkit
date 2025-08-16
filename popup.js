// Popup functionality for Spek Tools Chrome Extension

class SpekToolsPopup {
    constructor() {
        this.currentTool = 'main';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // Tool selection
        document.getElementById('fontTool').addEventListener('click', () => this.showTool('font'));
        document.getElementById('paletteTool').addEventListener('click', () => this.showTool('palette'));
        document.getElementById('backgroundTool').addEventListener('click', () => this.showTool('background'));

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showTool('main'));
        });

        // File inputs
        document.getElementById('fontFileInput').addEventListener('change', (e) => this.handleFontUpload(e));
        document.getElementById('paletteFileInput').addEventListener('change', (e) => this.handlePaletteUpload(e));
        document.getElementById('backgroundFileInput').addEventListener('change', (e) => this.handleBackgroundUpload(e));

        // Upload area clicks
        document.getElementById('fontUpload').addEventListener('click', () => document.getElementById('fontFileInput').click());
        document.getElementById('paletteUpload').addEventListener('click', () => document.getElementById('paletteFileInput').click());
        document.getElementById('backgroundUpload').addEventListener('click', () => document.getElementById('backgroundFileInput').click());

        // Website link
        document.getElementById('visitWebsite').addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://your-website-url.com' });
        });
    }

    setupDragAndDrop() {
        const uploadAreas = ['fontUpload', 'paletteUpload', 'backgroundUpload'];
        
        uploadAreas.forEach(areaId => {
            const area = document.getElementById(areaId);
            
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('dragover');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('dragover');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    this.handleFileUpload(files[0], areaId);
                }
            });
        });
    }

    showTool(tool) {
        // Hide all interfaces
        document.querySelectorAll('.tool-interface').forEach(interface => {
            interface.style.display = 'none';
        });

        if (tool === 'main') {
            document.querySelector('.tools-grid').style.display = 'grid';
            this.currentTool = 'main';
        } else {
            document.querySelector('.tools-grid').style.display = 'none';
            document.getElementById(`${tool}Interface`).style.display = 'block';
            this.currentTool = tool;
        }
    }

    handleFileUpload(file, areaId) {
        if (areaId === 'fontUpload') {
            this.processFontImage(file);
        } else if (areaId === 'paletteUpload') {
            this.extractColorPalette(file);
        } else if (areaId === 'backgroundUpload') {
            this.removeBackground(file);
        }
    }

    handleFontUpload(e) {
        const file = e.target.files[0];
        if (file) this.processFontImage(file);
    }

    handlePaletteUpload(e) {
        const file = e.target.files[0];
        if (file) this.extractColorPalette(file);
    }

    handleBackgroundUpload(e) {
        const file = e.target.files[0];
        if (file) this.removeBackground(file);
    }

    async processFontImage(file) {
        const resultsDiv = document.getElementById('fontResults');
        resultsDiv.innerHTML = '<div class="processing"><div class="spinner"></div><p>Analyzing fonts...</p></div>';

        try {
            // Simulate font detection - in real implementation, you'd use OCR or font detection API
            setTimeout(() => {
                const mockFonts = [
                    { name: 'Helvetica Neue', confidence: 0.92 },
                    { name: 'Arial', confidence: 0.78 },
                    { name: 'Open Sans', confidence: 0.65 }
                ];

                const html = `
                    <h3>Detected Fonts:</h3>
                    ${mockFonts.map(font => `
                        <div style="padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px;">
                            <strong>${font.name}</strong>
                            <div style="font-size: 12px; color: #666;">Confidence: ${Math.round(font.confidence * 100)}%</div>
                        </div>
                    `).join('')}
                `;
                resultsDiv.innerHTML = html;
            }, 2000);
        } catch (error) {
            resultsDiv.innerHTML = '<p style="color: #e74c3c;">Error analyzing image. Please try again.</p>';
        }
    }

    async extractColorPalette(file) {
        const resultsDiv = document.getElementById('paletteResults');
        resultsDiv.innerHTML = '<div class="processing"><div class="spinner"></div><p>Extracting colors...</p></div>';

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const colors = this.getDominantColors(ctx, canvas.width, canvas.height);
                this.displayColorPalette(colors, resultsDiv);
            };

            img.src = URL.createObjectURL(file);
        } catch (error) {
            resultsDiv.innerHTML = '<p style="color: #e74c3c;">Error extracting colors. Please try again.</p>';
        }
    }

    getDominantColors(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const colorMap = new Map();

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 4 * 10) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];

            if (alpha > 128) { // Skip transparent pixels
                const hex = this.rgbToHex(r, g, b);
                colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
            }
        }

        // Get top 8 colors
        return Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([color]) => color);
    }

    displayColorPalette(colors, container) {
        const html = `
            <h3>Color Palette:</h3>
            <div class="color-palette">
                ${colors.map(color => `
                    <div class="color-swatch" style="background-color: ${color};" onclick="navigator.clipboard.writeText('${color}')">
                        <div class="color-value">${color}</div>
                    </div>
                `).join('')}
            </div>
            <small style="display: block; margin-top: 16px; color: #666;">Click any color to copy to clipboard</small>
        `;
        container.innerHTML = html;
    }

    async removeBackground(file) {
        const processingDiv = document.getElementById('backgroundProcessing');
        const resultsDiv = document.getElementById('backgroundResults');
        
        processingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';

        try {
            // Use Hugging Face API for background removal
            const processedBlob = await this.callBackgroundRemovalAPI(file);
            const processedUrl = URL.createObjectURL(processedBlob);

            const html = `
                <h3>Background Removed:</h3>
                <img src="${processedUrl}" alt="Processed" class="result-image" style="background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%); background-size: 20px 20px; background-position: 0 0, 0 10px;">
                <button class="download-btn" onclick="this.downloadImage('${processedUrl}', 'background-removed.png')">Download PNG</button>
            `;
            
            processingDiv.style.display = 'none';
            resultsDiv.innerHTML = html;
        } catch (error) {
            processingDiv.style.display = 'none';
            resultsDiv.innerHTML = '<p style="color: #e74c3c;">Error removing background. Please try again.</p>';
        }
    }

    async callBackgroundRemovalAPI(file) {
        const response = await fetch('https://api-inference.huggingface.co/models/schirrmacher/ormbg', {
            method: 'POST',
            body: file,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.blob();
    }

    downloadImage(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpekToolsPopup();
});

// Add global download function
window.downloadImage = function(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};