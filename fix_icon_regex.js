const fs = require('fs');
const file = 'public/chairperson.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<div class="company-sector">[^<]+ \$\{c\.city\}/, '<div class="company-sector">🏢 ${c.city}');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed building icon permanently!');
