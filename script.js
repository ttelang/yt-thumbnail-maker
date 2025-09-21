// State
let currentLayout = 'b';

// Palettes
const palettes = {
    cool: ['#0f172a', '#1e293b', '#ffffff', '#38bdf8', '#06b6d4', '#ffffff'],
    indigo: ['#1e1b4b', '#312e81', '#ffffff', '#6366f1', '#8b5cf6', '#ffffff'],
    cyan: ['#164e63', '#155e75', '#ffffff', '#06b6d4', '#0891b2', '#ffffff'],
    teal: ['#134e4a', '#115e59', '#ffffff', '#14b8a6', '#0d9488', '#ffffff'],
    rose: ['#4c1d24', '#881337', '#ffffff', '#f43f5e', '#e11d48', '#ffffff'],
    amber: ['#451a03', '#92400e', '#ffffff', '#f59e0b', '#d97706', '#ffffff'],
    purple: ['#2d1b69', '#4c1d95', '#ffffff', '#a855f7', '#9333ea', '#ffffff'],
    sunset: ['#431407', '#9a3412', '#ffffff', '#f97316', '#ea580c', '#ffffff'],
    emerald: ['#064e3b', '#065f46', '#ffffff', '#10b981', '#059669', '#ffffff'],
    crimson: ['#450a0a', '#7f1d1d', '#ffffff', '#dc2626', '#b91c1c', '#ffffff'],
    ocean: ['#0c4a6e', '#075985', '#ffffff', '#0284c7', '#0369a1', '#ffffff'],
    forest: ['#14532d', '#166534', '#ffffff', '#16a34a', '#15803d', '#ffffff'],
    neon: ['#0a0a0a', '#171717', '#00ff88', '#ff0080', '#00ddff', '#000000'],
    gold: ['#451a03', '#78350f', '#ffffff', '#eab308', '#ca8a04', '#1f2937'],
    midnight: ['#0f0f23', '#1a1a2e', '#e2e8f0', '#4f46e5', '#3730a3', '#ffffff'],
    volcano: ['#7c2d12', '#9a3412', '#ffffff', '#f97316', '#dc2626', '#ffffff'],
    // High-contrast and emotional trigger presets
    urgent: ['#000000', '#1a0000', '#ffffff', '#ff0000', '#ff4444', '#ffffff'],
    shock: ['#ffffff', '#f8f8f8', '#000000', '#ff0080', '#ff0040', '#ffffff'],
    warning: ['#1a1a00', '#333300', '#ffffff', '#ffff00', '#ffcc00', '#000000'],
    success: ['#003300', '#004400', '#ffffff', '#00ff00', '#00cc00', '#000000'],
    viral: ['#ff00ff', '#cc00cc', '#ffffff', '#00ffff', '#0099ff', '#000000'],
    mystery: ['#0a0a0a', '#1a0a1a', '#ffffff', '#8000ff', '#6600cc', '#ffffff']
};

// Elements
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const tagInput = document.getElementById('tagInput');
const brandInput = document.getElementById('brandInput');
const layoutSelect = document.getElementById('layoutSelect');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');

// Visual elements
const visualElementCheckboxes = {
    arrow: document.getElementById('showArrow'),
    star: document.getElementById('showStar'),
    checkmark: document.getElementById('showCheckmark'),
    exclamation: document.getElementById('showExclamation'),
    fire: document.getElementById('showFire'),
    lightning: document.getElementById('showLightning')
};
const elementSizeSlider = document.getElementById('elementSizeSlider');
const elementSizeValue = document.getElementById('elementSizeValue');

// Drama elements
const showDrama = document.getElementById('showDrama');
const showTextShadow = document.getElementById('showTextShadow');

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
    let fontSize;
    if (layout === 'b') fontSize = 80 + currentFontSizeOffset;
    else if (layout === 'd') fontSize = 76 + currentFontSizeOffset;
    else fontSize = 72 + currentFontSizeOffset;
    
    const minFontSize = 24;
    const maxFontSize = 120;
    const maxWidth = layout === 'b' || layout === 'd' ? 920 : 1120;
    
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
            ['a', 'b', 'c', 'd'].forEach(layout => {
                const el = document.getElementById(`layout-${layout}`);
                el.style.display = layout === currentLayout ? 'block' : 'none';
            });
        }// Update content
        function updateContent() {
            const title = titleInput.value;
            const subtitle = subtitleInput.value;
            const brand = brandInput.value;
            
            ['a', 'b', 'c', 'd'].forEach(layout => {
                document.getElementById(`title-${layout}`).textContent = title;
                if (layout !== 'd') {
                    document.getElementById(`subtitle-${layout}`).textContent = subtitle;
                }
                document.getElementById(`brand-${layout}`).textContent = brand;
            });
            
            // Special handling for Layout D subtitle (urgency message)
            if (subtitle.trim()) {
                document.getElementById('subtitle-d').textContent = subtitle.toUpperCase() + ' - DON\'T MISS OUT!';
            } else {
                document.getElementById('subtitle-d').textContent = 'WATCH BEFORE IT\'S TOO LATE!';
            }
        }// Main update function
function update() {
    applyCSSVariables();
    updateContent();
    updateLayoutVisibility();
    
        // Update title sizing and pill for current layout
        autofitTitle(currentLayout);
        updatePill(currentLayout);
        updateVisualElements();
        updateCharacterCounters();
        updateDramaEffects();
    }// Export functions
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
    
    // Character counter functions
    function updateCharacterCounters() {
        updateCounter('titleInput', 'titleCounter', 40, 20);
        updateCounter('subtitleInput', 'subtitleCounter', 60, 40);
        updateCounter('tagInput', 'tagCounter', 12, 8);
    }
    
    function updateCounter(inputId, counterId, maxChars, warningThreshold) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        const length = input.value.length;
        
        counter.textContent = `(${length}/${maxChars})`;
        counter.className = 'char-counter';
        
        if (length >= maxChars) {
            counter.classList.add('danger');
        } else if (length >= warningThreshold) {
            counter.classList.add('warning');
        }
    }
    
    // Visual elements functions
    function updateVisualElements() {
        const elementSize = parseInt(elementSizeSlider.value);
        elementSizeValue.textContent = elementSize;
        
        ['a', 'b', 'c', 'd'].forEach(layout => {
            Object.keys(visualElementCheckboxes).forEach(elementType => {
                const element = document.getElementById(`${elementType}-${layout}`);
                const checkbox = visualElementCheckboxes[elementType];
                
                if (element && checkbox) {
                    element.style.display = checkbox.checked ? 'block' : 'none';
                    
                    // Apply size scaling
                    const baseFontSize = layout === 'b' ? 100 : layout === 'd' ? 120 : layout === 'a' ? 80 : 90;
                    const scaledSize = Math.round(baseFontSize * (elementSize / 100));
                    element.setAttribute('font-size', scaledSize);
                }
            });
        });
    }
    
    // Drama effects functions
    function updateDramaEffects() {
        // Toggle dramatic overlay
        const overlay = document.getElementById('dramaticOverlay');
        if (overlay) {
            overlay.style.display = showDrama.checked ? 'block' : 'none';
        }
        
        // Toggle text shadows
        const titles = document.querySelectorAll('.main-title');
        titles.forEach(title => {
            if (showTextShadow.checked) {
                title.setAttribute('filter', 'url(#textShadow)');
            } else {
                title.removeAttribute('filter');
            }
        });
    }// Toggle guides
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
        
        // Visual elements event listeners
        Object.values(visualElementCheckboxes).forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                update(); // Instant update
            });
        });
        
        elementSizeSlider.addEventListener('input', () => {
            update(); // Instant update
        });
        
        // Drama effects event listeners
        showDrama.addEventListener('change', () => {
            update(); // Instant update
        });
        
        showTextShadow.addEventListener('change', () => {
            update(); // Instant update
        });// Preset buttons
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