const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const mous33 = db.prepare('SELECT id, title, industry_id FROM mous WHERE department_id = 33').all();
const mous13 = db.prepare('SELECT id, title, industry_id FROM mous WHERE department_id = 13').all();

console.log('Dept 13 MOUs:', mous13);
console.log('Dept 33 MOUs:', mous33);

// Let's check industry details for both
mous13.forEach(m => {
  const ind = db.prepare('SELECT * FROM industries WHERE id = ?').get(m.industry_id);
  console.log(`Dept 13 Mou ${m.id} (${m.title}) -> Industry:`, ind?.name);
});

mous33.forEach(m => {
  const ind = db.prepare('SELECT * FROM industries WHERE id = ?').get(m.industry_id);
  console.log(`Dept 33 Mou ${m.id} (${m.title}) -> Industry:`, ind?.name);
});
