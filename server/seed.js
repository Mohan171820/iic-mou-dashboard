const db = require('./db/database');
const bcrypt = require('bcryptjs');
const { STATUS_PERCENT_MAP } = require('./config/constants');

async function seedDatabase() {
  console.log('Seeding database...');

  // 1. Seed Status Configuration
  const initStatusConfig = db.prepare(`
    INSERT OR REPLACE INTO mou_status_config (id, status_key, status_name, percentage, step_order, color_code, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);

  const statusesConfig = [
    [1, 'Initial Communication', 'Initial Communication', 10, 1, '#3b82f6'],
    [2, 'Discussion in Progress', 'Discussion in Progress', 25, 2, '#0284c7'],
    [3, 'Draft MoU to be Prepared', 'Draft MoU to be Prepared', 40, 3, '#06b6d4'],
    [4, 'Draft Shared with Company', 'Draft Shared with Company', 55, 4, '#0d9488'],
    [5, 'Draft Under Review', 'Draft Under Review', 65, 5, '#10b981'],
    [6, 'Revision / Clarification Required', 'Revision / Clarification Required', 75, 6, '#f59e0b'],
    [7, 'Approval Awaited', 'Approval Awaited', 85, 7, '#8b5cf6'],
    [8, 'Signing Date to be Finalized', 'Signing Date to be Finalized', 95, 8, '#6366f1'],
    [9, 'Signed', 'Signed', 100, 9, '#10b981'],
    [10, 'On Hold', 'On Hold', 50, 10, '#d97706'],
    [11, 'Not Proceeding', 'Not Proceeding', 0, 11, '#6b7280']
  ];

  for (const s of statusesConfig) {
    initStatusConfig.run(...s);
  }

  // 2. Seed Departments
  const insertDept = db.prepare(`INSERT OR IGNORE INTO departments (id, name, hod_name) VALUES (?, ?, ?)`);
  const depts = [
    [1, 'Computer Science & Engineering', 'Dr. A. K. Sharma'],
    [2, 'Electronics & Communication', 'Dr. S. R. Varma'],
    [3, 'Electrical & Electronics', 'Dr. M. K. Pillai'],
    [4, 'Mechanical Engineering', 'Dr. R. N. Mukherjee'],
    [5, 'Civil Engineering', 'Dr. P. V. Rao'],
    [6, 'Information Technology', 'Dr. Sunita Deshmukh'],
    [7, 'AI & Data Science', 'Dr. Vikramaditya Roy'],
    [8, 'Management Studies (MBA)', 'Dr. Meenakshi Sundaram']
  ];
  depts.forEach(d => insertDept.run(...d));

  // 3. Seed Users
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const chairHash = await bcrypt.hash('Dean@321', 10);
  const coordHash = await bcrypt.hash('Coord@123', 10);

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password_hash, role, department_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(1, 'System Administrator', 'admin@college.edu', passwordHash, 'Admin', null, 0);
  insertUser.run(2, 'Dean', 'dean@srmist.edu.in', chairHash, 'Chairperson', null, 1);
  insertUser.run(3, 'Prof. N. K. Patel (CSE Coordinator)', 'coordinator@college.edu', coordHash, 'Coordinator', 1, 0);

  // 4. Seed Industries
  const insertIndustry = db.prepare(`
    INSERT OR REPLACE INTO industries (id, name, sector, contact_person, designation, email, phone, address, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const industries = [
    [1, 'Tata Consultancy Services', 'IT & Software', 'Mr. Rajesh Gopinathan', 'VP University Relations', 'campus.tcs@tcs.com', '+91 22 6778 9999', 'Mumbai, Maharashtra', 'https://www.tcs.com'],
    [2, 'Infosys Technologies Ltd', 'IT Services', 'Ms. Shalini Iyer', 'Head Academic Partnerships', 'academic@infosys.com', '+91 80 2852 0261', 'Bengaluru, Karnataka', 'https://www.infosys.com'],
    [3, 'Wipro Digital & Engineering', 'Tech Consulting', 'Mr. Anand Rao', 'Director University Programs', 'campus.wipro@wipro.com', '+91 80 2844 0011', 'Bengaluru, Karnataka', 'https://www.wipro.com'],
    [4, 'Larsen & Toubro (L&T)', 'Infrastructure & Heavy Engg', 'Er. Suresh K. Nair', 'General Manager HR', 'hr.campus@larsentoubro.com', '+91 22 6752 5656', 'Mumbai, Maharashtra', 'https://www.larsentoubro.com'],
    [5, 'Bosch India Pvt Ltd', 'Automotive & Automation', 'Dr. Hans Mueller', 'Head Research & Innovation', 'connect@bosch.in', '+91 80 6657 5757', 'Bengaluru, Karnataka', 'https://www.bosch.in'],
    [6, 'Texas Instruments India', 'Semiconductors', 'Ms. Radhika Kulkarni', 'University Relations Lead', 'univ.india@ti.com', '+91 80 2509 9000', 'Bengaluru, Karnataka', 'https://www.ti.com'],
    [7, 'AWS India (Amazon Web Services)', 'Cloud & AI', 'Mr. Amit Agarwal', 'Head Education Programs', 'aws-edu@amazon.com', '+91 80 4000 0000', 'Bengaluru, Karnataka', 'https://aws.amazon.com'],
    [8, 'Cisco Systems India', 'Networking & Cyber Security', 'Mr. Sanjeev Gupta', 'Director Networking Academy', 'netacad-in@cisco.com', '+91 80 4426 0000', 'Bengaluru, Karnataka', 'https://www.cisco.com'],
    [9, 'BHEL (Bharat Heavy Electricals Ltd)', 'Power & Electrical', 'Mr. R. C. Pandey', 'Chief Engineer R&D', 'rd@bhel.in', '+91 11 6633 7000', 'New Delhi', 'https://www.bhel.com'],
    [10, 'Mahindra & Mahindra Automotive', 'Automotive & EV', 'Mr. Anand Mahindra', 'Exec Director R&D', 'ev.connect@mahindra.com', '+91 22 2490 1441', 'Pune, Maharashtra', 'https://www.mahindra.com'],
    [11, 'IBM Quantum & AI Lab', 'Quantum Computing', 'Dr. Gargi Dasgupta', 'Director IBM Research', 'ibmresearch@in.ibm.com', '+91 80 4197 0000', 'Bengaluru, Karnataka', 'https://www.ibm.com']
  ];

  industries.forEach(i => insertIndustry.run(...i));

  // 5. Seed MoUs
  const insertMou = db.prepare(`
    INSERT OR REPLACE INTO mous (
      id, industry_id, department_id, title, purpose, status, progress_percent,
      owner_user_id, mou_date, validity_years, expiry_date, next_activity,
      next_activity_date, health, last_status_change_at, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mous = [
    // Signed MoUs
    [1, 1, 1, 'TCS Centre of Excellence in Cloud & DevOps', 'Establishment of COE, curriculum alignment, faculty development, and 100 student internships annually.', 'Signed', 100, 3, '2024-01-15', 3, '2027-01-15', 'Annual Progress Review & Joint Workshop', '2026-10-15', 'Good', '2024-01-15 10:00:00', 1],
    [2, 2, 6, 'Infosys Campus Connect & Industry electives', 'Joint certification courses, electives integration, soft skills training and campus placement drive.', 'Signed', 100, 1, '2023-11-01', 3, '2026-11-01', 'MoU Renewal Discussion (Expiring in 30 days)', '2026-10-10', 'At Risk', '2023-11-01 11:30:00', 1],
    [3, 5, 2, 'Bosch Embedded Systems & Automotive IoT Lab', 'Setup of state-of-the-art Embedded IoT lab with hardware sponsorship worth ₹25 Lakhs.', 'Signed', 100, 1, '2024-03-20', 3, '2027-03-20', 'Lab Equipment Calibration & Hackathon', '2026-11-05', 'Good', '2024-03-20 14:00:00', 1],
    [4, 6, 2, 'Texas Instruments VLSI Design & Microcontroller Lab', 'Co-branded VLSI training facility, free hardware kits, and M.Tech research grants.', 'Signed', 100, 1, '2023-12-10', 3, '2026-12-10', 'Renewal Document Preparation (Expiring in 70 days)', '2026-10-25', 'Good', '2023-12-10 16:00:00', 1],
    [5, 7, 7, 'AWS Academy Cloud Computing & AI Certification', 'AWS cloud sandbox credits, student voucher discounts, and faculty cloud architect training.', 'Signed', 100, 3, '2024-05-10', 3, '2027-05-10', 'Student Cloud Certification Drive Phase 2', '2026-10-20', 'Good', '2024-05-10 09:15:00', 1],
    [6, 8, 6, 'Cisco Cyber Security Academy & Networking Lab', 'Establishment of NetAcad, security lab setup, CCNA/CCNP student certifications.', 'Signed', 100, 1, '2025-01-10', 3, '2028-01-10', 'Cybersecurity Awareness Boot Camp', '2026-11-12', 'Good', '2025-01-10 15:00:00', 1],
    [7, 4, 4, 'L&T Heavy Engineering Thermal Design Research', 'Industry sponsored consultancy projects for M.Tech Mechanical students.', 'Signed', 100, 1, '2024-02-18', 2, '2026-02-18', 'Project Completion Report & Renewal', '2026-10-05', 'Delayed', '2024-02-18 12:00:00', 1],

    // In Progress MoUs across various stages
    [8, 3, 1, 'Wipro AI & Software Testing Research Lab', 'Collaborative research in automated software testing using generative AI.', 'Signing Date to be Finalized', 95, 3, '2026-10-15', 3, '2029-10-15', 'Final Signing Event Date Confirmation', '2026-10-08', 'Good', '2026-09-20 10:00:00', 1],
    [9, 10, 4, 'Mahindra Electric Vehicle Power Electronics COE', 'Setup of EV powertrain testing bench and Battery Management System (BMS) research.', 'Approval Awaited', 85, 1, null, 3, null, 'Board of Governors Approval expected', '2026-10-12', 'Good', '2026-09-18 11:00:00', 1],
    [10, 9, 3, 'BHEL Smart Grid & Renewable Energy Integration', 'Joint consultancy on high-voltage DC transmission and microgrid synchronization.', 'Revision / Clarification Required', 75, 1, null, 3, null, 'Legal Team feedback on IP rights clause', '2026-08-15', 'At Risk', '2026-08-15 14:00:00', 1], // Stuck for >30 days!
    [11, 11, 7, 'IBM Quantum Computing & Deep Learning Hub', 'Access to IBM Quantum Experience platform and joint research publications.', 'Draft Under Review', 65, 3, null, 3, null, 'Internal Dean Research Review', '2026-10-10', 'Good', '2026-09-22 16:30:00', 1],
    [12, 5, 4, 'Bosch Smart Automation & Robotics Workshop', 'Hands-on training for 3rd year Mechanical and Mechatronics students.', 'Draft Shared with Company', 55, 1, null, 3, null, 'Feedback from Bosch HR team awaited', '2026-10-14', 'Good', '2026-09-25 09:00:00', 1],
    [13, 1, 8, 'TCS Executive Leadership & Management Program', 'Executive MBA modules and corporate mentorship for final year MBA students.', 'Draft MoU to be Prepared', 40, 1, null, 3, null, 'Drafting scope of work and financial terms', '2026-10-18', 'Good', '2026-09-26 13:00:00', 1],
    [14, 4, 5, 'L&T Civil Infrastructure & Smart Cities Research', 'Concrete testing lab accreditation and smart building structural audit projects.', 'Discussion in Progress', 25, 1, null, 3, null, '2nd Round Technical Discussion via Teams', '2026-10-09', 'Good', '2026-09-27 10:00:00', 1],
    [15, 6, 2, 'Texas Instruments 5G Communications Bench', 'Proposal for 5G RF testing equipment and antenna design research sponsorship.', 'Initial Communication', 10, 1, null, 3, null, 'Send initial proposal letter to Vice President', '2026-10-15', 'Good', '2026-09-28 15:00:00', 1],

    // On Hold and Not Proceeding
    [16, 2, 8, 'Infosys FinTech Innovation Sandbox', 'Curriculum for financial technology and blockchain in Banking & Finance.', 'On Hold', 40, 1, null, 3, null, 'Budget allocation deferred to Q4', '2026-08-10', 'At Risk', '2026-08-10 11:00:00', 1], // Stuck!
    [17, 9, 3, 'BHEL Coal Power Plant Emission Sensors', 'Sensor calibration consultancy for thermal power stations.', 'Not Proceeding', 0, 1, null, 3, null, 'Industry changed priority to Solar Power', '2026-07-01', 'Delayed', '2026-07-01 10:00:00', 1],

    // Additional realistic MoUs for depth
    [18, 7, 1, 'AWS Data Engineering & Big Data Analytics', 'Specialized track for B.Tech CSE students in distributed data systems.', 'Signed', 100, 3, '2025-02-15', 3, '2028-02-15', 'Mid-term Audit', '2026-11-20', 'Good', '2025-02-15 10:00:00', 1],
    [19, 3, 6, 'Wipro Cybersecurity & Ethical Hacking Lab', 'Setting up dedicated red team simulation lab for IT security.', 'Approval Awaited', 85, 1, null, 3, null, 'Financial Vetting by Registrar', '2026-10-06', 'Good', '2026-09-15 14:00:00', 1],
    [20, 10, 4, 'Mahindra Lightweight Materials Research', 'Composite materials testing for electric vehicles.', 'Discussion in Progress', 25, 1, null, 3, null, 'Site Visit by Mahindra R&D Head', '2026-10-22', 'Good', '2026-09-20 12:00:00', 1]
  ];

  mous.forEach(m => insertMou.run(...m));

  // 6. Seed MoU Status History
  const insertHistory = db.prepare(`
    INSERT INTO mou_status_history (mou_id, old_status, new_status, remark, changed_by, changed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertHistory.run(1, 'Signing Date to be Finalized', 'Signed', 'MoU signed successfully during Annual Industry Summit by Vice Chancellor & TCS VP.', 1, '2024-01-15 10:00:00');
  insertHistory.run(2, 'Signing Date to be Finalized', 'Signed', 'Signed at Infosys Mysore Campus.', 1, '2023-11-01 11:30:00');
  insertHistory.run(8, 'Approval Awaited', 'Signing Date to be Finalized', 'Approved by Academic Council. Date set for mid-October.', 1, '2026-09-20 10:00:00');
  insertHistory.run(10, 'Draft Under Review', 'Revision / Clarification Required', 'Legal team requested modification in clause 14 regarding patent ownership.', 1, '2026-08-15 14:00:00');
  insertHistory.run(16, 'Draft MoU to be Prepared', 'On Hold', 'Management deferred project pending funding review.', 1, '2026-08-10 11:00:00');

  // 7. Seed Commitments
  const insertCommitment = db.prepare(`
    INSERT INTO commitments (mou_id, title, target, achieved, owner, due_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertCommitment.run(1, 'Student Internships', '100 Students/Year', '85 Students Placed', 'Prof. N. K. Patel', '2026-12-31', 'In Progress');
  insertCommitment.run(1, 'Faculty Development Program', '2 Workshops', '2 Workshops Completed', 'Dr. A. K. Sharma', '2026-06-30', 'Achieved');
  insertCommitment.run(2, 'Infosys Campus Connect Certification', '250 Students', '190 Certified', 'Prof. Sunita Deshmukh', '2026-10-31', 'In Progress');
  insertCommitment.run(3, 'Bosch Embedded IoT Lab Setup', 'Lab Operational', 'Lab Setup Complete', 'Dr. S. R. Varma', '2024-06-30', 'Achieved');
  insertCommitment.run(4, 'Texas Instruments Design Contest', '15 Teams Submitted', '12 Teams Finalized', 'Dr. S. R. Varma', '2026-09-15', 'Overdue');
  insertCommitment.run(7, 'L&T Consultancy Grant', '₹ 15.0 Lakhs', '₹ 8.5 Lakhs Realised', 'Dr. R. N. Mukherjee', '2026-11-30', 'In Progress');

  // 8. Seed Meetings
  const insertMeeting = db.prepare(`
    INSERT INTO meetings (industry_id, mou_id, meeting_date, purpose, outcome, next_action, owner)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertMeeting.run(1, 1, '2026-09-10 11:00:00', 'Quarterly Review of TCS COE Activities', 'Reviewed progress of 85 intern placements and upcoming AI elective.', 'Finalize syllabus for Spring 2027 semester.', 'Prof. N. K. Patel');
  insertMeeting.run(10, 9, '2026-09-18 14:30:00', 'EV Power Electronics Bench Specification Review', 'Agreed on technical specs for 50kW test bench.', 'Awaiting formal Dean approval.', 'Dr. R. N. Mukherjee');
  insertMeeting.run(3, 8, '2026-09-20 10:00:00', 'Wipro MoU Final Signing Preparation', 'Final draft approved by both university legal counsel and Wipro legal team.', 'Schedule signing ceremony on Oct 15.', 'Prof. N. K. Patel');
  insertMeeting.run(9, 10, '2026-08-15 15:00:00', 'BHEL Smart Grid Clause 14 Discussion', 'BHEL legal team requested shared IP ownership for co-developed algorithms.', 'Send modified IP clause back for legal review.', 'Dr. M. K. Pillai');

  // 9. Seed COEs & Activities
  const insertCoe = db.prepare(`INSERT OR REPLACE INTO coes (id, name, domain, head) VALUES (?, ?, ?, ?)`);
  const coes = [
    [1, 'Centre of Excellence in Cloud & DevOps', 'Cloud & Software Architecture', 'Dr. A. K. Sharma'],
    [2, 'Bosch Automotive IoT & Embedded Systems COE', 'Embedded Systems & Automation', 'Dr. S. R. Varma'],
    [3, 'AWS Cloud & Data Science Research Centre', 'Artificial Intelligence & Cloud', 'Dr. Vikramaditya Roy'],
    [4, 'L&T Structural & Heavy Engineering COE', 'Civil & Mechanical Engineering', 'Dr. R. N. Mukherjee']
  ];
  coes.forEach(c => insertCoe.run(...c));

  const insertCoeActivity = db.prepare(`
    INSERT INTO coe_activities (coe_id, title, industry_id, participants, revenue, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertCoeActivity.run(1, 'Advanced Kubernetes & DevOps Bootcamp', 1, 120, 180000, 'Completed', '2026-08-20');
  insertCoeActivity.run(2, 'Automotive CAN Bus Protocol Hands-on Workshop', 5, 85, 125000, 'Completed', '2026-09-05');
  insertCoeActivity.run(3, 'AWS Certified Cloud Practitioner Hackathon', 7, 210, 315000, 'Completed', '2026-09-18');

  // 10. Seed Revenue Items
  const insertRevenue = db.prepare(`
    INSERT INTO revenue_items (coe_id, source, amount, type, date)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertRevenue.run(1, 'TCS Sponsorship & Lab Grant', 1500000, 'realised', '2026-04-10');
  insertRevenue.run(1, 'Corporate Workshop Fees', 180000, 'realised', '2026-08-20');
  insertRevenue.run(2, 'Bosch Equipment Sponsorship', 2500000, 'realised', '2026-03-25');
  insertRevenue.run(3, 'AWS Cloud Sandbox Credits & Grants', 800000, 'realised', '2026-05-15');
  insertRevenue.run(1, 'Upcoming DevOps Certification Drive', 350000, 'pipeline', '2026-11-15');
  insertRevenue.run(4, 'L&T Sponsored Research Consultancy', 1200000, 'pipeline', '2026-12-01');

  // 11. Seed Chairperson Comments
  const insertComment = db.prepare(`
    INSERT INTO comments (mou_id, user_id, message, created_at)
    VALUES (?, ?, ?, ?)
  `);
  insertComment.run(1, 2, 'Great progress on student placements! Ensure we track the joint research papers as well.', '2026-09-12 11:00:00');
  insertComment.run(10, 2, 'Please expedite the IP clause clarification with BHEL legal counsel so we can move this to approval stage.', '2026-08-20 16:00:00');

  // 12. Seed Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (user_id, message, type, is_read, created_at)
    VALUES (?, ?, ?, 0, ?)
  `);
  insertNotif.run(1, 'MoU with Infosys Technologies Ltd is expiring in 32 days (2026-11-01). Action required.', 'warning', '2026-09-30 08:00:00');
  insertNotif.run(1, 'MoU #10 (BHEL Smart Grid) has been in "Revision / Clarification Required" for 46 days.', 'alert', '2026-09-30 08:00:00');
  insertNotif.run(3, 'MoU #8 (Wipro AI Lab) status changed to "Signing Date to be Finalized".', 'info', '2026-09-20 10:00:00');

  console.log('Database seeded successfully!');
}

seedDatabase().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
