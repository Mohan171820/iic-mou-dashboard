const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

const depts = db.prepare(`
  SELECT d.id, d.name, d.hod_name,
         COUNT(m.id) as total_mous,
         SUM(CASE WHEN m.status IN ('Signed', 'Formal Signing', 'CoE Established', 'CoE Operational') THEN 1 ELSE 0 END) as signed_mous,
         SUM(CASE WHEN m.status NOT IN ('Signed', 'Formal Signing', 'CoE Established', 'CoE Operational', 'On Hold', 'Not Proceeding') THEN 1 ELSE 0 END) as in_progress_mous,
         SUM(CASE WHEN m.status = 'On Hold' THEN 1 ELSE 0 END) as on_hold_mous,
         ROUND(COALESCE(AVG(m.progress_percent), 0), 1) as avg_percent
  FROM departments d
  LEFT JOIN mous m ON d.id = m.department_id AND m.is_deleted = 0
  GROUP BY d.id
  ORDER BY avg_percent DESC, d.name ASC
`).all();

console.log('Department Progress Result:');
depts.forEach(d => {
  console.log(`${d.name.padEnd(25)} | Total: ${d.total_mous} | Signed: ${d.signed_mous} | Active: ${d.in_progress_mous} | Avg: ${d.avg_percent}% | HOD: ${d.hod_name || 'N/A'}`);
});
