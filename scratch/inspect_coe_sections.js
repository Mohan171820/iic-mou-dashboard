const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const matches = coeDetail.match(/<!-- =+ SECTION [^=]+ =+ -->/gi) || [];
console.log('Sections in coe-detail.html:');
matches.forEach(m => console.log(m));

const galIdx = coeDetail.indexOf('coe-gallery');
console.log('Index of coe-gallery:', galIdx);
if (galIdx !== -1) {
  console.log(coeDetail.substring(galIdx - 100, galIdx + 400));
}

// Check hero emblem image
const heroIconIdx = coeDetail.indexOf('coe-hero-icon');
if (heroIconIdx !== -1) {
  console.log('Hero icon HTML:\n', coeDetail.substring(heroIconIdx - 60, heroIconIdx + 150));
}

// Check engagement images slot
const engSlot = coeDetail.indexOf('engagement-img-slot');
if (engSlot !== -1) {
  console.log('Engagement img slot:\n', coeDetail.substring(engSlot - 60, engSlot + 200));
}
