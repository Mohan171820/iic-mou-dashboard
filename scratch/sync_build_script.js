const fs = require('fs');
const path = require('path');

const buildScript = path.resolve(__dirname, 'build_landing_page.js');
let content = fs.readFileSync(buildScript, 'utf8');

const srmIndex = path.resolve(__dirname, '../../srm iic/index.html');
const srmCss = path.resolve(__dirname, '../../srm iic/style.css');

const html = fs.readFileSync(srmIndex, 'utf8');
const css = fs.readFileSync(srmCss, 'utf8');

const bttHtmlMatch = html.match(/<button id="back-to-top"[\s\S]*?<\/button>/);
if (bttHtmlMatch) {
  content = content.replace(/<button id="back-to-top"[\s\S]*?<\/button>/, bttHtmlMatch[0]);
  console.log('Updated back-to-top HTML in build_landing_page.js');
}

const oldBttCssRegex = /\/\* ===== BACK TO TOP BUTTON ===== \*\/[\s\S]*?#back-to-top\.is-visible \{[^}]*\}[\s\S]*?#back-to-top \.arrow-icon::after \{[^}]*\}/;
const newBttCssMatch = css.match(/\/\* ===== BACK TO TOP BUTTON ===== \*\/[\s\S]*?#back-to-top:hover \.btt-arrow \{[\s\S]*?\}/);
if (newBttCssMatch && oldBttCssRegex.test(content)) {
  content = content.replace(oldBttCssRegex, newBttCssMatch[0]);
  console.log('Updated back-to-top CSS in build_landing_page.js');
}

fs.writeFileSync(buildScript, content, 'utf8');
console.log('Synchronized build_landing_page.js successfully!');
