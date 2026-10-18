const db = require('../server/db/database');

db.transaction(() => {
  // 1. Normalize existing mou statuses
  const rows = db.prepare('SELECT id, status FROM mous').all();
  const updateMou = db.prepare('UPDATE mous SET status = ?, progress_percent = ? WHERE id = ?');
  
  for (const r of rows) {
    if (!r.status) continue;
    const s = r.status.trim();
    const lower = s.toLowerCase();
    
    if (lower === 'signed' || s === 'SIGNED' || s === 'Signed ') {
      updateMou.run('Signed', 100, r.id);
    } else if (lower.includes('renewal')) {
      updateMou.run('Signed – Under Renewal', 100, r.id);
    } else if (lower === 'coe operational') {
      updateMou.run('CoE Operational', 100, r.id);
    } else if (lower === 'coe established') {
      updateMou.run('CoE Established', 100, r.id);
    }
  }

  // 2. Populate departments.hod_name with lead faculty_spoc where missing
  const depts = db.prepare('SELECT id, name, hod_name FROM departments').all();
  const getSpoc = db.prepare(`
    SELECT faculty_spoc FROM mous 
    WHERE department_id = ? AND faculty_spoc IS NOT NULL AND TRIM(faculty_spoc) != '' AND TRIM(faculty_spoc) != '-' 
    GROUP BY faculty_spoc ORDER BY COUNT(*) DESC LIMIT 1
  `);
  const updateDeptHod = db.prepare('UPDATE departments SET hod_name = ? WHERE id = ?');

  for (const d of depts) {
    if (!d.hod_name || d.hod_name.trim() === '' || d.hod_name.trim().toUpperCase() === 'N/A') {
      const spocRow = getSpoc.get(d.id);
      if (spocRow && spocRow.faculty_spoc) {
        updateDeptHod.run(spocRow.faculty_spoc.trim(), d.id);
        console.log(`Updated Dept ${d.name} SPOC to: ${spocRow.faculty_spoc.trim()}`);
      }
    }
  }
})();

console.log('Database normalization completed successfully.');
