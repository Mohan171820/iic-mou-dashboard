const db = require('../db/database');

exports.getSummary = (req, res) => {
  try {
    let deptFilter = '';
    const params = [];

    if (req.user.role === 'Coordinator' && req.user.department_id) {
      deptFilter = ' AND department_id = ?';
      params.push(req.user.department_id);
    }

    const total = db.prepare(`SELECT COUNT(*) as count FROM mous WHERE is_deleted = 0 ${deptFilter}`).get(...params).count;
    const signed = db.prepare(`
      SELECT COUNT(*) as count FROM mous 
      WHERE is_deleted = 0 
        AND (
          stage_index IN (4, 5, 6)
          OR LOWER(TRIM(status)) IN ('signed', 'formal signing', 'coe established', 'coe operational', 'active r&d / hiring') 
          OR LOWER(TRIM(status)) LIKE 'signed%' 
          OR LOWER(TRIM(status)) LIKE 'coe%'
          OR LOWER(TRIM(status)) LIKE 'active r&d%'
        ) 
        ${deptFilter}
    `).get(...params).count;
    const inProgress = db.prepare(`
      SELECT COUNT(*) as count FROM mous 
      WHERE is_deleted = 0 
        AND NOT (
          stage_index IN (4, 5, 6)
          OR LOWER(TRIM(status)) IN ('signed', 'formal signing', 'coe established', 'coe operational', 'active r&d / hiring', 'on hold', 'not proceeding') 
          OR LOWER(TRIM(status)) LIKE 'signed%' 
          OR LOWER(TRIM(status)) LIKE 'coe%' 
          OR LOWER(TRIM(status)) LIKE 'active r&d%'
          OR LOWER(TRIM(status)) = 'no'
        ) 
        ${deptFilter}
    `).get(...params).count;
    const onHold = db.prepare(`
      SELECT COUNT(*) as count FROM mous 
      WHERE is_deleted = 0 
        AND (stage_index = 0 OR LOWER(TRIM(status)) IN ('on hold', 'no') OR LOWER(TRIM(status)) LIKE 'on hold%') 
        ${deptFilter}
    `).get(...params).count;
    const notProceeding = db.prepare(`
      SELECT COUNT(*) as count FROM mous 
      WHERE is_deleted = 0 
        AND LOWER(TRIM(status)) IN ('not proceeding', 'cancelled', 'rejected') 
        ${deptFilter}
    `).get(...params).count;

    const avgRow = db.prepare(`
      SELECT ROUND(AVG(CASE WHEN stage_index IN (4, 5, 6) OR LOWER(TRIM(status)) IN ('signed', 'formal signing', 'coe established', 'coe operational', 'active r&d / hiring') OR LOWER(TRIM(status)) LIKE 'signed%' OR LOWER(TRIM(status)) LIKE 'coe%' THEN 100 ELSE progress_percent END), 1) as avg 
      FROM mous 
      WHERE is_deleted = 0 ${deptFilter}
    `).get(...params);
    const avgPercent = avgRow && avgRow.avg ? avgRow.avg : 0;

    const expiring90 = db.prepare(`
      SELECT COUNT(*) as count FROM mous 
      WHERE is_deleted = 0 AND expiry_date IS NOT NULL 
        AND JULIANDAY(expiry_date) - JULIANDAY('now') BETWEEN 0 AND 90
        ${deptFilter}
    `).get(...params).count;

    const totalRevenue = db.prepare(`SELECT SUM(amount) as sum FROM revenue_items WHERE type = 'realised'`).get().sum || 0;

    const outcomeRows = db.prepare(`
      SELECT internships_ay, placements_ay 
      FROM mous 
      WHERE is_deleted = 0 ${deptFilter}
    `).all(...params);

    let totalInternships = 0;
    let internshipCompanies = 0;
    let totalPlacements = 0;
    let placementCompanies = 0;

    outcomeRows.forEach(m => {
      const iMatch = String(m.internships_ay || '').match(/\d+/);
      const iCount = iMatch ? parseInt(iMatch[0]) : (/^(yes|available|arranged|reported)$/i.test(String(m.internships_ay || '').trim()) ? 1 : 0);
      if (iCount > 0) {
        totalInternships += iCount;
        internshipCompanies++;
      }
      const pMatch = String(m.placements_ay || '').match(/\d+/);
      const pCount = pMatch ? parseInt(pMatch[0]) : (/^(yes|available|arranged|reported)$/i.test(String(m.placements_ay || '').trim()) ? 1 : 0);
      if (pCount > 0) {
        totalPlacements += pCount;
        placementCompanies++;
      }
    });

    res.json({
      success: true,
      summary: {
        total,
        signed,
        inProgress,
        onHold,
        notProceeding,
        avgPercent,
        expiring90,
        totalRevenue,
        totalInternships,
        internshipCompanies,
        totalPlacements,
        placementCompanies
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStatusDistribution = (req, res) => {
  try {
    let deptFilter = '';
    const params = [];

    if (req.user.role === 'Coordinator' && req.user.department_id) {
      deptFilter = ' AND department_id = ?';
      params.push(req.user.department_id);
    }

    // Get configured statuses order
    const configs = db.prepare('SELECT status_name, percentage, color_code FROM mou_status_config ORDER BY step_order ASC').all();

    const distribution = configs.map(c => {
      const row = db.prepare(`
        SELECT COUNT(*) as count FROM mous 
        WHERE is_deleted = 0 AND status = ? ${deptFilter}
      `).get(c.status_name, ...params);

      return {
        status: c.status_name,
        percentage: c.percentage,
        color: c.color_code,
        count: row ? row.count : 0
      };
    });

    res.json({ success: true, distribution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartmentProgress = (req, res) => {
  try {
    const rawDepts = db.prepare(`
      SELECT d.id, d.name, d.hod_name,
             COALESCE(
               NULLIF(TRIM(d.hod_name), ''),
               (SELECT faculty_spoc FROM mous WHERE department_id = d.id AND faculty_spoc IS NOT NULL AND TRIM(faculty_spoc) != '' AND TRIM(faculty_spoc) != '-' LIMIT 1)
             ) as faculty_spoc,
             COUNT(m.id) as total_mous,
             SUM(CASE WHEN LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%' THEN 1 ELSE 0 END) as signed_mous,
             SUM(CASE WHEN NOT (LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational', 'on hold', 'not proceeding') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%' OR LOWER(TRIM(m.status)) = 'no') THEN 1 ELSE 0 END) as in_progress_mous,
             SUM(CASE WHEN LOWER(TRIM(m.status)) IN ('on hold', 'no') THEN 1 ELSE 0 END) as on_hold_mous,
             ROUND(COALESCE(AVG(CASE WHEN LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%' THEN 100 ELSE m.progress_percent END), 0), 1) as avg_percent
      FROM departments d
      LEFT JOIN mous m ON d.id = m.department_id AND m.is_deleted = 0
      GROUP BY d.id
      ORDER BY avg_percent DESC, d.name ASC
    `).all();

    // Ensure IT and Information Technology are unified under Information Technology
    const deptsMap = new Map();
    for (const d of rawDepts) {
      const isIT = d.name.trim().toUpperCase() === 'IT' || d.name.trim().toLowerCase() === 'information technology';
      const key = isIT ? 'Information Technology' : d.name.trim();
      if (!deptsMap.has(key)) {
        deptsMap.set(key, { ...d, name: key });
      } else {
        const existing = deptsMap.get(key);
        const total = (existing.total_mous || 0) + (d.total_mous || 0);
        const signed = (existing.signed_mous || 0) + (d.signed_mous || 0);
        const inProg = (existing.in_progress_mous || 0) + (d.in_progress_mous || 0);
        const onHold = (existing.on_hold_mous || 0) + (d.on_hold_mous || 0);
        const avg = total > 0 ? ((existing.avg_percent * (existing.total_mous || 0)) + (d.avg_percent * (d.total_mous || 0))) / total : 0;
        existing.total_mous = total;
        existing.signed_mous = signed;
        existing.in_progress_mous = inProg;
        existing.on_hold_mous = onHold;
        existing.avg_percent = Math.round(avg * 10) / 10;
        if (!existing.faculty_spoc && d.faculty_spoc) existing.faculty_spoc = d.faculty_spoc;
        if (!existing.hod_name && d.hod_name) existing.hod_name = d.hod_name;
      }
    }
    const depts = Array.from(deptsMap.values()).sort((a, b) => b.avg_percent - a.avg_percent);

    res.json({ success: true, departments: depts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActionRequired = (req, res) => {
  try {
    // 1. Stuck MoUs (>30 days without status change)
    const stuckMous = db.prepare(`
      SELECT m.id, m.title, m.status, m.last_status_change_at, d.name as department_name, i.name as industry_name,
             CAST((JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) AS INTEGER) as days_stuck
      FROM mous m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN industries i ON m.industry_id = i.id
      WHERE m.is_deleted = 0 AND m.status NOT IN ('Signed', 'Not Proceeding')
        AND (JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) >= 30
      ORDER BY days_stuck DESC
    `).all();

    // 2. Expiring MoUs within 90 days
    const expiringMous = db.prepare(`
      SELECT m.id, m.title, m.expiry_date, m.status, d.name as department_name, i.name as industry_name,
             CAST((JULIANDAY(m.expiry_date) - JULIANDAY('now')) AS INTEGER) as days_to_expiry
      FROM mous m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN industries i ON m.industry_id = i.id
      WHERE m.is_deleted = 0 AND m.expiry_date IS NOT NULL
        AND (JULIANDAY(m.expiry_date) - JULIANDAY('now')) BETWEEN 0 AND 90
      ORDER BY days_to_expiry ASC
    `).all();

    // 3. Overdue Commitments
    const overdueCommitments = db.prepare(`
      SELECT c.*, m.title as mou_title, i.name as industry_name
      FROM commitments c
      LEFT JOIN mous m ON c.mou_id = m.id
      LEFT JOIN industries i ON m.industry_id = i.id
      WHERE c.status != 'Achieved' AND c.due_date IS NOT NULL
        AND JULIANDAY(c.due_date) < JULIANDAY('now')
      ORDER BY c.due_date ASC
    `).all();

    res.json({
      success: true,
      actionRequired: {
        stuckMous,
        expiringMous,
        overdueCommitments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlyTrend = (req, res) => {
  try {
    const trend = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month,
             COUNT(*) as created_count,
             SUM(CASE WHEN status = 'Signed' THEN 1 ELSE 0 END) as signed_count
      FROM mous
      WHERE is_deleted = 0
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `).all();

    res.json({ success: true, trend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

function normalizeCityName(raw) {
  if (!raw) return 'Other';
  let str = String(raw).trim().replace(/[()\[\]]/g, '').trim();
  if (/^(not confirmed|not specified|n\/?a|none|pending|null|undefined|unknown)$/i.test(str)) {
    return 'Other';
  }
  const lower = str.toLowerCase();
  if (lower.includes('chennai')) return 'Chennai';
  if (lower.includes('bangalore') || lower.includes('bengaluru')) return 'Bengaluru';
  if (lower.includes('hyderabad')) return 'Hyderabad';
  if (lower.includes('pune')) return 'Pune';
  if (lower.includes('coimbatore')) return 'Coimbatore';
  if (lower.includes('tiruchirappalli') || lower.includes('trichy')) return 'Tiruchirappalli';
  if (lower.includes('gurgaon') || lower.includes('gurugram')) return 'Gurugram';
  if (lower.includes('mumbai') || lower.includes('bombay')) return 'Mumbai';
  if (lower.includes('karur')) return 'Karur';
  if (lower.includes('mangalore') || lower.includes('mangaluru')) return 'Mangalore';
  if (lower.includes('san francisco')) return 'San Francisco';
  if (lower.includes('ethiopia')) return 'Ethiopia';
  if (lower.includes('slovakia')) return 'Slovakia';
  if (lower.includes('slovenia') || lower.includes('maribor')) return 'Slovenia';
  if (lower.includes('portland')) return 'Portland';

  const token = str.split(/[,/;&]/)[0].trim();
  if (!token || token.length < 2) return 'Other';
  return token.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

// --- City Footprint: group companies by city (using address field) ---
exports.getCityAnalytics = (req, res) => {
  try {
    // Each industry's city derived from address field (or sector as fallback)
    const companies = db.prepare(`
      SELECT
        i.id, i.name, i.sector,
        CASE
          WHEN TRIM(COALESCE(i.address,'')) != '' THEN TRIM(i.address)
          ELSE COALESCE(i.sector, 'Other')
        END as city,
        COALESCE(
          (SELECT m.status FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0
           ORDER BY m.updated_at DESC LIMIT 1),
          'Visited Only'
        ) as latest_status,
        (SELECT m.id FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0 ORDER BY m.updated_at DESC LIMIT 1) as mou_id,
        (SELECT COUNT(*) FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0) as mou_count,
        (SELECT COUNT(*) FROM meetings mt WHERE mt.industry_id = i.id) as visit_count,
        (SELECT COALESCE(MAX(m.chairman_visit), 0) FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0) as chairman_visit,
        (SELECT COALESCE(MAX(m.stage_index), 1) FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0) as stage_index
      FROM industries i
      WHERE EXISTS (SELECT 1 FROM mous m WHERE m.industry_id = i.id AND m.is_deleted = 0)
      ORDER BY i.name ASC
    `).all();

    // Aggregate cities with case-insensitive and synonym normalization
    const cityMap = {};
    companies.forEach(c => {
      c.city = normalizeCityName(c.city);
      if (!cityMap[c.city]) cityMap[c.city] = { city: c.city, visits: 0, mous_signed: 0, companies: [] };
      cityMap[c.city].visits += Math.max(c.visit_count, 1);
      if (c.stage_index >= 4 || ['Signed', 'Formal Signing', 'CoE Established', 'CoE Operational', 'Active R&D / Hiring'].includes(c.latest_status)) cityMap[c.city].mous_signed++;
      cityMap[c.city].companies.push(c);
    });

    const cities = Object.values(cityMap).sort((a, b) => {
      if (a.city === 'Other') return 1;
      if (b.city === 'Other') return -1;
      return b.visits - a.visits;
    });
    const totalVisited = companies.length;
    const activeCities = cities.filter(c => c.city !== 'Other').length;
    const coeCount = db.prepare(`
      SELECT COUNT(*) as c FROM mous 
      WHERE is_deleted = 0 
        AND (
          LOWER(TRIM(status)) IN ('coe established', 'coe operational') 
          OR LOWER(coe_status) LIKE '%established%' 
          OR LOWER(coe_status) LIKE '%available%' 
          OR LOWER(coe_status) LIKE '%operational%' 
          OR (coe_status IS NOT NULL AND LOWER(TRIM(coe_status)) IN ('established', 'available', 'operational', 'active')) 
          OR (coe_status IS NOT NULL AND LOWER(TRIM(coe_status)) NOT IN ('na', 'nil', '-', '', 'under discussion', 'yet to establish', 'under progress', 'air discussion process') AND LOWER(TRIM(coe_status)) NOT LIKE '%will be%')
        )
    `).get().c;
    const totalSigned = db.prepare(`SELECT COUNT(*) as c FROM mous WHERE is_deleted = 0 AND (stage_index IN (4, 5, 6) OR status IN ('Signed', 'Formal Signing', 'CoE Established', 'CoE Operational', 'Active R&D / Hiring'))`).get().c;
    const totalChairmanVisits = db.prepare(`SELECT COUNT(DISTINCT industry_id) as c FROM mous WHERE is_deleted = 0 AND chairman_visit = 1`).get().c;

    res.json({ success: true, cities, companies, totalVisited, activeCities, coeCount, totalSigned, totalChairmanVisits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Pipeline Funnel for donut chart and interactive company drilldown ---
exports.getPipelineFunnel = (req, res) => {
  try {
    const selectFields = `
      m.id, m.title, i.name as company_name, i.sector,
      CASE WHEN UPPER(TRIM(d.name)) = 'IT' THEN 'Information Technology' ELSE d.name END as department_name,
      m.faculty_spoc, m.status, m.progress_percent, m.insta_url, m.linkedin_url, m.drive_link, m.chairman_visit,
      COALESCE(i.address, 'Chennai') as hub_city, m.coe_name, m.coe_status, m.mou_date,
      m.internships_ay, m.placements_ay, m.purpose
    `;

    const visitedOnlyList = db.prepare(`
      SELECT ${selectFields} FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0 AND (m.stage_index = 1 OR LOWER(TRIM(m.status)) IN ('initial communication', 'no', 'visited only') OR LOWER(m.status) LIKE '%initial%')
      ORDER BY m.id DESC
    `).all();

    const followUpList = db.prepare(`
      SELECT ${selectFields} FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0 AND (m.stage_index = 2 OR LOWER(m.status) LIKE '%discuss%' OR LOWER(m.status) LIKE '%initiated%' OR LOWER(m.status) LIKE '%process%' OR LOWER(m.status) LIKE '%progress%')
      ORDER BY m.id DESC
    `).all();

    const draftDispatchedList = db.prepare(`
      SELECT ${selectFields} FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0 AND (m.stage_index = 3 OR LOWER(m.status) LIKE '%waiting%' OR LOWER(m.status) LIKE '%approval%' OR LOWER(m.status) LIKE '%draft%' OR LOWER(m.status) = 'final' OR LOWER(m.status) LIKE '%accepted%')
      ORDER BY m.id DESC
    `).all();

    const mouSignedList = db.prepare(`
      SELECT ${selectFields} FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0 AND (m.stage_index IN (4, 5, 6) OR LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational', 'active r&d / hiring') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%')
      ORDER BY m.id DESC
    `).all();

    const coeList = db.prepare(`
      SELECT ${selectFields} FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0 AND (
        LOWER(TRIM(m.status)) IN ('coe established', 'coe operational') 
        OR LOWER(m.coe_status) LIKE '%established%' 
        OR LOWER(m.coe_status) LIKE '%available%' 
        OR LOWER(m.coe_status) LIKE '%operational%' 
        OR (m.coe_status IS NOT NULL AND LOWER(TRIM(m.coe_status)) IN ('established', 'available', 'operational', 'active')) 
        OR (m.coe_status IS NOT NULL AND LOWER(TRIM(m.coe_status)) NOT IN ('na', 'nil', '-', '', 'under discussion', 'yet to establish', 'under progress', 'air discussion process') AND LOWER(TRIM(m.coe_status)) NOT LIKE '%will be%')
      )
      ORDER BY m.id DESC
    `).all();

    const total = db.prepare(`SELECT COUNT(*) as c FROM mous WHERE is_deleted = 0`).get().c;

    res.json({
      success: true,
      total,
      funnel: [
        { label: 'Visited Only', stageKey: 'visited', count: visitedOnlyList.length, color: '#94a3b8', items: visitedOnlyList },
        { label: 'Follow-up Communication', stageKey: 'followup', count: followUpList.length, color: '#38bdf8', items: followUpList },
        { label: 'Draft Dispatched', stageKey: 'draft', count: draftDispatchedList.length, color: '#818cf8', items: draftDispatchedList },
        { label: 'MoU Signed', stageKey: 'signed', count: mouSignedList.length, color: '#10b981', items: mouSignedList },
        { label: 'CoE Operational', stageKey: 'coe', count: coeList.length, color: '#059669', items: coeList }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Branch Analytics: placements and CoE count by department for bar chart ---
exports.getBranchAnalytics = (req, res) => {
  try {
    const rawBranches = db.prepare(`
      SELECT
        d.name as branch,
        COUNT(DISTINCT m.id) as mou_count,
        SUM(CASE WHEN m.status IN ('Signed', 'Formal Signing', 'CoE Established', 'CoE Operational') THEN 1 ELSE 0 END) as signed,
        COALESCE((
          SELECT SUM(CAST(c2.achieved AS INTEGER))
          FROM commitments c2
          JOIN mous m2 ON c2.mou_id = m2.id
          WHERE m2.department_id = d.id AND LOWER(c2.title) LIKE '%intern%'
        ), 0) as placements
      FROM departments d
      LEFT JOIN mous m ON d.id = m.department_id AND m.is_deleted = 0
      GROUP BY d.id
      ORDER BY signed DESC, mou_count DESC
    `).all();

    // Ensure IT is unified into Information Technology
    const branchMap = new Map();
    for (const b of rawBranches) {
      const isIT = b.branch.trim().toUpperCase() === 'IT' || b.branch.trim().toLowerCase() === 'information technology';
      const key = isIT ? 'Information Technology' : b.branch.trim();
      if (!branchMap.has(key)) {
        branchMap.set(key, { ...b, branch: key });
      } else {
        const existing = branchMap.get(key);
        existing.mou_count = (existing.mou_count || 0) + (b.mou_count || 0);
        existing.signed = (existing.signed || 0) + (b.signed || 0);
        existing.placements = (existing.placements || 0) + (b.placements || 0);
      }
    }
    const branches = Array.from(branchMap.values()).sort((a, b) => (b.signed - a.signed) || (b.mou_count - a.mou_count));

    const maxVal = Math.max(...branches.map(b => (b.placements || 0) + (b.signed || 0) * 15), 1);

    res.json({
      success: true,
      branches: branches.map(b => ({
        ...b,
        score: (b.placements || 0) + (b.signed || 0) * 15,
        maxScore: maxVal
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const xlsx = require('xlsx');
const { STATUS_PERCENT_MAP } = require('../config/constants');

function getField(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
    const normalizedTarget = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const rowKey of Object.keys(row)) {
      if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTarget) {
        if (row[rowKey] !== undefined && row[rowKey] !== null && String(row[rowKey]).trim() !== '') {
          return String(row[rowKey]).trim();
        }
      }
    }
  }
  return '';
}

function normalizeMouStage(rawStage) {
  if (!rawStage) return { status: 'Initial Communication', pct: 10 };
  const s = String(rawStage).trim();
  const lower = s.toLowerCase();

  // Signed & CoE stages (100% complete)
  if (lower.startsWith('signed') || lower.startsWith('coe') || lower.includes('formal signing') || lower === 'final' || lower.includes('signed')) {
    if (lower.includes('coe operational')) return { status: 'CoE Operational', pct: 100 };
    if (lower.includes('coe')) return { status: 'CoE Established', pct: 100 };
    if (lower.includes('renewal')) return { status: 'Signed – Under Renewal', pct: 100 };
    return { status: 'Signed', pct: 100 };
  }

  // Pre-signing stages
  if (lower.includes('waiting for date') || lower.includes('date confirmation') || lower.includes('signing date')) {
    return { status: 'Waiting for Date', pct: 95 };
  }
  if (lower.includes('waiting for approval') || lower.includes('management approval') || lower.includes('approval awaited')) {
    return { status: 'Waiting for approval', pct: 85 };
  }
  if (lower.includes('revision') || lower.includes('clarification')) {
    return { status: 'Revision / Clarification Required', pct: 75 };
  }
  if (lower.includes('initiated legal') || lower.includes('draft review') || lower.includes('under review')) {
    return { status: 'Initiated legal', pct: 65 };
  }
  if (lower.includes('company accepted') || lower.includes('draft shared')) {
    return { status: 'Company accepted for MoU', pct: 60 };
  }
  if (lower.includes('under process') || lower.includes('under progress') || lower.includes('draft mou')) {
    return { status: 'Under Process', pct: 40 };
  }
  if (lower.includes('under discuss') || lower.includes('discussion')) {
    return { status: 'Under Discussion', pct: 30 };
  }
  if (lower.includes('prospect')) {
    return { status: 'Initiated – Prospect', pct: 20 };
  }
  if (lower === 'on hold' || lower === 'no' || lower === 'paused' || lower === 'stalled') {
    return { status: 'On Hold', pct: 0 };
  }
  if (lower === 'not proceeding' || lower === 'cancelled' || lower === 'rejected') {
    return { status: 'Not Proceeding', pct: 0 };
  }

  return { status: s, pct: 10 };
}

const { syncFromExcelFile, syncFromGoogleSheet, getSyncStatus, processExcelWorkbook } = require('../services/excelSyncService');

exports.uploadExcel = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No Excel file provided.' });
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const count = processExcelWorkbook(workbook);
    
    res.json({ success: true, message: 'Excel data imported successfully', count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.syncLocalExcel = (req, res) => {
  try {
    const result = syncFromExcelFile();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.syncGoogleSheet = async (req, res) => {
  try {
    const customUrl = req.body && req.body.url ? req.body.url : null;
    const result = await syncFromGoogleSheet(customUrl);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSyncStatus = (req, res) => {
  try {
    res.json({ success: true, ...getSyncStatus() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
