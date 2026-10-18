const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const times = db.prepare('SELECT created_at, count(*) as c FROM mous GROUP BY created_at').all();
console.log('MOU created_at groups:');
console.log(times);

const depts = db.prepare('SELECT id, name FROM departments').all();
console.log('All departments in DB:');
console.log(depts);
