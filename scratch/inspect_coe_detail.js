const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');
const lines = coeDetail.split('\n');

console.log('--- Lines 1300 to 1380 of coe-detail.html ---');
console.log(lines.slice(1299, 1370).map((l, i) => (i + 1300) + ': ' + l).join('\n'));

console.log('\n--- Searching for gallery / photos / images in coe-detail.html ---');
lines.forEach((l, i) => {
  if (/<img\b|gallery|photos|image|img/i.test(l) && !l.includes('nav-logo-img')) {
    console.log(`Line ${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
