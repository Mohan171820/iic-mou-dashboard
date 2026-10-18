const db = require('../server/db/database');
const rows = db.prepare(`
  SELECT m.id, i.name as company_name, m.coe_status, m.coe_name, m.status, d.name as dept_name
  FROM mous m
  LEFT JOIN industries i ON m.industry_id = i.id
  LEFT JOIN departments d ON m.department_id = d.id
  WHERE m.is_deleted = 0 
    AND (
      LOWER(TRIM(m.coe_status)) IN ('established', 'available', 'operational', 'active') 
      OR LOWER(m.coe_status) LIKE '%established%' 
      OR LOWER(m.coe_status) LIKE '%operational%' 
      OR LOWER(m.status) IN ('coe established', 'coe operational')
    )
`).all();
console.log('Count:', rows.length);
console.table(rows);
