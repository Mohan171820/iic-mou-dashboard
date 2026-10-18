const db = require('../db/database');

exports.getAuditLogs = (req, res) => {
  const { user_id, action, entity, limit = 200 } = req.query;

  let query = `
    SELECT a.*, u.name as user_name, u.email as user_email, u.role as user_role
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (user_id) {
    query += ` AND a.user_id = ?`;
    params.push(user_id);
  }

  if (action) {
    query += ` AND a.action = ?`;
    params.push(action);
  }

  if (entity) {
    query += ` AND a.entity = ?`;
    params.push(entity);
  }

  query += ` ORDER BY a.created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  const logs = db.prepare(query).all(...params);
  res.json({ success: true, logs });
};
