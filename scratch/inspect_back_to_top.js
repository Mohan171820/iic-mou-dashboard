const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const html = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srmIicDir, 'script.js'), 'utf8');

const bttHtmlIdx = html.indexOf('back-to-top');
if (bttHtmlIdx !== -1) {
  console.log('--- Back to top in HTML ---');
  console.log(html.substring(bttHtmlIdx - 50, bttHtmlIdx + 500));
}

const bttCssIdx = css.indexOf('.back-to-top');
if (bttCssIdx !== -1) {
  console.log('--- Back to top in CSS ---');
  console.log(css.substring(bttCssIdx - 50, bttCssIdx + 900));
}

const bttJsIdx = js.indexOf('back-to-top') !== -1 ? js.indexOf('back-to-top') : js.indexOf('backToTop');
if (bttJsIdx !== -1) {
  console.log('--- Back to top in JS ---');
  console.log(js.substring(bttJsIdx - 50, bttJsIdx + 500));
}
