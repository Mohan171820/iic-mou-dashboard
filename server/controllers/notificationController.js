const db = require('../db/database');

exports.getNotifications = (req, res) => {
  const notifs = db.prepare(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).all(req.user.id);

  const unreadCount = db.prepare(`
    SELECT COUNT(*) as count FROM notifications
    WHERE user_id = ? AND is_read = 0
  `).get(req.user.id).count;

  res.json({ success: true, unreadCount, notifications: notifs });
};

exports.markAsRead = (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.user.id);
  res.json({ success: true, message: 'Notification marked as read.' });
};

exports.markAllAsRead = (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ success: true, message: 'All notifications marked as read.' });
};
