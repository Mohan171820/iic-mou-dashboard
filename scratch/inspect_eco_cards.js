const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const indexHtml = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');

const ecoIdx = indexHtml.indexOf('id="ecosystem"');
const ecoEnd = indexHtml.indexOf('</section>', ecoIdx);
console.log('--- Ecosystem section in index.html ---');
console.log(indexHtml.substring(ecoIdx, ecoEnd));
