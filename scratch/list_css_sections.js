const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');
const styleMatch = coeDetail.match(/<style[^>]*>([\s\S]*?)<\/style>/i)[1];

// Find all CSS section comments
const comments = styleMatch.match(/\/\*[\s\S]*?\*\//g) || [];
comments.forEach(c => {
  const firstLine = c.trim().split('\n')[0];
  console.log(firstLine.substring(0, 80));
});
