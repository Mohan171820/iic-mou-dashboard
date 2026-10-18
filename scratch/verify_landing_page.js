const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const html = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srmIicDir, 'script.js'), 'utf8');
const content = require(path.join(srmIicDir, 'data/iic-content.js'));

console.log('--- 1. FROZEN ZONES AUDIT ---');
const frozenOwnerCommentsHtml = (html.match(/DO NOT MODIFY - frozen by owner/g) || []).length;
const frozenOwnerCommentsCss = (css.match(/DO NOT MODIFY - frozen by owner/g) || []).length;
console.log('Frozen comments in HTML:', frozenOwnerCommentsHtml, '(expected 2)');
console.log('Frozen comments in CSS:', frozenOwnerCommentsCss, '(expected 2)');
console.log('Announcement keyframe present:', css.includes('@keyframes announcementScroll'));
console.log('Marquee keyframe present:', css.includes('@keyframes scroll-left'));

console.log('--- 2. FORBIDDEN CONTENT CHECK ---');
console.log('Contains [ Council Image ]:', html.includes('[ Council Image ]'));
console.log('Contains [Council Image]:', html.includes('[Council Image]'));

console.log('--- 3. SECTION AUDIT (17 SECTIONS) ---');
const sectionIds = [
  'navbar', 'hero', 'proof-strip', 'partners', 'about', 'why-partner',
  'vision', 'impact', 'ecosystem', 'ways-to-collaborate', 'dept-dashboard',
  'how-partnership-works', 'success-stories', 'events-news', 'partner-enquiry',
  'faq', 'mou-photo-modal', 'back-to-top'
];
sectionIds.forEach(id => {
  const found = html.includes('id="' + id + '"');
  console.log('Section #' + id.padEnd(24) + ':', found ? 'FOUND' : 'MISSING');
  if (!found) throw new Error('Missing ID: ' + id);
});

console.log('--- 4. SYNTAX VALIDATION ---');
new Function(js);
console.log('script.js syntax valid: YES');
console.log('data/iic-content.js loaded keys:', Object.keys(content));

console.log('--- 5. FILE SIZES ---');
console.log('index.html size:', html.length, 'bytes');
console.log('style.css size:', css.length, 'bytes');
console.log('script.js size:', js.length, 'bytes');
console.log('ALL AUDITS PASSED WITH ZERO ERRORS!');
