ROLE
You are a senior full-stack developer and UI/UX designer. Build a complete, working, full-stack "MoU Management System" for a university/college. It has an Admin portal (full control) and a Chairperson portal (view-only with a few extras). Deliver full source code, folder structure, database schema, and run instructions.

TECH STACK
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3) so it runs with zero setup (write the schema so it can move to MySQL/PostgreSQL later)
- Auth: JWT in httpOnly cookies + bcrypt password hashing
- File upload: multer (images and PDFs stored in /uploads, paths saved in DB)
- Frontend: HTML + CSS + vanilla JS (no frameworks), calling the backend with fetch()
- Extras: express-validator (validation), helmet, cors, express-rate-limit, exceljs (Excel export), pdfkit (PDF report)

BASE DESIGN (from the attached preview.html)
Keep the look of the "Industry Connect & COE Management" preview: navy header (#10243e), left sidebar, light background (#f4f7fb), white rounded cards, blue accent (#2563eb), Inter/Segoe UI font. Keep all its sections (Dashboard, Industries, MoU Lifecycle, MoU Commitments, Visits & Meetings, COE Management, COE Monetisation, Reports) and make them fully functional and connected to the backend.

ROLES AND PERMISSIONS
1. Admin: full access. Create/edit/delete industries, MoUs, commitments, meetings, COE data and revenue. Change status, upload/replace/delete images and documents, manage users, view audit logs, export reports.
2. Chairperson: read-only portal. Sees the executive dashboard, department progress, MoU details with images, signed MoU register, reports, and can add remarks/comments on any MoU. Cannot edit or delete anything.
3. Department Coordinator (optional role): can view and update only MoUs of their own department.
Enforce roles in backend middleware (never trust the frontend). Separate login redirects: Admin -> /admin, Chairperson -> /chairperson.

STATUS-DRIVEN PROGRESS CYCLE (core feature)
Each MoU has a Current Status (same as our Excel dropdown) mapped to completion %:
Initial Communication 10% | Discussion in Progress 25% | Draft MoU to be Prepared 40% | Draft Shared with Company 55% | Draft Under Review 65% | Revision / Clarification Required 75% (shows loop-back arrow to Draft Under Review) | Approval Awaited 85% | Signing Date to be Finalized 95% | Signed 100% | On Hold (keeps last %, amber paused ring) | Not Proceeding (grey ring, no progress).
The backend calculates and stores the percentage from the status, so it is always consistent. Store this map in a config table/file so new statuses can be added easily.

STYLISH CIRCULAR PROGRESS VISUAL
Not a plain donut. Build an SVG "MoU Progress Cycle": a ring made of 9 arc segments with small gaps, completed segments in a blue-to-teal gradient, current segment gently pulsing, upcoming segments light grey. Round icon nodes on the ring with hover tooltips of stage names, big animated percentage in the centre with the status name and "days in this stage" below it, and a small curved arrow for the revision loop. Smooth stroke-dashoffset animation when the status changes. Use it in 3 sizes: large (MoU detail), medium (dashboard portfolio progress), small (rows and department cards). Professional glow/glassmorphism-light style.

DATABASE TABLES
users(id, name, email, password_hash, role, department_id, is_active, created_at)
departments(id, name, hod_name)
industries(id, name, sector, contact_person, designation, email, phone, address, website, created_at)
mous(id, industry_id, department_id, title, purpose, status, progress_percent, owner_user_id, mou_date, validity_years, expiry_date, next_activity, next_activity_date, health, last_status_change_at, created_by, created_at, updated_at)
mou_status_history(id, mou_id, old_status, new_status, remark, changed_by, changed_at)
mou_images(id, mou_id, file_path, caption, type [signing_photo | logo | event | other], uploaded_by, uploaded_at)
mou_documents(id, mou_id, file_path, title, doc_type [draft | signed_copy | annexure], version, uploaded_by, uploaded_at)
commitments(id, mou_id, title, target, achieved, owner, due_date, status)
meetings(id, industry_id, mou_id, meeting_date, purpose, outcome, next_action, owner)
coe_activities(id, coe_id, title, industry_id, participants, revenue, status, date)
coes(id, name, domain, head)
revenue_items(id, coe_id, source, amount, type [realised | pipeline | cost], date)
comments(id, mou_id, user_id, message, created_at)   // chairperson remarks
notifications(id, user_id, message, type, is_read, created_at)
audit_logs(id, user_id, action, entity, entity_id, details, ip, created_at)

REST API (all under /api, JSON, with validation and proper error codes)
Auth: POST /auth/login, POST /auth/logout, GET /auth/me, POST /auth/change-password
Users (admin): GET/POST /users, PUT /users/:id, PATCH /users/:id/deactivate, POST /users/:id/reset-password
Departments: GET/POST/PUT/DELETE /departments
Industries: GET (search, pagination), GET /:id, POST, PUT, DELETE
MoUs: GET (filters: department, status, health, owner, date range, search, sort, pagination), GET /:id (with history, images, documents, commitments, meetings, comments), POST, PUT, DELETE
  PATCH /mous/:id/status (requires remark, auto-updates percentage, writes history + audit log + notification)
  POST /mous/:id/images (multiple upload, caption, type), DELETE /mous/:id/images/:imageId
  POST /mous/:id/documents, GET /mous/:id/documents/:docId/download, DELETE
  POST /mous/:id/comments (chairperson/admin)
Commitments, Meetings, COE, COE activities, Revenue: full CRUD endpoints
Dashboard: GET /dashboard/summary (KPIs), /dashboard/status-distribution, /dashboard/department-progress, /dashboard/action-required (stuck 30+ days, expiring in 90/60/30 days, overdue commitments), /dashboard/monthly-trend
Reports: GET /reports/mou-status.xlsx, /reports/commitments.xlsx, /reports/coe-revenue.xlsx, /reports/mou-summary.pdf, and CSV import POST /import/mous (matches our Excel columns; return a row-wise success/error report)
Notifications: GET /notifications, PATCH /notifications/:id/read
Audit: GET /audit-logs (admin only, filterable)

SCREENS TO BUILD
Admin portal: Executive Dashboard (KPIs + portfolio progress ring + status distribution + action-required panel); Department-wise progress grid with drill-down; MoU Tracker table (search, filters, sort, editable status dropdown, mini rings) with a Kanban drag-and-drop toggle that updates status via API; MoU detail drawer/page (large progress cycle, status timeline, image gallery with upload and lightbox, documents, commitments, meetings, chairperson comments, notes); Add/Edit MoU form with validation; Industries; Commitments; Meetings; COE and Monetisation; Reports with download buttons; User Management; Audit Log; Notifications; Settings (status list and percentages).
Chairperson portal: a cleaner, presentation-friendly read-only view: Executive Overview with big portfolio ring, department cards, signed MoU register with signing photos, MoU detail page with gallery, timeline and a "Add remark" box, expiring/renewal alerts, and report downloads. Big readable numbers, printable layout.

EXTRA FEATURES
- Renewal alerts at 90/60/30 days before expiry, and "stuck" alerts when a status is unchanged for 30+ days (a daily node-cron job creates notifications).
- Optional email notification hook (nodemailer, configured through .env, disabled by default).
- Soft delete for MoUs, with restore option for admin.
- Image validation (jpg/png/webp only, max 5 MB, auto-rename files), documents (pdf/docx, max 10 MB).
- Light/Dark theme toggle, responsive design for desktop, tablet and mobile.
- Global search across industries and MoUs.
- Seed script that creates: 1 admin, 1 chairperson, 1 coordinator, 8 departments, 20-25 realistic MoUs with sample Indian industry names across every status, plus status history, commitments and meetings.

SECURITY
Hashed passwords, JWT expiry, role middleware on every route, input validation and sanitisation, rate limiting on login, helmet headers, safe file names, no direct file path exposure, secrets in .env, audit logging of every create/update/delete/status change.

FOLDER STRUCTURE
/server (app.js, config, db, routes, controllers, middleware, services, cron, seed)
/public (admin/, chairperson/, shared css/js, assets)
/uploads (images, documents)
.env.example, package.json, README.md

OUTPUT
1. Full folder tree
2. Complete code for every file
3. SQL schema and seed script
4. README with: install steps (npm install, npm run seed, npm start), default login credentials, API list, and how to move from SQLite to MySQL/PostgreSQL and deploy the app
Write clean, commented, working code with no placeholders.
