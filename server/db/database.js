const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let dbPath = process.env.DB_PATH;

if (process.env.VERCEL) {
  const tmpDbPath = path.join('/tmp', 'mou_system.db');

  if (!fs.existsSync(tmpDbPath)) {
    const candidates = [
      path.join(process.cwd(), 'server', 'db', 'mou_system.db'),
      path.join(__dirname, 'mou_system.db'),
      path.join(__dirname, '..', 'server', 'db', 'mou_system.db'),
      path.join(process.cwd(), 'mou_system.db')
    ];
    const sourceDbPath = candidates.find(p => fs.existsSync(p));

    if (sourceDbPath) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log(`[DB Setup] Copied existing database from ${sourceDbPath} to /tmp/mou_system.db`);
      } catch (err) {
        console.warn('[DB Setup] Could not copy db to /tmp:', err.message);
      }
    }
  }
  dbPath = tmpDbPath;
} else if (!dbPath) {
  dbPath = path.join(__dirname, 'mou_system.db');
}

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? null : null });
db.pragma('foreign_keys = ON');

// Initialize schema if tables don't exist
const schemaCandidates = [
  path.join(process.cwd(), 'server', 'db', 'schema.sql'),
  path.join(__dirname, 'schema.sql'),
  path.join(__dirname, '..', 'server', 'db', 'schema.sql')
];
const schemaPath = schemaCandidates.find(p => fs.existsSync(p));
if (schemaPath) {
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  } catch (err) {
    console.warn('[DB Schema Init Notice]:', err.message);
  }
}

// Ensure default users exist if users table is empty
try {
  const userCheck = db.prepare('SELECT count(*) as count FROM users').get();
  if (!userCheck || userCheck.count === 0) {
    const bcrypt = require('bcryptjs');
    const adminHash = bcrypt.hashSync('Admin@123', 10);
    const chairHash = bcrypt.hashSync('Chair@123', 10);
    const insertUser = db.prepare(`INSERT OR REPLACE INTO users (id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)`);
    insertUser.run(1, 'System Administrator', 'admin@college.edu', adminHash, 'Admin');
    insertUser.run(2, 'DR. R. ShivaKumar', 'chairperson@college.edu', chairHash, 'Chairperson');
    console.log('[DB Setup] Seeded default Chairperson and Admin credentials.');
  }
} catch (e) {
  console.warn('[DB Setup] User verification notice:', e.message);
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
  console.warn('[DB Migration Notice]', e.message);
}

module.exports = db;
