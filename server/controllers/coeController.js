const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getCoes = (req, res) => {
  const coes = db.prepare(`
    SELECT c.*,
           (SELECT COUNT(*) FROM coe_activities WHERE coe_id = c.id) as activity_count,
           COALESCE((SELECT SUM(amount) FROM revenue_items WHERE coe_id = c.id AND type = 'realised'), 0) as realised_revenue,
           COALESCE((SELECT SUM(amount) FROM revenue_items WHERE coe_id = c.id AND type = 'pipeline'), 0) as pipeline_revenue
    FROM coes c
    ORDER BY c.name ASC
  `).all();
  res.json({ success: true, coes });
};

exports.createCoe = (req, res) => {
  try {
    const { name, domain, head } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'COE name is required.' });

    const result = db.prepare('INSERT INTO coes (name, domain, head) VALUES (?, ?, ?)').run(name, domain || '', head || '');
    logAudit(req.user.id, 'CREATE', 'COE', result.lastInsertRowid, `Created COE ${name}`, req.ip);

    res.status(201).json({ success: true, message: 'COE created.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// COE Activities
exports.getCoeActivities = (req, res) => {
  const { coe_id } = req.query;
  let query = `
    SELECT a.*, c.name as coe_name, i.name as industry_name
    FROM coe_activities a
    LEFT JOIN coes c ON a.coe_id = c.id
    LEFT JOIN industries i ON a.industry_id = i.id
    WHERE 1=1
  `;
  const params = [];
  if (coe_id) {
    query += ` AND a.coe_id = ?`;
    params.push(coe_id);
  }
  query += ` ORDER BY a.date DESC`;

  const activities = db.prepare(query).all(...params);
  res.json({ success: true, activities });
};

exports.createCoeActivity = (req, res) => {
  try {
    const { coe_id, title, industry_id, participants, revenue, status, date } = req.body;
    if (!coe_id || !title) return res.status(400).json({ success: false, message: 'COE ID and activity title are required.' });

    const result = db.prepare(`
      INSERT INTO coe_activities (coe_id, title, industry_id, participants, revenue, status, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(coe_id, title, industry_id || null, participants || 0, revenue || 0.0, status || 'Completed', date || new Date().toISOString().split('T')[0]);

    logAudit(req.user.id, 'CREATE', 'COEActivity', result.lastInsertRowid, `Created COE activity "${title}"`, req.ip);

    res.status(201).json({ success: true, message: 'Activity logged.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Revenue Items
exports.getRevenueItems = (req, res) => {
  const { coe_id } = req.query;
  let query = `
    SELECT r.*, c.name as coe_name
    FROM revenue_items r
    LEFT JOIN coes c ON r.coe_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (coe_id) {
    query += ` AND r.coe_id = ?`;
    params.push(coe_id);
  }
  query += ` ORDER BY r.date DESC`;

  const items = db.prepare(query).all(...params);
  res.json({ success: true, revenue: items });
};

exports.createRevenueItem = (req, res) => {
  try {
    const { coe_id, source, amount, type, date } = req.body;
    if (!coe_id || !source || !amount || !type) {
      return res.status(400).json({ success: false, message: 'COE ID, source, amount and type (realised/pipeline/cost) are required.' });
    }

    const result = db.prepare(`
      INSERT INTO revenue_items (coe_id, source, amount, type, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(coe_id, source, amount, type, date || new Date().toISOString().split('T')[0]);

    logAudit(req.user.id, 'CREATE', 'Revenue', result.lastInsertRowid, `Added revenue item ${source} (₹${amount})`, req.ip);

    res.status(201).json({ success: true, message: 'Revenue item added.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
