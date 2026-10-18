const path = require('path');
const db = require(path.join(__dirname, '../server/db/database'));
const rows = db.prepare("SELECT id, title, status, coe_status, coe_name FROM mous WHERE (coe_status IS NOT NULL AND coe_status != '' AND coe_status != 'N/A') OR (coe_name IS NOT NULL AND coe_name != '' AND coe_name != 'N/A')").all();
console.log('CoE rows count:', rows.length);
console.log(rows);
