const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');
const lines = coeDetail.split('\n');

console.log('--- Lines 3480 to 3655 ---');
console.log(lines.slice(3480, 3655).map((l, i) => (i + 3481) + ': ' + l).join('\n'));
