const path = require('path');
const db = require(path.join(__dirname, '../server/db/database'));
const m = db.prepare("SELECT id, title, status, progress_percent, coe_status, coe_name, mou_date, internships_ay, placements_ay, joint_research, sponsored_funding_inr FROM mous WHERE title LIKE '%Samsung%'").get();
console.log(m);
