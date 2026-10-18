const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const toastIdx = coeDetail.indexOf('id="contact-toast"');
console.log(coeDetail.substring(toastIdx, toastIdx + 400));
