// State
let currentLayout = 'b';

// Palettes
const palettes = {
    cool: ['#0f172a', '#38bdf8', '#e0f2fe', '#38bdf8', '#06b6d4', '#ffffff'],
    indigo: ['#1e1b4b', '#6366f1', '#e0e7ff', '#6366f1', '#8b5cf6', '#ffffff'],
    cyan: ['#164e63', '#67e8f9', '#cffafe', '#06b6d4', '#0891b2', '#ffffff'],
    teal: ['#134e4a', '#5eead4', '#f0fdfa', '#14b8a6', '#0d9488', '#ffffff'],
    rose: ['#4c1d24', '#fb7185', '#fff1f2', '#f43f5e', '#e11d48', '#ffffff'],
    amber: ['#451a03', '#fbbf24', '#fffbeb', '#f59e0b', '#d97706', '#1f2937'],
    purple: ['#2d1b69', '#a855f7', '#faf5ff', '#a855f7', '#9333ea', '#ffffff'],
    sunset: ['#431407', '#fb923c', '#fff7ed', '#f97316', '#ea580c', '#ffffff'],
    emerald: ['#064e3b', '#6ee7b7', '#ecfdf5', '#10b981', '#059669', '#ffffff'],
    crimson: ['#450a0a', '#f87171', '#fef2f2', '#dc2626', '#b91c1c', '#ffffff'],
    ocean: ['#0c4a6e', '#7dd3fc', '#f0f9ff', '#0284c7', '#0369a1', '#ffffff'],
    forest: ['#14532d', '#86efac', '#f0fdf4', '#16a34a', '#15803d', '#ffffff'],
    neon: ['#0a0a0a', '#00ff88', '#00ff88', '#ff0080', '#00ddff', '#000000'],
    gold: ['#451a03', '#fcd34d', '#1f2937', '#eab308', '#ca8a04', '#1f2937'],
    midnight: ['#0f0f23', '#818cf8', '#e2e8f0', '#4f46e5', '#3730a3', '#ffffff'],
    volcano: ['#7c2d12', '#fb923c', '#fef2f2', '#f97316', '#dc2626', '#ffffff'],
    // High-contrast and emotional trigger presets
    urgent: ['#000000', '#ff4444', '#ffdddd', '#ff0000', '#ff4444', '#ffffff'],
    shock: ['#ffffff', '#000000', '#000000', '#ff0080', '#ff0040', '#ffffff'],
    warning: ['#1a1a00', '#ffff00', '#000000', '#ffff00', '#ffcc00', '#000000'],
    success: ['#003300', '#00ff00', '#000000', '#00ff00', '#00cc00', '#000000'],
    viral: ['#ff00ff', '#00ffff', '#ffffff', '#00ffff', '#0099ff', '#000000'],
    mystery: ['#0a0a0a', '#8000ff', '#f3e8ff', '#8000ff', '#6600cc', '#ffffff']
};

// Elements
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const tagInput = document.getElementById('tagInput');
const brandInput = document.getElementById('brandInput');
const layoutSelect = document.getElementById('layoutSelect');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const textRotationSlider = document.getElementById('textRotationSlider');
const textRotationValue = document.getElementById('textRotationValue');

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

// Background image elements
const backgroundUpload = document.getElementById('backgroundUpload');
const removeBackground = document.getElementById('removeBackground');
const backgroundOpacity = document.getElementById('backgroundOpacity');
const backgroundOpacityValue = document.getElementById('backgroundOpacityValue');
const enableTextBands = document.getElementById('enableTextBands');
const showMobilePreview = document.getElementById('showMobilePreview');

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
    
    // Measure text - for longer text, use smaller font size
    const maxWidth = 300; // Maximum pill width to avoid overlapping content
    let fontSize = 18;
    let fontWeight = '600';
    
    // Dynamically adjust font size for long text
    let textWidth = getTextWidth(tag, fontSize, fontWeight);
    if (textWidth > maxWidth - 32) { // Account for padding
        fontSize = 16;
        textWidth = getTextWidth(tag, fontSize, fontWeight);
        if (textWidth > maxWidth - 32) {
            fontSize = 14;
            textWidth = getTextWidth(tag, fontSize, fontWeight);
        }
    }
    
    const pillWidth = Math.min(textWidth + 32, maxWidth); // 16px padding on each side
    const pillHeight = 40;
    const pillX = 1160 - pillWidth; // Right-align to safe area
    const pillY = 40;
    
    // Update pill
    pillEl.setAttribute('x', pillX);
    pillEl.setAttribute('width', pillWidth);
    
    // Update text font size
    tagEl.setAttribute('font-size', fontSize);
    
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
        updateTextVisibility();
        updateTextRotation();
        updateMobilePreview();
    }

    // Text rotation function
    function updateTextRotation() {
        const rotation = textRotationSlider.value;
        
        ['a', 'b', 'c', 'd'].forEach(layout => {
            const titleElement = document.getElementById(`title-${layout}`);
            const subtitleElement = document.getElementById(`subtitle-${layout}`);
            
            if (rotation == 0) {
                // Remove rotation when angle is 0
                titleElement.removeAttribute('transform');
                if (subtitleElement) {
                    subtitleElement.removeAttribute('transform');
                }
            } else {
                // Get current position for rotation center
                const titleX = titleElement.getAttribute('x') || 0;
                const titleY = titleElement.getAttribute('y') || 0;
                
                // Apply rotation around text center
                titleElement.setAttribute('transform', `rotate(${rotation} ${titleX} ${titleY})`);
                
                if (subtitleElement) {
                    const subtitleX = subtitleElement.getAttribute('x') || 0;
                    const subtitleY = subtitleElement.getAttribute('y') || 0;
                    subtitleElement.setAttribute('transform', `rotate(${rotation} ${subtitleX} ${subtitleY})`);
                }
            }
        });
        
        // Update the rotation value display
        textRotationValue.textContent = rotation;
    }

    // Mobile preview sync function
    function updateMobilePreview() {
        if (showMobilePreview.checked) {
            const mainSvg = document.getElementById('thumb');
            const mobileSvg = document.getElementById('thumbMobile');
            
            // Clone the main SVG content to mobile SVG
            mobileSvg.innerHTML = mainSvg.innerHTML;
        }
    }

    // Toggle mobile preview visibility
    function toggleMobilePreview() {
        const mobileWrapper = document.querySelector('.mobile-preview');
        const mobileLabel = document.querySelector('.mobile-label');
        const desktopLabel = document.querySelector('.desktop-label');
        const canvasContainer = document.querySelector('.canvas-container');
        
        if (showMobilePreview.checked) {
            mobileWrapper.style.display = 'block';
            mobileLabel.style.display = 'inline';
            desktopLabel.textContent = 'Desktop Preview';
            canvasContainer.classList.add('mobile-preview-active');
            updateMobilePreview();
        } else {
            mobileWrapper.style.display = 'none';
            mobileLabel.style.display = 'none';
            desktopLabel.textContent = 'Desktop Preview';
            canvasContainer.classList.remove('mobile-preview-active');
        }
    }
    
    // Export functions
    function exportSVG() {
        // Ensure everything is up to date before export
        update();
        
        const svg = document.getElementById('thumb');
        const svgClone = svg.cloneNode(true);
        
        // Apply current CSS variables
        const root = document.documentElement;
        const cssVars = {
            '--bg0': root.style.getPropertyValue('--bg0') || colorInputs.bg0.value,
            '--bg1': root.style.getPropertyValue('--bg1') || colorInputs.bg1.value,
            '--primary': root.style.getPropertyValue('--primary') || colorInputs.primary.value,
            '--accent': root.style.getPropertyValue('--accent') || colorInputs.accent.value,
            '--pill': root.style.getPropertyValue('--pill') || colorInputs.pill.value,
            '--tagText': root.style.getPropertyValue('--tagText') || colorInputs.tagText.value
        };
        
        // Handle background image properly in the cloned SVG
        const originalBgImage = svg.querySelector('#backgroundImage');
        const clonedBgImage = svgClone.querySelector('#backgroundImage');
        if (originalBgImage && clonedBgImage && originalBgImage.getAttribute('href')) {
            clonedBgImage.setAttribute('href', originalBgImage.getAttribute('href'));
            clonedBgImage.style.display = originalBgImage.style.display;
            clonedBgImage.style.opacity = originalBgImage.style.opacity;
        }
        
        // Create style element
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        const cssVarString = Object.entries(cssVars)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
        style.textContent = `:root { ${cssVarString}; }`;
        
        // Insert style into defs
        const defs = svgClone.querySelector('defs');
        if (defs) {
            defs.insertBefore(style, defs.firstChild);
        }
        
        // Serialize and replace CSS variables as fallback
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        Object.entries(cssVars).forEach(([variable, value]) => {
            const regex = new RegExp(`var\\(${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
            svgString = svgString.replace(regex, value);
        });
        
        // Ensure proper namespace
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'thumbnail.svg';
        a.click();
        URL.revokeObjectURL(url);
    }
        
        function exportPNG() {
    // Ensure everything is up to date before export
    update();
    
    const svg = document.getElementById('thumb');
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    // Clone the SVG to avoid modifying the original
    const svgClone = svg.cloneNode(true);
    
    // Apply current CSS variables directly to the cloned SVG
    const root = document.documentElement;
    const cssVars = {
        '--bg0': root.style.getPropertyValue('--bg0') || colorInputs.bg0.value,
        '--bg1': root.style.getPropertyValue('--bg1') || colorInputs.bg1.value,
        '--primary': root.style.getPropertyValue('--primary') || colorInputs.primary.value,
        '--accent': root.style.getPropertyValue('--accent') || colorInputs.accent.value,
        '--pill': root.style.getPropertyValue('--pill') || colorInputs.pill.value,
        '--tagText': root.style.getPropertyValue('--tagText') || colorInputs.tagText.value
    };
    
    // Handle background image properly in the cloned SVG
    const originalBgImage = svg.querySelector('#backgroundImage');
    const clonedBgImage = svgClone.querySelector('#backgroundImage');
    if (originalBgImage && clonedBgImage && originalBgImage.getAttribute('href')) {
        clonedBgImage.setAttribute('href', originalBgImage.getAttribute('href'));
        clonedBgImage.style.display = originalBgImage.style.display;
        clonedBgImage.style.opacity = originalBgImage.style.opacity;
    }
    
    // Create a style element with CSS variables
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
        :root {
            --bg0: ${cssVars['--bg0']};
            --bg1: ${cssVars['--bg1']};
            --primary: ${cssVars['--primary']};
            --accent: ${cssVars['--accent']};
            --pill: ${cssVars['--pill']};
            --tagText: ${cssVars['--tagText']};
        }
    `;
    
    // Insert style at the beginning of defs
    const defs = svgClone.querySelector('defs');
    if (defs) {
        defs.insertBefore(style, defs.firstChild);
    }
    
    // Serialize the modified SVG
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);
    
    // Replace CSS variables with actual values as fallback
    Object.entries(cssVars).forEach(([variable, value]) => {
        const regex = new RegExp(`var\\(${variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
        svgString = svgString.replace(regex, value);
    });
    
    // Ensure proper SVG namespace and encoding
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1280, 720);
        
        // Draw the SVG
        ctx.drawImage(img, 0, 0, 1280, 720);
        
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'thumbnail.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    };
    
    img.onerror = function(error) {
        console.error('Error loading SVG for PNG export:', error);
        alert('Error exporting PNG. Please try again.');
    };
    
    // Create blob and load image
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.src = url;
    
    // Clean up URL after a delay
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
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

function adjustRotation(delta) {
    const currentRotation = parseInt(textRotationSlider.value);
    const newRotation = Math.max(-15, Math.min(15, currentRotation + delta));
    textRotationSlider.value = newRotation;
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
        updateCounter('titleInput', 'titleCounter', 100, 80);
        updateCounter('subtitleInput', 'subtitleCounter', 100, 80);
        updateCounter('tagInput', 'tagCounter', 64, 48);
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
    }
    
    // Background image functions
    function handleBackgroundUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const backgroundImage = document.getElementById('backgroundImage');
                const backgroundOverlay = document.getElementById('backgroundOverlay');
                
                backgroundImage.setAttribute('href', e.target.result);
                backgroundImage.style.display = 'block';
                backgroundOverlay.style.display = 'block';
                
                removeBackground.style.display = 'block';
                updateTextVisibility();
                update();
            };
            reader.readAsDataURL(file);
        }
    }
    
    function removeBackgroundImage() {
        const backgroundImage = document.getElementById('backgroundImage');
        const backgroundOverlay = document.getElementById('backgroundOverlay');
        
        backgroundImage.style.display = 'none';
        backgroundImage.removeAttribute('href');
        backgroundOverlay.style.display = 'none';
        
        removeBackground.style.display = 'none';
        backgroundUpload.value = '';
        updateTextVisibility();
        update();
    }
    
    function updateBackgroundOpacity() {
        const opacity = backgroundOpacity.value / 100;
        const backgroundImage = document.getElementById('backgroundImage');
        const backgroundOverlay = document.getElementById('backgroundOverlay');
        
        backgroundOpacityValue.textContent = backgroundOpacity.value;
        
        if (backgroundImage) {
            backgroundImage.style.opacity = opacity;
        }
        
        // Adjust overlay opacity inversely for better text visibility
        const overlayOpacity = Math.max(0.2, (100 - backgroundOpacity.value) / 200);
        if (backgroundOverlay) {
            backgroundOverlay.setAttribute('fill', `rgba(0,0,0,${overlayOpacity})`);
        }
    }
    
    function updateTextVisibility() {
        const textElements = document.querySelectorAll('text');
        const hasBackground = document.getElementById('backgroundImage').style.display !== 'none';
        
        textElements.forEach(element => {
            // Remove any existing filters and strokes
            element.removeAttribute('filter');
            element.removeAttribute('stroke');
            element.removeAttribute('stroke-width');
        });
        
        updateTextBands();
    }
    
    function updateTextBands() {
        const layouts = ['a', 'b', 'c', 'd'];
        const hasBackground = document.getElementById('backgroundImage').style.display !== 'none';
        const showBands = enableTextBands.checked && hasBackground;
        
        layouts.forEach(layout => {
            // Title bands
            const titleBand = document.getElementById(`titleBand-${layout}`);
            if (titleBand) {
                titleBand.style.display = showBands ? 'block' : 'none';
            }
            
            // Subtitle bands
            const subtitleBand = document.getElementById(`subtitleBand-${layout}`);
            if (subtitleBand) {
                subtitleBand.style.display = showBands ? 'block' : 'none';
            }
            
            // Brand bands
            const brandBand = document.getElementById(`brandBand-${layout}`);
            if (brandBand) {
                brandBand.style.display = showBands ? 'block' : 'none';
            }
        });
        
        // Update band sizes dynamically based on text content
        updateBandSizes();
    }
    
    function updateBandSizes() {
        const layouts = ['a', 'b', 'c', 'd'];
        
        layouts.forEach(layout => {
            // Update title band size
            const titleText = document.getElementById(`title-${layout}`);
            const titleBand = document.getElementById(`titleBand-${layout}`);
            
            if (titleText && titleBand && titleBand.style.display !== 'none') {
                const textWidth = getTextWidth(titleText.textContent, titleText.getAttribute('font-size'), '700');
                const padding = 40;
                
                if (layout === 'b' || layout === 'd') {
                    // Centered layouts
                    const bandWidth = Math.min(textWidth + padding, 1000);
                    const bandX = 580 - bandWidth / 2;
                    titleBand.setAttribute('x', bandX);
                    titleBand.setAttribute('width', bandWidth);
                } else {
                    // Left-aligned layouts
                    const bandWidth = Math.min(textWidth + padding, 800);
                    titleBand.setAttribute('width', bandWidth);
                }
            }
            
            // Update subtitle band size
            const subtitleText = document.getElementById(`subtitle-${layout}`);
            const subtitleBand = document.getElementById(`subtitleBand-${layout}`);
            
            if (subtitleText && subtitleBand && subtitleBand.style.display !== 'none') {
                const textWidth = getTextWidth(subtitleText.textContent, subtitleText.getAttribute('font-size'), 'normal');
                const padding = 30;
                
                if (layout === 'b' || layout === 'd') {
                    // Centered layouts
                    const bandWidth = Math.min(textWidth + padding, 800);
                    const bandX = 580 - bandWidth / 2;
                    subtitleBand.setAttribute('x', bandX);
                    subtitleBand.setAttribute('width', bandWidth);
                } else {
                    // Left-aligned layouts
                    const bandWidth = Math.min(textWidth + padding, 600);
                    subtitleBand.setAttribute('width', bandWidth);
                }
            }
            
            // Update brand band size
            const brandText = document.getElementById(`brand-${layout}`);
            const brandBand = document.getElementById(`brandBand-${layout}`);
            
            if (brandText && brandBand && brandBand.style.display !== 'none') {
                const textWidth = getTextWidth(brandText.textContent, brandText.getAttribute('font-size'), 'normal');
                const padding = 20;
                const bandWidth = Math.min(textWidth + padding, 300);
                
                if (layout === 'b' || layout === 'd') {
                    // Centered layouts
                    const bandX = 580 - bandWidth / 2;
                    brandBand.setAttribute('x', bandX);
                }
                brandBand.setAttribute('width', bandWidth);
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

textRotationSlider.addEventListener('input', (e) => {
    update(); // Instant update
});

textRotationSlider.addEventListener('change', (e) => {
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
        });
        
        // Background image event listeners
        backgroundUpload.addEventListener('change', handleBackgroundUpload);
        removeBackground.addEventListener('click', removeBackgroundImage);
        
        backgroundOpacity.addEventListener('input', () => {
            updateBackgroundOpacity();
        });
        
        enableTextBands.addEventListener('change', () => {
            update(); // Instant update
        });

        showMobilePreview.addEventListener('change', toggleMobilePreview);

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const preset = btn.dataset.preset;
        let colors;
        
        console.log('Preset clicked:', preset); // Debug log
        
        if (preset === 'random') {
            const presetNames = Object.keys(palettes);
            const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
            colors = palettes[randomPreset];
            console.log('Random preset selected:', randomPreset, colors); // Debug log
        } else {
            colors = palettes[preset];
            console.log('Preset colors:', colors); // Debug log
        }
        
        if (colors) {
            const colorKeys = ['bg0', 'bg1', 'primary', 'accent', 'pill', 'tagText'];
            colors.forEach((color, index) => {
                if (colorInputs[colorKeys[index]]) {
                    colorInputs[colorKeys[index]].value = color;
                    console.log(`Set ${colorKeys[index]} to ${color}`); // Debug log
                }
            });
            update(); // Instant update
        } else {
            console.warn('Preset not found:', preset);
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
        case ',':
        case '<':
            e.preventDefault();
            adjustRotation(-1);
            break;
        case '.':
        case '>':
            e.preventDefault();
            adjustRotation(1);
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