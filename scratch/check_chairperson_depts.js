const fs = require('fs');
const html = fs.readFileSync('public/chairperson.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('depts.departments') || l.includes('allDepts') || l.includes('department_name') || l.includes('deptGrid') || l.includes('renderDeptCards')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
