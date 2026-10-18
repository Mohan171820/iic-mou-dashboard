const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const origHtml = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');

const partnersMatch = origHtml.match(/(<!-- ===== PARTNERS MARQUEE =====[\s\S]*?<\/section>)/);
if (partnersMatch) {
  const p = partnersMatch[1];
  console.log('Partners snippet length:', p.length);
  const openDivs = (p.match(/<div\b/g) || []).length;
  const closeDivs = (p.match(/<\/div>/g) || []).length;
  const openSections = (p.match(/<section\b/g) || []).length;
  const closeSections = (p.match(/<\/section>/g) || []).length;
  console.log(`Divs: ${openDivs}/${closeDivs}, Sections: ${openSections}/${closeSections}`);
} else {
  console.log('No partners match!');
}
