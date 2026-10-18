const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetailPath = path.join(srmIicDir, 'coe-detail.html');
let html = fs.readFileSync(coeDetailPath, 'utf8');

// 1. Remove Section H: Gallery section from HTML
const gallerySectionRegex = /<!--\s*SECTION H:[\s\S]*?id="gallery-section"[\s\S]*?<\/section>/i;
if (gallerySectionRegex.test(html)) {
  console.log('Found gallery-section, removing it...');
  html = html.replace(gallerySectionRegex, '');
} else {
  // Try matching without comment
  const galAlt = /<section[^>]*id="gallery-section"[\s\S]*?<\/section>/i;
  if (galAlt.test(html)) {
    console.log('Found gallery-section (alt), removing it...');
    html = html.replace(galAlt, '');
  } else {
    console.log('gallery-section not found in HTML');
  }
}

// 2. Remove Gallery link from sticky subnav
const subnavGalleryRegex = /<a href="#gallery-section" class="subnav-link">[\s\S]*?<\/a>\s*/i;
if (subnavGalleryRegex.test(html)) {
  console.log('Found Gallery subnav link, removing it...');
  html = html.replace(subnavGalleryRegex, '');
} else {
  console.log('Gallery subnav link not found');
}

// 3. Remove Lightbox modal from HTML
const lightboxRegex = /<!--\s*Photo Lightbox Modal[\s\S]*?id="galleryLightbox"[\s\S]*?<\/div>\s*<\/div>/i;
if (lightboxRegex.test(html)) {
  console.log('Found galleryLightbox modal, removing it...');
  html = html.replace(lightboxRegex, '');
} else {
  const lbAlt = /<div class="lightbox-modal" id="galleryLightbox"[\s\S]*?<\/div>\s*<\/div>/i;
  if (lbAlt.test(html)) {
    console.log('Found galleryLightbox modal (alt), removing it...');
    html = html.replace(lbAlt, '');
  } else {
    console.log('galleryLightbox modal not found');
  }
}

// 4. Update Hero Emblem in HTML: replace <img> with #coe-hero-vector-tile
const oldHeroIconRegex = /<div class="coe-hero-glass-tile">\s*<img[^>]*id="coe-hero-icon"[^>]*>\s*<\/div>/i;
const newHeroTile = `<div class="coe-hero-glass-tile" id="coe-hero-icon-container">
          <!-- Dynamically populated with crisp CoE vector SVG icon -->
        </div>`;
if (oldHeroIconRegex.test(html)) {
  console.log('Found coe-hero-icon img, replacing with vector tile...');
  html = html.replace(oldHeroIconRegex, newHeroTile);
} else {
  console.log('coe-hero-glass-tile img not matched');
}

// 5. Update CSS for engagement cards and hero glass tile
const oldEngCardCss = /\.engagement-img-slot \{[\s\S]*?\.engagement-badge-overlay \{[\s\S]*?\}\s*\}/;
const newEngCardCss = `/* Engagement Card Modern Styling (No Images) */
    .engagement-item-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 28px 24px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }

    .engagement-item-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--gold-300, #FCD34D);
    }

    .engagement-card-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 4px;
    }

    .engagement-card-icon-sq {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--blue-50);
      color: var(--blue-600);
      border: 1px solid var(--blue-100);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .engagement-card-type-badge {
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--navy-800);
      background: var(--cream-100);
      border: 1px solid var(--border-light);
      padding: 4px 10px;
      border-radius: var(--radius-full, 9999px);
    }

    .engagement-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--navy-900);
      margin-top: 12px;
      margin-bottom: 8px;
    }

    .engagement-card-desc {
      font-size: 0.9rem;
      color: var(--ink-600);
      line-height: 1.55;
      margin: 0;
    }

    .engagement-learn-more {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--blue-600);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      transition: gap 0.2s ease, color 0.2s ease;
    }

    .engagement-learn-more:hover {
      color: var(--navy-900);
      gap: 10px;
    }`;

if (oldEngCardCss.test(html)) {
  console.log('Replacing engagement card CSS...');
  html = html.replace(oldEngCardCss, newEngCardCss);
}

// Update .coe-hero-glass-tile CSS to style vector icon
html = html.replace(
  /\.coe-hero-glass-tile img \{[\s\S]*?\}/,
  `.coe-hero-glass-tile svg {
      width: 68px;
      height: 68px;
      stroke: var(--gold-500);
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 4px 14px rgba(245, 197, 24, 0.4));
    }`
);

// 6. Define vector SVG icons for all 6 CoEs in JS
const coeVectorIcons = {
  ai: `<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 3.5 2.2 6.5 5.3 7.6V20a2 2 0 0 0 2 2h1.4a2 2 0 0 0 2-2v-2.4c3.1-1.1 5.3-4.1 5.3-7.6a8 8 0 0 0-8-8z"/><path d="M10 10h4"/><path d="M12 8v4"/></svg>`,
  edge: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>`,
  cybersecurity: `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  automation: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  nichiin: `<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>`,
  structural: `<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
};

// 7. Update JS render function for Hero icon & Engagement cards & Gallery
html = html.replace(
  "document.getElementById('coe-hero-icon').src = data.icon;",
  `const iconTile = document.getElementById('coe-hero-icon-container');
      const coeVectors = ${JSON.stringify(coeVectorIcons)};
      if (iconTile) {
        iconTile.innerHTML = coeVectors[coeId] || coeVectors.ai;
      }`
);

// Update Engagement rendering in JS
const oldRenderEngRegex = /\/\/ 7\. Render Engagement Cards with SVG Icons & 16:10 Photo Slot[\s\S]*?engagementContainer\.innerHTML = data\.engagement\.map[\s\S]*?`\s*\)\.join\(''\);\s*\}/;
const newRenderEng = `// 7. Render Engagement Cards with SVG Icons & Type Badges (No Images)
      const engagementContainer = document.getElementById('coe-engagement-grid');
      if (engagementContainer && data.engagement) {
        engagementContainer.innerHTML = data.engagement.map(item => \`
          <div class="engagement-item-card">
            <div>
              <div class="engagement-card-top-bar">
                <div class="engagement-card-icon-sq">
                  <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="\${item.iconPath || 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z'}"/></svg>
                </div>
                <span class="engagement-card-type-badge">\${item.badge}</span>
              </div>
              <div class="engagement-card-title">\${item.title}</div>
              <p class="engagement-card-desc">\${item.desc}</p>
            </div>
            <a href="javascript:void(0)" class="engagement-learn-more" onclick="openVisitModal()">
              <span>Request details</span>
              <svg class="svg-icon-sm" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        \`).join('');
      }`;

if (oldRenderEngRegex.test(html)) {
  console.log('Replacing engagement cards rendering in JS...');
  html = html.replace(oldRenderEngRegex, newRenderEng);
}

// 8. Neutralize or bypass renderGallery in JS
const oldGalleryRenderRegex = /\/\/ 8\. Render Gallery with Captions Below & Lightbox trigger[\s\S]*?galleryContainer\.innerHTML = currentGalleryPhotos\.map[\s\S]*?`\s*\)\.join\(''\);\s*\}/;
if (oldGalleryRenderRegex.test(html)) {
  console.log('Removing gallery rendering from JS...');
  html = html.replace(oldGalleryRenderRegex, '// Gallery section removed as requested');
}

fs.writeFileSync(coeDetailPath, html, 'utf8');
console.log('Updated coe-detail.html successfully!');
