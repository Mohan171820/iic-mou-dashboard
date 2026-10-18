const fs = require('fs');
let text = fs.readFileSync('public/chairperson.html', 'utf8');

const replacements = {
  'â€”': '—',
  'Ã°Å¸Å’Â ': '📍',
  'ðŸ ¢': '🏢',
  'ðŸŽ“': '🎓',
  'ðŸ’¼': '💼',
  'ðŸ“ˆ': '📈',
  'âš™ï¸ ': '⚙️',
  'ðŸ“„': '📄',
  'ðŸ“Š': '📊',
  'â†’': '→',
  'âœ“': '✓',
  'ðŸ“…': '📅',
  'ðŸŒ ': '📍',
  'âœ…': '✅',
  'â Œ': '❌'
};

for (const [bad, good] of Object.entries(replacements)) {
  text = text.split(bad).join(good);
}

fs.writeFileSync('public/chairperson.html', text, 'utf8');
console.log('Fixed');
