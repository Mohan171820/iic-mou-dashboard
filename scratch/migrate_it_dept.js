const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

console.log('=== BEFORE MIGRATION ===');
const dept13 = db.prepare("SELECT * FROM departments WHERE id = 13").get();
const dept33 = db.prepare("SELECT * FROM departments WHERE id = 33").get();
console.log('Dept 13:', dept13);
console.log('Dept 33:', dept33);

const mous13 = db.prepare("SELECT id, title, status, progress_percent, department_id FROM mous WHERE department_id = 13").all();
const mous33 = db.prepare("SELECT id, title, status, progress_percent, department_id FROM mous WHERE department_id = 33").all();
console.log('Mous in 13 (count ' + mous13.length + '):', mous13);
console.log('Mous in 33 (count ' + mous33.length + '):', mous33);

db.transaction(() => {
  // 1. Delete duplicate MOU 28 (Genesys MoU in dept 33, since MOU 25 in dept 13 is already CoE Operational)
  db.prepare("DELETE FROM mous WHERE id = 28").run();
  console.log('Deleted duplicate Genesys MoU #28');

  // 2. Delete stale draft MOU 26 (MongoDB in dept 13), keep complete signed MOU 60
  db.prepare("DELETE FROM mous WHERE id = 26").run();
  console.log('Deleted stale draft MongoDB MoU #26');

  // 3. Delete stale draft MOU 27 (SnowFlake in dept 13), keep complete signed MOU 61
  db.prepare("DELETE FROM mous WHERE id = 27").run();
  console.log('Deleted stale draft SnowFlake MoU #27');

  // 4. Update all remaining MOUs from department 33 to department 13
  const updatedMous = db.prepare("UPDATE mous SET department_id = 13 WHERE department_id = 33").run();
  console.log('Updated MOUs from dept 33 to 13, changes:', updatedMous.changes);

  // 5. Update users if any
  const updatedUsers = db.prepare("UPDATE users SET department_id = 13 WHERE department_id = 33").run();
  console.log('Updated users from dept 33 to 13, changes:', updatedUsers.changes);

  // 6. Delete department 33 (IT)
  db.prepare("DELETE FROM departments WHERE id = 33").run();
  console.log('Deleted department 33 (IT)');
})();

console.log('\n=== AFTER MIGRATION ===');
const finalDepts = db.prepare("SELECT * FROM departments WHERE name LIKE '%IT%' OR name LIKE '%Information%'").all();
console.log('Departments matching IT / Information:', finalDepts);

const finalMous13 = db.prepare("SELECT id, title, status, progress_percent, faculty_spoc, department_id FROM mous WHERE department_id = 13").all();
console.log('Final MOUs in Information Technology (count ' + finalMous13.length + '):');
finalMous13.forEach((m, i) => console.log(`  ${i+1}. [#${m.id}] ${m.title} - ${m.status} (${m.progress_percent}%) - SPOC: ${m.faculty_spoc || 'N/A'}`));

const remainingDept33 = db.prepare("SELECT * FROM mous WHERE department_id = 33").all();
console.log('Any remaining MOUs with dept 33:', remainingDept33);
