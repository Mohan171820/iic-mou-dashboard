const path = require('path');
const db = require(path.join(__dirname, '../server/db/database.js'));

function normalizeCityName(raw) {
  if (!raw) return 'Other';
  let str = String(raw).trim().replace(/[()\[\]]/g, '').trim();
  if (/^(not confirmed|not specified|n\/?a|none|pending|null|undefined|unknown)$/i.test(str)) {
    return 'Other';
  }
  const lower = str.toLowerCase();
  if (lower.includes('chennai')) return 'Chennai';
  if (lower.includes('bangalore') || lower.includes('bengaluru')) return 'Bengaluru';
  if (lower.includes('hyderabad')) return 'Hyderabad';
  if (lower.includes('pune')) return 'Pune';
  if (lower.includes('coimbatore')) return 'Coimbatore';
  if (lower.includes('tiruchirappalli') || lower.includes('trichy')) return 'Tiruchirappalli';
  if (lower.includes('gurgaon') || lower.includes('gurugram')) return 'Gurugram';
  if (lower.includes('mumbai') || lower.includes('bombay')) return 'Mumbai';
  if (lower.includes('karur')) return 'Karur';
  if (lower.includes('mangalore') || lower.includes('mangaluru')) return 'Mangalore';
  if (lower.includes('san francisco')) return 'San Francisco';
  if (lower.includes('ethiopia')) return 'Ethiopia';
  if (lower.includes('slovakia')) return 'Slovakia';
  if (lower.includes('slovenia') || lower.includes('maribor')) return 'Slovenia';
  if (lower.includes('portland')) return 'Portland';

  const token = str.split(/[,/;&]/)[0].trim();
  if (!token || token.length < 2) return 'Other';
  return token.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

// Update industries address
const industries = db.prepare('SELECT id, name, address FROM industries').all();
const updateStmt = db.prepare('UPDATE industries SET address = ? WHERE id = ?');

db.transaction(() => {
  for (const ind of industries) {
    const normalized = normalizeCityName(ind.address);
    if (normalized !== ind.address) {
      updateStmt.run(normalized, ind.id);
      console.log(`Updated industry #${ind.id} (${ind.name}): "${ind.address}" -> "${normalized}"`);
    }
  }
})();

console.log('City migration complete.');
