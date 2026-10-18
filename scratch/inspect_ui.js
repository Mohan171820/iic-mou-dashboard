const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const html = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');

const heroIndex = html.indexOf('<section class="hero"');
console.log('--- 150 chars before hero ---');
console.log(html.substring(heroIndex - 250, heroIndex));

console.log('--- announcement-bar div tags check ---');
const annStart = html.indexOf('<div class="announcement-bar">');
const annEnd = html.indexOf('<!-- ===== HERO');
const annSnippet = html.substring(annStart, annEnd);
console.log('Announcement snippet:\n' + annSnippet);

const openDivs = (annSnippet.match(/<div\b/g) || []).length;
const closeDivs = (annSnippet.match(/<\/div>/g) || []).length;
console.log(`Open divs: ${openDivs}, Close divs: ${closeDivs}`);

console.log('\n--- CSS around announcement-bar and hero ---');
const annCssIdx = css.indexOf('.announcement-bar {');
if (annCssIdx !== -1) {
  console.log(css.substring(annCssIdx, annCssIdx + 400));
}
const heroCssIdx = css.indexOf('.hero {');
if (heroCssIdx !== -1) {
  console.log(css.substring(heroCssIdx, heroCssIdx + 400));
}
