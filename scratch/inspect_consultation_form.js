const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const modalIdx = coeDetail.indexOf('id="consultationForm"');
console.log(coeDetail.substring(modalIdx, modalIdx + 1200));
