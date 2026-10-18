const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const css = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');

function showCssBlock(name) {
  const idx = css.indexOf(name);
  if (idx !== -1) {
    console.log(`=== ${name} ===`);
    console.log(css.substring(idx, idx + 500));
  } else {
    console.log(`=== ${name} NOT FOUND ===`);
  }
}

showCssBlock('.navbar {');
showCssBlock('.announcement-bar {');
showCssBlock('.hero {');
showCssBlock('.proof-strip-section {');
showCssBlock('.proof-strip-card {');
