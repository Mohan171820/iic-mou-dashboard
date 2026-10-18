const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const indexPath = path.join(srmIicDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Fix announcement-bar: Ensure it closes with </div> before hero
// Current end of announcement-bar:
const badAnnounceEnd = /<\/div>\s*<\/div>\s*<\/div>\s*(\r?\n\s*<!-- ===== HERO)/;
if (badAnnounceEnd.test(html)) {
  console.log('Found 3 closing divs at end of announcement-bar, adding 4th to close .announcement-bar');
  html = html.replace(badAnnounceEnd, '</div>\n      </div>\n    </div>\n  </div>$1');
} else {
  console.log('Checking announcement-bar closing divs...');
}

// 2. Fix partners section: remove the extra 5th closing </div>
const badPartnersEnd = /(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)\s*<\/div>\s*(<\/section>)/;
if (badPartnersEnd.test(html)) {
  console.log('Found extra closing div in partners marquee, removing it');
  html = html.replace(badPartnersEnd, '$1\n  $2');
} else {
  console.log('Checking partners closing divs...');
}

// 3. Fix council photo to use professional MoU group photo
html = html.replace(
  'src="WhatsApp Image 2026-09-23 at 2.41.13 PM.jpeg" alt="SRMIST IIC Council Leadership &amp; MoU Session" class="about-council-photo" onerror="this.src=\'Images/IT/Genesys_MoU_Group_Photo.png\'"',
  'src="Images/IT/Genesys_MoU_Group_Photo.png" alt="SRMIST IIC Council Leadership &amp; MoU Session" class="about-council-photo" onerror="this.src=\'WhatsApp Image 2026-09-23 at 2.41.13 PM.jpeg\'"'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html successfully!');
