// Script to resize the large icon to different sizes
// This would be run in a browser console or Node.js environment

function createIcon(size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add simple white design tool symbols
    ctx.fillStyle = 'white';
    const center = size / 2;
    const unit = size / 16;
    
    // Draw simplified design tool shapes
    // Pen/brush
    ctx.fillRect(center - 3*unit, center - 4*unit, unit, 8*unit);
    
    // Palette circle
    ctx.beginPath();
    ctx.arc(center + 2*unit, center - 2*unit, 2*unit, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ruler
    ctx.fillRect(center - 4*unit, center + 2*unit, 8*unit, unit);
    
    return canvas.toDataURL();
}

// Usage: createIcon(16), createIcon(48), createIcon(128)