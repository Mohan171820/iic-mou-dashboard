const fs = require('fs');
let lines = fs.readFileSync('public/chairperson.html', 'utf8').split('\n');
lines[1984] = "        document.getElementById('cityActivePill').textContent = '📍 ' + cityData.activeCities + ' Cities Active';";
lines[1983] = "          ? Math.round((s.signed / cityData.totalVisited) * 100) + '% conversion' : '—';";
fs.writeFileSync('public/chairperson.html', lines.join('\n'), 'utf8');
console.log('Fixed lines');
