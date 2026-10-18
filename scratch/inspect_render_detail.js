const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');
const lines = coeDetail.split('\n');

const renderDetailIdx = coeDetail.indexOf('function renderDetail');
const lineStart = coeDetail.substring(0, renderDetailIdx).split('\n').length;

console.log('--- renderDetail from line ' + lineStart + ' ---');
console.log(lines.slice(lineStart - 1, lineStart + 120).map((l, i) => (i + lineStart) + ': ' + l).join('\n'));
