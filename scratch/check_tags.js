const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const html = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');

// Simple tag stack checker
const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?>/g;
let match;
const stack = [];
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype']);

let lineNum = 1;
let lastIndex = 0;

while ((match = tagRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const tagName = match[1].toLowerCase();
  
  // Count lines
  const upToMatch = html.substring(lastIndex, match.index);
  lineNum += (upToMatch.match(/\n/g) || []).length;
  lastIndex = match.index;

  if (fullTag.startsWith('<!--') || tagName.startsWith('!')) continue;
  if (voidTags.has(tagName)) continue;
  if (fullTag.endsWith('/>')) continue;

  if (fullTag.startsWith('</')) {
    // Closing tag
    if (stack.length === 0) {
      console.log(`Extra closing tag </${tagName}> at line ~${lineNum}`);
    } else {
      const top = stack.pop();
      if (top.tagName !== tagName) {
        console.log(`Mismatched closing tag </${tagName}> at line ~${lineNum}, expected </${top.tagName}> (opened at line ~${top.line})`);
      }
    }
  } else {
    // Opening tag
    stack.push({ tagName, line: lineNum, fullTag: fullTag.substring(0, 40) });
  }
}

console.log('Unclosed tags remaining on stack:');
stack.forEach(s => console.log(`  <${s.tagName}> at line ~${s.line}: ${s.fullTag}`));
