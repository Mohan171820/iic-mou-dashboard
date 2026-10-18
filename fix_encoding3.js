const fs = require('fs');
let lines = fs.readFileSync('public/chairperson.html', 'utf8');
lines = lines.split('Ã°Å¸Â â„¢Ã¯Â¸Â ').join('🏢').split('Ã‚Â·').join('·');
fs.writeFileSync('public/chairperson.html', lines, 'utf8');
console.log('Cleaned up more encodings');
