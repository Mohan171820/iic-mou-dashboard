const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const indexPath = path.join(srmIicDir, 'index.html');
const cssPath = path.join(srmIicDir, 'style.css');
const jsPath = path.join(srmIicDir, 'script.js');

let html = fs.readFileSync(indexPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Update Back to Top Button HTML
const oldBttHtmlRegex = /<button id="back-to-top"[\s\S]*?<\/button>/;
const newBttHtml = `<button id="back-to-top" aria-label="Back to top">
    <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48">
      <circle class="progress-ring-bg" stroke="rgba(240, 180, 41, 0.22)" stroke-width="2.5" fill="transparent" r="21" cx="24" cy="24" />
      <circle class="progress-ring-circle" stroke="var(--gold-500)" stroke-width="2.5" stroke-linecap="round" fill="transparent" r="21" cx="24" cy="24" />
    </svg>
    <svg class="btt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </button>`;

if (oldBttHtmlRegex.test(html)) {
  html = html.replace(oldBttHtmlRegex, newBttHtml);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Updated back-to-top in index.html');
} else {
  console.log('Could not find back-to-top button in index.html');
}

// 2. Update CSS
const oldBttCssRegex = /\/\* ===== BACK TO TOP BUTTON ===== \*\/[\s\S]*?#back-to-top\.is-visible \{[^}]*\}[\s\S]*?#back-to-top \.arrow-icon::after \{[^}]*\}/;
const newBttCss = `/* ===== BACK TO TOP BUTTON ===== */
#back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(6, 30, 74, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  color: var(--gold-500);
  cursor: pointer;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 6px 20px rgba(2, 7, 19, 0.35);
  padding: 0;
}
#back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
#back-to-top:hover {
  transform: translateY(-4px) scale(1.06);
  background: #020713;
  box-shadow: 0 10px 26px rgba(240, 180, 41, 0.32), 0 4px 14px rgba(2, 7, 19, 0.45);
  color: #FFE58F;
}
#back-to-top .progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  pointer-events: none;
  transform: rotate(-90deg);
}
#back-to-top .progress-ring-circle {
  stroke-dasharray: 131.95;
  stroke-dashoffset: 131.95;
  transition: stroke-dashoffset 0.12s linear;
}
#back-to-top .btt-arrow {
  position: relative;
  z-index: 2;
  transition: transform 0.25s ease;
  display: block;
}
#back-to-top:hover .btt-arrow {
  transform: translateY(-2px);
}`;

if (oldBttCssRegex.test(css)) {
  css = css.replace(oldBttCssRegex, newBttCss);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Updated back-to-top in style.css');
} else {
  console.log('Could not find back-to-top in style.css');
}

// 3. Update script.js to dynamically calculate circle offset
const oldScrollRegex = /function onScroll\(\) \{[\s\S]*?if \(backToTopBtn\) \{[\s\S]*?\}[\s\S]*?\}/;
const newScroll = `function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;

    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    const ringCircle = document.querySelector('.progress-ring-circle');
    if (ringCircle) {
      const circumference = 131.95;
      const offset = circumference - (progress * circumference);
      ringCircle.style.strokeDashoffset = offset;
    }

    if (backToTopBtn) {
      if (scrollTop > 300) backToTopBtn.classList.add('is-visible');
      else backToTopBtn.classList.remove('is-visible');
    }
  }`;

if (oldScrollRegex.test(js)) {
  js = js.replace(oldScrollRegex, newScroll);
  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Updated onScroll in script.js');
} else {
  console.log('Could not find onScroll in script.js');
}

// Also sync to IIC Dashboard/public/landing.html if exists
const pubLanding = path.resolve(__dirname, '../public/landing.html');
if (fs.existsSync(pubLanding)) {
  fs.copyFileSync(indexPath, pubLanding);
  console.log('Synced to public/landing.html');
}
