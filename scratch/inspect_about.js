const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const html = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');

const aboutStart = html.indexOf('id="about"');
console.log('--- About Section in index.html ---');
console.log(html.substring(aboutStart, aboutStart + 1500));

const aboutCssIdx = css.indexOf('.about-');
console.log('--- About CSS in style.css ---');
console.log(css.substring(aboutCssIdx, aboutCssIdx + 1000));
