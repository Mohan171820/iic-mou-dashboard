const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const js = fs.readFileSync(path.join(srmIicDir, 'script.js'), 'utf8');

console.log('--- JS particles & initialization check ---');
const particlesIdx = js.indexOf('hero-particles');
if (particlesIdx !== -1) {
  console.log(js.substring(particlesIdx - 50, particlesIdx + 500));
}
