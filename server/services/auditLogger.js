const db = require('../db/database');

const logAudit = (userId, action, entity, entityId, details, ip = '127.0.0.1') => {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details || '');
    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(userId || null, action, entity, entityId || null, detailsStr, ip);
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};

module.exports = { logAudit };
