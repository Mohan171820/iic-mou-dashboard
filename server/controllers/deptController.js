const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getDepartments = (req, res) => {
  const rawDepts = db.prepare(`
    SELECT d.*, 
           COALESCE(
             NULLIF(TRIM(d.hod_name), ''),
             (SELECT faculty_spoc FROM mous WHERE department_id = d.id AND faculty_spoc IS NOT NULL AND TRIM(faculty_spoc) != '' AND TRIM(faculty_spoc) != '-' LIMIT 1)
           ) as faculty_spoc,
           COUNT(m.id) as total_mous,
           SUM(CASE WHEN LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%' THEN 1 ELSE 0 END) as signed_mous,
           ROUND(AVG(CASE WHEN LOWER(TRIM(m.status)) IN ('signed', 'formal signing', 'coe established', 'coe operational') OR LOWER(TRIM(m.status)) LIKE 'signed%' OR LOWER(TRIM(m.status)) LIKE 'coe%' THEN 100 ELSE m.progress_percent END), 1) as avg_progress
    FROM departments d
    LEFT JOIN mous m ON d.id = m.department_id AND m.is_deleted = 0
    GROUP BY d.id
    ORDER BY d.name ASC
  `).all();

  const deptsMap = new Map();
  for (const d of rawDepts) {
    const isIT = d.name.trim().toUpperCase() === 'IT' || d.name.trim().toLowerCase() === 'information technology';
    const key = isIT ? 'Information Technology' : d.name.trim();
    if (!deptsMap.has(key)) {
      deptsMap.set(key, { ...d, name: key });
    } else {
      const existing = deptsMap.get(key);
      existing.total_mous = (existing.total_mous || 0) + (d.total_mous || 0);
      existing.signed_mous = (existing.signed_mous || 0) + (d.signed_mous || 0);
      if (!existing.faculty_spoc && d.faculty_spoc) existing.faculty_spoc = d.faculty_spoc;
      if (!existing.hod_name && d.hod_name) existing.hod_name = d.hod_name;
    }
  }
  const depts = Array.from(deptsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  res.json({ success: true, departments: depts });
};

exports.createDepartment = (req, res) => {
  try {
    let { name, hod_name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Department name is required.' });

    if (name.trim().toUpperCase() === 'IT' || name.trim().toLowerCase() === 'information technology') {
      name = 'Information Technology';
      const exist = db.prepare("SELECT id FROM departments WHERE name = 'Information Technology'").get();
      if (exist) {
        if (hod_name) db.prepare("UPDATE departments SET hod_name = ? WHERE id = ?").run(hod_name, exist.id);
        return res.status(200).json({ success: true, message: 'Department updated.', id: exist.id });
      }
    }

    const result = db.prepare('INSERT INTO departments (name, hod_name) VALUES (?, ?)').run(name, hod_name || '');
    logAudit(req.user.id, 'CREATE', 'Department', result.lastInsertRowid, `Created dept ${name}`, req.ip);
    res.status(201).json({ success: true, message: 'Department created.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDepartment = (req, res) => {
  try {
    const { id } = req.params;
    const { name, hod_name } = req.body;
    db.prepare('UPDATE departments SET name = ?, hod_name = ? WHERE id = ?').run(name, hod_name, id);
    logAudit(req.user.id, 'UPDATE', 'Department', id, `Updated dept ID ${id}`, req.ip);
    res.json({ success: true, message: 'Department updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDepartment = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM departments WHERE id = ?').run(id);
    logAudit(req.user.id, 'DELETE', 'Department', id, `Deleted dept ID ${id}`, req.ip);
    res.json({ success: true, message: 'Department deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
