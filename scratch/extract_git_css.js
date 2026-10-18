const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = path.resolve(__dirname, '../../srm iic');
const gitHtml = execSync(`git -C "${repoPath}" show HEAD:coe-detail.html`, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });

console.log('git HEAD coe-detail.html size:', gitHtml.length);
const styleMatch = gitHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  const css = styleMatch[1];
  console.log('git CSS length:', css.length);
  console.log('git has .leadership-dual-grid:', css.includes('.leadership-dual-grid'));
  console.log('git has .research-ip-tile:', css.includes('.research-ip-tile'));
  console.log('git has .visit-modal:', css.includes('.visit-modal'));
  console.log('git has .partners-logo-strip:', css.includes('.partners-logo-strip'));
  console.log('git has .focus-area-card:', css.includes('.focus-area-card'));

  // Save the full git CSS to a file for comparison
  fs.writeFileSync(path.resolve(__dirname, 'git_coe_css.css'), css, 'utf8');
  console.log('Saved git_coe_css.css');
}
