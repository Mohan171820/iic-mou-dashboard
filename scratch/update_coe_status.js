const db = require('../server/db/database');

const res = db.prepare(`
  UPDATE mous 
  SET status = 'CoE Established' 
  WHERE (status = 'Signed' OR status = 'Formal Signing') 
    AND (LOWER(coe_status) = 'established' OR LOWER(coe_status) = 'operational' OR (coe_name IS NOT NULL AND coe_name != '' AND LOWER(coe_name) NOT IN ('na','nil','none','-')))
`).run();

console.log('Updated MoUs to CoE Established:', res.changes);

const updated = db.prepare(`
  SELECT id, title, status, coe_status, coe_name 
  FROM mous 
  WHERE status = 'CoE Established'
`).all();

console.log('Current CoE Established MoUs:', updated);
