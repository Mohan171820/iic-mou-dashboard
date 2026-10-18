const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const xlsx = require('xlsx');
const db = require('../server/db/database');

const docId = '1vrjeQei_HmLGdpgnaZjUg1F7BwAoApiW';
const targetUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=xlsx`;

function fetchBuffer(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects < 0) return reject(new Error('Too many redirects'));
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location, redirects - 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function normalizeStr(s) {
  return String(s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('Downloading Google Sheet...');
  const buf = await fetchBuffer(targetUrl);
  console.log(`Downloaded ${buf.length} bytes.`);

  const workbook = xlsx.read(buf, { type: 'buffer', cellDates: true });
  console.log('Sheet names in Google Sheet:', workbook.SheetNames);

  // Find sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  console.log(`Total rows (including header): ${rawRows.length}`);
  if (rawRows.length === 0) return;

  const headerRow = rawRows[0];
  console.log('Headers in row 0:');
  headerRow.forEach((h, i) => console.log(`  Col ${i}: "${h}"`));

  // Also check object rows
  const records = xlsx.utils.sheet_to_json(sheet);
  console.log(`Parsed ${records.length} record rows.`);

  // Find columns for company, internships, placements
  let companyColKey = null;
  let internshipColKey = null;
  let placementColKey = null;

  const sample = records[0] || {};
  for (const k of Object.keys(sample)) {
    const lk = k.toLowerCase();
    if (lk.includes('company') || lk.includes('firm') || lk.includes('industry')) {
      companyColKey = companyColKey || k;
    }
    if (lk.includes('internship') || lk.includes('intern')) {
      internshipColKey = k;
    }
    if (lk.includes('placement') || lk.includes('placed') || lk.includes('offer')) {
      placementColKey = k;
    }
  }

  console.log('\nDetected column keys:');
  console.log('  Company key:', companyColKey);
  console.log('  Internship key:', internshipColKey);
  console.log('  Placement key:', placementColKey);

  // Aggregate Google Sheet
  const sheetInternshipsByCompany = [];
  const sheetPlacementsByCompany = [];
  let sheetTotalInternships = 0;
  let sheetTotalPlacements = 0;

  records.forEach((row, idx) => {
    // If empty row or total row, skip
    const comp = String(row[companyColKey] || '').trim();
    if (!comp || comp.toLowerCase().includes('total') || comp.toLowerCase().includes('summary')) return;

    let internVal = 0;
    if (internshipColKey && row[internshipColKey] !== undefined) {
      const parsed = parseInt(String(row[internshipColKey]).replace(/[^0-9]/g, ''));
      if (!isNaN(parsed)) internVal = parsed;
    }

    let placeVal = 0;
    if (placementColKey && row[placementColKey] !== undefined) {
      const parsed = parseInt(String(row[placementColKey]).replace(/[^0-9]/g, ''));
      if (!isNaN(parsed)) placeVal = parsed;
    }

    if (internVal > 0) {
      sheetTotalInternships += internVal;
      sheetInternshipsByCompany.push({ company: comp, count: internVal, row: idx + 2 });
    }
    if (placeVal > 0) {
      sheetTotalPlacements += placeVal;
      sheetPlacementsByCompany.push({ company: comp, count: placeVal, row: idx + 2 });
    }
  });

  console.log('\n--- GOOGLE SHEET TOTALS ---');
  console.log(`Total Internships: ${sheetTotalInternships} across ${sheetInternshipsByCompany.length} companies`);
  console.log(`Total Placements: ${sheetTotalPlacements} across ${sheetPlacementsByCompany.length} companies`);

  // Query Database
  const dbRows = db.prepare(`
    SELECT m.id, i.name as company_name, m.internships_ay, m.placements_ay
    FROM mous m
    JOIN industries i ON m.industry_id = i.id
    ORDER BY i.name ASC
  `).all();

  let dbTotalInternships = 0;
  let dbTotalPlacements = 0;
  const dbInternships = [];
  const dbPlacements = [];

    dbRows.forEach(r => {
      const intern = parseInt(r.internships_ay || 0);
      const place = parseInt(r.placements_ay || 0);
      if (intern > 0) {
        dbTotalInternships += intern;
        dbInternships.push({ company: r.company_name, count: intern, id: r.id });
      }
      if (place > 0) {
        dbTotalPlacements += place;
        dbPlacements.push({ company: r.company_name, count: place, id: r.id });
      }
    });

    console.log('\n--- DATABASE TOTALS ---');
    console.log(`Total Internships: ${dbTotalInternships} across ${dbInternships.length} companies`);
    console.log(`Total Placements: ${dbTotalPlacements} across ${dbPlacements.length} companies`);

    console.log('\n--- DETAILED COMPARISON: INTERNSHIPS ---');
    console.log('Google Sheet Internships:');
    sheetInternshipsByCompany.forEach(c => console.log(`  Row ${c.row}: ${c.company} => ${c.count}`));

    console.log('\nDatabase Internships:');
    dbInternships.forEach(c => console.log(`  ID ${c.id}: ${c.company} => ${c.count}`));

    console.log('\n--- DETAILED COMPARISON: PLACEMENTS ---');
    console.log('Google Sheet Placements:');
    sheetPlacementsByCompany.forEach(c => console.log(`  Row ${c.row}: ${c.company} => ${c.count}`));

    console.log('\nDatabase Placements:');
    dbPlacements.forEach(c => console.log(`  ID ${c.id}: ${c.company} => ${c.count}`));

    // Check mismatches
    console.log('\n--- MISMATCH CHECK ---');
    let hasMismatch = false;

    // Compare each Google Sheet internship
    sheetInternshipsByCompany.forEach(sc => {
      const match = dbInternships.find(dc => normalizeStr(dc.company) === normalizeStr(sc.company) || normalizeStr(dc.company).includes(normalizeStr(sc.company)) || normalizeStr(sc.company).includes(normalizeStr(dc.company)));
      if (!match) {
        console.log(`[MISMATCH] Google Sheet has internship for "${sc.company}" (${sc.count}), but NOT in DB!`);
        hasMismatch = true;
      } else if (match.count !== sc.count) {
        console.log(`[MISMATCH] Count difference for "${sc.company}": Sheet=${sc.count}, DB=${match.count}`);
        hasMismatch = true;
      }
    });

    dbInternships.forEach(dc => {
      const match = sheetInternshipsByCompany.find(sc => normalizeStr(sc.company) === normalizeStr(dc.company) || normalizeStr(dc.company).includes(normalizeStr(sc.company)) || normalizeStr(sc.company).includes(normalizeStr(dc.company)));
      if (!match) {
        console.log(`[MISMATCH] DB has internship for "${dc.company}" (${dc.count}), but NOT in Google Sheet!`);
        hasMismatch = true;
      }
    });

    // Compare placements
    sheetPlacementsByCompany.forEach(sc => {
      const match = dbPlacements.find(dc => normalizeStr(dc.company) === normalizeStr(sc.company) || normalizeStr(dc.company).includes(normalizeStr(sc.company)) || normalizeStr(sc.company).includes(normalizeStr(dc.company)));
      if (!match) {
        console.log(`[MISMATCH] Google Sheet has placement for "${sc.company}" (${sc.count}), but NOT in DB!`);
        hasMismatch = true;
      } else if (match.count !== sc.count) {
        console.log(`[MISMATCH] Count difference for "${sc.company}": Sheet=${sc.count}, DB=${match.count}`);
        hasMismatch = true;
      }
    });

    dbPlacements.forEach(dc => {
      const match = sheetPlacementsByCompany.find(sc => normalizeStr(sc.company) === normalizeStr(dc.company) || normalizeStr(dc.company).includes(normalizeStr(sc.company)) || normalizeStr(sc.company).includes(normalizeStr(dc.company)));
      if (!match) {
        console.log(`[MISMATCH] DB has placement for "${dc.company}" (${dc.count}), but NOT in Google Sheet!`);
        hasMismatch = true;
      }
    });

    if (!hasMismatch) {
      console.log('>>> 100% PERFECT MATCH! All internship & placement companies and counts match between Google Sheet and Database! <<<');
    }
}

run().catch(err => {
  console.error('Error:', err);
});
