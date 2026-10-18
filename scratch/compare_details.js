const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const rows = db.prepare('SELECT * FROM mous WHERE id IN (25, 26, 27, 28, 60, 61)').all();
console.log(JSON.stringify(rows, null, 2));

// Check if any child records exist for 25, 26, 27, 28, 60, 61
['commitments', 'meetings', 'mou_history', 'comments'].forEach(table => {
  const c = db.prepare(`SELECT mou_id, count(*) as count FROM ${table} WHERE mou_id IN (25, 26, 27, 28, 60, 61) GROUP BY mou_id`).all();
  console.log(`${table}:`, c);
});
