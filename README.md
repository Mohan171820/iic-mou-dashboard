# MoU Management System (University / College Portal)

A complete, production-grade full-stack **MoU Management System** built with Node.js, Express, SQLite (`better-sqlite3`), and vanilla HTML/CSS/JS frontend. Designed with a signature SVG **Status-Driven Progress Cycle**, role-based access control (Admin, Chairperson, Coordinator), file uploads, PDF/Excel report generators, cron alerts, and audit logging.

---

## 🌟 Key Features

1. **Status-Driven MoU Progress Cycle (Core Feature)**:
   - Dynamic 9-stage completion progress mapping:
     - `Initial Communication` -> 10%
     - `Discussion in Progress` -> 25%
     - `Draft MoU to be Prepared` -> 40%
     - `Draft Shared with Company` -> 55%
     - `Draft Under Review` -> 65%
     - `Revision / Clarification Required` -> 75% (with curved loop-back arrow indicator)
     - `Approval Awaited` -> 85%
     - `Signing Date to be Finalized` -> 95%
     - `Signed` -> 100%
     - `On Hold` -> Keeps last % with amber paused styling
     - `Not Proceeding` -> 0% movement
   - Custom SVG segmented radial gauge rendered in 3 sizes: **Large** (detail drawer), **Medium** (dashboard hero), **Small** (table rows & department cards).

2. **Portals & Roles**:
   - **Admin Portal (`/admin`)**: Full control over MoUs, industries, commitments, meetings, COE monetisation, user management, status config, audit logs, and reports.
   - **Chairperson Portal (`/chairperson`)**: Read-only executive view with portfolio statistics, signed MoU register, department cards, printable PDF reports, and executive comment/remark posting.
   - **Department Coordinator**: Department-scoped access for managing department MoUs.

3. **Analytics & Alerts**:
   - Automated daily cron check (`node-cron`) for renewal alerts (90/60/30 days before expiry) and stuck alerts (30+ days without status change).
   - Action-required alerts panel on the main executive dashboard.

4. **File Management & Reports**:
   - Image uploads (signing photos, event photos, logos) & document uploads (drafts, signed copies, annexures) using `multer`.
   - Excel export using `exceljs` (`.xlsx`).
   - PDF Executive summary report generation using `pdfkit`.
   - CSV Batch Import with row-by-row success/error verification.

---

## 📁 Folder Structure

```
c:/Users/miriy/OneDrive/Desktop/IIC Dashboard/
├── .env                        # Environment configuration
├── .env.example                # Example env variables template
├── package.json                # Project dependencies
├── README.md                   # System documentation & guide
├── server/
│   ├── app.js                  # Main Express application server
│   ├── seed.js                 # Seed database script with realistic data
│   ├── config/
│   │   └── constants.js        # Status percentages, roles & map configs
│   ├── db/
│   │   ├── database.js         # SQLite better-sqlite3 connection manager
│   │   └── schema.sql          # Portable SQL DDL schema
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & RBAC middleware
│   │   └── upload.js           # Multer image & document upload handler
│   ├── services/
│   │   └── auditLogger.js      # Audit log recorder
│   ├── cron/
│   │   └── alertCron.js        # Expiry & stuck status background checker
│   ├── controllers/            # Route controllers (Auth, MoU, Users, Dept, Reports, etc.)
│   └── routes/                 # Express API router definitions
├── public/
│   ├── index.html              # Entry redirect page
│   ├── login.html              # Glassmorphism login page
│   ├── admin.html              # Admin Portal interface
│   ├── chairperson.html        # Chairperson Portal interface
│   ├── css/
│   │   └── style.css           # UI design system & responsive styles
│   └── js/
│       ├── api.js              # Fetch API wrapper
│       ├── progress-ring.js    # Signature SVG Progress Cycle component
│       ├── admin.js            # Admin portal interactive logic
│       └── chairperson.js      # Chairperson portal logic
└── uploads/
    ├── images/                 # Uploaded signing photos & event images
    └── documents/              # Uploaded PDF & DOCX agreements
```

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Run the seed script to populate SQLite database with status mappings, users, departments, industries, sample MoUs, commitments, meetings, and COE revenue items:
```bash
node server/seed.js
```

### 3. Start the Server
```bash
npm start
# OR
node server/app.js
```

The application will start at: `http://localhost:5000`

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Dean / Chairperson** | `dean@srmist.edu.in` | `Dean@321` | Industry-Academia Connect (`/chairperson`) |

---

## 🌐 REST API Reference (`/api`)

### Auth & User Routes
- `POST /api/auth/login` - Authenticate user & issue httpOnly JWT cookie
- `POST /api/auth/logout` - Clear session token
- `GET /api/auth/me` - Get current authenticated user details
- `GET /api/users` - List all users (Admin only)
- `POST /api/users` - Create user (Admin only)

### MoU Lifecycle Routes
- `GET /api/mous` - List MoUs (with filters: department, status, health, search, sorting)
- `GET /api/mous/:id` - MoU detail with history, images, documents, commitments, meetings, comments
- `POST /api/mous` - Create new MoU
- `PUT /api/mous/:id` - Update MoU details
- `PATCH /api/mous/:id/status` - Update MoU status & auto-recalculate progress percentage
- `DELETE /api/mous/:id` - Soft delete MoU
- `POST /api/mous/:id/images` - Upload images (Multer)
- `POST /api/mous/:id/documents` - Upload documents (Multer)
- `POST /api/mous/:id/comments` - Add chairperson/admin executive remark

### Dashboard & Analytics
- `GET /api/dashboard/summary` - Executive KPI metrics
- `GET /api/dashboard/status-distribution` - Lifecycle stage counts
- `GET /api/dashboard/department-progress` - Department-wise progress grid
- `GET /api/dashboard/action-required` - Stuck (>30 days) and expiring (<90 days) MoUs

### Reports & Imports
- `GET /api/reports/mou-status.xlsx` - Export MoU Register (.xlsx)
- `GET /api/reports/commitments.xlsx` - Export Commitments (.xlsx)
- `GET /api/reports/coe-revenue.xlsx` - Export COE Revenue (.xlsx)
- `GET /api/reports/mou-summary.pdf` - Download PDF Executive Summary Report
- `POST /api/reports/import/mous` - CSV Batch MoU Import

---

## 🗄️ Moving from SQLite to MySQL / PostgreSQL

The database schema in `server/db/schema.sql` was authored using standard ANSI SQL types (`INTEGER`, `TEXT`, `VARCHAR`, `DATETIME`, `REAL`).

To migrate to MySQL or PostgreSQL:
1. Replace `better-sqlite3` driver in `server/db/database.js` with `mysql2/promise` or `pg`.
2. Run `server/db/schema.sql` on your MySQL/PostgreSQL instance.
3. Update `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`.
