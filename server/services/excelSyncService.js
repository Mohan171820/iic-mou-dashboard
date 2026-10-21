const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const db = require('../db/database');

let lastSyncTime = null;
let lastSyncStatus = { active: false, file: null, count: 0, lastError: null };
let isSyncing = false;

// Determine candidate watch paths
function getSyncCandidatePaths() {
  const candidates = [];
  if (process.env.EXCEL_SYNC_PATH) {
    candidates.push(process.env.EXCEL_SYNC_PATH);
  }
  // User's Desktop path on Windows
  candidates.push('c:/Users/miriy/OneDrive/Desktop/Industry_Connect_Data.xlsx');
  candidates.push('c:\\Users\\miriy\\OneDrive\\Desktop\\Industry_Connect_Data.xlsx');
  candidates.push('c:/Users/miriy/OneDrive/Desktop/Mou Details.xlsx');
  // Local project data folder
  candidates.push(path.join(__dirname, '../../data/Industry_Connect_Data.xlsx'));
  candidates.push(path.join(__dirname, '../../data/MoU_Master.xlsx'));

  return candidates;
}

function findActiveSyncFile() {
  const candidates = getSyncCandidatePaths();
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {}
  }
  return null;
}

function getField(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
    const normalizedTarget = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const rowKey of Object.keys(row)) {
      if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTarget) {
        if (row[rowKey] !== undefined && row[rowKey] !== null && String(row[rowKey]).trim() !== '') {
          return String(row[rowKey]).trim();
        }
      }
    }
  }
  return '';
}

function normalizeCityName(raw) {
  if (!raw) return 'Other';
  const str = String(raw).trim();
  const lower = str.toLowerCase();

  if (lower.includes('chennai') || lower.includes('madras')) return 'Chennai';
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('blore')) return 'Bengaluru';
  if (lower.includes('pune')) return 'Pune';
  if (lower.includes('hyderabad') || lower.includes('secunderabad')) return 'Hyderabad';
  if (lower.includes('karur')) return 'Karur';
  if (lower.includes('ethiopia') || lower.includes('addis')) return 'Ethiopia';
  if (lower.includes('gurugram') || lower.includes('gurgaon')) return 'Gurugram';
  if (lower.includes('mangalor') || lower.includes('mangalore')) return 'Mangalore';
  if (lower.includes('coimbatore') || lower.includes('kovai')) return 'Coimbatore';
  if (lower.includes('tiruchirappalli') || lower.includes('trichy') || lower.includes('tiruchy')) return 'Tiruchirappalli';
  if (lower.includes('slovakia') || lower.includes('tuke')) return 'Slovakia';
  if (lower.includes('san francisco') || lower.includes('bay area') || lower.includes('california')) return 'San Francisco';
  if (lower.includes('slovenia') || lower.includes('maribor')) return 'Slovenia';
  if (lower.includes('portland')) return 'Portland';

  const token = str.split(/[,/;&]/)[0].trim();
  if (!token || token.length < 2) return 'Other';
  return token.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function normalizeMouStage(rawStage, rawStageIdx) {
  // Check if rawStageIdx or rawStage contains an explicit 1..6 stage index
  const idxCandidate = String(rawStageIdx || '').trim() || String(rawStage || '').trim();
  const firstChar = idxCandidate.charAt(0);
  const parsedNum = parseInt(firstChar);

  if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 6) {
    if (parsedNum === 1) return { status: 'Campus Visit', pct: 20, stageIndex: 1 };
    if (parsedNum === 2) return { status: 'Follow-up Communication', pct: 40, stageIndex: 2 };
    if (parsedNum === 3) return { status: 'MoU Draft Share', pct: 60, stageIndex: 3 };
    if (parsedNum === 4) return { status: 'Formal Signing', pct: 100, stageIndex: 4 };
    if (parsedNum === 5) return { status: 'CoE Established', pct: 100, stageIndex: 5 };
    if (parsedNum === 6) return { status: 'Active R&D / Hiring', pct: 100, stageIndex: 6 };
  }

  const s = String(rawStage || '').trim();
  const lower = s.toLowerCase();

  if (lower.startsWith('1.') || lower.includes('campus visit')) {
    return { status: 'Campus Visit', pct: 20, stageIndex: 1 };
  }
  if (lower.startsWith('2.') || lower.includes('follow up') || lower.includes('follow-up') || lower.includes('communicat')) {
    return { status: 'Follow-up Communication', pct: 40, stageIndex: 2 };
  }
  if (lower.startsWith('3.') || lower.includes('draft share') || lower.includes('draft shared') || lower.includes('mou draft')) {
    return { status: 'MoU Draft Share', pct: 60, stageIndex: 3 };
  }
  if (lower.startsWith('4.') || lower.includes('formal signing')) {
    return { status: 'Formal Signing', pct: 100, stageIndex: 4 };
  }
  if (lower.startsWith('5.') || lower.includes('coe established') || lower.includes('coe operational')) {
    return { status: 'CoE Established', pct: 100, stageIndex: 5 };
  }
  if (lower.startsWith('6.') || lower.includes('active r&d') || lower.includes('hiring')) {
    return { status: 'Active R&D / Hiring', pct: 100, stageIndex: 6 };
  }

  // Signed & CoE stages (100% complete)
  if (lower.startsWith('signed') || lower.startsWith('coe') || lower.includes('formal signing') || lower === 'final' || lower.includes('signed')) {
    if (lower.includes('coe operational')) return { status: 'CoE Operational', pct: 100, stageIndex: 5 };
    if (lower.includes('coe')) return { status: 'CoE Established', pct: 100, stageIndex: 5 };
    if (lower.includes('renewal')) return { status: 'Signed – Under Renewal', pct: 100, stageIndex: 4 };
    return { status: 'Signed', pct: 100, stageIndex: 4 };
  }

  // Pre-signing stages
  if (lower.includes('waiting for date') || lower.includes('date confirmation') || lower.includes('signing date')) {
    return { status: 'Waiting for Date', pct: 95, stageIndex: 3 };
  }
  if (lower.includes('waiting for approval') || lower.includes('management approval') || lower.includes('approval awaited')) {
    return { status: 'Waiting for approval', pct: 85, stageIndex: 3 };
  }
  if (lower.includes('revision') || lower.includes('clarification')) {
    return { status: 'Revision / Clarification Required', pct: 75, stageIndex: 3 };
  }
  if (lower.includes('initiated legal') || lower.includes('draft review') || lower.includes('under review')) {
    return { status: 'Initiated legal', pct: 65, stageIndex: 3 };
  }
  if (lower.includes('company accepted') || lower.includes('draft shared')) {
    return { status: 'Company accepted for MoU', pct: 60, stageIndex: 3 };
  }
  if (lower.includes('under process') || lower.includes('under progress') || lower.includes('draft mou')) {
    return { status: 'Under Process', pct: 40, stageIndex: 3 };
  }
  if (lower.includes('under discuss') || lower.includes('discussion')) {
    return { status: 'Under Discussion', pct: 30, stageIndex: 2 };
  }
  if (lower.includes('prospect')) {
    return { status: 'Initiated – Prospect', pct: 20, stageIndex: 1 };
  }
  if (lower === 'on hold' || lower === 'no' || lower === 'paused' || lower === 'stalled') {
    return { status: 'On Hold', pct: 0, stageIndex: 0 };
  }
  if (lower === 'not proceeding' || lower === 'cancelled' || lower === 'rejected') {
    return { status: 'Not Proceeding', pct: 0, stageIndex: 0 };
  }

  return { status: s || 'Campus Visit', pct: 10, stageIndex: 1 };
}

function processExcelWorkbook(workbook) {
  const insertDept = db.prepare(`INSERT OR IGNORE INTO departments (name, hod_name) VALUES (?, ?)`);
  const updateDeptHod = db.prepare(`UPDATE departments SET hod_name = ? WHERE name = ?`);
  const getDeptId = db.prepare(`SELECT id FROM departments WHERE name = ?`);

  const getInd = db.prepare(`SELECT id FROM industries WHERE name = ?`);
  const insertInd = db.prepare(`INSERT INTO industries (name, sector, address, contact_person, email) VALUES (?, ?, ?, ?, ?)`);
  const updateInd = db.prepare(`UPDATE industries SET sector = ?, address = ?, contact_person = ?, email = ? WHERE id = ?`);

  const getMou = db.prepare(`SELECT id, progress_percent, insta_url, linkedin_url, drive_link, chairman_visit, stage_index FROM mous WHERE industry_id = ? AND department_id = ?`);
  const insertMou = db.prepare(`INSERT INTO mous (industry_id, department_id, title, status, progress_percent, purpose, mou_date, validity_years, first_visit_date, followup_date, mou_draft_date, coe_status, coe_name, internships_ay, placements_ay, joint_research, sponsored_funding_inr, aligned_branches, faculty_spoc, insta_url, linkedin_url, drive_link, chairman_visit, stage_index, usecases_received) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const updateMou = db.prepare(`UPDATE mous SET status = ?, progress_percent = ?, purpose = ?, mou_date = ?, validity_years = ?, first_visit_date = ?, followup_date = ?, mou_draft_date = ?, coe_status = ?, coe_name = ?, internships_ay = ?, placements_ay = ?, joint_research = ?, sponsored_funding_inr = ?, aligned_branches = ?, faculty_spoc = ?, insta_url = ?, linkedin_url = ?, drive_link = ?, chairman_visit = ?, stage_index = ?, usecases_received = ? WHERE id = ?`);

  let totalProcessed = 0;

  db.transaction(() => {
    // Select master sheet: Prefer 'Industry_Data' if present (89-90 MoUs), otherwise use first sheet
    const targetSheets = workbook.SheetNames.includes('Industry_Data')
      ? ['Industry_Data']
      : (workbook.SheetNames.length === 1 ? workbook.SheetNames : [workbook.SheetNames[0]]);

    const processedMouIds = new Set();

    for (const sheetName of targetSheets) {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' });
      if (!Array.isArray(data) || !data.length) continue;

      for (const row of data) {
        const rawCompName = getField(row, 'Company_Name', 'Company Name', 'Industry_Name', 'Industry Name', 'Company');
        if (!rawCompName) continue;
        const compName = rawCompName.replace(/^(mou\s*[-–—:]\s*)+/i, '').trim();
        if (!compName) continue;

        let deptName = (getField(row, 'Lead_Department', 'Lead Department', 'Department', 'Branch') || 'General').trim();
        const alignedDepts = getField(row, 'Aligned_Departments', 'Aligned Departments', 'Aligned_Branches', 'Aligned Branches') || '';
        const facSpoc = getField(row, 'Faculty_SPOC', 'Faculty SPOC', 'Faculty_Spoc', 'SPOC', 'Faculty Coordinator', 'Faculty Incharge');

        if (/^it$/i.test(deptName) || /^information technology$/i.test(deptName)) {
          deptName = 'Information Technology';
        } else if (/^mech/i.test(deptName)) {
          deptName = 'Mech';
        } else if (/^biotechnology/i.test(deptName)) {
          deptName = 'Biotechnology';
        } else if (/^bda/i.test(deptName)) {
          deptName = 'BDA & CC';
        } else if (/^iot/i.test(deptName)) {
          deptName = 'IOT & CSBS';
        } else if (/^cs\s*&\s*gt$/i.test(deptName) || /^cs&gt$/i.test(deptName)) {
          if (alignedDepts.toLowerCase().includes('gaming') || (facSpoc && facSpoc.includes('Balika'))) {
            deptName = 'Gaming Technology';
          } else {
            deptName = 'Cybersecurity';
          }
        }

        insertDept.run(deptName, facSpoc || null);
        if (facSpoc) {
          updateDeptHod.run(facSpoc, deptName);
        }
        let deptIdRes = getDeptId.get(deptName);
        let deptId = deptIdRes ? deptIdRes.id : null;

        let indId;
        const existInd = getInd.get(compName);
        const email = getField(row, 'Email', 'Contact_Email', 'Contact Email', 'Company_Email', 'Company Email');
        const hubCity = normalizeCityName(getField(row, 'Hub_City', 'Hub City', 'City', 'Location', 'Metro'));
        const corpSpoc = getField(row, 'Corporate_SPOC Contact Details(Name,Contact Number & Mail id)', 'Corporate_SPOC', 'Corporate SPOC', 'Contact_Person', 'Contact Person');
        const domainSec = getField(row, 'Domain_Sector', 'Domain Sector', 'Sector', 'Industry Sector');

        if (existInd) {
          indId = existInd.id;
          updateInd.run(domainSec, hubCity, corpSpoc, email, indId);
        } else {
          insertInd.run(compName, domainSec, hubCity, corpSpoc, email);
          indId = db.prepare('SELECT last_insert_rowid() as id').get().id;
        }

        let valYears = 3;
        const rawVal = getField(row, 'MOU_Validity_Years', 'MOU Validity Years', 'Validity Years', 'Validity');
        if (rawVal) {
          const parsed = parseInt(String(rawVal).replace(/[^0-9]/g, ''));
          if (!isNaN(parsed)) valYears = parsed;
        }

        const rawStageIdx = getField(row, 'Current_Stage_Index', 'Current Stage Index', 'Stage_Index', 'Stage Index');
        const rawStage = getField(row, 'MOU_Stage', 'MOU Stage', 'Mou_Stage', 'MoU Stage', 'Stage', 'Status');
        const { status: st, pct, stageIndex } = normalizeMouStage(rawStage, rawStageIdx);

        const fvDate = getField(row, 'First_Visit_Date', 'First Visit Date') || null;
        const fuDate = getField(row, 'Followup_Date', 'Followup Date') || null;
        const mdDate = getField(row, 'MOU_Draft_Date', 'MOU Draft Date') || null;
        const msDate = getField(row, 'MOU_Signed_Date', 'MOU Signed Date', 'Signed Date', 'MOU_Date', 'MoU_Date') || null;
        const coeStat = getField(row, 'CoE_Status', 'CoE Status', 'COE Status') || null;
        const coeName = getField(row, 'CoE_Name', 'CoE Name', 'COE Name') || null;

        let finalSt = st;
        let finalStageIdx = stageIndex;

        const intAy = parseInt(getField(row, 'Internships_AY', 'Internships AY', 'Internships')) || 0;
        const plcAy = parseInt(getField(row, 'Placements_AY', 'Placements AY', 'Placements')) || 0;
        const jtRes = getField(row, 'Joint_Research_Papers', 'Joint_Research_', 'Joint Research', 'Joint_Research') || null;
        const spFund = parseFloat(getField(row, 'Sponsored_Funding_INR', 'Sponsored Funding INR', 'Sponsored Funding')) || 0;
        const activitiesLog = getField(row, 'Yearly_Activities_Log', 'Yearly Activities Log', 'Purpose', 'Activities') || '';

        // If stage is 5 or 6 or CoE details are present
        const hasCoE = (finalStageIdx === 5 || finalStageIdx === 6 || st === 'CoE Established' || st === 'CoE Operational' ||
          (coeStat && /established|operational|active|yes/i.test(coeStat)) ||
          (coeName && coeName.trim() !== '' && !/^(na|nil|none|-|\/|null|undefined)$/i.test(coeName.trim()))
        );
        const hasOutcomes = (intAy > 0 || plcAy > 0 || spFund > 0 || (jtRes && jtRes.trim() !== '' && !/^(na|nil|none|-|\/|null|undefined|no active.*)$/i.test(jtRes.trim())));

        if (finalStageIdx === 6 || (hasCoE && hasOutcomes)) {
          finalStageIdx = 6;
          finalSt = 'Active R&D / Hiring';
        } else if (finalStageIdx === 5 || hasCoE) {
          finalStageIdx = 5;
          finalSt = 'CoE Established';
        } else if (finalStageIdx === 4 || st === 'Signed' || st === 'Formal Signing') {
          finalStageIdx = 4;
          finalSt = 'Formal Signing';
        }

        // Extract New Media & Drive Columns
        const instaUrl = getField(row, 'Insta id', 'Insta ID', 'Instagram id', 'Instagram ID', 'Insta Link', 'Instagram URL', 'Insta_id', 'Insta') || null;
        const linkedinUrl = getField(row, 'LinkedIn id', 'Linkedin id', 'LinkedIn ID', 'Linkedin ID', 'LinkedIn Link', 'LinkedIn URL', 'LinkedIn_id', 'LinkedIn') || null;
        const driveLink = getField(row, 'Drive link of all MoU photos', 'Drive link of all Mou photos', 'Drive link of all MOU photos', 'Drive Link of all MoU photos', 'Drive link', 'Drive Link', 'Photos Drive Link', 'MoU Photos Drive Link', 'MoU Photos', 'Drive_Link') || null;

        // Extract Visited by Chairman? Column
        const rawChairman = getField(row, 'Visited by Chairman?', 'Visited by Chairman ?', 'Visited by Chairman', 'Chairman Visit', 'Visited by Chairperson', 'Chairman_Visit', 'Visited_by_Chairman');
        const isChairman = /^(y|yes|true|1)$/i.test(String(rawChairman).trim()) ? 1 : 0;

        // Extract Usecases Received Column (Column AB)
        const rawUsecases = getField(row, 'Usecases Received', 'Usecases Received ', 'Usecases_Received', 'Usecases', 'Use Cases Received', 'Use cases received');
        const isUsecases = /^(y|yes|true|1)$/i.test(String(rawUsecases).trim()) ? 1 : 0;

        let mouId;
        const existMou = getMou.get(indId, deptId);
        if (existMou) {
          mouId = existMou.id;
          const finalInsta = instaUrl || existMou.insta_url || null;
          const finalLinkedin = linkedinUrl || existMou.linkedin_url || null;
          const finalDrive = driveLink || existMou.drive_link || null;
          const finalChairman = isChairman;
          updateMou.run(finalSt, pct, activitiesLog, msDate, valYears, fvDate, fuDate, mdDate, coeStat, coeName, intAy, plcAy, jtRes, spFund, alignedDepts, facSpoc, finalInsta, finalLinkedin, finalDrive, finalChairman, finalStageIdx, isUsecases, existMou.id);
        } else {
          const insertRes = insertMou.run(indId, deptId, `${compName} MoU`, finalSt, pct, activitiesLog, msDate, valYears, fvDate, fuDate, mdDate, coeStat, coeName, intAy, plcAy, jtRes, spFund, alignedDepts, facSpoc, instaUrl, linkedinUrl, driveLink, isChairman, finalStageIdx, isUsecases);
          mouId = insertRes.lastInsertRowid;
        }
        processedMouIds.add(mouId);
        totalProcessed++;
      }
    }

    if (processedMouIds.size > 0) {
      const idList = Array.from(processedMouIds).join(',');
      db.prepare(`UPDATE mous SET is_deleted = 1 WHERE id NOT IN (${idList})`).run();
      db.prepare(`UPDATE mous SET is_deleted = 0 WHERE id IN (${idList})`).run();
      db.prepare('DELETE FROM departments WHERE id NOT IN (SELECT DISTINCT department_id FROM mous WHERE is_deleted = 0)').run();
    }
  })();

  return totalProcessed;
}

function syncFromExcelFile(filePath) {
  if (isSyncing) return { success: false, message: 'Sync already in progress' };
  isSyncing = true;
  try {
    const targetFile = filePath || findActiveSyncFile();
    if (!targetFile || !fs.existsSync(targetFile)) {
      throw new Error(`Sync file not found. Place Excel file in data/ or Desktop.`);
    }

    console.log(`[Excel Auto-Sync] Reading: ${targetFile}`);
    const fileBuffer = fs.readFileSync(targetFile);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer', cellDates: true });
    const count = processExcelWorkbook(workbook);

    lastSyncTime = new Date();
    lastSyncStatus = { active: true, file: targetFile, count, lastSync: lastSyncTime, lastError: null };
    console.log(`[Excel Auto-Sync] Successfully synced ${count} records at ${lastSyncTime.toISOString()}`);
    return { success: true, count, file: targetFile, lastSync: lastSyncTime };
  } catch (err) {
    console.error(`[Excel Auto-Sync Error]`, err);
    lastSyncStatus.lastError = err.message;
    return { success: false, message: err.message };
  } finally {
    isSyncing = false;
  }
}

// Background file watcher & Google Sheet Cloud Poller
const https = require('https');
const http = require('http');

const DEFAULT_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vrjeQei_HmLGdpgnaZjUg1F7BwAoApiW/edit?usp=sharing';

function extractGoogleSpreadsheetId(rawUrl) {
  if (!rawUrl) return null;
  const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const matchId = rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];
  return rawUrl.trim();
}

function fetchBufferWithRedirects(targetUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) return reject(new Error('Too many redirects while downloading Google Sheet'));
    const client = targetUrl.startsWith('https') ? https : http;
    client.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBufferWithRedirects(res.headers.location, maxRedirects - 1));
      }
      if (res.statusCode === 401 || res.statusCode === 403) {
        return reject(new Error('Permission Denied by Google Drive (401/403). Please set the Google Sheet Share permission to "Anyone with the link" (Viewer).'));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download Google Sheet: HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function syncFromGoogleSheet(customUrl) {
  if (isSyncing) return { success: false, message: 'Sync in progress' };
  isSyncing = true;
  const sheetUrl = customUrl || process.env.GOOGLE_SHEET_URL || DEFAULT_GOOGLE_SHEET_URL;
  const docId = extractGoogleSpreadsheetId(sheetUrl);

  if (!docId) {
    isSyncing = false;
    return { success: false, message: 'Invalid Google Sheet URL or ID' };
  }

  // Construct export URLs
  const exportUrls = [
    `https://docs.google.com/spreadsheets/d/${docId}/export?format=xlsx`,
    `https://drive.google.com/uc?export=download&id=${docId}`
  ];

  let lastErr = null;
  for (const expUrl of exportUrls) {
    try {
      console.log(`[Google Sheet Sync] Fetching: ${expUrl}`);
      const buf = await fetchBufferWithRedirects(expUrl);
      if (!buf || buf.length < 500) {
        throw new Error('Downloaded file too small or empty');
      }

      const workbook = xlsx.read(buf, { type: 'buffer', cellDates: true });
      const count = processExcelWorkbook(workbook, `Google Sheets [${docId.slice(0, 8)}...]`);
      
      // Save local backup copy and update local Desktop file if present
      try {
        const backupPath = path.join(__dirname, '../../data/Google_Sheet_Synced.xlsx');
        fs.writeFileSync(backupPath, buf);
        const desktopFile = findActiveSyncFile();
        if (desktopFile && fs.existsSync(desktopFile) && !process.env.VERCEL) {
          fs.writeFileSync(desktopFile, buf);
          console.log(`[Google Sheet Sync] Also synced updated workbook to Desktop file: ${desktopFile}`);
        }
      } catch (e) {}

      lastSyncTime = new Date();
      lastSyncStatus = { active: true, file: `Google Sheets Cloud (${docId})`, count, lastSync: lastSyncTime, lastError: null };
      console.log(`[Google Sheet Sync] Successfully imported ${count} records from Google Sheet!`);
      isSyncing = false;
      return { success: true, count, source: 'Google Sheets Cloud', docId, lastSync: lastSyncTime };
    } catch (e) {
      lastErr = e;
      console.warn(`[Google Sheet Sync] Attempt with ${expUrl} notice: ${e.message}`);
    }
  }

  isSyncing = false;
  lastSyncStatus.lastError = lastErr ? lastErr.message : 'Failed to download Google Sheet';
  return { success: false, message: lastSyncStatus.lastError };
}

let watcherStarted = false;
function startExcelWatcher(pollIntervalMs = 4000) {
  if (watcherStarted) return;
  watcherStarted = true;

  console.log('[Excel Auto-Sync] Starting background file watcher & cloud sync engine...');
  let watchedFile = findActiveSyncFile();
  let lastMtime = null;

  if (watchedFile && fs.existsSync(watchedFile)) {
    try {
      lastMtime = fs.statSync(watchedFile).mtimeMs;
      syncFromExcelFile(watchedFile);
    } catch (e) {}
  }

  // Periodic local file check
  setInterval(() => {
    const currentTarget = findActiveSyncFile();
    if (!currentTarget) return;

    try {
      const stat = fs.statSync(currentTarget);
      if (!lastMtime || stat.mtimeMs > lastMtime) {
        console.log(`[Excel Auto-Sync] Change detected in ${currentTarget}! Triggering auto-sync...`);
        lastMtime = stat.mtimeMs;
        syncFromExcelFile(currentTarget);
      }
    } catch (e) {}
  }, pollIntervalMs);

  // Periodic Google Sheets Cloud check every 30 seconds
  setInterval(async () => {
    try {
      await syncFromGoogleSheet();
    } catch (e) {}
  }, 30000);
}

module.exports = {
  syncFromExcelFile,
  syncFromGoogleSheet,
  findActiveSyncFile,
  startExcelWatcher,
  processExcelWorkbook,
  getSyncStatus: () => ({ ...lastSyncStatus, activeFile: lastSyncStatus.file || findActiveSyncFile() })
};
