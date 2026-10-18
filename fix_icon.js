const fs = require('fs');
const file = 'public/chairperson.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the specific broken encoding
content = content.replace(/Ã°Å¸Â â„¢Ã¯Â¸Â /g, '🏢');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed building icon!');
