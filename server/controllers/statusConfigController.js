const db = require('../db/database');
const { logAudit } = require('../services/auditLogger');

exports.getStatusConfigs = (req, res) => {
  const configs = db.prepare('SELECT * FROM mou_status_config ORDER BY step_order ASC').all();
  res.json({ success: true, configs });
};

exports.updateStatusConfig = (req, res) => {
  try {
    const { id } = req.params;
    const { status_name, percentage, color_code, is_active } = req.body;

    db.prepare(`
      UPDATE mou_status_config
      SET status_name = ?, percentage = ?, color_code = ?, is_active = ?
      WHERE id = ?
    `).run(status_name, percentage, color_code, is_active !== undefined ? is_active : 1, id);

    logAudit(req.user.id, 'UPDATE_STATUS_CONFIG', 'MoUStatusConfig', id, `Updated status config for "${status_name}" (${percentage}%)`, req.ip);

    res.json({ success: true, message: 'Status configuration updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
