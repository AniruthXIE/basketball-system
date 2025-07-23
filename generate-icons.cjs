// Script to generate PWA icons
// Run this with: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for PWA
const createBasketballIcon = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <radialGradient id="basketballGradient" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="50%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#d97706"/>
    </radialGradient>
  </defs>
  
  <!-- Basketball circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#basketballGradient)" stroke="#92400e" stroke-width="2"/>
  
  <!-- Basketball lines -->
  <path d="M ${size * 0.1} ${size/2} Q ${size/2} ${size * 0.3} ${size * 0.9} ${size/2} Q ${size/2} ${size * 0.7} ${size * 0.1} ${size/2}" 
        fill="none" stroke="#92400e" stroke-width="3"/>
  <path d="M ${size/2} ${size * 0.1} Q ${size * 0.7} ${size/2} ${size/2} ${size * 0.9} Q ${size * 0.3} ${size/2} ${size/2} ${size * 0.1}" 
        fill="none" stroke="#92400e" stroke-width="3"/>
  
  <!-- Highlight -->
  <ellipse cx="${size * 0.35}" cy="${size * 0.35}" rx="${size * 0.15}" ry="${size * 0.1}" fill="#fde047" opacity="0.6"/>
</svg>`;
};

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons directory structure
const iconsDir = path.join(__dirname, 'public', 'icons');

console.log('🎨 Generating PWA icons...');

// Create icons for each size
iconSizes.forEach(size => {
  const svgContent = createBasketballIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Created ${filename}`);
});

// Create shortcut icons
const shortcuts = [
  { name: 'shortcut-game.svg', icon: '🏀', bg: '#10b981' },
  { name: 'shortcut-stats.svg', icon: '📊', bg: '#3b82f6' },
  { name: 'shortcut-trophy.svg', icon: '🏆', bg: '#f59e0b' }
];

shortcuts.forEach(shortcut => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
    <rect width="96" height="96" rx="20" fill="${shortcut.bg}"/>
    <text x="48" y="65" font-size="40" text-anchor="middle" fill="white">${shortcut.icon}</text>
  </svg>`;
  
  const filepath = path.join(iconsDir, shortcut.name);
  fs.writeFileSync(filepath, svgContent);
  console.log(`📱 Created ${shortcut.name}`);
});

// Create README for icons
const readmeContent = `# PWA Icons

This directory contains all the icons needed for the Basketball Queue PWA.

## Generated Icons:
${iconSizes.map(size => `- icon-${size}x${size}.svg (${size}x${size}px)`).join('\n')}

## Shortcut Icons:
- shortcut-game.svg (Start new game)
- shortcut-stats.svg (View statistics) 
- shortcut-trophy.svg (Tournament mode)

## To regenerate icons:
Run: \`node generate-icons.js\`

## Converting to PNG (optional):
You can use online converters or tools like ImageMagick to convert SVG to PNG if needed.
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent);
console.log('📋 Created README.md');

console.log('\n🎉 PWA icons generated successfully!');
console.log(`📁 Icons saved to: ${iconsDir}`);
console.log('\n💡 Note: SVG icons work great for PWAs, but you can convert to PNG if needed.');