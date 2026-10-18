const db = require('../server/db/database');

const isSigned = (st) => {
  if (!st) return false;
  const s = st.trim().toLowerCase();
  return s.startsWith('signed') || s.startsWith('coe') || s.includes('formal signing');
};

const isOnHold = (st) => {
  if (!st) return false;
  const s = st.trim().toLowerCase();
  return s === 'on hold' || s === 'no' || s === 'paused' || s === 'stalled';
};

const isNotProceeding = (st) => {
  if (!st) return false;
  const s = st.trim().toLowerCase();
  return s === 'not proceeding' || s === 'cancelled' || s === 'rejected';
};

const mous = db.prepare('SELECT id, department_id, status, progress_percent, faculty_spoc FROM mous WHERE is_deleted = 0').all();
const depts = db.prepare('SELECT id, name, hod_name FROM departments').all();

const deptMap = new Map();
depts.forEach(d => {
  let name = d.name.trim();
  if (name.toUpperCase() === 'IT' || name.toLowerCase() === 'information technology') {
    name = 'Information Technology';
  }
  if (!deptMap.has(name)) {
    deptMap.set(name, {
      ids: [d.id],
      name: name,
      hod_name: d.hod_name,
      total: 0,
      signed: 0,
      active: 0,
      onHold: 0,
      pctSum: 0,
      spocs: []
    });
  } else {
    deptMap.get(name).ids.push(d.id);
    if (!deptMap.get(name).hod_name && d.hod_name) deptMap.get(name).hod_name = d.hod_name;
  }
});

mous.forEach(m => {
  for (const [name, d] of deptMap.entries()) {
    if (d.ids.includes(m.department_id)) {
      d.total++;
      if (isSigned(m.status)) {
        d.signed++;
        d.pctSum += 100;
      } else if (isOnHold(m.status)) {
        d.onHold++;
        d.pctSum += (m.progress_percent || 0);
      } else if (isNotProceeding(m.status)) {
        d.pctSum += 0;
      } else {
        d.active++;
        d.pctSum += (m.progress_percent || 10);
      }
      if (m.faculty_spoc && m.faculty_spoc.trim() && m.faculty_spoc.trim() !== '-' && !d.spocs.includes(m.faculty_spoc.trim())) {
        d.spocs.push(m.faculty_spoc.trim());
      }
      break;
    }
  }
});

for (const [name, d] of deptMap.entries()) {
  const avg = d.total > 0 ? Math.round(d.pctSum / d.total) : 0;
  const spoc = d.spocs[0] || d.hod_name || 'N/A';
  console.log(`${name.padEnd(25)} | Total: ${d.total} | Signed: ${d.signed} | Active: ${d.active} | Avg: ${avg}% | SPOC: ${spoc.replace(/\n/g, ', ')}`);
}
