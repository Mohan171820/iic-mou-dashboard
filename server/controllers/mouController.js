const db = require('../db/database');
const fs = require('fs');
const path = require('path');
const { STATUS_PERCENT_MAP } = require('../config/constants');
const { logAudit } = require('../services/auditLogger');

// Helper to get percent from status name
function getPercentageForStatus(statusName, currentPercent = 0) {
  // First check status config table
  const cfg = db.prepare('SELECT percentage FROM mou_status_config WHERE status_name = ?').get(statusName);
  if (cfg) return cfg.percentage;

  if (STATUS_PERCENT_MAP[statusName] !== undefined && STATUS_PERCENT_MAP[statusName] !== null) {
    return STATUS_PERCENT_MAP[statusName];
  }
  if (statusName === 'On Hold') return currentPercent;
  if (statusName === 'Not Proceeding') return 0;
  return 10;
}

function parseMouDate(str) {
  if (!str) return null;
  const s = String(str).trim();
  if (/^(na|nil|none|-|\/|null|undefined|pending|not signed|waiting.*)$/i.test(s)) return null;
  const clean = s.replace(/\s*\(.*\)$/, '').trim();
  
  let m = clean.match(/^(\d{1,2})[.\-](\d{1,2})[.\-](\d{2,4})$/);
  if (m) {
    let day = parseInt(m[1]), month = parseInt(m[2]) - 1, year = parseInt(m[3]);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
  }
  m = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    let n1 = parseInt(m[1]), n2 = parseInt(m[2]), year = parseInt(m[3]);
    if (year < 100) year += 2000;
    return n1 > 12 ? new Date(year, n2 - 1, n1) : new Date(year, n2 - 1, n1);
  }
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

exports.getMous = (req, res) => {
  const { department_id, status, health, owner_id, search, sort = 'updated_at', order = 'DESC', includeDeleted = 'false' } = req.query;

  let query = `
    SELECT m.*, 
           i.name as industry_name, i.contact_person, i.email as industry_email, i.phone as industry_phone, i.sector, COALESCE(i.address, 'Chennai') as hub_city,
           d.name as department_name,
           u.name as owner_name,
           (SELECT COUNT(*) FROM mou_documents WHERE mou_id = m.id) as document_count,
           (SELECT COUNT(*) FROM mou_images WHERE mou_id = m.id) as image_count,
           CAST((JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) AS INTEGER) as days_in_stage,
           CASE 
            WHEN m.expiry_date IS NOT NULL THEN CAST((JULIANDAY(m.expiry_date) - JULIANDAY('now')) AS INTEGER)
            ELSE NULL 
           END as days_to_expiry
    FROM mous m
    LEFT JOIN industries i ON m.industry_id = i.id
    LEFT JOIN departments d ON m.department_id = d.id
    LEFT JOIN users u ON m.owner_user_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (includeDeleted !== 'true') {
    query += ` AND m.is_deleted = 0`;
  }

  // Enforce department access for Coordinator role
  if (req.user.role === 'Coordinator' && req.user.department_id) {
    query += ` AND m.department_id = ?`;
    params.push(req.user.department_id);
  } else if (department_id) {
    query += ` AND m.department_id = ?`;
    params.push(department_id);
  }

  if (status) {
    if (status.toLowerCase() === 'signed') {
      query += ` AND (LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%')`;
    } else if (status.toLowerCase() === 'upcoming') {
      // Handled post-query with date parser
    } else {
      query += ` AND LOWER(TRIM(m.status)) = ?`;
      params.push(status.trim().toLowerCase());
    }
  }

  if (health) {
    query += ` AND m.health = ?`;
    params.push(health);
  }

  if (owner_id) {
    query += ` AND m.owner_user_id = ?`;
    params.push(owner_id);
  }

  if (search) {
    query += ` AND (m.title LIKE ? OR i.name LIKE ? OR d.name LIKE ? OR m.purpose LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  // Allowed sort columns
  const allowedSorts = ['updated_at', 'created_at', 'mou_date', 'expiry_date', 'progress_percent', 'title', 'last_status_change_at'];
  const sortCol = allowedSorts.includes(sort) ? `m.${sort}` : 'm.updated_at';
  const sortDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  query += ` ORDER BY ${sortCol} ${sortDir}`;

  let mous = db.prepare(query).all(...params);
  if (status && status.toLowerCase() === 'upcoming') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    mous = mous.filter(m => {
      const d = parseMouDate(m.mou_date);
      if (d && d > today) return true;
      if (m.status && /waiting for date|upcoming|date confirmation/i.test(m.status)) return true;
      return false;
    });
  }
  res.json({ success: true, count: mous.length, mous });
};

exports.getMouById = (req, res) => {
  const { id } = req.params;

  const mou = db.prepare(`
    SELECT m.*, 
           i.name as industry_name, i.contact_person, i.designation as contact_designation, i.email as industry_email, i.phone as industry_phone, i.sector, i.address as industry_address, i.website as industry_website,
           d.name as department_name, d.hod_name,
           u.name as owner_name, u.email as owner_email,
           CAST((JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) AS INTEGER) as days_in_stage,
           CASE 
            WHEN m.expiry_date IS NOT NULL THEN CAST((JULIANDAY(m.expiry_date) - JULIANDAY('now')) AS INTEGER)
            ELSE NULL 
           END as days_to_expiry
    FROM mous m
    LEFT JOIN industries i ON m.industry_id = i.id
    LEFT JOIN departments d ON m.department_id = d.id
    LEFT JOIN users u ON m.owner_user_id = u.id
    WHERE m.id = ?
  `).get(id);

  if (!mou) return res.status(404).json({ success: false, message: 'MoU not found.' });

  // Enforce Coordinator dept permission
  if (req.user.role === 'Coordinator' && req.user.department_id && mou.department_id !== req.user.department_id) {
    return res.status(403).json({ success: false, message: 'Access denied to this department MoU.' });
  }

  const history = db.prepare(`
    SELECT h.*, u.name as changed_by_name
    FROM mou_status_history h
    LEFT JOIN users u ON h.changed_by = u.id
    WHERE h.mou_id = ?
    ORDER BY h.changed_at DESC
  `).all(id);

  const images = db.prepare(`
    SELECT img.*, u.name as uploaded_by_name
    FROM mou_images img
    LEFT JOIN users u ON img.uploaded_by = u.id
    WHERE img.mou_id = ?
    ORDER BY img.uploaded_at DESC
  `).all(id);

  const documents = db.prepare(`
    SELECT doc.*, u.name as uploaded_by_name
    FROM mou_documents doc
    LEFT JOIN users u ON doc.uploaded_by = u.id
    WHERE doc.mou_id = ?
    ORDER BY doc.uploaded_at DESC
  `).all(id);

  const commitments = db.prepare('SELECT * FROM commitments WHERE mou_id = ? ORDER BY due_date ASC').all(id);
  const meetings = db.prepare('SELECT * FROM meetings WHERE mou_id = ? ORDER BY meeting_date DESC').all(id);
  const comments = db.prepare(`
    SELECT c.*, u.name as user_name, u.role as user_role
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.mou_id = ?
    ORDER BY c.created_at DESC
  `).all(id);

  res.json({
    success: true,
    mou,
    history,
    images,
    documents,
    commitments,
    meetings,
    comments
  });
};

exports.createMou = (req, res) => {
  try {
    const {
      industry_id, department_id, title, purpose, status = 'Initial Communication',
      owner_user_id, mou_date, validity_years = 3, next_activity, next_activity_date, health = 'Good'
    } = req.body;

    if (!industry_id || !department_id || !title) {
      return res.status(400).json({ success: false, message: 'Industry, department, and title are required.' });
    }

    const progress_percent = getPercentageForStatus(status, 10);

    let expiry_date = null;
    if (mou_date) {
      const d = new Date(mou_date);
      d.setFullYear(d.getFullYear() + parseInt(validity_years || 3));
      expiry_date = d.toISOString().split('T')[0];
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = db.prepare(`
      INSERT INTO mous (
        industry_id, department_id, title, purpose, status, progress_percent,
        owner_user_id, mou_date, validity_years, expiry_date, next_activity,
        next_activity_date, health, created_by, last_status_change_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      industry_id, department_id, title, purpose || '', status, progress_percent,
      owner_user_id || req.user.id, mou_date || null, validity_years, expiry_date, next_activity || '',
      next_activity_date || null, health, req.user.id, now, now, now
    );

    const mouId = result.lastInsertRowid;

    // Log initial history record
    db.prepare(`
      INSERT INTO mou_status_history (mou_id, old_status, new_status, remark, changed_by)
      VALUES (?, null, ?, 'Initial creation of MoU', ?)
    `).run(mouId, status, req.user.id);

    logAudit(req.user.id, 'CREATE', 'MoU', mouId, `Created MoU "${title}" in status "${status}"`, req.ip);

    res.status(201).json({ success: true, message: 'MoU created successfully.', id: mouId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMou = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM mous WHERE id = ? AND is_deleted = 0').get(id);
    if (!existing) return res.status(404).json({ success: false, message: 'MoU not found.' });

    const {
      title, purpose, owner_user_id, mou_date, validity_years, next_activity, next_activity_date, health
    } = req.body;

    let expiry_date = existing.expiry_date;
    const finalValidity = validity_years || existing.validity_years;
    const finalMouDate = mou_date || existing.mou_date;

    if (finalMouDate) {
      const d = new Date(finalMouDate);
      d.setFullYear(d.getFullYear() + parseInt(finalValidity));
      expiry_date = d.toISOString().split('T')[0];
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      UPDATE mous
      SET title = ?, purpose = ?, owner_user_id = ?, mou_date = ?, validity_years = ?,
          expiry_date = ?, next_activity = ?, next_activity_date = ?, health = ?, updated_at = ?
      WHERE id = ?
    `).run(
      title || existing.title,
      purpose !== undefined ? purpose : existing.purpose,
      owner_user_id || existing.owner_user_id,
      finalMouDate,
      finalValidity,
      expiry_date,
      next_activity !== undefined ? next_activity : existing.next_activity,
      next_activity_date !== undefined ? next_activity_date : existing.next_activity_date,
      health || existing.health,
      now,
      id
    );

    logAudit(req.user.id, 'UPDATE', 'MoU', id, `Updated MoU "${title || existing.title}"`, req.ip);

    res.json({ success: true, message: 'MoU updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMouStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus, remark } = req.body;

    if (!newStatus) return res.status(400).json({ success: false, message: 'New status is required.' });

    const existing = db.prepare('SELECT * FROM mous WHERE id = ? AND is_deleted = 0').get(id);
    if (!existing) return res.status(404).json({ success: false, message: 'MoU not found.' });

    const oldStatus = existing.status;
    const newPercent = getPercentageForStatus(newStatus, existing.progress_percent);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      UPDATE mous
      SET status = ?, progress_percent = ?, last_status_change_at = ?, updated_at = ?
      WHERE id = ?
    `).run(newStatus, newPercent, now, now, id);

    // Record status history
    db.prepare(`
      INSERT INTO mou_status_history (mou_id, old_status, new_status, remark, changed_by, changed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, oldStatus, newStatus, remark || 'Status updated', req.user.id, now);

    // Audit log
    logAudit(req.user.id, 'STATUS_CHANGE', 'MoU', id, `Status changed from "${oldStatus}" to "${newStatus}". Remark: ${remark || 'None'}`, req.ip);

    // Create notification for admin / chairperson / owner
    if (existing.owner_user_id && existing.owner_user_id !== req.user.id) {
      db.prepare(`
        INSERT INTO notifications (user_id, message, type)
        VALUES (?, ?, 'info')
      `).run(existing.owner_user_id, `MoU "${existing.title}" status changed to "${newStatus}" by ${req.user.name}.`);
    }

    res.json({
      success: true,
      message: 'MoU status updated successfully.',
      status: newStatus,
      progress_percent: newPercent,
      last_status_change_at: now
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMou = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE mous SET is_deleted = 1 WHERE id = ?').run(id);
    logAudit(req.user.id, 'SOFT_DELETE', 'MoU', id, `Soft deleted MoU ID ${id}`, req.ip);
    res.json({ success: true, message: 'MoU deleted (soft delete).' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.restoreMou = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE mous SET is_deleted = 0 WHERE id = ?').run(id);
    logAudit(req.user.id, 'RESTORE', 'MoU', id, `Restored MoU ID ${id}`, req.ip);
    res.json({ success: true, message: 'MoU restored successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Image handling
exports.uploadMouImages = (req, res) => {
  try {
    const { id } = req.params;
    const { caption, type = 'event' } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }

    const inserted = [];
    for (const file of req.files) {
      const relPath = `/uploads/images/${file.filename}`;
      const result = db.prepare(`
        INSERT INTO mou_images (mou_id, file_path, caption, type, uploaded_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, relPath, caption || file.originalname, type, req.user.id);
      inserted.push({ id: result.lastInsertRowid, file_path: relPath, caption, type });
    }

    logAudit(req.user.id, 'UPLOAD_IMAGE', 'MoU', id, `Uploaded ${req.files.length} images`, req.ip);

    res.status(201).json({ success: true, message: 'Images uploaded successfully.', images: inserted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMouImage = (req, res) => {
  try {
    const { id, imageId } = req.params;
    const img = db.prepare('SELECT * FROM mou_images WHERE id = ? AND mou_id = ?').get(imageId, id);
    if (!img) return res.status(404).json({ success: false, message: 'Image record not found.' });

    // Remove file from disk
    const diskPath = path.join(__dirname, '../../', img.file_path);
    if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

    db.prepare('DELETE FROM mou_images WHERE id = ?').run(imageId);
    logAudit(req.user.id, 'DELETE_IMAGE', 'MoU', id, `Deleted image ID ${imageId}`, req.ip);

    res.json({ success: true, message: 'Image deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Document handling
exports.uploadMouDocument = (req, res) => {
  try {
    const { id } = req.params;
    const { title, doc_type = 'draft', version = 'v1.0' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file provided.' });
    }

    const relPath = `/uploads/documents/${req.file.filename}`;
    const docTitle = title || req.file.originalname;

    const result = db.prepare(`
      INSERT INTO mou_documents (mou_id, file_path, title, doc_type, version, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, relPath, docTitle, doc_type, version, req.user.id);

    logAudit(req.user.id, 'UPLOAD_DOC', 'MoU', id, `Uploaded document "${docTitle}" (${doc_type})`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully.',
      document: { id: result.lastInsertRowid, title: docTitle, file_path: relPath, doc_type, version }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMouDocument = (req, res) => {
  try {
    const { id, docId } = req.params;
    const doc = db.prepare('SELECT * FROM mou_documents WHERE id = ? AND mou_id = ?').get(docId, id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });

    const diskPath = path.join(__dirname, '../../', doc.file_path);
    if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);

    db.prepare('DELETE FROM mou_documents WHERE id = ?').run(docId);
    logAudit(req.user.id, 'DELETE_DOC', 'MoU', id, `Deleted document ID ${docId}`, req.ip);

    res.json({ success: true, message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Chairperson / Admin comments
exports.addComment = (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Comment message is required.' });
    }

    const result = db.prepare(`
      INSERT INTO comments (mou_id, user_id, message)
      VALUES (?, ?, ?)
    `).run(id, req.user.id, message.trim());

    logAudit(req.user.id, 'ADD_REMARK', 'MoU', id, `Added remark: "${message.trim()}"`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Remark added successfully.',
      comment: {
        id: result.lastInsertRowid,
        user_name: req.user.name,
        user_role: req.user.role,
        message: message.trim(),
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
