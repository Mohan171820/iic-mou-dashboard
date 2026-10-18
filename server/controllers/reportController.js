const db = require('../db/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { STATUS_PERCENT_MAP } = require('../config/constants');
const { logAudit } = require('../services/auditLogger');

exports.exportMouStatusExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'University MoU Intelligence Executive Portal';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('MoU Status Register', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    sheet.columns = [
      { header: '#', key: 'idx', width: 6 },
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Stage Index', key: 'stage_index', width: 14 },
      { header: 'Pipeline Stage', key: 'stage_name', width: 28 },
      { header: 'Industry Partner', key: 'industry_name', width: 32 },
      { header: 'Agreement / Title', key: 'title', width: 34 },
      { header: 'Lead Department', key: 'department_name', width: 25 },
      { header: 'Faculty SPOC', key: 'faculty_spoc', width: 24 },
      { header: 'Current Status', key: 'status', width: 24 },
      { header: 'Progress', key: 'progress_percent', width: 12 },
      { header: 'Health', key: 'health', width: 12 },
      { header: 'Chairman Visit', key: 'chairman_visit', width: 16 },
      { header: 'Hub City', key: 'hub_city', width: 18 },
      { header: 'Signed Date', key: 'mou_date', width: 15 },
      { header: 'CoE Status', key: 'coe_status', width: 18 },
      { header: 'CoE Lab Name', key: 'coe_name', width: 28 }
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 10, name: 'Calibri' };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F2744' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 26;

    sheet.autoFilter = 'A1:P1';

    let whereClause = 'WHERE m.is_deleted = 0';
    const params = [];
    const { status, chairman_visit, search, ids, stage } = req.query;

    if (ids) {
      const idList = String(ids).split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (idList.length > 0) {
        whereClause += ` AND m.id IN (${idList.map(() => '?').join(',')})`;
        params.push(...idList);
      }
    } else {
      if (chairman_visit === '1' || chairman_visit === 'true') {
        whereClause += ' AND m.chairman_visit = 1';
      }

      const stageNum = parseInt(stage !== undefined ? stage : status);
      if (!isNaN(stageNum) && stageNum >= 0 && stageNum <= 6) {
        whereClause += ' AND m.stage_index = ?';
        params.push(stageNum);
      } else if (status) {
        const s = status.toLowerCase().trim();
        if (s === 'signed') {
          whereClause += ` AND (m.stage_index IN (4, 5, 6) OR LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%')`;
        } else if (s === 'unsigned') {
          whereClause += ` AND NOT (m.stage_index IN (4, 5, 6) OR LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%')`;
        } else if (s !== 'all') {
          whereClause += ` AND (LOWER(TRIM(m.status)) = ? OR LOWER(m.status) LIKE ?)`;
          params.push(s, `%${s}%`);
        }
      }

      if (search) {
        const q = `%${search.toLowerCase().trim()}%`;
        whereClause += ` AND (LOWER(m.title) LIKE ? OR LOWER(i.name) LIKE ? OR LOWER(d.name) LIKE ? OR LOWER(m.faculty_spoc) LIKE ?)`;
        params.push(q, q, q, q);
      }
    }

    const STAGE_NAMES = {
      1: '1. Campus Visit',
      2: '2. Follow-up Communication',
      3: '3. MoU Draft Share',
      4: '4. Formal Signing',
      5: '5. CoE Established',
      6: '6. Active R&D / Hiring',
      0: 'On Hold'
    };

    const mous = db.prepare(`
      SELECT m.*, i.name as industry_name, 
             CASE WHEN UPPER(TRIM(d.name)) = 'IT' THEN 'Information Technology' ELSE d.name END as department_name,
             m.faculty_spoc,
             COALESCE(i.address, 'Chennai') as hub_city
      FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN m.stage_index IN (4, 5, 6) THEN 1
          WHEN m.stage_index = 3 THEN 2
          WHEN m.stage_index = 2 THEN 3
          WHEN m.stage_index = 1 THEN 4
          ELSE 5
        END,
        m.progress_percent DESC,
        m.id ASC
    `).all(...params);

    mous.forEach((m, idx) => {
      const stageIdx = m.stage_index !== null && m.stage_index !== undefined ? m.stage_index : '—';
      const stageName = STAGE_NAMES[m.stage_index] || m.status || '—';
      const row = sheet.addRow({
        idx: idx + 1,
        id: m.id,
        stage_index: stageIdx,
        stage_name: stageName,
        industry_name: m.industry_name || '—',
        title: m.title,
        department_name: m.department_name || 'General',
        faculty_spoc: m.faculty_spoc && m.faculty_spoc !== 'N/A' ? m.faculty_spoc.replace(/\n/g, ', ') : '—',
        status: m.status,
        progress_percent: `${m.progress_percent || 0}%`,
        health: m.health || 'Good',
        chairman_visit: m.chairman_visit == 1 ? 'Yes' : 'No',
        hub_city: m.hub_city || '—',
        mou_date: m.mou_date || '—',
        coe_status: m.coe_status || '—',
        coe_name: m.coe_name || '—'
      });

      // Zebra striping
      const isEven = idx % 2 === 0;
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFF' : 'F8FAFC' }
      };

      row.alignment = { vertical: 'middle' };
      row.getCell('idx').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('id').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('progress_percent').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('health').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('mou_date').alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
    });

    const filenameSuffix = status ? `_${status.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="MoU_Status_Register${filenameSuffix}.xlsx"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportCommitmentsExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('MoU Commitments');

    sheet.columns = [
      { header: 'Commitment ID', key: 'id', width: 12 },
      { header: 'MoU Title', key: 'mou_title', width: 35 },
      { header: 'Commitment Title', key: 'title', width: 30 },
      { header: 'Target', key: 'target', width: 20 },
      { header: 'Achieved', key: 'achieved', width: 20 },
      { header: 'Owner', key: 'owner', width: 20 },
      { header: 'Due Date', key: 'due_date', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10243E' } };

    const commitments = db.prepare(`
      SELECT c.*, m.title as mou_title
      FROM commitments c
      LEFT JOIN mous m ON c.mou_id = m.id
      ORDER BY c.due_date ASC
    `).all();

    commitments.forEach(c => {
      sheet.addRow(c);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="MoU_Commitments_Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportCoeRevenueExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('COE Revenue & Activities');

    sheet.columns = [
      { header: 'Item ID', key: 'id', width: 10 },
      { header: 'COE Name', key: 'coe_name', width: 30 },
      { header: 'Revenue Source', key: 'source', width: 30 },
      { header: 'Amount (INR)', key: 'amount', width: 18 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10243E' } };

    const items = db.prepare(`
      SELECT r.*, c.name as coe_name
      FROM revenue_items r
      LEFT JOIN coes c ON r.coe_id = c.id
      ORDER BY r.date DESC
    `).all();

    items.forEach(i => {
      sheet.addRow({
        ...i,
        amount: `₹${i.amount.toLocaleString('en-IN')}`
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="COE_Revenue_Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportMouPdfReport = (req, res) => {
  try {
    const doc = new PDFDocument({
      margin: 36,
      size: 'A4',
      bufferPages: true,
      autoFirstPage: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="MoU_Summary_Executive_Report.pdf"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    doc.pipe(res);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 36;
    const contentWidth = pageWidth - margin * 2; // 523.28

    // Fetch accurate KPIs
    const total = db.prepare('SELECT COUNT(*) as c FROM mous WHERE is_deleted = 0').get().c;
    const signed = db.prepare(`
      SELECT COUNT(*) as c FROM mous 
      WHERE is_deleted = 0 
        AND (LOWER(TRIM(status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') 
             OR LOWER(TRIM(status)) LIKE 'signed%')
    `).get().c;
    const coes = db.prepare(`
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
    const avgPercent = db.prepare('SELECT ROUND(AVG(progress_percent), 1) as a FROM mous WHERE is_deleted = 0').get().a || 0;

    const mous = db.prepare(`
      SELECT m.id, m.title, i.name as industry,
             CASE WHEN UPPER(TRIM(d.name)) = 'IT' THEN 'Information Technology' ELSE d.name END as dept,
             m.status, m.progress_percent, m.faculty_spoc,
             COALESCE(i.address, 'Chennai') as city
      FROM mous m
      LEFT JOIN industries i ON m.industry_id = i.id
      LEFT JOIN departments d ON m.department_id = d.id
      WHERE m.is_deleted = 0
      ORDER BY 
        CASE 
          WHEN LOWER(m.status) LIKE 'signed%' OR LOWER(m.status) LIKE 'coe%' THEN 1
          WHEN LOWER(m.status) LIKE '%waiting%' OR LOWER(m.status) LIKE '%approval%' THEN 2
          WHEN LOWER(m.status) LIKE '%discuss%' THEN 3
          ELSE 4 
        END,
        m.progress_percent DESC,
        m.id ASC
    `).all();

    function drawReportHeader() {
      // Top header banner
      doc.rect(margin, margin, contentWidth, 54).fill('#0f2744');
      doc.rect(margin, margin + 51, contentWidth, 3).fill('#10b981');

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold');
      doc.text('UNIVERSITY MoU MANAGEMENT SYSTEM', margin + 14, margin + 12);

      doc.fillColor('#94a3b8').fontSize(9.5).font('Helvetica');
      doc.text('Executive Portfolio & Status Register Report', margin + 14, margin + 33);

      const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.fillColor('#38bdf8').fontSize(9).font('Helvetica-Bold');
      doc.text('OFFICIAL RECORD', margin + contentWidth - 140, margin + 13, { width: 126, align: 'right' });
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica');
      doc.text(`Generated: ${dateStr}`, margin + contentWidth - 140, margin + 28, { width: 126, align: 'right' });

      doc.y = margin + 64;
    }

    // Page 1 Header
    drawReportHeader();

    // KPI Summary Boxes
    const kpiY = doc.y;
    const kpiBoxWidth = (contentWidth - 24) / 4;
    const kpiBoxHeight = 44;

    const kpis = [
      { label: 'TOTAL ACTIVE MoUs', val: total.toString(), color: '#0f2744' },
      { label: 'SIGNED & ACTIVE', val: signed.toString(), color: '#10b981' },
      { label: 'CoE LABS ESTABLISHED', val: coes.toString(), color: '#0284c7' },
      { label: 'AVG PORTFOLIO PROGRESS', val: `${avgPercent}%`, color: '#f59e0b' }
    ];

    kpis.forEach((kpi, idx) => {
      const boxX = margin + idx * (kpiBoxWidth + 8);
      doc.rect(boxX, kpiY, kpiBoxWidth, kpiBoxHeight).fill('#f8fafc');
      doc.rect(boxX, kpiY, kpiBoxWidth, kpiBoxHeight).lineWidth(1).stroke('#e2e8f0');
      doc.rect(boxX, kpiY, kpiBoxWidth, 2).fill(kpi.color);

      doc.fillColor(kpi.color).fontSize(14).font('Helvetica-Bold');
      doc.text(kpi.val, boxX + 8, kpiY + 8, { width: kpiBoxWidth - 16, align: 'left' });

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica-Bold');
      doc.text(kpi.label, boxX + 8, kpiY + 28, { width: kpiBoxWidth - 16, align: 'left' });
    });

    doc.y = kpiY + kpiBoxHeight + 14;

    // Table Columns Setup
    const cols = [
      { name: '#', x: margin, width: 24, align: 'center' },
      { name: 'PARTNER & AGREEMENT', x: margin + 24, width: 176, align: 'left' },
      { name: 'DEPARTMENT', x: margin + 200, width: 100, align: 'left' },
      { name: 'STAGE / STATUS', x: margin + 300, width: 95, align: 'left' },
      { name: 'PROGRESS', x: margin + 395, width: 48, align: 'center' },
      { name: 'SPOC / METRO', x: margin + 443, width: 80, align: 'left' }
    ];

    function drawTableHeader(y) {
      doc.rect(margin, y, contentWidth, 20).fill('#0f2744');
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
      cols.forEach(c => {
        doc.text(c.name, c.x + 3, y + 6, { width: c.width - 6, align: c.align });
      });
      return y + 20;
    }

    let tableY = drawTableHeader(doc.y);
    const rowHeight = 22;
    const bottomThreshold = pageHeight - margin - 26;

    mous.forEach((m, idx) => {
      if (tableY + rowHeight > bottomThreshold) {
        doc.addPage();
        drawReportHeader();
        tableY = drawTableHeader(doc.y + 6);
      }

      const isEven = idx % 2 === 0;
      doc.rect(margin, tableY, contentWidth, rowHeight).fill(isEven ? '#ffffff' : '#f8fafc');
      doc.rect(margin, tableY, contentWidth, rowHeight).lineWidth(0.5).stroke('#e2e8f0');

      // #
      doc.fillColor('#64748b').fontSize(8).font('Helvetica');
      doc.text((idx + 1).toString(), cols[0].x, tableY + 6, { width: cols[0].width, align: 'center' });

      // Partner & Agreement Title
      const partnerName = m.industry || 'Industry Partner';
      const cleanTitle = m.title && m.title !== partnerName ? m.title : `${partnerName} MoU`;
      doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold');
      doc.text(partnerName, cols[1].x + 4, tableY + 3, { width: cols[1].width - 8, lineBreak: false, ellipsis: true });
      doc.fillColor('#64748b').fontSize(7).font('Helvetica');
      doc.text(cleanTitle, cols[1].x + 4, tableY + 12, { width: cols[1].width - 8, lineBreak: false, ellipsis: true });

      // Department
      doc.fillColor('#334155').fontSize(7.5).font('Helvetica');
      doc.text(m.dept || 'General', cols[2].x + 3, tableY + 6, { width: cols[2].width - 6, lineBreak: false, ellipsis: true });

      // Stage / Status
      const st = (m.status || 'Initial Communication').trim();
      let stColor = '#64748b';
      if (st.toLowerCase().startsWith('signed') || st.toLowerCase().startsWith('coe')) stColor = '#059669';
      else if (st.toLowerCase().includes('waiting') || st.toLowerCase().includes('approval')) stColor = '#d97706';
      else if (st.toLowerCase().includes('discuss')) stColor = '#2563eb';

      doc.fillColor(stColor).fontSize(7.5).font('Helvetica-Bold');
      doc.text(st, cols[3].x + 3, tableY + 6, { width: cols[3].width - 6, lineBreak: false, ellipsis: true });

      // Progress Badge
      const pct = m.progress_percent || 0;
      let badgeBg = '#f1f5f9';
      let badgeText = '#475569';
      if (pct >= 100) { badgeBg = '#dcfce7'; badgeText = '#15803d'; }
      else if (pct >= 60) { badgeBg = '#dbeafe'; badgeText = '#1d4ed8'; }
      else if (pct >= 30) { badgeBg = '#fef3c7'; badgeText = '#b45309'; }

      doc.rect(cols[4].x + 6, tableY + 4, cols[4].width - 12, 13).fill(badgeBg);
      doc.fillColor(badgeText).fontSize(7.5).font('Helvetica-Bold');
      doc.text(`${pct}%`, cols[4].x + 6, tableY + 6, { width: cols[4].width - 12, align: 'center' });

      // SPOC / Metro
      const spoc = (m.faculty_spoc && m.faculty_spoc !== 'N/A') ? m.faculty_spoc.split('\n')[0] : (m.city || 'Chennai');
      doc.fillColor('#475569').fontSize(7).font('Helvetica');
      doc.text(spoc, cols[5].x + 3, tableY + 6, { width: cols[5].width - 6, lineBreak: false, ellipsis: true });

      tableY += rowHeight;
    });

    // Footers on all buffered pages
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.rect(margin, pageHeight - 24, contentWidth, 0.5).fill('#e2e8f0');
      doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica');
      doc.text(
        `University MoU Intelligence Executive Portal  •  Page ${i + 1} of ${range.count}  •  Strictly Confidential`,
        margin,
        pageHeight - 18,
        { width: contentWidth, align: 'center' }
      );
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.importMousCsv = (req, res) => {
  try {
    const { rows } = req.body; // Array of objects
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided for import.' });
    }

    const report = {
      totalRows: rows.length,
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const { Industry, Department, Title, Status, Purpose, NextActivity, Health } = row;

      if (!Industry || !Department || !Title) {
        report.errorCount++;
        report.errors.push({ row: rowNum, error: 'Missing Industry, Department, or Title.' });
        return;
      }

      // Find or create Industry
      let ind = db.prepare('SELECT id FROM industries WHERE name = ?').get(Industry.trim());
      if (!ind) {
        const indRes = db.prepare('INSERT INTO industries (name) VALUES (?)').run(Industry.trim());
        ind = { id: indRes.lastInsertRowid };
      }

      // Find or create Department
      let dept = db.prepare('SELECT id FROM departments WHERE name = ?').get(Department.trim());
      if (!dept) {
        const deptRes = db.prepare('INSERT INTO departments (name) VALUES (?)').run(Department.trim());
        dept = { id: deptRes.lastInsertRowid };
      }

      const statusVal = Status ? Status.trim() : 'Initial Communication';
      const pct = STATUS_PERCENT_MAP[statusVal] !== undefined ? STATUS_PERCENT_MAP[statusVal] : 10;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

      try {
        const resMou = db.prepare(`
          INSERT INTO mous (
            industry_id, department_id, title, purpose, status, progress_percent,
            next_activity, health, created_by, last_status_change_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          ind.id, dept.id, Title.trim(), Purpose || '', statusVal, pct,
          NextActivity || '', Health || 'Good', req.user.id, now, now, now
        );

        db.prepare(`
          INSERT INTO mou_status_history (mou_id, old_status, new_status, remark, changed_by)
          VALUES (?, null, ?, 'Imported via CSV', ?)
        `).run(resMou.lastInsertRowid, statusVal, req.user.id);

        report.successCount++;
      } catch (e) {
        report.errorCount++;
        report.errors.push({ row: rowNum, error: e.message });
      }
    });

    logAudit(req.user.id, 'CSV_IMPORT', 'MoUs', 0, `Imported CSV: ${report.successCount} succeeded, ${report.errorCount} failed`, req.ip);

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
