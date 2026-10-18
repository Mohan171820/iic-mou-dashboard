const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let dbPath = process.env.DB_PATH || path.join(__dirname, 'mou_system.db');

if (process.env.VERCEL) {
  const tmpDbPath = path.join('/tmp', 'mou_system.db');
  const sourceDbPath = path.join(__dirname, 'mou_system.db');
  if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
    try {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
    } catch (err) {
      console.warn('Could not copy db to /tmp:', err.message);
    }
  }
  dbPath = tmpDbPath;
}

const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? null : null });
db.pragma('foreign_keys = ON');

// Initialize schema
const schemaPath = path.join(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

// Ensure new columns exist in mous table
try {
  const cols = db.prepare("PRAGMA table_info(mous)").all().map(c => c.name);
  if (!cols.includes('insta_url')) db.exec("ALTER TABLE mous ADD COLUMN insta_url TEXT");
  if (!cols.includes('linkedin_url')) db.exec("ALTER TABLE mous ADD COLUMN linkedin_url TEXT");
  if (!cols.includes('drive_link')) db.exec("ALTER TABLE mous ADD COLUMN drive_link TEXT");
  if (!cols.includes('coe_photos')) db.exec("ALTER TABLE mous ADD COLUMN coe_photos TEXT");
  if (!cols.includes('chairman_visit')) db.exec("ALTER TABLE mous ADD COLUMN chairman_visit INTEGER DEFAULT 0");
  if (!cols.includes('stage_index')) db.exec("ALTER TABLE mous ADD COLUMN stage_index INTEGER DEFAULT NULL");
} catch (e) {
  console.error('[DB Migration Error]', e.message);
}

module.exports = db;
