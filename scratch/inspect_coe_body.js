const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

// Find all HTML sections in body
const bodyStart = coeDetail.indexOf('<body');
const bodyContent = coeDetail.substring(bodyStart);

// Print all sections in body
const sections = bodyContent.match(/<(section|nav|div\s+class="[^"]*modal)[^>]*>/g) || [];
console.log('Main structural tags in body:');
sections.forEach(s => console.log(s));
