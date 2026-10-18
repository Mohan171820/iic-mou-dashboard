const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

function printSectionHtml(id) {
  const start = coeDetail.indexOf(`id="${id}"`);
  if (start === -1) {
    console.log(`Section id="${id}" NOT FOUND!`);
    return;
  }
  const end = coeDetail.indexOf('</section>', start);
  console.log(`=== HTML for id="${id}" ===`);
  console.log(coeDetail.substring(start, end !== -1 ? end + 10 : start + 1500));
}

printSectionHtml('focus-section');
printSectionHtml('leadership-section');

// Also print the partners strip and closing CTA
const pStripIdx = coeDetail.indexOf('partners-logo-strip');
if (pStripIdx !== -1) {
  console.log('=== HTML for partners-logo-strip ===');
  console.log(coeDetail.substring(pStripIdx - 100, pStripIdx + 600));
}

const ctaIdx = coeDetail.indexOf('closing-cta-banner');
if (ctaIdx !== -1) {
  console.log('=== HTML for closing-cta-banner ===');
  console.log(coeDetail.substring(ctaIdx - 100, ctaIdx + 800));
}

const modalIdx = coeDetail.indexOf('visitModalBackdrop');
if (modalIdx !== -1) {
  console.log('=== HTML for visitModalBackdrop ===');
  console.log(coeDetail.substring(modalIdx - 100, modalIdx + 1200));
}
