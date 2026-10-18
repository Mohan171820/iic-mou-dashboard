const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const rows = db.prepare('SELECT id, department_id, title, status, created_at, faculty_spoc FROM mous').all();
console.log('Total MOUs in DB:', rows.length);
const byDept = {};
rows.forEach(r => {
  byDept[r.department_id] = byDept[r.department_id] || [];
  byDept[r.department_id].push(r);
});

Object.keys(byDept).forEach(dId => {
  const dept = db.prepare('SELECT name FROM departments WHERE id = ?').get(dId);
  console.log(`Dept ${dId} (${dept?.name}): ${byDept[dId].length} MOUs`);
});
