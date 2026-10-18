const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const mouIds = [25, 26, 27, 28, 58, 59, 60, 61, 62, 63, 64, 65];

const tables = ['mou_documents', 'mou_images', 'commitments', 'meetings', 'comments', 'mou_status_history'];

tables.forEach(table => {
  try {
    const rows = db.prepare(`SELECT mou_id, count(*) as count FROM ${table} WHERE mou_id IN (${mouIds.join(',')}) GROUP BY mou_id`).all();
    console.log(table + ':', rows);
  } catch (e) {
    console.log(table + ' error:', e.message);
  }
});
