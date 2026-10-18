const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetailPath = path.join(srmIicDir, 'coe-detail.html');
let html = fs.readFileSync(coeDetailPath, 'utf8');

const completeCss = `
    /* ========================================================
       SECTION: FOCUS AREAS & RESEARCH THRUSTS
       ======================================================== */
    .focus-areas-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .focus-area-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 28px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }

    .focus-area-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--gold-400);
    }

    .focus-area-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .focus-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--blue-50);
      color: var(--blue-600);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border: 1px solid var(--blue-100);
    }

    .focus-area-head h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--navy-900);
      margin: 0;
    }

    .focus-area-card p {
      font-size: 0.92rem;
      color: var(--ink-600);
      line-height: 1.55;
      margin: 0;
    }

    .focus-tech-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-tag-chip {
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--navy-800);
      background: var(--blue-50);
      border: 1px solid var(--blue-100);
      padding: 3px 10px;
      border-radius: var(--radius-sm);
    }

    /* ========================================================
       SECTION: INDUSTRY PARTNERS LOGO STRIP
       ======================================================== */
    .partners-logo-strip {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 28px 36px;
      box-shadow: var(--shadow-sm);
    }

    .partners-strip-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-400);
      text-align: center;
      margin-bottom: 24px;
    }

    .partners-logo-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 28px;
    }

    .partner-logo-item {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      background: var(--cream-50);
      border: 1px solid var(--border-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .partner-logo-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .partner-logo-item img {
      max-height: 32px;
      max-width: 120px;
      object-fit: contain;
      filter: grayscale(20%);
      transition: filter 0.2s ease;
    }

    .partner-logo-item:hover img {
      filter: grayscale(0%);
    }

    .partner-text-badge {
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: var(--navy-800);
    }

    /* ========================================================
       SECTION: RESEARCH PUBLICATIONS & INTELLECTUAL PROPERTY
       ======================================================== */
    .research-ip-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .research-ip-tile {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 32px;
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }

    .research-ip-tile:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--gold-400);
    }

    .ip-meta-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .ip-icon-square {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-lg);
      background: var(--blue-50);
      color: var(--blue-600);
      display: grid;
      place-items: center;
      border: 1px solid var(--blue-100);
      flex-shrink: 0;
    }

    .ip-icon-square.gold-theme {
      background: var(--gold-50);
      color: var(--gold-600);
      border-color: var(--gold-100);
    }

    .ip-number {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--navy-900);
      line-height: 1.1;
    }

    .ip-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--ink-900);
      margin-top: 4px;
    }

    .ip-desc-sub {
      font-size: 0.85rem;
      color: var(--ink-600);
      margin-top: 2px;
    }

    .ip-view-all-link {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--blue-600);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: color 0.2s ease, gap 0.2s ease;
    }

    .ip-view-all-link:hover {
      color: var(--navy-900);
      gap: 10px;
    }

    /* ========================================================
       SECTION J: LEADERSHIP & IN-CHARGE
       ======================================================== */
    .leadership-dual-grid {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 28px;
      align-items: stretch;
    }

    .lead-faculty-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 32px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 24px;
      transition: transform 0.22s ease, box-shadow 0.22s ease;
    }

    .lead-faculty-card:hover {
      box-shadow: var(--shadow-md);
    }

    .lead-header-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .lead-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .lead-avatar-img {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-700) 100%);
      color: var(--gold-500);
      font-family: var(--font-heading);
      font-size: 1.45rem;
      font-weight: 800;
      display: grid;
      place-items: center;
      border: 2px solid var(--gold-500);
      box-shadow: 0 4px 12px rgba(6, 30, 74, 0.2);
    }

    .verified-badge-icon {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--blue-600);
      color: var(--white);
      display: grid;
      place-items: center;
      border: 2px solid var(--white);
    }

    .lead-meta-text h3 {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--navy-900);
      margin: 0 0 6px 0;
    }

    .lead-designation-pill {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--navy-800);
      background: var(--gold-50);
      border: 1px solid var(--gold-100);
      padding: 3px 10px;
      border-radius: var(--radius-sm);
      display: inline-block;
      margin-bottom: 6px;
    }

    .lead-dept-text {
      font-size: 0.85rem;
      color: var(--ink-600);
    }

    .lead-contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: var(--cream-50);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 20px;
    }

    .lead-contact-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .lead-contact-item.full-width {
      grid-column: 1 / -1;
    }

    .contact-item-lbl {
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ink-400);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .contact-item-val {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--ink-900);
      word-break: break-word;
    }

    .contact-item-val a {
      color: var(--blue-600);
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .contact-item-val a:hover {
      color: var(--navy-900);
      text-decoration: underline;
    }

    .lead-actions-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-btn-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: var(--radius-full, 9999px);
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      min-height: 44px;
      border: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }

    .action-btn-primary {
      background: var(--navy-900);
      color: var(--white);
    }

    .action-btn-primary:hover {
      background: var(--navy-700);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(6, 30, 74, 0.25);
    }

    .action-btn-secondary {
      background: var(--cream-100);
      color: var(--navy-900);
      border: 1px solid var(--border-card);
    }

    .action-btn-secondary:hover {
      background: var(--white);
      border-color: var(--gold-500);
      color: var(--navy-900);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .liaison-side-panel {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 32px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
    }

    .liaison-head-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--navy-900);
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
    }

    .liaison-entry-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      background: var(--cream-50);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
    }

    .liaison-avatar-sm {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--blue-50);
      color: var(--blue-600);
      border: 1px solid var(--blue-100);
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 0.95rem;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .liaison-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .liaison-role-lbl {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ink-400);
    }

    .liaison-name-val {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--navy-900);
    }

    .liaison-sub-desc {
      font-size: 0.8rem;
      color: var(--ink-600);
    }

    .academic-support-callout {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px;
      background: var(--blue-50);
      border: 1px solid var(--blue-100);
      border-radius: var(--radius-lg);
    }

    .academic-support-callout .info-icon {
      color: var(--blue-600);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .academic-support-callout h4 {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--navy-900);
      margin: 0 0 4px 0;
    }

    .academic-support-callout p {
      font-size: 0.82rem;
      color: var(--ink-700);
      margin: 0;
      line-height: 1.45;
    }

    /* ========================================================
       SECTION: CLOSING CALL-TO-ACTION BANNER
       ======================================================== */
    .closing-cta-banner {
      background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 60%, #050D1C 100%);
      color: var(--white);
      border-radius: var(--radius-2xl);
      padding: 48px;
      box-shadow: var(--shadow-xl);
      border: 2px solid rgba(245, 197, 24, 0.35);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 36px;
      margin-top: 48px;
      position: relative;
      overflow: hidden;
    }

    .closing-cta-banner::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.05;
      pointer-events: none;
    }

    .closing-cta-text h2 {
      color: var(--white);
      font-size: clamp(1.6rem, 2.5vw, 2.1rem);
      margin-bottom: 10px;
    }

    .closing-cta-text p {
      color: #CBD5E1;
      font-size: 0.95rem;
      max-width: 620px;
      margin: 0;
      line-height: 1.6;
    }

    .closing-cta-buttons {
      display: flex;
      gap: 14px;
      flex-shrink: 0;
      flex-wrap: wrap;
    }

    /* ========================================================
       SECTION: MODAL DIALOG & TOAST NOTIFICATION
       ======================================================== */
    .visit-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 30, 74, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: none;
      place-items: center;
      z-index: 10000;
      padding: 24px;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .visit-modal-backdrop.open {
      display: grid;
      opacity: 1;
    }

    .visit-modal {
      background: var(--white);
      border-radius: var(--radius-2xl);
      width: 100%;
      max-width: 520px;
      padding: 36px;
      box-shadow: 0 24px 64px rgba(6, 30, 74, 0.35);
      position: relative;
      border: 1px solid var(--border-light);
      transform: translateY(16px);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }

    .visit-modal-backdrop.open .visit-modal {
      transform: translateY(0);
    }

    .modal-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--cream-100);
      border: 1px solid var(--border-light);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: grid;
      place-items: center;
      color: var(--ink-600);
      transition: all 0.2s ease;
    }

    .modal-close-btn:hover {
      background: var(--border-card);
      color: var(--navy-900);
      transform: scale(1.08);
    }

    #consultationForm input,
    #consultationForm select,
    #consultationForm textarea {
      font-family: var(--font-body);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    #consultationForm input:focus,
    #consultationForm select:focus,
    #consultationForm textarea:focus {
      border-color: var(--gold-500) !important;
      box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.2) !important;
      outline: none !important;
    }

    #contact-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: var(--navy-900);
      color: var(--white);
      border: 1.5px solid var(--gold-500);
      padding: 14px 22px;
      border-radius: var(--radius-lg);
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px);
      transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10001;
    }

    #contact-toast.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
`;

// Insert the CSS before the responsive media queries in <style>
const mediaQueryIdx = html.indexOf('@media (max-width: 1024px)');
if (mediaQueryIdx !== -1) {
  html = html.substring(0, mediaQueryIdx) + completeCss + '\n    ' + html.substring(mediaQueryIdx);
  fs.writeFileSync(coeDetailPath, html, 'utf8');
  console.log('Successfully injected all missing CSS before media queries!');
} else {
  // If not found, insert before </style>
  const styleCloseIdx = html.indexOf('</style>');
  html = html.substring(0, styleCloseIdx) + completeCss + '\n  ' + html.substring(styleCloseIdx);
  fs.writeFileSync(coeDetailPath, html, 'utf8');
  console.log('Successfully injected all missing CSS before </style>!');
}
