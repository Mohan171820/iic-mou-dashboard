const cron = require('node-cron');
const db = require('../db/database');

function checkRenewalAndStuckAlerts() {
  try {
    console.log('[Cron] Running daily MoU renewal and stuck status check...');

    // 1. Expiring MoUs within 90 days
    const expiringMous = db.prepare(`
      SELECT m.id, m.title, m.expiry_date, m.owner_user_id,
             CAST((JULIANDAY(m.expiry_date) - JULIANDAY('now')) AS INTEGER) as days_left
      FROM mous m
      WHERE m.is_deleted = 0 AND m.expiry_date IS NOT NULL
        AND JULIANDAY(m.expiry_date) - JULIANDAY('now') BETWEEN 0 AND 90
    `).all();

    for (const mou of expiringMous) {
      const msg = `Renewal Alert: MoU "${mou.title}" will expire in ${mou.days_left} days (${mou.expiry_date}).`;
      
      // Notify admin
      const adminUsers = db.prepare("SELECT id FROM users WHERE role = 'Admin' AND is_active = 1").all();
      adminUsers.forEach(u => {
        const exists = db.prepare("SELECT id FROM notifications WHERE user_id = ? AND message = ? AND is_read = 0").get(u.id, msg);
        if (!exists) {
          db.prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'warning')").run(u.id, msg);
        }
      });

      // Notify owner
      if (mou.owner_user_id) {
        const exists = db.prepare("SELECT id FROM notifications WHERE user_id = ? AND message = ? AND is_read = 0").get(mou.owner_user_id, msg);
        if (!exists) {
          db.prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'warning')").run(mou.owner_user_id, msg);
        }
      }
    }

    // 2. Stuck MoUs (>30 days without status change)
    const stuckMous = db.prepare(`
      SELECT m.id, m.title, m.status, m.owner_user_id,
             CAST((JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) AS INTEGER) as days_stuck
      FROM mous m
      WHERE m.is_deleted = 0 AND m.status NOT IN ('Signed', 'Not Proceeding')
        AND (JULIANDAY('now') - JULIANDAY(m.last_status_change_at)) >= 30
    `).all();

    for (const mou of stuckMous) {
      const msg = `Stuck Status Alert: MoU "${mou.title}" has been in status "${mou.status}" for ${mou.days_stuck} days.`;
      
      const adminUsers = db.prepare("SELECT id FROM users WHERE role = 'Admin' AND is_active = 1").all();
      adminUsers.forEach(u => {
        const exists = db.prepare("SELECT id FROM notifications WHERE user_id = ? AND message = ? AND is_read = 0").get(u.id, msg);
        if (!exists) {
          db.prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'alert')").run(u.id, msg);
        }
      });
    }

    console.log(`[Cron] Alert check completed. Scanned ${expiringMous.length} expiring MoUs and ${stuckMous.length} stuck MoUs.`);
  } catch (err) {
    console.error('[Cron] Error in alert cron job:', err.message);
  }
}

function startCronJobs() {
  // Run every midnight
  cron.schedule('0 0 * * *', () => {
    checkRenewalAndStuckAlerts();
  });

  // Also run once on startup
  setTimeout(() => {
    checkRenewalAndStuckAlerts();
  }, 3000);
}

module.exports = { startCronJobs, checkRenewalAndStuckAlerts };
