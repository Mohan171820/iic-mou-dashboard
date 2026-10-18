const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

const styleContent = coeDetail.match(/<style[^>]*>([\s\S]*?)<\/style>/i)[1];

// Extract all class names from HTML body
const bodyContent = coeDetail.substring(coeDetail.indexOf('<body'));
const classRegex = /class="([^"]+)"/g;
let match;
const allClasses = new Set();
while ((match = classRegex.exec(bodyContent)) !== null) {
  match[1].split(/\s+/).forEach(cls => {
    if (cls.trim()) allClasses.add(cls.trim());
  });
}

console.log('Total unique classes in HTML body:', allClasses.size);

const unstyledClasses = [];
allClasses.forEach(cls => {
  // Check if .cls appears in styleContent or in style.css
  const inInlineCss = new RegExp('\\.' + cls.replace(/-/g, '\\-') + '\\b').test(styleContent);
  if (!inInlineCss) {
    unstyledClasses.push(cls);
  }
});

console.log('Classes with NO rule in <style> (' + unstyledClasses.length + '):');
unstyledClasses.forEach(c => console.log(' - ' + c));
