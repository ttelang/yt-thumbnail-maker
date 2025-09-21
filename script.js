// State
let currentLayout = 'b';

// Palettes
const palettes = {
    cool: ['#0f172a', '#1e293b', '#ffffff', '#38bdf8', '#06b6d4', '#ffffff'],
    indigo: ['#1e1b4b', '#312e81', '#ffffff', '#6366f1', '#8b5cf6', '#ffffff'],
    cyan: ['#164e63', '#155e75', '#ffffff', '#06b6d4', '#0891b2', '#ffffff'],
    teal: ['#134e4a', '#115e59', '#ffffff', '#14b8a6', '#0d9488', '#ffffff'],
    rose: ['#4c1d24', '#881337', '#ffffff', '#f43f5e', '#e11d48', '#ffffff'],
    amber: ['#451a03', '#92400e', '#ffffff', '#f59e0b', '#d97706', '#ffffff']
};

// Elements
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const tagInput = document.getElementById('tagInput');
const brandInput = document.getElementById('brandInput');
const layoutSelect = document.getElementById('layoutSelect');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');

// Color inputs
const colorInputs = {
    bg0: document.getElementById('bg0Color'),
    bg1: document.getElementById('bg1Color'),
    primary: document.getElementById('primaryColor'),
    accent: document.getElementById('accentColor'),
    pill: document.getElementById('pillColor'),
    tagText: document.getElementById('tagTextColor')
};

// Apply CSS variables
function applyCSSVariables() {
    const root = document.documentElement;
    Object.entries(colorInputs).forEach(([key, input]) => {
        root.style.setProperty(`--${key}`, input.value);
    });
}

// Get text width
function getTextWidth(text, fontSize, fontWeight = 'normal') {
    const svg = document.querySelector('#thumb');
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('font-size', fontSize);
    textEl.setAttribute('font-weight', fontWeight);
    textEl.setAttribute('font-family', 'system-ui');
    textEl.setAttribute('visibility', 'hidden');
    textEl.textContent = text;
    svg.appendChild(textEl);
    const width = textEl.getComputedTextLength();
    svg.removeChild(textEl);
    return width;
}

// Auto-fit title
function autofitTitle(layout) {
    const titleEl = document.getElementById(`title-${layout}`);
    const subtitleEl = document.getElementById(`subtitle-${layout}`);
    const title = titleInput.value;
    let fontSize = (layout === 'b' ? 80 : 72) + currentFontSizeOffset;
    const minFontSize = 24;
    const maxFontSize = 120;
    const maxWidth = layout === 'b' ? 920 : layout === 'a' ? 1120 : 1120;
    
    // Apply font size constraints
    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));
    
    // Auto-fit to width
    while (fontSize > minFontSize) {
        const width = getTextWidth(title, fontSize, '700');
        if (width <= maxWidth) break;
        fontSize -= 2;
    }
    
    titleEl.setAttribute('font-size', fontSize);
    
    // Calculate proportional subtitle size (typically 40-45% of title size)
    const subtitleBaseFontSize = layout === 'b' ? 36 : 32;
    const subtitleFontSize = Math.max(16, Math.min(60, subtitleBaseFontSize + (currentFontSizeOffset * 0.45)));
    subtitleEl.setAttribute('font-size', subtitleFontSize);
    
    // Update underline width for Layout B
    if (layout === 'b') {
        const underline = document.getElementById('titleUnderline-b');
        const titleWidth = getTextWidth(title, fontSize, '700');
        const underlineWidth = Math.min(Math.max(titleWidth, 200), 760);
        const underlineX = 580 - underlineWidth / 2;
        underline.setAttribute('x', underlineX);
        underline.setAttribute('width', underlineWidth);
    }
}

// Update pill size and position
function updatePill(layout) {
    const tag = tagInput.value || 'TAG';
    const pillEl = document.getElementById(`tagPill-${layout}`);
    const tagEl = document.getElementById(`tag-${layout}`);
    
    // Measure text
    const textWidth = getTextWidth(tag, 18, '600');
    const pillWidth = textWidth + 32; // 16px padding on each side
    const pillHeight = 40;
    const pillX = 1160 - pillWidth; // Right-align to safe area
    const pillY = 40;
    
    // Update pill
    pillEl.setAttribute('x', pillX);
    pillEl.setAttribute('width', pillWidth);
    
    // Center text in pill
    const textX = pillX + pillWidth / 2;
    const textY = pillY + pillHeight / 2;
    
    tagEl.setAttribute('x', textX);
    tagEl.setAttribute('y', textY);
    tagEl.textContent = tag;
}

// Update layout visibility
function updateLayoutVisibility() {
    ['a', 'b', 'c'].forEach(layout => {
        const el = document.getElementById(`layout-${layout}`);
        el.style.display = layout === currentLayout ? 'block' : 'none';
    });
}

// Update content
function updateContent() {
    const title = titleInput.value;
    const subtitle = subtitleInput.value;
    const brand = brandInput.value;
    
    ['a', 'b', 'c'].forEach(layout => {
        document.getElementById(`title-${layout}`).textContent = title;
        document.getElementById(`subtitle-${layout}`).textContent = subtitle;
        document.getElementById(`brand-${layout}`).textContent = brand;
    });
}

// Main update function
function update() {
    applyCSSVariables();
    updateContent();
    updateLayoutVisibility();
    
    // Update title sizing and pill for current layout
    autofitTitle(currentLayout);
    updatePill(currentLayout);
}

// Export functions
function exportSVG() {
    const svg = document.getElementById('thumb');
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Add CSS variables to the SVG
    const style = document.createElement('style');
    const root = document.documentElement;
    const cssVars = [
        `--bg0: ${root.style.getPropertyValue('--bg0') || colorInputs.bg0.value}`,
        `--bg1: ${root.style.getPropertyValue('--bg1') || colorInputs.bg1.value}`,
        `--primary: ${root.style.getPropertyValue('--primary') || colorInputs.primary.value}`,
        `--accent: ${root.style.getPropertyValue('--accent') || colorInputs.accent.value}`,
        `--pill: ${root.style.getPropertyValue('--pill') || colorInputs.pill.value}`,
        `--tagText: ${root.style.getPropertyValue('--tagText') || colorInputs.tagText.value}`
    ].join('; ');
    
    svgString = svgString.replace('<svg', `<svg><defs><style>:root { ${cssVars}; }</style></defs><svg`);
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thumbnail.svg';
    a.click();
    URL.revokeObjectURL(url);
}

function exportPNG() {
    const svg = document.getElementById('thumb');
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Inline styles
    const root = document.documentElement;
    const cssVars = {
        '--bg0': root.style.getPropertyValue('--bg0') || colorInputs.bg0.value,
        '--bg1': root.style.getPropertyValue('--bg1') || colorInputs.bg1.value,
        '--primary': root.style.getPropertyValue('--primary') || colorInputs.primary.value,
        '--accent': root.style.getPropertyValue('--accent') || colorInputs.accent.value,
        '--pill': root.style.getPropertyValue('--pill') || colorInputs.pill.value,
        '--tagText': root.style.getPropertyValue('--tagText') || colorInputs.tagText.value
    };
    
    Object.entries(cssVars).forEach(([variable, value]) => {
        const regex = new RegExp(`var\\(${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
        svgString = svgString.replace(regex, value);
    });
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 1280, 720);
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'thumbnail.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    };
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.src = url;
}

// Font size adjustment
let currentFontSizeOffset = 0;
const maxFontSizeOffset = 20;
const minFontSizeOffset = -20;

function adjustFontSize(delta) {
    currentFontSizeOffset = Math.max(minFontSizeOffset, Math.min(maxFontSizeOffset, currentFontSizeOffset + delta));
    fontSizeSlider.value = currentFontSizeOffset;
    updateFontSizeDisplay();
    update(); // Instant update
}

function setFontSizeOffset(value) {
    currentFontSizeOffset = parseInt(value);
    updateFontSizeDisplay();
}

function updateFontSizeDisplay() {
    fontSizeValue.textContent = currentFontSizeOffset > 0 ? `+${currentFontSizeOffset}` : currentFontSizeOffset;
}

// Toggle guides
function toggleGuides() {
    const guides = document.getElementById('guides');
    guides.classList.toggle('visible');
}

// Event listeners with instant updates
[titleInput, subtitleInput, tagInput, brandInput].forEach(input => {
    input.addEventListener('input', () => {
        update(); // Instant update
    });
});

layoutSelect.addEventListener('change', (e) => {
    currentLayout = e.target.value;
    update(); // Instant update
});

fontSizeSlider.addEventListener('input', (e) => {
    setFontSizeOffset(e.target.value);
    update(); // Instant update
});

fontSizeSlider.addEventListener('change', (e) => {
    setFontSizeOffset(e.target.value);
    update(); // Instant update
});

Object.values(colorInputs).forEach(input => {
    input.addEventListener('input', () => {
        update(); // Instant update
    });
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        let colors;
        
        if (preset === 'random') {
            const presetNames = Object.keys(palettes);
            const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
            colors = palettes[randomPreset];
        } else {
            colors = palettes[preset];
        }
        
        if (colors) {
            const colorKeys = ['bg0', 'bg1', 'primary', 'accent', 'pill', 'tagText'];
            colors.forEach((color, index) => {
                colorInputs[colorKeys[index]].value = color;
            });
            update(); // Instant update
        }
    });
});

document.getElementById('exportSvg').addEventListener('click', exportSVG);
document.getElementById('exportPng').addEventListener('click', exportPNG);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        // Only allow Ctrl/Cmd+S when in input fields
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            exportPNG();
        }
        return;
    }
    
    switch(e.key.toLowerCase()) {
        case 'e':
            e.preventDefault();
            exportSVG();
            break;
        case '[':
            e.preventDefault();
            adjustFontSize(-2);
            break;
        case ']':
            e.preventDefault();
            adjustFontSize(2);
            break;
        case 'g':
            e.preventDefault();
            toggleGuides();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            e.preventDefault();
            const presetNames = ['cool', 'indigo', 'cyan', 'teal', 'rose', 'amber'];
            const presetIndex = parseInt(e.key) - 1;
            if (presetIndex < presetNames.length) {
                const colors = palettes[presetNames[presetIndex]];
                const colorKeys = ['bg0', 'bg1', 'primary', 'accent', 'pill', 'tagText'];
                colors.forEach((color, index) => {
                    colorInputs[colorKeys[index]].value = color;
                });
                update(); // Instant update
            }
            break;
        case 's':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                exportPNG();
            }
            break;
    }
});

// Initialize
updateFontSizeDisplay();

// Debug: Check if slider elements exist
console.log('Font size slider:', fontSizeSlider);
console.log('Font size value:', fontSizeValue);

update();