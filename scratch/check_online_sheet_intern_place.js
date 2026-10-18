const https = require('https');
const xlsx = require('xlsx');
const db = require('../server/db/database');
const docId = '1vrjeQei_HmLGdpgnaZjUg1F7BwAoApiW';
const targetUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=xlsx`;

function fetchBuffer(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location, redirects - 1));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function parseSmart(val) {
  if (val === undefined || val === null) return 0;
  const s = String(val).trim();
  if (!s || s === '0' || s.toLowerCase() === 'nil' || s.toLowerCase() === 'no') return 0;
  const direct = parseInt(s);
  if (!isNaN(direct) && direct > 0) return direct;
  const m = s.match(/\b(\d+)\b/);
  return m ? parseInt(m[1]) : 0;
}

async function main() {
  const buf = await fetchBuffer(targetUrl);
  const wb = xlsx.read(buf, { type: 'buffer' });
  const sheet = wb.Sheets['Industry_Data'] || wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log('Total Google Sheet rows:', rows.length);

  const sheetInterns = [];
  const sheetPlacements = [];

  rows.forEach((r, idx) => {
    const comp = (r['Company_Name'] || '').trim();
    if (!comp) return;

    const rawInt = r['Internships_AY'];
    const rawPlc = r['Placements_AY'];

    const intVal = parseSmart(rawInt);
    const plcVal = parseSmart(rawPlc);

    if (intVal > 0) {
      sheetInterns.push({ row: idx + 2, company: comp, raw: rawInt, parsed: intVal });
    }
    if (plcVal > 0) {
      sheetPlacements.push({ row: idx + 2, company: comp, raw: rawPlc, parsed: plcVal });
    }
  });

  const totalInternCount = sheetInterns.reduce((a, b) => a + b.parsed, 0);
  const totalPlaceCount = sheetPlacements.reduce((a, b) => a + b.parsed, 0);

  console.log('\n=========================================');
  console.log(`GOOGLE SHEET INTERNSHIPS: ${totalInternCount} students across ${sheetInterns.length} companies`);
  console.log('=========================================');
  sheetInterns.forEach(s => console.log(`  Row ${String(s.row).padStart(2)}: ${s.company.padEnd(45)} => ${String(s.parsed).padStart(2)} (Raw: ${JSON.stringify(s.raw)})`));

  console.log('\n=========================================');
  console.log(`GOOGLE SHEET PLACEMENTS: ${totalPlaceCount} offers across ${sheetPlacements.length} companies`);
  console.log('=========================================');
  sheetPlacements.forEach(s => console.log(`  Row ${String(s.row).padStart(2)}: ${s.company.padEnd(45)} => ${String(s.parsed).padStart(2)} (Raw: ${JSON.stringify(s.raw)})`));

  // Query Dashboard API values directly from DB
  const summaryQuery = db.prepare(`
    SELECT 
      SUM(CASE WHEN internships_ay > 0 THEN internships_ay ELSE 0 END) as totalInternships,
      COUNT(DISTINCT CASE WHEN internships_ay > 0 THEN industry_id END) as internshipCompanies,
      SUM(CASE WHEN placements_ay > 0 THEN placements_ay ELSE 0 END) as totalPlacements,
      COUNT(DISTINCT CASE WHEN placements_ay > 0 THEN industry_id END) as placementCompanies
    FROM mous
  `).get();

  console.log('\n=========================================');
  console.log('DASHBOARD / DATABASE SUMMARY METRICS:');
  console.log('=========================================');
  console.log(`Total Internships: ${summaryQuery.totalInternships}`);
  console.log(`Internship Companies: ${summaryQuery.internshipCompanies}`);
  console.log(`Total Placements: ${summaryQuery.totalPlacements}`);
  console.log(`Placement Companies: ${summaryQuery.placementCompanies}`);
}

main().catch(console.error);
