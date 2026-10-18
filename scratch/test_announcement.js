const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const origHtml = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');

const targetAnnouncementHtml = `<!-- DO NOT MODIFY - frozen by owner -->
  <!-- ===== SCROLLING ANNOUNCEMENT BAR (BELOW NAVBAR) ===== -->
  <div class="announcement-bar">
    <div class="announcement-label">
      <span class="pulse-dot"></span> ANNOUNCEMENTS
    </div>
    <div class="announcement-marquee">
      <div class="announcement-track">
        <div class="announcement-item">
          <span> Applications open for SRMIST Innovation &amp; Sustainability Leadership Awards 2026. Last date to
            apply: <strong>20<sup>th</sup> May 2026</strong>. <a href="#contact" class="announcement-link">Apply Now
              &rarr;</a></span>
          <span class="announcement-sep">&#10022;</span>
          <span> 50+ Active Industry MoUs &amp; Centres of Excellence inaugurated across SRMIST Ramapuram. <a
              href="#dept-dashboard" class="announcement-link">Explore MoUs &rarr;</a></span>
          <span class="announcement-sep">&#10022;</span>
        </div>
        <div class="announcement-item" aria-hidden="true">
          <span> Applications open for SRMIST Innovation &amp; Sustainability Leadership Awards 2026. Last date to
            apply: <strong>20<sup>th</sup> May 2026</strong>. <a href="#contact" class="announcement-link">Apply Now
              &rarr;</a></span>
          <span class="announcement-sep">&#10022;</span>
          <span> 50+ Active Industry MoUs &amp; Centres of Excellence inaugurated across SRMIST Ramapuram. <a
              href="#dept-dashboard" class="announcement-link">Explore MoUs &rarr;</a></span>
          <span class="announcement-sep">&#10022;</span>
        </div>
      </div>
    </div>
  </div>`;

console.log('Open divs:', (targetAnnouncementHtml.match(/<div\b/g) || []).length);
console.log('Close divs:', (targetAnnouncementHtml.match(/<\/div>/g) || []).length);
