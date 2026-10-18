const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getCommitments = (req, res) => {
  const { mou_id } = req.query;
  let query = `
    SELECT c.*, m.title as mou_title, i.name as industry_name
    FROM commitments c
    LEFT JOIN mous m ON c.mou_id = m.id
    LEFT JOIN industries i ON m.industry_id = i.id
    WHERE 1=1
  `;
  const params = [];
  if (mou_id) {
    query += ` AND c.mou_id = ?`;
    params.push(mou_id);
  }
  query += ` ORDER BY c.due_date ASC`;

  const commitments = db.prepare(query).all(...params);
  res.json({ success: true, commitments });
};

exports.createCommitment = (req, res) => {
  try {
    const { mou_id, title, target, achieved, owner, due_date, status = 'Pending' } = req.body;
    if (!mou_id || !title) {
      return res.status(400).json({ success: false, message: 'MoU ID and title are required.' });
    }

    const result = db.prepare(`
      INSERT INTO commitments (mou_id, title, target, achieved, owner, due_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(mou_id, title, target || '', achieved || '', owner || '', due_date || null, status);

    logAudit(req.user.id, 'CREATE', 'Commitment', result.lastInsertRowid, `Created commitment "${title}"`, req.ip);

    res.status(201).json({ success: true, message: 'Commitment created.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCommitment = (req, res) => {
  try {
    const { id } = req.params;
    const { title, target, achieved, owner, due_date, status } = req.body;

    db.prepare(`
      UPDATE commitments
      SET title = ?, target = ?, achieved = ?, owner = ?, due_date = ?, status = ?
      WHERE id = ?
    `).run(title, target, achieved, owner, due_date, status, id);

    logAudit(req.user.id, 'UPDATE', 'Commitment', id, `Updated commitment ID ${id}`, req.ip);

    res.json({ success: true, message: 'Commitment updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCommitment = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM commitments WHERE id = ?').run(id);
    logAudit(req.user.id, 'DELETE', 'Commitment', id, `Deleted commitment ID ${id}`, req.ip);
    res.json({ success: true, message: 'Commitment deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
