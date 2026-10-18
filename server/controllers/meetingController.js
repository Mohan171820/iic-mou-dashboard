const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getMeetings = (req, res) => {
  const { industry_id, mou_id } = req.query;
  let query = `
    SELECT mt.*, i.name as industry_name, m.title as mou_title
    FROM meetings mt
    LEFT JOIN industries i ON mt.industry_id = i.id
    LEFT JOIN mous m ON mt.mou_id = m.id
    WHERE 1=1
  `;
  const params = [];
  if (industry_id) {
    query += ` AND mt.industry_id = ?`;
    params.push(industry_id);
  }
  if (mou_id) {
    query += ` AND mt.mou_id = ?`;
    params.push(mou_id);
  }
  query += ` ORDER BY mt.meeting_date DESC`;

  const meetings = db.prepare(query).all(...params);
  res.json({ success: true, meetings });
};

exports.createMeeting = (req, res) => {
  try {
    const { industry_id, mou_id, meeting_date, purpose, outcome, next_action, owner } = req.body;
    if (!meeting_date || (!industry_id && !mou_id)) {
      return res.status(400).json({ success: false, message: 'Meeting date and industry or MoU are required.' });
    }

    const result = db.prepare(`
      INSERT INTO meetings (industry_id, mou_id, meeting_date, purpose, outcome, next_action, owner)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(industry_id || null, mou_id || null, meeting_date, purpose || '', outcome || '', next_action || '', owner || req.user.name);

    logAudit(req.user.id, 'CREATE', 'Meeting', result.lastInsertRowid, `Logged meeting on ${meeting_date}`, req.ip);

    res.status(201).json({ success: true, message: 'Meeting logged successfully.', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMeeting = (req, res) => {
  try {
    const { id } = req.params;
    const { meeting_date, purpose, outcome, next_action, owner } = req.body;

    db.prepare(`
      UPDATE meetings
      SET meeting_date = ?, purpose = ?, outcome = ?, next_action = ?, owner = ?
      WHERE id = ?
    `).run(meeting_date, purpose, outcome, next_action, owner, id);

    logAudit(req.user.id, 'UPDATE', 'Meeting', id, `Updated meeting ID ${id}`, req.ip);

    res.json({ success: true, message: 'Meeting updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMeeting = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM meetings WHERE id = ?').run(id);
    logAudit(req.user.id, 'DELETE', 'Meeting', id, `Deleted meeting ID ${id}`, req.ip);
    res.json({ success: true, message: 'Meeting deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
