const path = require('path');
const db = require(path.join(__dirname, '../server/db/database'));
const rows = db.prepare("SELECT id, title, status, coe_status, coe_name FROM mous WHERE coe_status NOT IN ('NA', 'nil', '', 'Under Discussion') AND coe_status IS NOT NULL").all();
console.log('Established or active CoE rows:', rows);
