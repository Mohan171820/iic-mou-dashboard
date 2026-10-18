const fs = require('fs');
const path = require('path');

const srmIicDir = path.resolve(__dirname, '../../srm iic');

console.log('Target srm iic directory:', srmIicDir);

// Read existing files to guarantee exact frozen blocks
const origHtml = fs.readFileSync(path.join(srmIicDir, 'index.html'), 'utf8');
const origCss = fs.readFileSync(path.join(srmIicDir, 'style.css'), 'utf8');

// Extract exact announcement bar HTML
const announcementMatch = origHtml.match(/(<!-- ===== SCROLLING ANNOUNCEMENT BAR[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/);
if (!announcementMatch) throw new Error('Could not extract announcement bar from index.html');
const announcementBarHtml = `<!-- DO NOT MODIFY - frozen by owner -->\n  ` + announcementMatch[1].trim();

// Extract exact partners marquee HTML
const partnersMatch = origHtml.match(/(<!-- ===== PARTNERS MARQUEE =====[\s\S]*?<\/section>)/);
if (!partnersMatch) throw new Error('Could not extract partners marquee from index.html');
const partnersMarqueeHtml = `<!-- DO NOT MODIFY - frozen by owner -->\n  ` + partnersMatch[1].trim();

// Extract exact announcement bar CSS
const announcementCssMatch = origCss.match(/(\/\* ===== SCROLLING ANNOUNCEMENT BAR[\s\S]*?@keyframes announcementScroll \{[\s\S]*?\}\s*\})/);
if (!announcementCssMatch) throw new Error('Could not extract announcement bar CSS');
const announcementBarCss = `/* DO NOT MODIFY - frozen by owner */\n` + announcementCssMatch[1].trim();

// Extract exact partners marquee CSS
const partnersCssMatch = origCss.match(/(\/\* ===== MARQUEE \(PARTNERS CARD[\s\S]*?@keyframes scroll-left \{ 0% \{ transform: translateX\(0\); \} 100% \{ transform: translateX\(-50%\); \} \})/);
if (!partnersCssMatch) throw new Error('Could not extract partners marquee CSS');
const partnersMarqueeCss = `/* DO NOT MODIFY - frozen by owner */\n` + partnersCssMatch[1].trim();

// =========================================================================
// 1. GENERATE INDEX.HTML
// =========================================================================
const newHtml = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
    content="Industry &amp; Innovation Council (IIC) at SRMIST Ramapuram - Fostering high-impact corporate partnerships, joint R&amp;D, Centres of Excellence, and industry-ready talent.">
  <title>Industry &amp; Innovation Council | SRMIST Ramapuram</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <!-- ===== TOP SCROLL PROGRESS BAR ===== -->
  <div id="scroll-progress-bar"></div>

  <!-- ===== NAVBAR ===== -->
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="#" class="nav-brand">
        <img src="Images/image-removebg-preview.png" alt="SRM Logo" class="nav-logo-img">
        <span>SRMIST IIC Ramapuram</span>
      </a>
      <div class="nav-links" id="navLinks">
        <a href="#about">About</a>
        <a href="#why-partner">Why Partner</a>
        <a href="#ecosystem">Centres of Excellence</a>
        <a href="#ways-to-collaborate">Ways to Collaborate</a>
        <a href="#dept-dashboard">Department MoUs</a>
        <a href="#impact">Milestones</a>
        <a href="#faq">FAQ</a>
        <a href="#partner-enquiry" class="btn btn-primary nav-cta">Partner With Us</a>
      </div>
      <!-- Mobile Hamburger Button -->
      <button class="nav-hamburger" id="navHamburger" aria-label="Toggle navigation menu" onclick="toggleMobileNav()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  </nav>

  ${announcementBarHtml}

  <!-- ===== HERO (SECTION 2: ENHANCED & COMPACT) ===== -->
  <section class="hero" id="hero">
    <canvas id="hero-particles"></canvas>
    <div class="hero-glow-overlay"></div>
    <div class="container" style="position: relative; z-index: 2;">
      <div class="hero-content">
        <div class="hero-badge">&#10022; Empowering Innovation at SRMIST Ramapuram</div>
        <h1>Industry &amp; Innovation <span class="highlight">Council</span></h1>
        <p>Bridging academia and enterprise: fostering high-impact corporate partnerships, sponsored Centres of Excellence, patentable R&amp;D, and elite engineering talent.</p>
        <div class="hero-buttons">
          <a href="#partner-enquiry" class="btn btn-primary">Partner With Us &rarr;</a>
          <a href="#ecosystem" class="btn btn-outline">Explore Centres of Excellence</a>
          <a href="#dept-dashboard" class="btn btn-text-link">View Department MoUs &rarr;</a>
        </div>
        <div class="hero-audience-line">For industry leaders, CTOs, startups, researchers, and campus recruiters.</div>
      </div>
    </div>
  </section>

  <!-- ===== PROOF STRIP (SECTION 3: NEW HEADLINE METRICS) ===== -->
  <section class="proof-strip-section">
    <div class="container">
      <div class="proof-strip-card" id="proof-strip">
        <div class="proof-metric-item">
          <div class="proof-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="proof-meta">
            <div class="proof-num impact-number" data-target="50" data-suffix="+">0</div>
            <div class="proof-label">Active Industry MoUs</div>
          </div>
        </div>

        <div class="proof-metric-item">
          <div class="proof-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <div class="proof-meta">
            <div class="proof-num impact-number" data-target="6" data-suffix="">0</div>
            <div class="proof-label">Centres of Excellence</div>
          </div>
        </div>

        <div class="proof-metric-item">
          <div class="proof-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div class="proof-meta">
            <div class="proof-num impact-number" data-target="625" data-suffix="+">0</div>
            <div class="proof-label">Recruiters on Campus</div>
          </div>
        </div>

        <div class="proof-metric-item">
          <div class="proof-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
          </div>
          <div class="proof-meta">
            <div class="proof-num impact-number" data-target="25" data-suffix="+">0</div>
            <div class="proof-label">Startups Incubated</div>
          </div>
        </div>

        <div class="proof-metric-item">
          <div class="proof-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>
          </div>
          <div class="proof-meta">
            <div class="proof-num impact-number" data-target="150" data-suffix="+">0</div>
            <div class="proof-label">Student Tech Projects</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${partnersMarqueeHtml}

  <!-- ===== ABOUT THE COUNCIL (SECTION 5: ENHANCED REAL IMAGE) ===== -->
  <section class="section about" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-image-wrapper reveal-left">
          <img src="Images/IT/Genesys_MoU_Group_Photo.png" alt="SRMIST IIC Council Leadership &amp; MoU Session" class="about-council-photo" onerror="this.src='WhatsApp Image 2026-09-23 at 2.41.13 PM.jpeg'">
          <div class="about-photo-corner-accent"></div>
          <div class="about-photo-badge">
            <svg class="iic-svg-sm" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <span>Recognized by MIC, Govt. of India</span>
          </div>
        </div>
        <div class="about-text reveal-right">
          <div class="section-overline">About the Council</div>
          <h3>Where Ideas Meet Industry</h3>
          <p>The Industry &amp; Innovation Council (IIC) at SRMIST Ramapuram is established under the Ministry of
            Education's Innovation Cell (MIC) to systematically foster the culture of innovation, startups, and
            entrepreneurship among students and faculty.</p>
          <p>The council serves as the central hub for coordinating all corporate alliances, R&amp;D consortia, and industry-sponsored Centres of Excellence across the campus &mdash; translating academic breakthroughs into commercial solutions.</p>
          
          <div class="about-highlight-chips">
            <span class="about-chip">
              <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Ministry of Education's Innovation Cell (MIC)
            </span>
            <span class="about-chip">
              <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Central Campus Innovation Hub
            </span>
            <span class="about-chip">
              <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Bridging Academia &amp; Enterprise
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== WHY PARTNER WITH SRMIST (SECTION 6: NEW 3x2 VALUE GRID) ===== -->
  <section class="section why-partner-section" id="why-partner">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Why Partner With <span class="highlight-serif">SRMIST Ramapuram</span></h2>
        <p>A proven institutional partner delivering verified outcomes for global tech enterprises and high-growth ventures</p>
      </div>

      <div class="why-partner-grid">
        <div class="why-partner-card reveal-scale delay-1">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h4>Industry-Ready Talent Pipeline</h4>
          <p>Tap into pre-vetted engineering graduates trained directly on modern software frameworks, VLSI microarchitectures, and real-time production sprints.</p>
          <div class="why-card-proof">625+ Recruiters on Campus</div>
        </div>

        <div class="why-partner-card reveal-scale delay-2">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <h4>Targeted Research &amp; IP Collaboration</h4>
          <p>Co-develop patentable industrial technologies, leverage joint government grant proposals (DST/SERB), and resolve proprietary engineering challenges.</p>
          <div class="why-card-proof">Joint Patents &amp; IEEE Papers</div>
        </div>

        <div class="why-partner-card reveal-scale delay-3">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>
          </div>
          <h4>Advanced Labs &amp; Infrastructure</h4>
          <p>Establish corporate-branded testbenches with dedicated floor space, NVIDIA GPU clusters, KUKA robotics arms, and cleanroom instrumentation.</p>
          <div class="why-card-proof">6 Dedicated CoE Facilities</div>
        </div>

        <div class="why-partner-card reveal-scale delay-4">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
          </div>
          <h4>Startup &amp; Incubation Ecosystem</h4>
          <p>Access early-stage intellectual property, prototype alongside ambitious student innovators, and explore commercialization pilots.</p>
          <div class="why-card-proof">25+ Startups Supported</div>
        </div>

        <div class="why-partner-card reveal-scale delay-5">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h4>Senior Faculty Advisory &amp; Consulting</h4>
          <p>Engage senior PhD professors and researchers for specialized advisory, independent verification &amp; validation (V&amp;V), and technical vetting.</p>
          <div class="why-card-proof">40+ Dedicated Expert Mentors</div>
        </div>

        <div class="why-partner-card reveal-scale delay-6">
          <div class="why-card-icon">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h4>Brand Visibility &amp; CSR Impact</h4>
          <p>Sponsor major regional hackathons, fund diversity scholarships, and channel CSR initiatives into verified STEM excellence programs.</p>
          <div class="why-card-proof">80+ Annual Tech Sprints</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== VISION & MISSION (SECTION 7: FIX EMPTY CIRCLES & DEAD SPACE) ===== -->
  <section class="section vision-mission" id="vision">
    <div class="vm-ambient-glow vm-ambient-1"></div>
    <div class="vm-ambient-glow vm-ambient-2"></div>
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Vision &amp; Mission</h2>
        <p>Driving institutional innovation and corporate synergy across engineering disciplines</p>
      </div>

      <div class="vm-grid">
        <!-- Vision Card -->
        <div class="vm-card reveal-scale delay-1">
          <div class="vm-icon-wrapper">
            <div class="vm-icon-inner">
              <svg class="iic-svg-lg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
          </div>
          <h3>Our Vision</h3>
          <p class="vm-vision-statement">
            To build a thriving innovation ecosystem at SRMIST Ramapuram that empowers students and faculty to become
            <strong class="highlight-blue">industry-ready innovators</strong>,
            <strong class="highlight-blue">entrepreneurs</strong>, and leaders who create
            <strong class="highlight-blue">real-world impact</strong>.
          </p>
          <!-- Elegant pull-quote to eliminate dead space -->
          <div class="vm-vision-pullquote">
            <svg class="iic-svg-xs" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5-2 4-2 4zm14 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5-2 4-2 4z"/></svg>
            <span>Committed to transforming academic curiosity into commercial excellence.</span>
          </div>
        </div>

        <!-- Mission Card -->
        <div class="vm-card reveal-scale delay-2">
          <div class="vm-icon-wrapper">
            <div class="vm-icon-inner">
              <svg class="iic-svg-lg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
          <h3>Our Mission</h3>
          <ul class="vm-mission-list">
            <li class="vm-list-item">
              <span class="vm-list-badge">
                <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div><strong>Industry-Academia Linkages:</strong> Establishing durable corporate R&amp;D partnerships and multi-year MoUs.</div>
            </li>
            <li class="vm-list-item">
              <span class="vm-list-badge">
                <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div><strong>Mentorship &amp; Guidance:</strong> Providing hands-on technical, patent filing, and business scaling guidance.</div>
            </li>
            <li class="vm-list-item">
              <span class="vm-list-badge">
                <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div><strong>Startup Support:</strong> Supporting and pre-incubating high-potential student and faculty ventures.</div>
            </li>
            <li class="vm-list-item">
              <span class="vm-list-badge">
                <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </span>
              <div><strong>Hands-on Learning:</strong> Enabling experiential learning through client hackathons, live code sprints, and labs.</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Stats Strip Below Cards -->
      <div class="vm-stats-strip reveal-scale delay-3">
        <div class="vm-stat-card">
          <div class="vm-stat-num impact-number" data-target="25" data-suffix="+">0</div>
          <div class="vm-stat-label">Startups Supported</div>
        </div>
        <div class="vm-stat-card">
          <div class="vm-stat-num impact-number" data-target="40" data-suffix="+">0</div>
          <div class="vm-stat-label">Expert Mentors</div>
        </div>
        <div class="vm-stat-card">
          <div class="vm-stat-num impact-number" data-target="150" data-suffix="+">0</div>
          <div class="vm-stat-label">Student Projects</div>
        </div>
        <div class="vm-stat-card">
          <div class="vm-stat-num impact-number" data-target="80" data-suffix="+">0</div>
          <div class="vm-stat-label">Workshops &amp; Events</div>
        </div>
      </div>

    </div>
  </section>

  <!-- ===== IMPACT & MILESTONES (SECTION 8: ENHANCED & COMPACT) ===== -->
  <section class="section impact" id="impact">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Our Institutional Milestones</h2>
        <p>Quantitative benchmarks demonstrating consistent collaboration and industry recognition</p>
      </div>
      <div class="impact-grid">
        <div class="impact-item reveal-scale delay-1">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="impact-number" data-target="50" data-suffix="+">0</div>
          <div class="impact-label">Total Active MoUs</div>
          <p class="impact-caption">Binding bilateral industry pacts across 12 departments</p>
        </div>

        <div class="impact-item reveal-scale delay-2">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          <div class="impact-number" data-target="12" data-suffix="+">0</div>
          <div class="impact-label">International Collaborations</div>
          <p class="impact-caption">Joint research partnerships spanning Japan, Europe &amp; USA</p>
        </div>

        <div class="impact-item reveal-scale delay-3">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div class="impact-number" data-target="20" data-suffix="+">0</div>
          <div class="impact-label">Major Industry Partners</div>
          <p class="impact-caption">Fortune 500 corporations and global tech leaders</p>
        </div>

        <div class="impact-item reveal-scale delay-4">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <div class="impact-number" data-target="8" data-suffix="+">0</div>
          <div class="impact-label">Academic Institutions</div>
          <p class="impact-caption">Consortia with national labs including IITM &amp; CSIR</p>
        </div>

        <div class="impact-item reveal-scale delay-5">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="impact-number" data-target="625" data-suffix="+">0</div>
          <div class="impact-label">Recruiters on Campus</div>
          <p class="impact-caption">Diverse multinational firms scouting specialized talent</p>
        </div>

        <div class="impact-item reveal-scale delay-6">
          <div class="impact-icon-badge">
            <svg class="iic-svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="impact-number" data-target="6" data-suffix="">0</div>
          <div class="impact-label">Centres of Excellence</div>
          <p class="impact-caption">Corporate-funded specialized laboratories and hubs</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CENTRES OF EXCELLENCE (SECTION 9: ENHANCED & FILTERABLE) ===== -->
  <section class="section ecosystem" id="ecosystem">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Centres of Excellence (CoEs)</h2>
        <p>Advanced Industry-Partnered Research &amp; Prototyping Hubs</p>
      </div>

      <!-- Department Filter Chips -->
      <div class="coe-filter-bar">
        <button class="coe-filter-btn active" data-filter="all" onclick="filterCoEs('all')">All Disciplines</button>
        <button class="coe-filter-btn" data-filter="cse" onclick="filterCoEs('cse')">CSE</button>
        <button class="coe-filter-btn" data-filter="ece" onclick="filterCoEs('ece')">ECE</button>
        <button class="coe-filter-btn" data-filter="eee" onclick="filterCoEs('eee')">EEE</button>
        <button class="coe-filter-btn" data-filter="civil" onclick="filterCoEs('civil')">Civil</button>
        <button class="coe-filter-btn" data-filter="multi" onclick="filterCoEs('multi')">Multi-Disciplinary</button>
      </div>

      <div class="eco-grid" id="coeGrid">
        <!-- 1. AI CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-1" data-dept="cse" onclick="window.location.href='coe-detail.html?id=ai'">
          <div class="coe-header coe-purple">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7.003 7.003 0 0 1 5.07 11H5a1 1 0 0 1 0-2h.07A7.003 7.003 0 0 1 11 3.07V3a1 1 0 0 1 2 0v.07A7.003 7.003 0 0 1 18.93 9H19a1 1 0 0 1 0 2h-.07A7.003 7.003 0 0 1 13 16.93z"/></svg>
            </div>
            <h4>AI Centre of Excellence</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">CSE – BDA / Cloud / AI</div>
            <div class="coe-partner-chip">Partner: Navigate Labs</div>
            <p class="coe-statement">Specialized in foundational LLM fine-tuning, computer vision pipelines, and production GenAI copilots.</p>
            <div class="coe-stats-row">
              <span><strong>480+</strong> Students</span> &bull; <span><strong>14</strong> Projects</span> &bull; <span><strong>8</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=ai" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'AI Centre of Excellence (Navigate Labs)')">Collaborate</button>
            </div>
          </div>
        </div>

        <!-- 2. EDGE CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-2" data-dept="ece" onclick="window.location.href='coe-detail.html?id=edge'">
          <div class="coe-header coe-blue">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>
            </div>
            <h4>EDGE Centre of Excellence</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">ECE – Microelectronics &amp; VLSI</div>
            <div class="coe-partner-chip">Partner: BeauRoi Technologies</div>
            <p class="coe-statement">VLSI silicon testbench, IoT edge telemetry, RTOS firmware development, and semiconductor verification.</p>
            <div class="coe-stats-row">
              <span><strong>385+</strong> Students</span> &bull; <span><strong>11</strong> Projects</span> &bull; <span><strong>5</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=edge" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'EDGE CoE (BeauRoi Technologies)')">Collaborate</button>
            </div>
          </div>
        </div>

        <!-- 3. Cybersecurity CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-3" data-dept="cse" onclick="window.location.href='coe-detail.html?id=cybersecurity'">
          <div class="coe-header coe-orange">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h4>Cybersecurity (CCEE)</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">CSE – Cyber Security &amp; Networks</div>
            <div class="coe-partner-chip">Partners: Fortinet &middot; Cybertracs &middot; GUVI</div>
            <p class="coe-statement">Live SIEM threat hunting, zero-trust cloud defense, ethical hacking CTF sprints, and incident triage.</p>
            <div class="coe-stats-row">
              <span><strong>535+</strong> Students</span> &bull; <span><strong>18</strong> Projects</span> &bull; <span><strong>12</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=cybersecurity" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'Cybersecurity CoE (Fortinet / Cybertracs)')">Collaborate</button>
            </div>
          </div>
        </div>

        <!-- 4. Automation CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-4" data-dept="eee" onclick="window.location.href='coe-detail.html?id=automation'">
          <div class="coe-header coe-yellow">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <h4>CoE in Automation &amp; Robotics</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">EEE – Control Systems &amp; Robotics</div>
            <div class="coe-partner-chip">Partners: IPCS Global &middot; Schneider &middot; MiBot</div>
            <p class="coe-statement">Industrial PLC &amp; SCADA programming, 6-axis articulated robotics, and smart factory IoT integration.</p>
            <div class="coe-stats-row">
              <span><strong>420+</strong> Students</span> &bull; <span><strong>15</strong> Projects</span> &bull; <span><strong>6</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=automation" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'Automation & Robotics CoE (IPCS Global)')">Collaborate</button>
            </div>
          </div>
        </div>

        <!-- 5. Nichi-In CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-5" data-dept="multi" onclick="window.location.href='coe-detail.html?id=nichiin'">
          <div class="coe-header coe-teal">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h4>Nichi-In Software Solutions Hub</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">Multi-Disciplinary IT &amp; Cloud</div>
            <div class="coe-partner-chip">Partner: Nichi-In Software Solutions</div>
            <p class="coe-statement">Cross-border cloud microservices, Japanese quality V&amp;V compliance, and bilingual engineering talent.</p>
            <div class="coe-stats-row">
              <span><strong>345+</strong> Students</span> &bull; <span><strong>9</strong> Projects</span> &bull; <span><strong>4</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=nichiin" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'Nichi-In Software Solutions Hub')">Collaborate</button>
            </div>
          </div>
        </div>

        <!-- 6. Structural CoE -->
        <div class="eco-card coe-card clickable-coe reveal-scale delay-6" data-dept="civil" onclick="window.location.href='coe-detail.html?id=structural'">
          <div class="coe-header coe-red">
            <div class="eco-icon-tile">
              <svg class="iic-svg" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h4>Structural Engg. Research Lab</h4>
          </div>
          <div class="coe-body">
            <div class="coe-dept-pill">Civil Engineering – Materials</div>
            <div class="coe-partner-chip">Partners: DST Govt of India &middot; L&amp;T &middot; Adani</div>
            <p class="coe-statement">Eco-friendly geopolymer concrete, non-destructive ultrasonic testing (NDT), and seismic FEA simulations.</p>
            <div class="coe-stats-row">
              <span><strong>295+</strong> Students</span> &bull; <span><strong>16</strong> Projects</span> &bull; <span><strong>14</strong> Patents</span>
            </div>
            <div class="coe-action-group" onclick="event.stopPropagation()">
              <a href="coe-detail.html?id=structural" class="btn btn-primary coe-btn-main">View Analytics &amp; Dashboard &rarr;</a>
              <button class="coe-btn-collab" onclick="prefillEnquiry('Centre of Excellence', 'Structural Engg. Research Lab (DST)')">Collaborate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== WAYS TO COLLABORATE (SECTION 10: NEW 8-TILE GRID) ===== -->
  <section class="section ways-section" id="ways-to-collaborate">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Ways to <span class="highlight-serif">Collaborate</span></h2>
        <p>Flexible engagement models structured to meet your technical objectives, hiring plans, and research timelines</p>
      </div>

      <div class="ways-grid">
        <div class="way-tile reveal-scale delay-1">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h4>Hire &amp; Internships</h4>
          <p>Access structured undergraduate and postgraduate talent for semester internships and full-time hiring drives.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Internship / Placement', 'Talent Hiring & Internships')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-2">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          </div>
          <h4>Sponsored Labs &amp; Equipment</h4>
          <p>Establish corporate-branded Centre of Excellence testbenches with dedicated student cohorts and research faculty.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Centre of Excellence', 'Sponsored Lab Facility')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-3">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/></svg>
          </div>
          <h4>Joint R&amp;D / Consultancy</h4>
          <p>Commission faculty-led research, material failure testing, algorithmic fine-tuning, or co-develop patents.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Sponsored Research', 'Joint R&D and Consultancy')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-4">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <h4>Hackathons &amp; Challenges</h4>
          <p>Sponsor 24-48hr campus innovation challenges where hundreds of students build working prototypes for your problem statement.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Other', 'Corporate Hackathon Sponsorship')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-5">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
          </div>
          <h4>Guest Lectures &amp; Masterclasses</h4>
          <p>Deliver executive seminars, tool tutorials, and engineering masterclasses to elevate your industry employer brand.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Guest Lecture / Workshop', 'Guest Lectures & Masterclasses')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-6">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h4>Incubation &amp; Mentoring</h4>
          <p>Mentor early-stage deep tech student founders, join our investor demo days, and pilot emerging campus technologies.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Other', 'Incubation & Startup Mentoring')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-7">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h4>CSR &amp; Scholarships</h4>
          <p>Channel corporate social responsibility funds into high-impact technology training labs and merit student scholarships.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Industry MoU', 'CSR Sponsorship & Scholarships')">Enquire &rarr;</a>
        </div>

        <div class="way-tile reveal-scale delay-8">
          <div class="way-icon-box">
            <svg class="iic-svg" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <h4>Curriculum Co-design</h4>
          <p>Embed industrial software frameworks, certifications, and credit electives directly into university curriculum syllabi.</p>
          <a href="#partner-enquiry" class="way-enquire-link" onclick="prefillEnquiry('Industry MoU', 'Curriculum Co-design')">Enquire &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== DEPT DASHBOARD (SECTION 11: ENHANCED SEARCH & SORT) ===== -->
  <section class="section dashboard-section" id="dept-dashboard">
    <div class="container">
      <div class="section-header">
        <div class="accent-line"></div>
        <h2 class="mou-header-icon">Department MoUs</h2>
        <p>Explore verified bilateral partnerships across 12 academic engineering departments</p>
      </div>

      <!-- Controls: Search & Sort Bar -->
      <div class="dept-controls-bar">
        <div class="dept-search-box">
          <svg class="iic-svg-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="deptSearchInput" placeholder="Search by department name or partner..." oninput="handleDeptSearch(event)" aria-label="Search departments or partners">
        </div>
        <div class="dept-sort-box">
          <label for="deptSortSelect">Sort:</label>
          <select id="deptSortSelect" onchange="handleDeptSort(event)" aria-label="Sort departments">
            <option value="default">Default Order</option>
            <option value="most">Most MoUs First</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div id="dept-grid-view" class="dept-card-grid">
        <!-- Cards injected dynamically by script.js from mous-data.js -->
      </div><!-- end dept-card-grid -->

    </div>
  </section>

  <!-- ===== HOW PARTNERSHIP WORKS (SECTION 12: NEW 4-STEP TIMELINE) ===== -->
  <section class="section how-works-section" id="how-partnership-works">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>How Partnership <span class="highlight-serif">Works</span></h2>
        <p>A transparent, frictionless 4-step path from first conversation to operational impact</p>
      </div>

      <div class="timeline-row">
        <div class="timeline-step-card reveal-scale delay-1">
          <div class="step-num-node">01</div>
          <h4>Enquire &amp; Align</h4>
          <p>Submit your strategic objectives or request a campus laboratory tour through our online portal.</p>
        </div>

        <div class="timeline-step-card reveal-scale delay-2">
          <div class="step-num-node">02</div>
          <h4>Discovery Call</h4>
          <p>Meet designated department chairs and research professors to map deliverables and talent cohorts.</p>
        </div>

        <div class="timeline-step-card reveal-scale delay-3">
          <div class="step-num-node">03</div>
          <h4>MoU &amp; Scope</h4>
          <p>Formalize terms using institutional bilateral templates without bureaucratic delays.</p>
        </div>

        <div class="timeline-step-card reveal-scale delay-4">
          <div class="step-num-node">04</div>
          <h4>Kick-off &amp; Review</h4>
          <p>Launch student cohorts, inaugurate testbenches, and conduct structured quarterly deliverable reviews.</p>
        </div>
      </div>

      <div class="timeline-cta-row">
        <a href="#partner-enquiry" class="btn btn-primary">Start a Conversation Today &rarr;</a>
      </div>
    </div>
  </section>

  <!-- ===== SUCCESS STORIES (SECTION 13: NEW REAL CASE STUDIES) ===== -->
  <section class="section success-stories-section" id="success-stories">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Collaboration <span class="highlight-serif">Success Stories</span></h2>
        <p>Measurable achievements co-created with corporate leaders at SRMIST Ramapuram</p>
      </div>

      <div class="success-grid">
        <!-- Story 1 -->
        <div class="success-card reveal-scale delay-1">
          <div class="success-card-top">
            <span class="success-badge">AI CoE Case Study</span>
            <div class="success-partner-name">Navigate Labs</div>
          </div>
          <div class="success-photo-slot">
            <img src="Images/AIML/WhatsApp Image 2026-09-23 at 12.13.36 PM.jpeg" alt="Navigate Labs AI Centre Inauguration" loading="lazy">
          </div>
          <div class="success-card-body">
            <h4>Foundational LLM Fine-Tuning &amp; Enterprise Copilots</h4>
            <p>Inaugurated dedicated high-compute AI facility training 480+ students with 14 live industry client sprints and 8 published patents.</p>
            <a href="coe-detail.html?id=ai" class="success-read-more">View CoE Analytics Dashboard &rarr;</a>
          </div>
        </div>

        <!-- Story 2 -->
        <div class="success-card reveal-scale delay-2">
          <div class="success-card-top">
            <span class="success-badge">Semiconductor CoE</span>
            <div class="success-partner-name">BeauRoi Technologies</div>
          </div>
          <div class="success-photo-slot">
            <img src="Images/ECE/WhatsApp Image 2026-09-23 at 1.42.14 PM.jpeg" alt="BeauRoi Technologies EDGE Lab Signing" loading="lazy">
          </div>
          <div class="success-card-body">
            <h4>VLSI Semiconductor &amp; IoT Telemetry Architecture</h4>
            <p>Equipped 385+ electronics engineers with FPGA testing suites, yielding 5 hardware patents and core silicon industry placements.</p>
            <a href="coe-detail.html?id=edge" class="success-read-more">View CoE Analytics Dashboard &rarr;</a>
          </div>
        </div>

        <!-- Story 3 -->
        <div class="success-card reveal-scale delay-3">
          <div class="success-card-top">
            <span class="success-badge">Cyber Defense CoE</span>
            <div class="success-partner-name">Fortinet Academy</div>
          </div>
          <div class="success-photo-slot">
            <img src="Images/CS/CYbertracs.jpeg" alt="Cybersecurity CCEE Operations Center" loading="lazy">
          </div>
          <div class="success-card-body">
            <h4>Zero-Trust Cyber Defense &amp; Live SOC Operations</h4>
            <p>Established continuous threat simulation center qualifying 440+ ethical hackers with 100% placement across Tier-1 security consultancies.</p>
            <a href="coe-detail.html?id=cybersecurity" class="success-read-more">View CoE Analytics Dashboard &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== EVENTS & NEWS (SECTION 14: TWO-COLUMN) ===== -->
  <section class="section events-news-section" id="events-news">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Events &amp; <span class="highlight-serif">Council News</span></h2>
        <p>Stay informed about institutional milestones, upcoming awards, and campus conclaves</p>
      </div>

      <div class="events-news-grid">
        <!-- Left: Upcoming Events -->
        <div class="events-col">
          <h3 class="col-head-title">
            <svg class="iic-svg-sm" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Upcoming Events
          </h3>

          <div class="event-card-item">
            <div class="event-date-box">
              <span class="event-day">20</span>
              <span class="event-month">MAY 2026</span>
            </div>
            <div class="event-info">
              <h4>SRMIST Innovation &amp; Sustainability Leadership Awards 2026</h4>
              <p>Annual flagship awards recognizing student innovation prototypes, faculty patents, and outstanding corporate R&amp;D partners.</p>
              <a href="#partner-enquiry" class="event-action-link" onclick="prefillEnquiry('Other', 'Leadership Awards 2026')">Apply / Enquire &rarr;</a>
            </div>
          </div>

          <div class="event-card-item">
            <div class="event-date-box">
              <span class="event-day">15</span>
              <span class="event-month">AUG 2026</span>
            </div>
            <div class="event-info">
              <h4>Next-Gen Industry-Academia Conclave 2026</h4>
              <p>Bi-annual symposium bringing together 50+ CTOs and R&amp;D heads to discuss CoE roadmaps and emerging industry curricula.</p>
              <a href="#partner-enquiry" class="event-action-link" onclick="prefillEnquiry('Other', 'Industry Conclave 2026')">Register Interest &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Right: Latest News & Milestones -->
        <div class="news-col">
          <h3 class="col-head-title">
            <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Latest Achievements
          </h3>

          <div class="news-card-item">
            <span class="news-tag milestone-tag">Milestone</span>
            <h4>50+ Active Industry MoUs Across SRMIST Ramapuram</h4>
            <p>Comprehensive milestone spanning 12 academic departments, connecting academia with Fortune 500 tech leaders.</p>
          </div>

          <div class="news-card-item">
            <span class="news-tag coe-tag">Infrastructure</span>
            <h4>6 Dedicated Centres of Excellence Operational</h4>
            <p>Advanced research clusters active in AI, Semiconductors, Cybersecurity, Robotics, Indo-Japan IT, and Structural Mechanics.</p>
          </div>

          <div class="news-card-item">
            <span class="news-tag national-tag">Recognition</span>
            <h4>Recognized Under Ministry of Education Innovation Cell (MIC)</h4>
            <p>Systematically structured council fostering innovation culture, startup incubation, and intellectual property generation.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== PARTNER ENQUIRY (SECTION 15: NEW CTA BAND + ACCESSIBLE FORM) ===== -->
  <section class="section partner-enquiry-section" id="partner-enquiry">
    <div class="container">
      <div class="enquiry-card-wrap">
        <!-- Left: Reassurance & Direct Contact -->
        <div class="enquiry-left-pane">
          <div class="section-overline" style="color:var(--gold-400); background:rgba(240,180,41,0.12); border:1px solid rgba(240,180,41,0.3);">Corporate Alliances</div>
          <h2>Partner with SRMIST Ramapuram</h2>
          <p class="enquiry-subtext">Whether you seek to establish a dedicated Centre of Excellence, recruit specialized engineering cohorts, or commission joint research &mdash; our leadership team ensures swift execution.</p>

          <div class="enquiry-reassurances">
            <div class="reassurance-row">
              <div class="reassurance-check">
                <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Guaranteed council response within 48 business hours</span>
            </div>
            <div class="reassurance-row">
              <div class="reassurance-check">
                <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Dedicated Faculty SPOC and corporate liaison coordinator</span>
            </div>
            <div class="reassurance-row">
              <div class="reassurance-check">
                <svg class="iic-svg-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Pre-vetted bilateral MoU templates with zero legal friction</span>
            </div>
          </div>

          <div class="enquiry-contact-links">
            <div class="contact-pill-item">
              <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>iic@srmist.edu.in</span>
            </div>
            <div class="contact-pill-item">
              <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+91 44 4392 3120</span>
            </div>
            <div class="contact-pill-item">
              <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>SRMIST Ramapuram, Chennai 600 089</span>
            </div>
          </div>
        </div>

        <!-- Right: Accessible Clean Form -->
        <div class="enquiry-right-pane">
          <form class="enquiry-form" id="partnerEnquiryForm" onsubmit="handleEnquirySubmit(event)">
            <div class="form-row-2">
              <div class="form-group">
                <label for="eq-name">Full Name <span class="req">*</span></label>
                <input type="text" id="eq-name" required placeholder="e.g. Ramesh Kumar" autocomplete="name">
              </div>
              <div class="form-group">
                <label for="eq-org">Organisation / Company <span class="req">*</span></label>
                <input type="text" id="eq-org" required placeholder="e.g. Infosys Ltd." autocomplete="organization">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="eq-email">Work Email <span class="req">*</span></label>
                <input type="email" id="eq-email" required placeholder="name@company.com" autocomplete="email">
              </div>
              <div class="form-group">
                <label for="eq-phone">Contact Phone</label>
                <input type="tel" id="eq-phone" placeholder="+91 98765 43210" autocomplete="tel">
              </div>
            </div>

            <div class="form-group">
              <label for="eq-type">Collaboration Type <span class="req">*</span></label>
              <select id="eq-type" required>
                <option value="">Select Primary Interest...</option>
                <option value="Centre of Excellence">Establish a Centre of Excellence (CoE)</option>
                <option value="Industry MoU">Institutional Bilateral MoU</option>
                <option value="Sponsored Research">Sponsored Research / Joint Patents</option>
                <option value="Internship / Placement">Campus Hiring &amp; Student Internships</option>
                <option value="Guest Lecture / Workshop">Executive Masterclasses &amp; Workshops</option>
                <option value="Other">Hackathon Sponsorship / Incubation</option>
              </select>
            </div>

            <div class="form-group">
              <label for="eq-msg">Brief Message / Specific Focus Area</label>
              <textarea id="eq-msg" rows="3" placeholder="Tell us about your technical requirements, cohort size, or proposed timeline..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary enquiry-submit-btn" id="enquirySubmitBtn">
              <span>Send Partnership Enquiry &rarr;</span>
            </button>
            
            <div id="enquirySuccessState" class="enquiry-success-alert" style="display:none;" role="status">
              <svg class="iic-svg-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <strong>Enquiry Received!</strong> Our Industry &amp; Innovation Council coordinator will follow up with you within 48 business hours.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== FAQ SECTION (SECTION 16: NEW CORPORATE ACCORDION) ===== -->
  <section class="section faq-section" id="faq">
    <div class="container">
      <div class="section-header reveal">
        <div class="accent-line"></div>
        <h2>Frequently Asked <span class="highlight-serif">Questions</span></h2>
        <p>Common questions from CTOs, HR heads, and research directors exploring institutional collaboration</p>
      </div>

      <div class="faq-accordion-wrap">
        <!-- FAQ 1 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>What is the typical timeline to formalize an MoU with SRMIST Ramapuram?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>Our streamlined vetting process typically completes within 10 to 14 business days. Following an initial alignment meeting, our legal and council committee approves the standard bilateral template with mutual scope agreements.</p>
          </div>
        </div>

        <!-- FAQ 2 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>What are the primary modes of corporate engagement available?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>Companies can engage through talent hiring and internships, establishing a sponsored Centre of Excellence (CoE), joint patent and R&amp;D consultancy, sponsoring hackathons, or co-designing specialized curriculum electives.</p>
          </div>
        </div>

        <!-- FAQ 3 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>How is Intellectual Property (IP) handled in collaborative R&amp;D projects?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>IP rights are defined clearly in the MoU scope agreement prior to project initiation. Collaborations can follow joint ownership models or assign proprietary rights to the industry sponsor according to grant provisions. <!-- TODO: Confirm institutional IP policy specifics --></p>
          </div>
        </div>

        <!-- FAQ 4 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>Can a corporate partner set up a customized Centre of Excellence?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>Yes. We offer dedicated laboratory floor space, power infrastructure, student cohort allocation, and designated faculty coordinators. Six CoEs are already operational with corporate partners including Navigate Labs, BeauRoi Tech, and IPCS Global.</p>
          </div>
        </div>

        <!-- FAQ 5 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>Is there any financial commitment required to initiate an academic partnership?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>Standard academic MoUs focusing on internships, guest lectures, and placement scouting involve zero financial commitments. Financial arrangements apply only to sponsored equipment laboratories, funded R&amp;D grants, or specialized corporate scholarships.</p>
          </div>
        </div>

        <!-- FAQ 6 -->
        <div class="faq-item">
          <button class="faq-question-btn" onclick="toggleFaq(this)" aria-expanded="false">
            <span>What ongoing operational support does the council provide after MoU signing?</span>
            <svg class="faq-chevron-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer-body" hidden>
            <p>Every corporate partner is assigned a dedicated Faculty Single Point of Contact (SPOC) and Department Coordinator who organize student cohorts, schedule reviews, maintain lab equipment, and report quarterly deliverables.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== UPGRADED MOU PHOTO LIGHTBOX (PRESERVED) ===== -->
  <div id="mou-photo-modal" role="dialog" aria-modal="true" aria-labelledby="mou-modal-title">
    <div class="mou-modal-box">
      <!-- Header bar -->
      <div class="mou-modal-header">
        <div class="mou-modal-header-info">
          <div class="mou-modal-badge">MoU Signing Ceremony</div>
          <h3 id="mou-modal-title">Partner Name</h3>
        </div>
        <div class="mou-modal-header-actions">
          <span id="mou-photo-counter" class="mou-photo-counter"></span>
          <button class="mou-modal-close" onclick="closeMouModal()" aria-label="Close modal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Main image viewer -->
      <div class="mou-modal-img-wrap">
        <button class="mou-modal-nav mou-modal-prev" id="mou-prev-btn" onclick="prevMouPhoto()"
          aria-label="Previous photo">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="mou-img-fade-wrap">
          <img id="mou-modal-img" src="" alt="MoU Signing Photo">
        </div>
        <button class="mou-modal-nav mou-modal-next" id="mou-next-btn" onclick="nextMouPhoto()" aria-label="Next photo">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <!-- Thumbnail strip -->
      <div id="mou-modal-thumbnails" class="mou-thumbnails-grid"></div>
      <!-- Footer hint -->
      <div class="mou-modal-footer-note">
        <span class="mou-kbd">&larr;</span><span class="mou-kbd">&rarr;</span> navigate &nbsp;&middot;&nbsp; <span
          class="mou-kbd">Esc</span> close
      </div>
    </div>
  </div>

  <!-- ===== FOOTER (SECTION 17: ENHANCED 4-COLUMN) ===== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <img src="Images/image-removebg-preview.png" alt="SRM IIC Logo" class="footer-logo">
          <p class="footer-tagline">Industry &amp; Innovation Council<br><strong>SRMIST Ramapuram</strong></p>
          <p class="footer-desc">Established under MIC, Ministry of Education &mdash; systematically fostering innovation, startups, research excellence, and high-value corporate alliances.</p>
        </div>
        <div class="footer-links-col">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#about">About the Council</a></li>
            <li><a href="#why-partner">Why Partner With Us</a></li>
            <li><a href="#ecosystem">Centres of Excellence</a></li>
            <li><a href="#ways-to-collaborate">Ways to Collaborate</a></li>
            <li><a href="#dept-dashboard">Department MoUs</a></li>
            <li><a href="#impact">Milestones</a></li>
            <li><a href="#faq">Corporate FAQ</a></li>
          </ul>
        </div>
        <div class="footer-links-col">
          <h5>Centres of Excellence</h5>
          <ul>
            <li><a href="coe-detail.html?id=ai">Artificial Intelligence (AI)</a></li>
            <li><a href="coe-detail.html?id=edge">EDGE Microelectronics</a></li>
            <li><a href="coe-detail.html?id=cybersecurity">Cybersecurity (CCEE)</a></li>
            <li><a href="coe-detail.html?id=automation">Automation &amp; Robotics</a></li>
            <li><a href="coe-detail.html?id=nichiin">Nichi-In Software Hub</a></li>
            <li><a href="coe-detail.html?id=structural">Structural Research Lab</a></li>
          </ul>
        </div>
        <div class="footer-links-col">
          <h5>Contact Liaison</h5>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:iic@srmist.edu.in">iic@srmist.edu.in</a></li>
            <li><strong>Phone:</strong> +91 44 4392 3120</li>
            <li>SRMIST Ramapuram Campus</li>
            <li>Bharathi Salai, Ramapuram</li>
            <li>Chennai &mdash; 600 089, India</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Industry &amp; Innovation Council, SRMIST Ramapuram. All rights reserved.</p>
        <p class="footer-mic-note">&#10022; Recognized by Ministry of Education's Innovation Cell (MIC)</p>
      </div>
    </div>
  </footer>

  <!-- ===== BACK TO TOP FLOATING BUTTON ===== -->
  <button id="back-to-top" aria-label="Back to top">
    <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48">
      <circle class="progress-ring-bg" stroke="rgba(240, 180, 41, 0.22)" stroke-width="2.5" fill="transparent" r="21" cx="24" cy="24" />
      <circle class="progress-ring-circle" stroke="var(--gold-500)" stroke-width="2.5" stroke-linecap="round" fill="transparent" r="21" cx="24" cy="24" />
    </svg>
    <svg class="btt-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </button>

  <script src="data/iic-content.js"></script>
  <script src="mous-data.js"></script>
  <script src="script.js"></script>
</body>

</html>
`;

fs.writeFileSync(path.join(srmIicDir, 'index.html'), newHtml, 'utf8');
console.log('Successfully wrote updated srm iic/index.html');


// =========================================================================
// 2. GENERATE STYLE.CSS (WITH EXACT FROZEN BLOCKS PRESERVED & COMPACT TOKENS)
// =========================================================================
const newCss = `/* ===== GOOGLE FONTS ===== */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');

/* ===== BRAND TOKENS & SCALED DESIGN SYSTEM ===== */
:root {
  /* Brand Tokens (Per Prompt Specification) */
  --navy-900: #061E4A;
  --navy-700: #0B4FAD;
  --blue-600: #1E64D4;
  --gold-500: #F0B429;
  --gold-600: #D99B16;
  --gold-400: #FCD34D;
  --cream-50: #F4F1E8;
  --ink-900: #0C1220;
  --ink-600: #5E6673;

  /* Aliases for backwards compatibility */
  --primary: var(--navy-700);
  --primary-dark: var(--navy-900);
  --primary-light: var(--blue-600);
  --accent: var(--gold-500);
  --accent-light: #FFEAA0;

  /* Backgrounds: Unified Cream Tone across all light sections */
  --dark-bg: #040C1C;
  --light-bg: var(--cream-50);
  --white: #FEFDF7;
  --card-bg: #FFFFFF;
  --surface: #FFFFFF;

  /* Typography Colors */
  --text-dark: var(--ink-900);
  --text-body: #2A3140;
  --text-muted: var(--ink-600);
  --text-light: #8891A0;

  /* Borders */
  --border: #E4DFD0;
  --border-dark: #C8C3B0;

  /* Spacing Grid & Border Radii (Compact) */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --shadow-sm: 0 2px 8px rgba(6, 30, 74, 0.05);
  --shadow-md: 0 8px 24px rgba(6, 30, 74, 0.08);
  --shadow-lg: 0 16px 44px rgba(6, 30, 74, 0.12);
}

/* Base Scaling Adjustment: 15px root scale for ~80-85% perceived zoom */
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 15px; }
body {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  color: var(--text-body);
  background: var(--light-bg);
  line-height: 1.58;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: normal;
}
a { text-decoration: none; color: inherit; transition: 0.25s; }
img { max-width: 100%; display: block; }

/* Unified Layout Container & Compact Section Padding */
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.section { padding: 58px 0; background: var(--cream-50); }

/* SVG Icon Standards (1.75 stroke) */
.iic-svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.iic-svg-lg { width: 28px; height: 28px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.iic-svg-sm { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.iic-svg-xs { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ===== SECTION HEADER (COMPACT CLAMP) ===== */
.section-header { text-align: center; margin-bottom: 42px; }
.section-header h2 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(1.75rem, 2.6vw, 2.25rem);
  font-weight: 400;
  color: var(--text-dark);
  margin-bottom: 10px;
  line-height: 1.25;
  letter-spacing: -0.015em;
}
.section-header .accent-line {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--navy-700), var(--gold-500));
  margin: 0 auto 14px;
  border-radius: 3px;
}
.section-header p {
  color: var(--text-muted);
  font-size: 0.98rem;
  font-weight: 500;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.55;
}
.highlight-serif {
  font-style: italic;
  color: var(--gold-600);
}

/* ===== OVERLINE LABEL ===== */
.section-overline {
  display: inline-block;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--navy-700);
  background: rgba(11, 79, 173, 0.08);
  border: 1px solid rgba(11, 79, 173, 0.2);
  padding: 3px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
}

/* ===== NAVBAR ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background: rgba(6, 30, 74, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(240, 180, 41, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  transition: all 0.35s ease;
}
.nav-container {
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.08rem;
  letter-spacing: -0.01em;
}
.nav-logo-img { height: 42px; width: auto; object-fit: contain; }
.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-links a {
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.88rem;
  font-weight: 600;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active {
  color: var(--gold-500);
}
.nav-cta {
  padding: 9px 20px !important;
  font-size: 0.86rem !important;
  border-radius: 24px !important;
}
.nav-hamburger {
  display: none;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 6px;
}

/* ===== BUTTON SYSTEM (MIN HEIGHT 40PX) ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.92rem;
  min-height: 42px;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1.5px solid transparent;
}
.btn-primary {
  background: var(--gold-500);
  color: var(--navy-900);
  border-color: var(--gold-500);
}
.btn-primary:hover {
  background: var(--gold-600);
  border-color: var(--gold-600);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(240, 180, 41, 0.35);
}
.btn-outline {
  background: transparent;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.35);
}
.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
  transform: translateY(-2px);
}
.btn-text-link {
  background: transparent;
  color: var(--gold-400);
  font-size: 0.88rem;
  padding: 10px 14px;
}
.btn-text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

${announcementBarCss}

/* ===== HERO (SECTION 2: COMPACT 70-74VH) ===== */
.hero {
  position: relative;
  background: linear-gradient(135deg, #020713 0%, #061E4A 55%, #0B4FAD 100%);
  color: #ffffff;
  padding: 130px 0 54px;
  min-height: 520px;
  max-height: 74vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
#hero-particles {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1; pointer-events: none;
}
.hero-glow-overlay {
  position: absolute;
  top: 20%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 350px;
  background: radial-gradient(circle, rgba(240, 180, 41, 0.14) 0%, rgba(11, 79, 173, 0.18) 50%, transparent 70%);
  filter: blur(55px);
  pointer-events: none;
  z-index: 1;
}
.hero-content {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}
.hero-badge {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-400);
  background: rgba(240, 180, 41, 0.12);
  border: 1px solid rgba(240, 180, 41, 0.35);
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.hero h1 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(2.25rem, 3.8vw, 3.25rem);
  font-weight: 400;
  line-height: 1.18;
  margin-bottom: 14px;
  letter-spacing: -0.02em;
}
.hero h1 .highlight {
  font-style: italic;
  color: var(--gold-500);
}
.hero p {
  font-size: 1.02rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
  max-width: 680px;
  margin: 0 auto 22px;
}
.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.hero-audience-line {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 14px;
  font-weight: 500;
}

/* ===== PROOF STRIP (SECTION 3: NEW OVERLAPPING CARD) ===== */
.proof-strip-section {
  position: relative;
  z-index: 10;
  background: transparent;
  padding: 0;
}
.proof-strip-card {
  margin-top: -34px;
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 24px;
  box-shadow: 0 10px 32px rgba(6, 30, 74, 0.08);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
.proof-metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-right: 1px solid #ECE7D9;
}
.proof-metric-item:last-child { border-right: none; }
.proof-icon-box {
  width: 40px; height: 40px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.proof-meta { display: flex; flex-direction: column; }
.proof-num {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--navy-900);
  line-height: 1.1;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.proof-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--ink-600);
  line-height: 1.25;
  margin-top: 2px;
}

${partnersMarqueeCss}

/* ===== ABOUT THE COUNCIL (SECTION 5) ===== */
.about { background: var(--cream-50); }
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: center;
}
.about-image-wrapper {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1.5px solid var(--border);
  background: #061E4A;
}
.about-council-photo {
  width: 100%;
  height: 380px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.about-image-wrapper:hover .about-council-photo {
  transform: scale(1.03);
}
.about-photo-corner-accent {
  position: absolute;
  top: 14px; right: 14px;
  width: 32px; height: 32px;
  border-top: 3px solid var(--gold-500);
  border-right: 3px solid var(--gold-500);
  pointer-events: none;
}
.about-photo-badge {
  position: absolute;
  bottom: 14px; left: 14px; right: 14px;
  background: rgba(6, 30, 74, 0.88);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(240, 180, 41, 0.3);
}
.about-text h3 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(1.8rem, 2.6vw, 2.3rem);
  color: var(--navy-900);
  margin-bottom: 14px;
  line-height: 1.2;
}
.about-text p {
  color: var(--text-body);
  font-size: 0.96rem;
  line-height: 1.62;
  margin-bottom: 14px;
}
.about-highlight-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}
.about-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 20px;
  border: 1px solid rgba(11, 79, 173, 0.18);
}

/* ===== WHY PARTNER WITH SRMIST (SECTION 6: 3x2 GRID) ===== */
.why-partner-section { background: var(--cream-50); }
.why-partner-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.why-partner-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  display: flex;
  flex-direction: column;
}
.why-partner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(6, 30, 74, 0.10);
  border-color: var(--gold-500);
  border-top: 3px solid var(--gold-500);
}
.why-card-icon {
  width: 44px; height: 44px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.why-partner-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 8px;
  line-height: 1.3;
}
.why-partner-card p {
  font-size: 0.9rem;
  color: var(--ink-600);
  line-height: 1.55;
  margin-bottom: 16px;
  flex-grow: 1;
}
.why-card-proof {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--navy-700);
  background: rgba(11, 79, 173, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
}

/* ===== VISION & MISSION (SECTION 7: STRETCH & NO DEAD SPACE) ===== */
.vision-mission {
  background: var(--cream-50);
  position: relative;
  overflow: hidden;
}
.vm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}
.vm-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
}
.vm-icon-wrapper {
  margin-bottom: 16px;
}
.vm-icon-inner {
  width: 52px; height: 52px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vm-card h3 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.5rem;
  color: var(--navy-900);
  margin-bottom: 12px;
}
.vm-vision-statement {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text-dark);
  margin-bottom: 20px;
}
.highlight-blue { color: var(--navy-700); }
.vm-vision-pullquote {
  margin-top: auto;
  padding: 14px;
  background: rgba(240, 180, 41, 0.08);
  border-left: 3px solid var(--gold-500);
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--navy-900);
  font-size: 0.88rem;
  font-weight: 600;
  font-style: italic;
}
.vm-mission-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.vm-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.92rem;
  line-height: 1.5;
}
.vm-list-badge {
  width: 26px; height: 26px;
  background: rgba(11, 79, 173, 0.1);
  color: var(--navy-700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.vm-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-top: 26px;
}
.vm-stat-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  text-align: center;
}
.vm-stat-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--navy-900);
}
.vm-stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-600);
}

/* ===== IMPACT & MILESTONES (SECTION 8) ===== */
.impact {
  background: var(--cream-50);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.impact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (min-width: 1280px) {
  .impact-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
.impact-item {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.impact-icon-badge {
  width: 44px; height: 44px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.impact-number {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--navy-900);
  line-height: 1.1;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.impact-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 6px 0 4px;
  line-height: 1.25;
}
.impact-caption {
  font-size: 0.74rem;
  color: var(--ink-600);
  line-height: 1.35;
  margin-top: auto;
}

/* ===== CENTRES OF EXCELLENCE (SECTION 9: FILTER & CARDS) ===== */
.ecosystem { background: var(--cream-50); }
.coe-filter-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.coe-filter-btn {
  background: #ffffff;
  border: 1.5px solid var(--border);
  color: var(--text-dark);
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.coe-filter-btn:hover {
  border-color: var(--navy-700);
  color: var(--navy-700);
}
.coe-filter-btn.active {
  background: var(--navy-900);
  color: #ffffff;
  border-color: var(--navy-900);
}
.eco-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.eco-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  cursor: pointer;
}
.eco-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(6, 30, 74, 0.12);
  border-color: var(--navy-700);
}
.coe-header {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.coe-purple { background: linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%); }
.coe-blue { background: linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%); }
.coe-orange { background: linear-gradient(135deg, #FFEDD5 0%, #FEE2E2 100%); }
.coe-yellow { background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); }
.coe-teal { background: linear-gradient(135deg, #CCFBF1 0%, #D1FAE5 100%); }
.coe-red { background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%); }

.eco-icon-tile {
  width: 42px; height: 42px;
  background: #ffffff;
  color: var(--navy-900);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}
.coe-header h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--navy-900);
  line-height: 1.25;
}
.coe-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.coe-dept-pill {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--navy-700);
  background: rgba(11, 79, 173, 0.08);
  padding: 3px 10px;
  border-radius: 14px;
  display: inline-block;
  align-self: flex-start;
  margin-bottom: 8px;
}
.coe-partner-chip {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 10px;
}
.coe-statement {
  font-size: 0.88rem;
  color: var(--ink-600);
  line-height: 1.5;
  margin-bottom: 14px;
  flex-grow: 1;
}
.coe-stats-row {
  font-size: 0.78rem;
  color: var(--ink-600);
  background: #F8FAFC;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 14px;
}
.coe-stats-row strong { color: var(--navy-900); }
.coe-action-group {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
.coe-btn-main {
  flex: 1;
  font-size: 0.8rem !important;
  padding: 8px 12px !important;
  min-height: 38px !important;
}
.coe-btn-collab {
  background: transparent;
  color: var(--navy-700);
  border: 1.5px solid rgba(11, 79, 173, 0.3);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.coe-btn-collab:hover {
  background: var(--navy-700);
  color: #ffffff;
}

/* ===== WAYS TO COLLABORATE (SECTION 10) ===== */
.ways-section { background: var(--cream-50); }
.ways-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.way-tile {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.way-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(6, 30, 74, 0.09);
  border-color: var(--gold-500);
}
.way-icon-box {
  width: 42px; height: 42px;
  background: rgba(11, 79, 173, 0.08);
  color: var(--navy-700);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.way-tile h4 {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 6px;
  line-height: 1.3;
}
.way-tile p {
  font-size: 0.84rem;
  color: var(--ink-600);
  line-height: 1.5;
  margin-bottom: 14px;
  flex-grow: 1;
}
.way-enquire-link {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--navy-700);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.way-enquire-link:hover {
  color: var(--gold-600);
}

/* ===== DEPT DASHBOARD (SECTION 11: 4 COLUMNS AT 1280PX) ===== */
.dashboard-section { background: var(--cream-50); }
.dept-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.dept-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  flex: 1;
  max-width: 420px;
}
.dept-search-box input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--text-dark);
}
.dept-sort-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--ink-600);
}
.dept-sort-box select {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: #ffffff;
  font-size: 0.84rem;
  font-family: inherit;
  color: var(--text-dark);
  cursor: pointer;
}

#dept-grid-view.dept-card-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  align-items: start;
}
@media (min-width: 1280px) {
  #dept-grid-view.dept-card-grid {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}
@media (max-width: 900px) {
  #dept-grid-view.dept-card-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 580px) {
  #dept-grid-view.dept-card-grid {
    grid-template-columns: 1fr !important;
  }
}

.dept-accordion {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.22s ease;
  cursor: pointer;
}
.dept-accordion:hover {
  box-shadow: 0 8px 24px rgba(11, 79, 173, 0.10);
  border-color: rgba(11, 79, 173, 0.35);
  transform: translateY(-2px);
}
.dept-acc-header {
  padding: 16px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.dept-acc-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dept-icon-circle {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(11, 79, 173, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.dept-icon-circle img {
  width: 100%; height: 100%; object-fit: cover;
}
.dept-acc-info { display: flex; flex-direction: column; }
.dept-acc-title {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--navy-900);
  line-height: 1.25;
}
.dept-acc-count {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--navy-700);
}
.dept-acc-chevron {
  color: var(--ink-600);
  transition: transform 0.25s ease;
}
.dept-accordion.is-open .dept-acc-chevron {
  transform: rotate(180deg);
}
.dept-acc-body {
  padding: 0 14px 14px;
  border-top: 1px solid #ECE7D9;
}
.partner-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.partner-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px;
}
.partner-card-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--navy-900);
}
.partner-card-about {
  font-size: 0.76rem;
  color: var(--ink-600);
  line-height: 1.4;
  margin: 4px 0;
}
.partner-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mou-year-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--navy-700);
}
.mou-photo-btn {
  background: var(--gold-500);
  border: none;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

/* ===== HOW PARTNERSHIP WORKS (SECTION 12) ===== */
.how-works-section { background: var(--cream-50); }
.timeline-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
  margin-bottom: 34px;
}
.timeline-row::before {
  content: '';
  position: absolute;
  top: 32px; left: 12%; right: 12%;
  height: 2px;
  background: linear-gradient(90deg, var(--gold-500), var(--navy-700));
  z-index: 1;
}
.timeline-step-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px 18px;
  text-align: center;
  position: relative;
  z-index: 2;
}
.step-num-node {
  width: 48px; height: 48px;
  background: var(--navy-900);
  color: var(--gold-500);
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 14px rgba(6, 30, 74, 0.2);
}
.timeline-step-card h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 8px;
}
.timeline-step-card p {
  font-size: 0.84rem;
  color: var(--ink-600);
  line-height: 1.5;
}
.timeline-cta-row {
  text-align: center;
}

/* ===== SUCCESS STORIES (SECTION 13) ===== */
.success-stories-section { background: var(--cream-50); }
.success-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.success-card {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.success-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(6, 30, 74, 0.10);
  border-color: var(--navy-700);
}
.success-card-top {
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F8FAFC;
  border-bottom: 1px solid #ECE7D9;
}
.success-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy-700);
  background: rgba(11, 79, 173, 0.08);
  padding: 3px 8px;
  border-radius: 4px;
}
.success-partner-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--navy-900);
}
.success-photo-slot {
  height: 180px;
  overflow: hidden;
  background: #061E4A;
}
.success-photo-slot img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease;
}
.success-card:hover .success-photo-slot img {
  transform: scale(1.05);
}
.success-card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.success-card-body h4 {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 8px;
  line-height: 1.35;
}
.success-card-body p {
  font-size: 0.85rem;
  color: var(--ink-600);
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}
.success-read-more {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--navy-700);
}
.success-read-more:hover { color: var(--gold-600); }

/* ===== EVENTS & NEWS (SECTION 14) ===== */
.events-news-section { background: var(--cream-50); }
.events-news-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.col-head-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--navy-900);
  margin-bottom: 18px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.event-card-item {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}
.event-date-box {
  background: var(--navy-900);
  color: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}
.event-day {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--gold-500);
  line-height: 1;
}
.event-month {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
.event-info h4 {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 4px;
}
.event-info p {
  font-size: 0.8rem;
  color: var(--ink-600);
  line-height: 1.45;
  margin-bottom: 8px;
}
.event-action-link {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--navy-700);
}

.news-card-item {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-bottom: 12px;
}
.news-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 6px;
}
.milestone-tag { background: #DCFCE7; color: #166534; }
.coe-tag { background: #E0F2FE; color: #075985; }
.national-tag { background: #FEF3C7; color: #92400E; }
.news-card-item h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--navy-900);
  margin-bottom: 4px;
}
.news-card-item p {
  font-size: 0.8rem;
  color: var(--ink-600);
  line-height: 1.4;
}

/* ===== PARTNER ENQUIRY (SECTION 15: NAVY & GOLD BAND) ===== */
.partner-enquiry-section {
  background: linear-gradient(135deg, var(--navy-900) 0%, #082860 100%);
  color: #ffffff;
  padding: 64px 0;
}
.enquiry-card-wrap {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 40px;
  align-items: center;
}
.enquiry-left-pane h2 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(1.9rem, 2.8vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.2;
}
.enquiry-subtext {
  font-size: 0.94rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 22px;
}
.enquiry-reassurances {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 26px;
}
.reassurance-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.9);
}
.reassurance-check {
  width: 22px; height: 22px;
  background: rgba(240, 180, 41, 0.2);
  color: var(--gold-400);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.enquiry-contact-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 18px;
}
.contact-pill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.8);
}

.enquiry-right-pane {
  background: #ffffff;
  border-radius: var(--radius-xl);
  padding: 32px 28px;
  color: var(--text-dark);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.25);
}
.enquiry-form .form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.enquiry-form .form-group {
  margin-bottom: 14px;
}
.enquiry-form label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ink-900);
  margin-bottom: 5px;
}
.enquiry-form label .req { color: #DC2626; }
.enquiry-form input, .enquiry-form select, .enquiry-form textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text-dark);
  background: #FFFFFF;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.enquiry-form input:focus, .enquiry-form select:focus, .enquiry-form textarea:focus {
  outline: none;
  border-color: var(--navy-700);
  box-shadow: 0 0 0 3px rgba(11, 79, 173, 0.12);
}
.enquiry-submit-btn {
  width: 100%;
  margin-top: 8px;
  font-size: 0.95rem !important;
}
.enquiry-success-alert {
  margin-top: 14px;
  padding: 12px 16px;
  background: #DCFCE7;
  border: 1px solid #86EFAC;
  border-radius: 8px;
  color: #166534;
  font-size: 0.86rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ===== FAQ SECTION (SECTION 16) ===== */
.faq-section { background: var(--cream-50); }
.faq-accordion-wrap {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.faq-item {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-item.is-open {
  border-color: var(--navy-700);
}
.faq-question-btn {
  width: 100%;
  background: transparent;
  border: none;
  padding: 18px 20px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  font-family: inherit;
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--navy-900);
  cursor: pointer;
}
.faq-chevron-icon {
  width: 18px; height: 18px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.faq-item.is-open .faq-chevron-icon {
  transform: rotate(180deg);
}
.faq-answer-body {
  padding: 0 20px 18px;
  font-size: 0.9rem;
  color: var(--ink-600);
  line-height: 1.6;
  border-top: 1px solid #F1F5F9;
}

/* ===== FOOTER (SECTION 17: 4 COLUMNS) ===== */
.footer {
  background: #030814;
  color: #ffffff;
  padding: 60px 0 24px;
  border-top: 1px solid rgba(240, 180, 41, 0.25);
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr 1fr;
  gap: 36px;
  margin-bottom: 44px;
}
.footer-logo { height: 44px; width: auto; margin-bottom: 12px; }
.footer-tagline {
  font-size: 0.96rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 10px;
}
.footer-desc {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
}
.footer-links-col h5 {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-400);
  margin-bottom: 16px;
}
.footer-links-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links-col li, .footer-links-col li a {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;
}
.footer-links-col li a:hover {
  color: var(--gold-400);
}
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-bottom p {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.45);
}
.footer-mic-note {
  color: var(--gold-400) !important;
  font-weight: 700;
}

/* ===== BACK TO TOP BUTTON ===== */
#back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(6, 30, 74, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: none;
  color: var(--gold-500);
  cursor: pointer;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 6px 20px rgba(2, 7, 19, 0.35);
  padding: 0;
}
#back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
#back-to-top:hover {
  transform: translateY(-4px) scale(1.06);
  background: #020713;
  box-shadow: 0 10px 26px rgba(240, 180, 41, 0.32), 0 4px 14px rgba(2, 7, 19, 0.45);
  color: #FFE58F;
}
#back-to-top .progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  pointer-events: none;
  transform: rotate(-90deg);
}
#back-to-top .progress-ring-circle {
  stroke-dasharray: 131.95;
  stroke-dashoffset: 131.95;
  transition: stroke-dashoffset 0.12s linear;
}
#back-to-top .btt-arrow {
  position: relative;
  z-index: 2;
  transition: transform 0.25s ease;
  display: block;
}
#back-to-top:hover .btt-arrow {
  transform: translateY(-2px);
}
#scroll-progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: var(--gold-500);
  z-index: 1001;
  width: 0%;
  transition: width 0.1s linear;
}

/* ===== MOU PHOTO LIGHTBOX (PRESERVED MODAL STYLES) ===== */
#mou-photo-modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
#mou-photo-modal.is-active { display: flex; }
.mou-modal-box {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  max-width: 820px; width: 100%;
  overflow: hidden;
  color: #ffffff;
}
.mou-modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.mou-modal-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold-400);
  text-transform: uppercase;
}
.mou-modal-close {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 4px;
}
.mou-modal-img-wrap {
  position: relative;
  height: 420px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mou-modal-img-wrap img {
  max-width: 100%; max-height: 100%; object-fit: contain;
}
.mou-modal-nav {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.mou-modal-prev { left: 14px; }
.mou-modal-next { right: 14px; }
.mou-thumbnails-grid {
  display: flex; gap: 8px; padding: 12px 20px; overflow-x: auto;
}
.mou-thumb-item {
  width: 56px; height: 42px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 1.5px solid transparent; flex-shrink: 0;
}
.mou-thumb-item.is-active { border-color: var(--gold-500); }
.mou-thumb-item img { width: 100%; height: 100%; object-fit: cover; }
.mou-modal-footer-note {
  padding: 10px 20px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ===== REVEAL ON SCROLL & ACCESSIBILITY ===== */
.reveal, .reveal-scale, .reveal-left, .reveal-right {
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.reveal { transform: translateY(22px); }
.reveal-scale { transform: scale(0.96) translateY(14px); }
.reveal-left { transform: translateX(-24px); }
.reveal-right { transform: translateX(24px); }

.is-revealed {
  opacity: 1 !important;
  transform: none !important;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ===== RESPONSIVE MEDIA QUERIES ===== */
@media (max-width: 1024px) {
  .proof-strip-card { grid-template-columns: repeat(3, 1fr); }
  .proof-metric-item:nth-child(3) { border-right: none; }
  .why-partner-grid { grid-template-columns: repeat(2, 1fr); }
  .ways-grid { grid-template-columns: repeat(2, 1fr); }
  .timeline-row { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .timeline-row::before { display: none; }
  .success-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .section { padding: 40px 0; }
  .nav-links {
    display: none;
    position: absolute;
    top: 72px; left: 0; width: 100%;
    background: #061E4A;
    flex-direction: column;
    padding: 24px;
    gap: 18px;
    border-bottom: 1px solid rgba(240, 180, 41, 0.25);
  }
  .nav-links.is-open { display: flex; }
  .nav-hamburger { display: block; }
  .hero { min-height: 480px; max-height: none; padding: 120px 0 44px; }
  .proof-strip-card { grid-template-columns: 1fr; margin-top: 10px; }
  .proof-metric-item { border-right: none; border-bottom: 1px solid #ECE7D9; padding: 8px 0; }
  .proof-metric-item:last-child { border-bottom: none; }
  .about-grid { grid-template-columns: 1fr; }
  .why-partner-grid { grid-template-columns: 1fr; }
  .vm-grid { grid-template-columns: 1fr; }
  .vm-stats-strip { grid-template-columns: repeat(2, 1fr); }
  .eco-grid { grid-template-columns: 1fr; }
  .ways-grid { grid-template-columns: 1fr; }
  .timeline-row { grid-template-columns: 1fr; }
  .success-grid { grid-template-columns: 1fr; }
  .events-news-grid { grid-template-columns: 1fr; }
  .enquiry-card-wrap { grid-template-columns: 1fr; }
  .enquiry-form .form-row-2 { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
}
`;

fs.writeFileSync(path.join(srmIicDir, 'style.css'), newCss, 'utf8');
console.log('Successfully wrote updated srm iic/style.css');


// =========================================================================
// 3. GENERATE SCRIPT.JS (WITH COES FILTER, SEARCH/SORT, ENQUIRY PREFILL & ACCORDION)
// =========================================================================
const newJs = `/* ===== HELPER FUNCTIONS ===== */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getInitials(name) {
  if (!name) return 'SRM';
  const parts = name.trim().split(/\\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/* ===== DEPARTMENT ACCORDION & SEARCH/SORT ENGINE ===== */
let currentDeptQuery = '';
let currentDeptSort = 'default';

function renderDeptCards() {
  const container = document.getElementById('dept-grid-view');
  if (!container || typeof mousData === 'undefined' || !mousData.categories) return;

  let categories = [...mousData.categories];

  // 1. Filter by search query
  if (currentDeptQuery) {
    const q = currentDeptQuery.toLowerCase();
    categories = categories.filter(cat => {
      const matchTitle = cat.title.toLowerCase().includes(q);
      const matchPartners = (cat.partners || []).some(p => p.name.toLowerCase().includes(q));
      return matchTitle || matchPartners;
    });
  }

  // 2. Sort categories
  if (currentDeptSort === 'most') {
    categories.sort((a, b) => (b.partners ? b.partners.length : 0) - (a.partners ? a.partners.length : 0));
  } else if (currentDeptSort === 'alpha') {
    categories.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (categories.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:36px; background:#fff; border-radius:12px; border:1.5px solid var(--border);"><p style="color:var(--ink-600); font-weight:600;">No departments or partners match your search.</p></div>';
    return;
  }

  container.innerHTML = categories.map(function(cat, idx) {
    const partnerCount = cat.partners ? cat.partners.length : 0;
    
    // Up to 3 partner initials chips
    const partnerChips = (cat.partners || []).slice(0, 3).map(p => {
      return '<span style="display:inline-block; font-size:0.68rem; font-weight:700; background:#ECE7D9; color:var(--navy-900); padding:2px 6px; border-radius:4px;">' + escapeHTML(getInitials(p.name)) + '</span>';
    }).join(' ');

    return (
      '<div class="dept-accordion" id="acc-' + escapeHTML(cat.id) + '">' +
        '<div class="dept-acc-header" onclick="toggleAccordion(\\'' + escapeHTML(cat.id) + '\\')">' +
          '<div class="dept-acc-left">' +
            '<div class="dept-icon-circle">' +
              '<img src="' + escapeHTML(cat.icon) + '" alt="' + escapeHTML(cat.title) + ' Icon" onerror="this.src=\\'Images/aiml-icon.jpg\\'">' +
            '</div>' +
            '<div class="dept-acc-info">' +
              '<h4 class="dept-acc-title">' + escapeHTML(cat.title) + '</h4>' +
              '<span class="dept-acc-count">' + partnerCount + ' Active MoU' + (partnerCount === 1 ? '' : 's') + '</span>' +
              '<div style="display:flex; gap:4px; margin-top:4px;">' + partnerChips + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dept-acc-chevron" aria-label="Expand">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</div>' +
        '</div>' +
        '<div class="dept-acc-body" id="body-' + escapeHTML(cat.id) + '" hidden>' +
          '<div class="partner-cards-grid">' +
            renderPartnerCards(cat.partners || []) +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function handleDeptSearch(e) {
  currentDeptQuery = e.target.value.trim();
  renderDeptCards();
}

function handleDeptSort(e) {
  currentDeptSort = e.target.value;
  renderDeptCards();
}

function renderPartnerCards(partners) {
  if (!partners || partners.length === 0) {
    return '<div style="padding:10px; font-size:0.8rem; color:var(--ink-600);"><p>Partners coming soon.</p></div>';
  }

  return partners.map(function(p) {
    const initials = getInitials(p.name);
    const logoHTML = p.logo
      ? '<img src="' + escapeHTML(p.logo) + '" alt="' + escapeHTML(p.name) + ' Logo" loading="lazy" style="height:28px; width:auto; max-width:80px; object-fit:contain;" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'inline\\'">' +
        '<span style="display:none; font-weight:700; font-size:0.75rem;">' + initials + '</span>'
      : '<span style="font-weight:700; font-size:0.75rem;">' + initials + '</span>';

    let photos = [];
    if (p.mouPhotos && Array.isArray(p.mouPhotos) && p.mouPhotos.length > 0) {
      photos = p.mouPhotos;
    } else if (p.mouPhoto && p.mouPhoto.trim() !== '') {
      photos = [p.mouPhoto];
    }

    const hasPhoto = photos.length > 0;
    const photosJSON = hasPhoto ? escapeHTML(JSON.stringify(photos)) : '';

    const clickAttr = hasPhoto
      ? 'onclick="openMouModal(' + photosJSON + ', ' + \"'\" + escapeHTML(p.name) + \"'\" + ')" role="button" tabindex="0"'
      : '';
    const photoBtnText = photos.length > 1 ? 'Photos (' + photos.length + ') →' : 'Photo →';
    const photoBtn = hasPhoto
      ? '<button class=\"mou-photo-btn\" title=\"View MoU signing photos\">' + photoBtnText + '</button>'
      : '';

    return (
      '<div class=\"partner-card\" ' + clickAttr + '>' +
        '<div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;\">' +
          '<div class=\"partner-card-name\">' + escapeHTML(p.name) + '</div>' +
          '<div>' + logoHTML + '</div>' +
        '</div>' +
        '<p class=\"partner-card-about\">' + escapeHTML(p.about) + '</p>' +
        '<div class=\"partner-card-footer\">' +
          '<span class=\"mou-year-tag\">MoU ' + escapeHTML(p.year) + '</span>' +
          photoBtn +
        '</div>' +
      '</div>'
    );
  }).join('');
}

let openCategoryId = null;
function toggleAccordion(categoryId) {
  const acc = document.getElementById('acc-' + categoryId);
  const body = document.getElementById('body-' + categoryId);
  if (!acc || !body) return;

  const isOpen = !body.hidden;

  if (openCategoryId && openCategoryId !== categoryId) {
    const prevBody = document.getElementById('body-' + openCategoryId);
    const prevAcc = document.getElementById('acc-' + openCategoryId);
    if (prevBody) prevBody.hidden = true;
    if (prevAcc) prevAcc.classList.remove('is-open');
  }

  if (isOpen) {
    body.hidden = true;
    acc.classList.remove('is-open');
    openCategoryId = null;
  } else {
    body.hidden = false;
    acc.classList.add('is-open');
    openCategoryId = categoryId;
  }
}

/* ===== CENTRE OF EXCELLENCE FILTER ===== */
function filterCoEs(dept) {
  const buttons = document.querySelectorAll('.coe-filter-btn');
  buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === dept));

  const cards = document.querySelectorAll('#coeGrid .eco-card');
  cards.forEach(card => {
    if (dept === 'all' || card.dataset.dept === dept) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ===== ENQUIRY PREFILL & FORM CONTROLLER ===== */
function prefillEnquiry(collabType, focusNote) {
  const typeSelect = document.getElementById('eq-type');
  const msgArea = document.getElementById('eq-msg');
  if (typeSelect && collabType) {
    typeSelect.value = collabType;
  }
  if (msgArea && focusNote) {
    msgArea.value = 'Interested in discussing: ' + focusNote;
  }
  const enquirySection = document.getElementById('partner-enquiry');
  if (enquirySection) {
    enquirySection.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleEnquirySubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('enquirySubmitBtn');
  const alertBox = document.getElementById('enquirySuccessState');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Submitting Enquiry...</span>';
  }

  // Client-side confirmation
  setTimeout(() => {
    if (btn) btn.style.display = 'none';
    if (alertBox) alertBox.style.display = 'flex';
  }, 600);
}

/* ===== FAQ ACCORDION TOGGLE ===== */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-answer-body');
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';

  // Close others for clean single-expanded view
  document.querySelectorAll('.faq-item').forEach(other => {
    if (other !== item) {
      other.classList.remove('is-open');
      const otherBtn = other.querySelector('.faq-question-btn');
      const otherBody = other.querySelector('.faq-answer-body');
      if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      if (otherBody) otherBody.hidden = true;
    }
  });

  if (isExpanded) {
    btn.setAttribute('aria-expanded', 'false');
    body.hidden = true;
    item.classList.remove('is-open');
  } else {
    btn.setAttribute('aria-expanded', 'true');
    body.hidden = false;
    item.classList.add('is-open');
  }
}

/* ===== MOBILE NAV DRAWER ===== */
function toggleMobileNav() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('is-open');
  }
}

/* ===== MOU PHOTO LIGHTBOX ===== */
let currentMouPhotos = [];
let currentMouIndex = 0;
let currentMouPartner = '';

function openMouModal(photos, partnerName) {
  const modal = document.getElementById('mou-photo-modal');
  const img = document.getElementById('mou-modal-img');
  const title = document.getElementById('mou-modal-title');
  if (!modal || !img) return;

  if (typeof photos === 'string') {
    try {
      currentMouPhotos = JSON.parse(photos);
    } catch(e) {
      currentMouPhotos = [photos];
    }
  } else if (Array.isArray(photos)) {
    currentMouPhotos = photos;
  } else {
    currentMouPhotos = [];
  }

  currentMouIndex = 0;
  currentMouPartner = partnerName || 'MoU Signing';

  updateMouModalContent();

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function updateMouModalContent() {
  const img = document.getElementById('mou-modal-img');
  const title = document.getElementById('mou-modal-title');
  const thumbContainer = document.getElementById('mou-modal-thumbnails');
  const prevBtn = document.getElementById('mou-prev-btn');
  const nextBtn = document.getElementById('mou-next-btn');
  const counter = document.getElementById('mou-photo-counter');

  if (!img) return;

  const currentSrc = currentMouPhotos[currentMouIndex] || '';

  img.src = currentSrc;
  img.alt = currentMouPartner + ' MoU Signing Photo ' + (currentMouIndex + 1);

  if (title) title.textContent = currentMouPartner;

  if (counter) {
    if (currentMouPhotos.length > 1) {
      counter.textContent = (currentMouIndex + 1) + ' / ' + currentMouPhotos.length;
      counter.style.display = 'inline';
    } else {
      counter.style.display = 'none';
    }
  }

  if (prevBtn) prevBtn.style.display = currentMouPhotos.length > 1 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentMouPhotos.length > 1 ? 'flex' : 'none';

  if (thumbContainer) {
    if (currentMouPhotos.length > 1) {
      thumbContainer.style.display = 'flex';
      thumbContainer.innerHTML = currentMouPhotos.map((src, i) => \`
        <div class="mou-thumb-item \${i === currentMouIndex ? 'is-active' : ''}" onclick="selectMouPhoto(\${i})">
          <img src="\${escapeHTML(src)}" alt="Thumbnail \${i + 1}">
        </div>
      \`).join('');
    } else {
      thumbContainer.style.display = 'none';
      thumbContainer.innerHTML = '';
    }
  }
}

function selectMouPhoto(index) {
  if (index >= 0 && index < currentMouPhotos.length) {
    currentMouIndex = index;
    updateMouModalContent();
  }
}

function prevMouPhoto() {
  if (currentMouPhotos.length <= 1) return;
  currentMouIndex = (currentMouIndex - 1 + currentMouPhotos.length) % currentMouPhotos.length;
  updateMouModalContent();
}

function nextMouPhoto() {
  if (currentMouPhotos.length <= 1) return;
  currentMouIndex = (currentMouIndex + 1) % currentMouPhotos.length;
  updateMouModalContent();
}

function closeMouModal() {
  const modal = document.getElementById('mou-photo-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  document.body.style.overflow = '';
}

/* ===== ANIMATED NUMBER COUNTER ===== */
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      let start = 0;
      const duration = 1400;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });

/* ===== SCROLL REVEAL OBSERVER ===== */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

/* ===== HERO PARTICLES ===== */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 16000), 55);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(240, 180, 41, ' : 'rgba(30, 100, 212, '
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          let alpha = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = \`rgba(240, 180, 41, \${alpha})\`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== TOP SCROLL PROGRESS & BACK TO TOP BUTTON ===== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    if (backToTopBtn) {
      if (scrollTop > 350) backToTopBtn.classList.add('is-visible');
      else backToTopBtn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ===== DOMContentLoaded INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  renderDeptCards();

  document.querySelectorAll('[data-target]').forEach(function(el) {
    counterObserver.observe(el);
  });

  document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(function(el) {
    revealObserver.observe(el);
  });

  initHeroParticles();
  initScrollProgress();

  const modal = document.getElementById('mou-photo-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeMouModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMouModal();
    if (e.key === 'ArrowLeft') prevMouPhoto();
    if (e.key === 'ArrowRight') nextMouPhoto();
  });
});
`;

fs.writeFileSync(path.join(srmIicDir, 'script.js'), newJs, 'utf8');
console.log('Successfully wrote updated srm iic/script.js');
