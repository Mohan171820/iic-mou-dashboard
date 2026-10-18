const db = require('../server/db/database');
const list = db.prepare(`
  SELECT m.id, i.name as company_name, m.coe_status, m.coe_name, m.status 
  FROM mous m 
  LEFT JOIN industries i ON m.industry_id = i.id 
  WHERE m.is_deleted = 0 
    AND (
      LOWER(TRIM(m.status)) IN ('coe established', 'coe operational') 
      OR LOWER(m.coe_status) LIKE '%established%' 
      OR LOWER(m.coe_status) LIKE '%available%' 
      OR LOWER(m.coe_status) LIKE '%operational%' 
      OR (m.coe_status IS NOT NULL AND LOWER(TRIM(m.coe_status)) IN ('established', 'available', 'operational', 'active')) 
      OR (m.coe_status IS NOT NULL AND LOWER(TRIM(m.coe_status)) NOT IN ('na', 'nil', '-', '', 'under discussion', 'yet to establish', 'under progress', 'air discussion process') AND LOWER(TRIM(m.coe_status)) NOT LIKE '%will be%')
    )
`).all();
console.log('Operational CoEs Count:', list.length);
console.table(list);
