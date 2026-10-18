const path = require('path');
const db = require(path.join(__dirname, '../server/db/database'));
db.prepare("UPDATE users SET name = ? WHERE id = 2 OR role = 'Chairperson'").run("DR. R. ShivaKumar");
const updated = db.prepare("SELECT id, name, email, role FROM users WHERE id = 2").get();
console.log("Updated Chairman in DB:", updated);
