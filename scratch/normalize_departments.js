const db = require('../server/db/database');

console.log('--- Starting Department Normalization Migration ---');

// 1. Ensure clean canonical departments exist
function getOrCreateDept(name, defaultHod) {
  let row = db.prepare('SELECT id FROM departments WHERE name = ?').get(name);
  if (!row) {
    const res = db.prepare('INSERT INTO departments (name, hod_name) VALUES (?, ?)').run(name, defaultHod || '');
    return res.lastInsertRowid;
  }
  return row.id;
}

const cyberDeptId = getOrCreateDept('Cybersecurity', 'Dr. Shiny Duela');
const gamingDeptId = getOrCreateDept('Gaming Technology', 'Dr. Balika J Chelliah');
const bdaCcDeptId = getOrCreateDept('BDA & CC', 'Dr. A. Umamageswari');
const iotCsbsDeptId = getOrCreateDept('IOT & CSBS', 'Dr. A. UshaRuby');
const bioDeptId = getOrCreateDept('Biotechnology', 'Dr H Archana');
const mechDeptId = getOrCreateDept('Mech', 'Dr. C. Uthirapathy');
const itDeptId = getOrCreateDept('Information Technology', 'Dr M Latha');

// 2. Query all active MoUs
const mous = db.prepare(`
  SELECT m.id, m.title, m.aligned_branches, m.faculty_spoc, d.name as dept_name 
  FROM mous m 
  LEFT JOIN departments d ON m.department_id = d.id 
  WHERE m.is_deleted = 0
`).all();

const updateDept = db.prepare('UPDATE mous SET department_id = ? WHERE id = ?');

let reassignCount = 0;
mous.forEach(m => {
  const dName = (m.dept_name || '').trim();
  if (dName === 'CS&GT') {
    if ((m.aligned_branches && m.aligned_branches.toLowerCase().includes('gaming')) || (m.faculty_spoc && m.faculty_spoc.includes('Balika'))) {
      updateDept.run(gamingDeptId, m.id);
    } else {
      updateDept.run(cyberDeptId, m.id);
    }
    reassignCount++;
  } else if (dName === 'BDA' || dName === 'BDA&CC') {
    updateDept.run(bdaCcDeptId, m.id);
    reassignCount++;
  } else if (dName === 'IOT' || dName === 'IOT&CSBS') {
    updateDept.run(iotCsbsDeptId, m.id);
    reassignCount++;
  } else if (dName === 'Biotechnology ') {
    updateDept.run(bioDeptId, m.id);
    reassignCount++;
  } else if (dName === 'Mech ') {
    updateDept.run(mechDeptId, m.id);
    reassignCount++;
  } else if (dName === 'IT') {
    updateDept.run(itDeptId, m.id);
    reassignCount++;
  }
});

console.log(`Reassigned ${reassignCount} MoUs to canonical departments.`);

// 3. Remove zero-mou departments from departments table
const delRes = db.prepare('DELETE FROM departments WHERE id NOT IN (SELECT DISTINCT department_id FROM mous WHERE is_deleted = 0)').run();
console.log(`Deleted ${delRes.changes} orphaned zero-MoU departments.`);

// 4. Update HOD names for clean departments if needed
db.prepare('UPDATE departments SET hod_name = ? WHERE id = ?').run('Dr. Shiny Duela', cyberDeptId);
db.prepare('UPDATE departments SET hod_name = ? WHERE id = ?').run('Dr. Balika J Chelliah', gamingDeptId);
db.prepare('UPDATE departments SET hod_name = ? WHERE id = ?').run('Dr. A. Umamageswari', bdaCcDeptId);
db.prepare('UPDATE departments SET hod_name = ? WHERE id = ?').run('Dr. A. UshaRuby', iotCsbsDeptId);

// 5. Verify final clean departments and counts
const finalDepts = db.prepare(`
  SELECT d.id, d.name, d.hod_name, COUNT(m.id) as mou_count
  FROM departments d
  JOIN mous m ON d.id = m.department_id AND m.is_deleted = 0
  GROUP BY d.id
  ORDER BY mou_count DESC, d.name ASC
`).all();

console.log('Final clean departments:');
console.log(JSON.stringify(finalDepts, null, 2));

const totalActive = db.prepare('SELECT COUNT(*) as count FROM mous WHERE is_deleted = 0').get().count;
console.log('Total active MoUs in system:', totalActive);
