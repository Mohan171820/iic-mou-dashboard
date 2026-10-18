-- MoU Management System SQLite Schema
-- Designed for easy migration to MySQL / PostgreSQL

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  hod_name TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Admin', 'Chairperson', 'Coordinator')),
  department_id INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS industries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sector TEXT,
  contact_person TEXT,
  designation TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mous (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  industry_id INTEGER NOT NULL,
  department_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'Initial Communication',
  progress_percent INTEGER NOT NULL DEFAULT 10,
  owner_user_id INTEGER,
  mou_date DATE,
  validity_years INTEGER DEFAULT 3,
  expiry_date DATE,
  next_activity TEXT,
  next_activity_date DATE,
  health TEXT DEFAULT 'Good', -- Good, At Risk, Delayed
  is_deleted INTEGER DEFAULT 0,
  usecases_received INTEGER DEFAULT 0,
  last_status_change_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(industry_id) REFERENCES industries(id) ON DELETE CASCADE,
  FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE CASCADE,
  FOREIGN KEY(owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mou_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mou_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  remark TEXT,
  changed_by INTEGER,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE CASCADE,
  FOREIGN KEY(changed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mou_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mou_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  caption TEXT,
  type TEXT DEFAULT 'event', -- signing_photo, logo, event, other
  uploaded_by INTEGER,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE CASCADE,
  FOREIGN KEY(uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mou_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mou_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  title TEXT NOT NULL,
  doc_type TEXT DEFAULT 'draft', -- draft, signed_copy, annexure
  version TEXT DEFAULT 'v1.0',
  uploaded_by INTEGER,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE CASCADE,
  FOREIGN KEY(uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS commitments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mou_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  target TEXT,
  achieved TEXT,
  owner TEXT,
  due_date DATE,
  status TEXT DEFAULT 'Pending', -- Pending, In Progress, Achieved, Overdue
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  industry_id INTEGER,
  mou_id INTEGER,
  meeting_date DATETIME NOT NULL,
  purpose TEXT,
  outcome TEXT,
  next_action TEXT,
  owner TEXT,
  FOREIGN KEY(industry_id) REFERENCES industries(id) ON DELETE SET NULL,
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS coes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  domain TEXT,
  head TEXT
);

CREATE TABLE IF NOT EXISTS coe_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coe_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  industry_id INTEGER,
  participants INTEGER DEFAULT 0,
  revenue REAL DEFAULT 0.0,
  status TEXT DEFAULT 'Completed',
  date DATE,
  FOREIGN KEY(coe_id) REFERENCES coes(id) ON DELETE CASCADE,
  FOREIGN KEY(industry_id) REFERENCES industries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS revenue_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coe_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT CHECK(type IN ('realised', 'pipeline', 'cost')),
  date DATE,
  FOREIGN KEY(coe_id) REFERENCES coes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mou_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mou_id) REFERENCES mous(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, alert, success
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  details TEXT,
  ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mou_status_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status_key TEXT NOT NULL UNIQUE,
  status_name TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  step_order INTEGER NOT NULL,
  color_code TEXT,
  is_active INTEGER DEFAULT 1
);
