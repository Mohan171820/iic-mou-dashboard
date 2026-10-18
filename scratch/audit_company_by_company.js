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

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  const buf = await fetchBuffer(targetUrl);
  const wb = xlsx.read(buf, { type: 'buffer' });
  const sheet = wb.Sheets['Industry_Data'] || wb.Sheets[wb.SheetNames[0]];
  const sheetRows = xlsx.utils.sheet_to_json(sheet);

  // Active DB rows
  const dbRows = db.prepare(`
    SELECT m.id, i.name as company_name, m.internships_ay, m.placements_ay, d.name as dept_name
    FROM mous m
    JOIN industries i ON m.industry_id = i.id
    LEFT JOIN departments d ON m.department_id = d.id
    WHERE m.is_deleted = 0
    ORDER BY i.name ASC
  `).all();

  console.log(`Active Google Sheet Rows: ${sheetRows.length}`);
  console.log(`Active Database MoUs: ${dbRows.length}`);

  // Map Google Sheet by normalized company name
  const sheetMap = new Map();
  sheetRows.forEach((r, idx) => {
    const rawName = String(r['Company_Name'] || '').trim();
    if (!rawName) return;
    const cleanName = rawName.replace(/^(mou\s*[-–—:]\s*)+/i, '').trim();
    const interns = parseSmart(r['Internships_AY']);
    const places = parseSmart(r['Placements_AY']);
    sheetMap.set(norm(cleanName), {
      row: idx + 2,
      rawName,
      cleanName,
      interns,
      places,
      rawIntern: r['Internships_AY'],
      rawPlace: r['Placements_AY']
    });
  });

  let mismatches = 0;
  const internshipMatches = [];
  const placementMatches = [];

  dbRows.forEach(dbRow => {
    const key = norm(dbRow.company_name);
    // Find closest or exact
    let sheetEntry = sheetMap.get(key);
    if (!sheetEntry) {
      for (const [k, v] of sheetMap.entries()) {
        if (k.includes(key) || key.includes(k)) {
          sheetEntry = v;
          break;
        }
      }
    }

    if (!sheetEntry) {
      console.log(`[NOT IN SHEET] DB MoU ID ${dbRow.id} "${dbRow.company_name}" not found in Google Sheet`);
      mismatches++;
      return;
    }

    const dbIntern = parseSmart(dbRow.internships_ay);
    const dbPlace = parseSmart(dbRow.placements_ay);

    if (sheetEntry.interns !== dbIntern) {
      console.log(`[INTERN MISMATCH] ${dbRow.company_name}: Sheet=${sheetEntry.interns} vs DB=${dbIntern}`);
      mismatches++;
    } else if (dbIntern > 0) {
      internshipMatches.push({
        company: dbRow.company_name,
        sheetCount: sheetEntry.interns,
        dbCount: dbIntern,
        rawSheet: sheetEntry.rawIntern
      });
    }

    if (sheetEntry.places !== dbPlace) {
      console.log(`[PLACEMENT MISMATCH] ${dbRow.company_name}: Sheet=${sheetEntry.places} vs DB=${dbPlace}`);
      mismatches++;
    } else if (dbPlace > 0) {
      placementMatches.push({
        company: dbRow.company_name,
        sheetCount: sheetEntry.places,
        dbCount: dbPlace,
        rawSheet: sheetEntry.rawPlace
      });
    }
  });

  console.log(`\n======================================================`);
  console.log(`AUDIT RESULTS: ${mismatches === 0 ? 'ALL DATA 100% MATCHES!' : mismatches + ' MISMATCHES DETECTED'}`);
  console.log(`======================================================`);

  console.log(`\n--- ALL ${internshipMatches.length} INTERNSHIP COMPANIES (TOTAL: ${internshipMatches.reduce((a,b)=>a+b.dbCount, 0)} STUDENTS) ---`);
  internshipMatches.sort((a,b) => b.dbCount - a.dbCount).forEach((m, i) => {
    console.log(`${String(i+1).padStart(2)}. ${m.company.padEnd(48)}: ${String(m.dbCount).padStart(2)} students (Sheet Raw: ${JSON.stringify(m.rawSheet)})`);
  });

  console.log(`\n--- ALL ${placementMatches.length} PLACEMENT COMPANIES (TOTAL: ${placementMatches.reduce((a,b)=>a+b.dbCount, 0)} OFFERS) ---`);
  placementMatches.sort((a,b) => b.dbCount - a.dbCount).forEach((m, i) => {
    console.log(`${String(i+1).padStart(2)}. ${m.company.padEnd(48)}: ${String(m.dbCount).padStart(2)} offers   (Sheet Raw: ${JSON.stringify(m.rawSheet)})`);
  });
}

run().catch(console.error);
