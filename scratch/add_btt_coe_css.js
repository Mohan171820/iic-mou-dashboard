const fs = require('fs');
const path = require('path');
const srmIicDir = path.resolve(__dirname, '../../srm iic');

const coeDetailPath = path.join(srmIicDir, 'coe-detail.html');
let html = fs.readFileSync(coeDetailPath, 'utf8');

const bttBaseCss = `
    /* Floating Scroll-to-Top Button Base Rule */
    #back-to-top {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--navy-900);
      color: var(--white);
      border: 2px solid var(--gold-500);
      box-shadow: 0 6px 20px rgba(6, 30, 74, 0.35);
      cursor: pointer;
      display: grid;
      place-items: center;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #back-to-top.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    #back-to-top:hover {
      transform: translateY(-4px) scale(1.06);
      background: var(--navy-700);
      box-shadow: 0 10px 24px rgba(245, 197, 24, 0.35);
    }

    #back-to-top svg {
      width: 20px;
      height: 20px;
      stroke: var(--gold-500);
      stroke-width: 2.5;
    }
`;

const styleCloseIdx = html.indexOf('</style>');
html = html.substring(0, styleCloseIdx) + bttBaseCss + '\n  ' + html.substring(styleCloseIdx);
fs.writeFileSync(coeDetailPath, html, 'utf8');
console.log('Added #back-to-top base CSS to coe-detail.html');
