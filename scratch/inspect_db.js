const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log('TABLE ' + t.name + ':\n' + t.sql + '\n'));

console.log('--- Sample MOU ---');
console.log(db.prepare("SELECT * FROM mous LIMIT 1").get());

console.log('--- MOUs for dept 13 (Information Technology) ---');
console.log(db.prepare("SELECT * FROM mous WHERE department_id = 13").all());

console.log('--- MOUs for dept 33 (IT) ---');
console.log(db.prepare("SELECT * FROM mous WHERE department_id = 33").all());

console.log('--- Checking all tables with department_id ---');
tables.forEach(t => {
  if (t.sql && t.sql.includes('department_id')) {
    console.log('Table has department_id: ' + t.name);
    try {
      const count13 = db.prepare(`SELECT count(*) as c FROM ${t.name} WHERE department_id = 13`).get();
      const count33 = db.prepare(`SELECT count(*) as c FROM ${t.name} WHERE department_id = 33`).get();
      console.log(`  ${t.name}: dept 13 has ${count13.c}, dept 33 has ${count33.c}`);
    } catch (e) {
      console.log(`  ${t.name} query error:`, e.message);
    }
  }
});
