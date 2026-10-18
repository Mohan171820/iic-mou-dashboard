const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetail = fs.readFileSync(path.join(srmIicDir, 'coe-detail.html'), 'utf8');

// Check remaining <img> tags
const imgMatches = coeDetail.match(/<img[^>]+>/gi) || [];
console.log('Remaining <img> tags in coe-detail.html:');
imgMatches.forEach((m, i) => console.log(i + ': ' + m));

// Validate JS syntax in coe-detail.html
const scriptStart = coeDetail.indexOf('<script>');
const scriptEnd = coeDetail.lastIndexOf('</script>');
if (scriptStart !== -1 && scriptEnd !== -1) {
  const scriptContent = coeDetail.substring(scriptStart + 8, scriptEnd);
  try {
    new Function(scriptContent);
    console.log('JS syntax valid: YES');
  } catch (err) {
    console.error('JS syntax error:', err.message);
  }
}

// Check tag balance
const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>/g;
let match;
const stack = [];
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype']);

while ((match = tagRegex.exec(coeDetail)) !== null) {
  const fullTag = match[0];
  const tagName = match[1].toLowerCase();
  if (fullTag.startsWith('<!--') || tagName.startsWith('!')) continue;
  if (voidTags.has(tagName)) continue;
  if (fullTag.endsWith('/>')) continue;

  if (fullTag.startsWith('</')) {
    if (stack.length > 0) {
      const top = stack.pop();
      if (top !== tagName) {
        // mismatch
      }
    }
  } else {
    stack.push(tagName);
  }
}
console.log('Unclosed tags remaining on stack:', stack.length);
