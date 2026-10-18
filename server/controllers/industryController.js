const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getIndustries = (req, res) => {
  const { search, sector, page = 1, limit = 100 } = req.query;
  let query = `
    SELECT i.*, COUNT(m.id) as total_mous
    FROM industries i
    LEFT JOIN mous m ON i.id = m.industry_id AND m.is_deleted = 0
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (i.name LIKE ? OR i.sector LIKE ? OR i.contact_person LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (sector) {
    query += ` AND i.sector = ?`;
    params.push(sector);
  }

  query += ` GROUP BY i.id ORDER BY i.name ASC`;

  const industries = db.prepare(query).all(...params);
  res.json({ success: true, count: industries.length, industries });
};

exports.getIndustryById = (req, res) => {
  const { id } = req.params;
  const industry = db.prepare('SELECT * FROM industries WHERE id = ?').get(id);
  if (!industry) return res.status(404).json({ success: false, message: 'Industry not found.' });

  const mous = db.prepare(`
    SELECT m.*, d.name as department_name
    FROM mous m
    LEFT JOIN departments d ON m.department_id = d.id
    WHERE m.industry_id = ? AND m.is_deleted = 0
  `).all(id);

  res.json({ success: true, industry, mous });
};

exports.createIndustry = (req, res) => {
  try {
    const { name, sector, contact_person, designation, email, phone, address, website } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Industry name is required.' });

    const result = db.prepare(`
      INSERT INTO industries (name, sector, contact_person, designation, email, phone, address, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, sector || '', contact_person || '', designation || '', email || '', phone || '', address || '', website || '');

    logAudit(req.user.id, 'CREATE', 'Industry', result.lastInsertRowid, `Created industry ${name}`, req.ip);

    res.status(201).json({ success: true, message: 'Industry created.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateIndustry = (req, res) => {
  try {
    const { id } = req.params;
    const { name, sector, contact_person, designation, email, phone, address, website } = req.body;

    db.prepare(`
      UPDATE industries
      SET name = ?, sector = ?, contact_person = ?, designation = ?, email = ?, phone = ?, address = ?, website = ?
      WHERE id = ?
    `).run(name, sector, contact_person, designation, email, phone, address, website, id);

    logAudit(req.user.id, 'UPDATE', 'Industry', id, `Updated industry ID ${id}`, req.ip);

    res.json({ success: true, message: 'Industry updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteIndustry = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM industries WHERE id = ?').run(id);
    logAudit(req.user.id, 'DELETE', 'Industry', id, `Deleted industry ID ${id}`, req.ip);
    res.json({ success: true, message: 'Industry deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
