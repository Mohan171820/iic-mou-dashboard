/**
 * MoU Progress Cycle SVG Component Generator - Minimalist Architectural Design
 * Renders sleek, minimal radial progress gauges in 3 sizes: 'large', 'medium', 'small'
 */

const STAGES = [
  { name: 'Initial Communication', pct: 10 },
  { name: 'Discussion in Progress', pct: 25 },
  { name: 'Draft MoU to be Prepared', pct: 40 },
  { name: 'Draft Shared with Company', pct: 55 },
  { name: 'Draft Under Review', pct: 65 },
  { name: 'Revision / Clarification Required', pct: 75, isRevision: true },
  { name: 'Approval Awaited', pct: 85 },
  { name: 'Signing Date to be Finalized', pct: 95 },
  { name: 'Signed', pct: 100 }
];

function createProgressRingHTML({
  size = 'large', // 'large', 'medium', 'small'
  percentage = 10,
  statusName = 'Initial Communication',
  daysInStage = 0,
  isPaused = false
}) {
  const configs = {
    large: { dim: 240, strokeWidth: 8, radius: 95, fontPct: 34, fontStatus: 12, fontDays: 10, nodeRadius: 3.5 },
    medium: { dim: 170, strokeWidth: 6, radius: 68, fontPct: 24, fontStatus: 11, fontDays: 9, nodeRadius: 2.5 },
    small: { dim: 52, strokeWidth: 4, radius: 21, fontPct: 11, fontStatus: 0, fontDays: 0, nodeRadius: 0 }
  };

  const cfg = configs[size] || configs.large;
  const center = cfg.dim / 2;
  const circumference = 2 * Math.PI * cfg.radius;
  
  // Calculate stroke offset for total progress
  const progressOffset = circumference - (percentage / 100) * circumference;

  // Track colors
  let progressColor = '#3b82f6'; // Clean Minimal Accent Blue
  if (isPaused) progressColor = '#d97706';
  else if (statusName === 'Signed') progressColor = '#10b981';
  else if (statusName === 'Not Proceeding') progressColor = '#94a3b8';

  // Build stage tick marks around the ring per stage
  let stageTicksHTML = '';
  if (size !== 'small') {
    for (let i = 0; i < 9; i++) {
      const angleDeg = -90 + (i / 9) * 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const tickX = center + cfg.radius * Math.cos(angleRad);
      const tickY = center + cfg.radius * Math.sin(angleRad);
      const isAchieved = percentage >= STAGES[i].pct;

      stageTicksHTML += `
        <circle cx="${tickX}" cy="${tickY}" r="${cfg.nodeRadius}" 
                fill="${isAchieved ? progressColor : 'var(--bg-card)'}" 
                stroke="${isAchieved ? progressColor : 'var(--border-color)'}" 
                stroke-width="1.5" />
      `;
    }
  }

  // Revision Loop Arrow (subtle dashed curve)
  let revisionArrowHTML = '';
  if (size === 'large' && (statusName === 'Revision / Clarification Required' || percentage >= 75)) {
    const revStartRad = ((-90 + (5 / 9) * 360) * Math.PI) / 180;
    const revX = center + (cfg.radius - 16) * Math.cos(revStartRad);
    const revY = center + (cfg.radius - 16) * Math.sin(revStartRad);
    
    revisionArrowHTML = `
      <path d="M ${center} ${center - cfg.radius + 18} A ${cfg.radius - 18} ${cfg.radius - 18} 0 0 1 ${revX} ${revY}" 
            fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 2" />
    `;
  }

  if (size === 'small') {
    return `
      <div class="mou-ring-container" style="width:${cfg.dim}px; height:${cfg.dim}px;">
        <svg width="${cfg.dim}" height="${cfg.dim}" class="mou-ring-svg">
          <circle cx="${center}" cy="${center}" r="${cfg.radius}" 
                  fill="none" stroke="var(--border-color)" stroke-width="${cfg.strokeWidth}" class="mou-ring-track" />
          <circle cx="${center}" cy="${center}" r="${cfg.radius}" 
                  fill="none" stroke="${progressColor}" stroke-width="${cfg.strokeWidth}"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${progressOffset}"
                  stroke-linecap="round" class="mou-ring-progress" />
        </svg>
        <div class="mou-ring-center">
          <span class="mou-ring-percent" style="font-size:${cfg.fontPct}px;">${percentage}%</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="mou-ring-container" style="width:${cfg.dim}px; height:${cfg.dim}px;">
      <svg width="${cfg.dim}" height="${cfg.dim}" class="mou-ring-svg">
        <!-- Background Track -->
        <circle cx="${center}" cy="${center}" r="${cfg.radius}" 
                fill="none" stroke="var(--border-color)" stroke-width="${cfg.strokeWidth}" class="mou-ring-track" />
        <!-- Smooth Progress Arc -->
        <circle cx="${center}" cy="${center}" r="${cfg.radius}" 
                fill="none" stroke="${progressColor}" stroke-width="${cfg.strokeWidth}"
                stroke-dasharray="${circumference}" stroke-dashoffset="${progressOffset}"
                stroke-linecap="round" class="mou-ring-progress" />
      </svg>
      <!-- Stage Nodes overlaid -->
      <svg width="${cfg.dim}" height="${cfg.dim}" style="position:absolute; top:0; left:0; pointer-events:none;">
        ${stageTicksHTML}
        ${revisionArrowHTML}
      </svg>
      <!-- Center Information -->
      <div class="mou-ring-center">
        <span class="mou-ring-percent" style="font-size:${cfg.fontPct}px;">${percentage}%</span>
        ${cfg.fontStatus ? `<span class="mou-ring-status" style="font-size:${cfg.fontStatus}px;">${statusName}</span>` : ''}
        ${cfg.fontDays ? `<span class="mou-ring-days" style="font-size:${cfg.fontDays}px;">${daysInStage} days in stage</span>` : ''}
      </div>
    </div>
  `;
}
