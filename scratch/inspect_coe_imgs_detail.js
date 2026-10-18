const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

// Find all occurrences of <img>
const imgRegex = /<img[^>]+>/g;
let match;
while ((match = imgRegex.exec(coeDetail)) !== null) {
  console.log('Static img tag:', match[0]);
}

// Find all template literal <img> tags in JS
const jsImgRegex = /<img[^>]+>/g;
const scriptStart = coeDetail.indexOf('<script>');
if (scriptStart !== -1) {
  const scriptContent = coeDetail.substring(scriptStart);
  let jsMatch;
  while ((jsMatch = jsImgRegex.exec(scriptContent)) !== null) {
    console.log('Dynamic img tag in JS:', jsMatch[0]);
  }
}

// Check subnav links
const subnavStart = coeDetail.indexOf('<nav class="coe-subnav"');
const subnavEnd = coeDetail.indexOf('</nav>', subnavStart);
console.log('Subnav HTML:\n', coeDetail.substring(subnavStart, subnavEnd + 6));
