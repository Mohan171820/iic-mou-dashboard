const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const matches = coeDetail.match(/[^\n]*\.(jpe?g|png)[^\n]*/gi) || [];
console.log('Lines containing .jpg/.png in coe-detail.html:');
matches.forEach((m, idx) => console.log(idx + ': ' + m.trim()));
