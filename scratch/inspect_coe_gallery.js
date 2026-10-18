const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const galStart = coeDetail.indexOf('id="gallery-section"');
console.log('--- gallery-section in coe-detail.html ---');
console.log(coeDetail.substring(galStart, galStart + 800));

const heroStart = coeDetail.indexOf('<section class="coe-hero">');
const heroEnd = coeDetail.indexOf('</section>', heroStart);
console.log('--- coe-hero in coe-detail.html ---');
console.log(coeDetail.substring(heroStart, heroEnd + 10));

const subnavStart = coeDetail.indexOf('id="stickySubnav"');
const subnavEnd = coeDetail.indexOf('</nav>', subnavStart);
console.log('--- stickySubnav in coe-detail.html ---');
console.log(coeDetail.substring(subnavStart, subnavEnd + 6));
