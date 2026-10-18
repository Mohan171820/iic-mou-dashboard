const db = require('../db/database');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../services/auditLogger');

exports.getAllUsers = (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.department_id, u.is_active, u.created_at, d.name as department_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    ORDER BY u.created_at DESC
  `).all();
  res.json({ success: true, users });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, department_id, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(name, email.trim().toLowerCase(), hash, role, department_id || null);

    logAudit(req.user.id, 'CREATE', 'User', result.lastInsertRowid, `Created user ${email} (${role})`, req.ip);

    res.status(201).json({ success: true, message: 'User created successfully.', userId: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, department_id, is_active } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    db.prepare(`
      UPDATE users
      SET name = ?, role = ?, department_id = ?, is_active = ?
      WHERE id = ?
    `).run(
      name || user.name,
      role || user.role,
      department_id !== undefined ? department_id : user.department_id,
      is_active !== undefined ? is_active : user.is_active,
      id
    );

    logAudit(req.user.id, 'UPDATE', 'User', id, `Updated user ${user.email}`, req.ip);

    res.json({ success: true, message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deactivateUser = (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
    }

    db.prepare('UPDATE users SET is_active = 0 WHERE id = ?').run(id);
    logAudit(req.user.id, 'DEACTIVATE', 'User', id, `Deactivated user ID ${id}`, req.ip);

    res.json({ success: true, message: 'User deactivated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
    logAudit(req.user.id, 'RESET_PASSWORD', 'User', id, `Reset password for user ID ${id}`, req.ip);

    res.json({ success: true, message: 'User password reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
