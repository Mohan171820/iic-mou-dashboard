const db = require('../server/db/database');

const query = `
  SELECT d.id, d.name, d.hod_name,
         COALESCE(
           NULLIF(TRIM(d.hod_name), ''),
           (SELECT faculty_spoc FROM mous WHERE department_id = d.id AND faculty_spoc IS NOT NULL AND TRIM(faculty_spoc) != '' AND TRIM(faculty_spoc) != '-' LIMIT 1)
         ) as faculty_spoc
  FROM departments d
`;

const rows = db.prepare(query).all();
console.log(rows);
