const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const idxLead = coeDetail.indexOf('id="leadership-section"');
console.log('--- Leadership Section (lines ~) ---');
if (idxLead !== -1) {
  console.log(coeDetail.substring(idxLead - 100, idxLead + 2500));
}

const idxIp = coeDetail.indexOf('Research Publications');
console.log('\n--- Research Publications Section ---');
if (idxIp !== -1) {
  console.log(coeDetail.substring(idxIp - 100, idxIp + 1200));
}

const idxModal = coeDetail.indexOf('visitModalBackdrop');
console.log('\n--- Modal Section ---');
if (idxModal !== -1) {
  console.log(coeDetail.substring(idxModal - 100, idxModal + 1500));
}
