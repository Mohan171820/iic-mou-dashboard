const db = require('../server/db/database');

// Query 1: Exactly matches coe_status = 'Established'
const q1 = db.prepare(`
  SELECT m.id, m.title, i.name as company_name, m.coe_status, m.coe_name, m.status 
  FROM mous m
  LEFT JOIN industries i ON m.industry_id = i.id
  WHERE m.is_deleted = 0 
    AND (
      LOWER(TRIM(m.coe_status)) IN ('established', 'available', 'operational', 'active')
      OR LOWER(m.coe_status) LIKE '%established%'
      OR LOWER(m.status) IN ('coe established', 'coe operational')
      OR (m.coe_name IS NOT NULL AND m.coe_name != '' AND LOWER(TRIM(m.coe_name)) NOT IN ('na','nil','none','-'))
    )
`).all();

console.log('--- ALL VALID COE ROWS (' + q1.length + ') ---');
console.table(q1);

// Query 2: Strictly where coe_status column itself indicates Established/Operational/Available
const q2 = db.prepare(`
  SELECT m.id, m.title, i.name as company_name, m.coe_status, m.coe_name, m.status 
  FROM mous m
  LEFT JOIN industries i ON m.industry_id = i.id
  WHERE m.is_deleted = 0 
    AND (
      LOWER(TRIM(m.coe_status)) IN ('established', 'available', 'operational', 'active')
      OR LOWER(m.coe_status) LIKE '%established%'
      OR LOWER(m.coe_status) LIKE '%available%'
      OR LOWER(m.coe_status) LIKE '%operational%'
    )
`).all();

console.log('--- STRICT COE_STATUS COLUMN ONLY (' + q2.length + ') ---');
console.table(q2);

// Query 3: What does the Excel file have directly in CoE_Status column?
const xlsx = require('xlsx');
const svc = require('../server/services/excelSyncService');
const activeFile = svc.findActiveSyncFile();
console.log('Active Excel File:', activeFile);
if (activeFile) {
  const wb = xlsx.readFile(activeFile);
  const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  const excelCoe = data.map((r, idx) => ({
    row: idx + 2,
    company: r['Company_Name'] || r['Company Name'] || r['Industry_Name'],
    coeStatus: r['CoE_Status'] || r['CoE Status'] || r['COE Status'] || '',
    coeName: r['CoE_Name'] || r['CoE Name'] || ''
  })).filter(x => x.coeStatus && String(x.coeStatus).trim() !== '' && !['NA','NIL','NONE','-'].includes(String(x.coeStatus).trim().toUpperCase()));
  console.log('--- EXCEL COE_STATUS NON-EMPTY ENTRIES (' + excelCoe.length + ') ---');
  console.table(excelCoe);
}
