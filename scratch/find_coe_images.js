const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');

console.log('--- Images in coe-detail.html ---');
const coeImgs = coeDetail.match(/<img[^>]+>/gi) || [];
coeImgs.forEach((img, idx) => console.log(idx + ':', img));

console.log('\n--- Images in index.html #ecosystem section ---');
const ecoIdx = indexHtml.indexOf('id="ecosystem"');
if (ecoIdx !== -1) {
  const ecoEnd = indexHtml.indexOf('</section>', ecoIdx);
  const ecoSection = indexHtml.substring(ecoIdx, ecoEnd);
  const ecoImgs = ecoSection.match(/<img[^>]+>/gi) || [];
  ecoImgs.forEach((img, idx) => console.log('Eco ' + idx + ':', img));
}

console.log('\n--- Checking JS dynamic rendering of COE if any ---');
const js = fs.readFileSync(path.join(srmIicDir, 'script.js'), 'utf8');
const coeDataJsPath = path.join(srmIicDir, 'data/iic-content.js');
if (fs.existsSync(coeDataJsPath)) {
  const coeDataJs = fs.readFileSync(coeDataJsPath, 'utf8');
  const imgMatches = coeDataJs.match(/['"][^'"]*\.(jpe?g|png|webp|svg)['"]/gi) || [];
  console.log('Images in iic-content.js:', imgMatches.slice(0, 15));
}
