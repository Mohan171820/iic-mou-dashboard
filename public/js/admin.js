/**
 * Admin Portal JavaScript Logic (Minimalist Clean Refresh)
 */

let currentUser = null;
let currentMousList = [];
let currentMouDetail = null;
let currentViewMode = 'table'; // 'table' or 'kanban'

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await checkAuthUser();
  if (!currentUser) {
    window.location.href = '/login';
    return;
  }

  // Update UI user info
  document.getElementById('userNameBadge').innerText = currentUser.name;
  document.getElementById('userRoleBadge').innerText = currentUser.role;

  // Initialize theme
  const savedTheme = localStorage.getItem('mou_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Setup Event Listeners
  setupNavigation();
  setupEventListeners();

  // Load Dashboard by default
  loadDashboardData();
});

// Theme Toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mou_theme', next);
}

// Navigation Handler
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      if (!targetSection) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.app-section').forEach(sec => sec.style.display = 'none');
      const activeSec = document.getElementById(`section-${targetSection}`);
      if (activeSec) activeSec.style.display = 'block';

      // Load section specific data
      if (targetSection === 'dashboard') loadDashboardData();
      else if (targetSection === 'departments') loadDepartmentProgressData();
      else if (targetSection === 'mou-tracker') loadMouTrackerData();
      else if (targetSection === 'signed-register') loadSignedRegisterData();
      else if (targetSection === 'industries') loadIndustriesData();
      else if (targetSection === 'commitments') loadCommitmentsData();
      else if (targetSection === 'meetings') loadMeetingsData();
      else if (targetSection === 'coe') loadCoeData();
      else if (targetSection === 'reports') loadReportsData();
      else if (targetSection === 'users') loadUsersData();
      else if (targetSection === 'audit') loadAuditLogsData();
    });
  });
}

function setupEventListeners() {
  // Global search
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase();
      filterMouTable(val);
    });
  }

  // MoU Filters
  ['filterDept', 'filterStatus', 'filterHealth'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => loadMouTrackerData());
  });

  // Kanban view toggle
  const btnTable = document.getElementById('btnViewTable');
  const btnKanban = document.getElementById('btnViewKanban');
  if (btnTable && btnKanban) {
    btnTable.addEventListener('click', () => {
      currentViewMode = 'table';
      btnTable.classList.add('btn-primary'); btnTable.classList.remove('btn-secondary');
      btnKanban.classList.add('btn-secondary'); btnKanban.classList.remove('btn-primary');
      document.getElementById('mouTableViewContainer').style.display = 'block';
      document.getElementById('mouKanbanViewContainer').style.display = 'none';
    });
    btnKanban.addEventListener('click', () => {
      currentViewMode = 'kanban';
      btnKanban.classList.add('btn-primary'); btnKanban.classList.remove('btn-secondary');
      btnTable.classList.add('btn-secondary'); btnTable.classList.remove('btn-primary');
      document.getElementById('mouTableViewContainer').style.display = 'none';
      document.getElementById('mouKanbanViewContainer').style.display = 'block';
      renderKanbanBoard(currentMousList);
    });
  }
}

// ---------------- DASHBOARD ----------------
async function loadDashboardData() {
  try {
    const [sumData, distData, actData] = await Promise.all([
      apiRequest('/dashboard/summary'),
      apiRequest('/dashboard/status-distribution'),
      apiRequest('/dashboard/action-required')
    ]);

    if (!sumData || !distData || !actData) return;

    // Render KPIs
    const s = sumData.summary;
    document.getElementById('kpiTotal').innerText = s.total;
    document.getElementById('kpiSigned').innerText = s.signed;
    document.getElementById('kpiInProgress').innerText = s.inProgress;
    document.getElementById('kpiOnHold').innerText = s.onHold;
    document.getElementById('kpiExpiring').innerText = s.expiring90;

    // Hero Ring (Minimalist)
    const heroRingContainer = document.getElementById('dashboardHeroRing');
    if (heroRingContainer) {
      heroRingContainer.innerHTML = createProgressRingHTML({
        size: 'medium',
        percentage: Math.round(s.avgPercent),
        statusName: 'Portfolio Avg',
        daysInStage: 0
      });
    }

    // Status Distribution Chart - Minimalist Slim Track
    const distContainer = document.getElementById('statusDistChart');
    if (distContainer) {
      distContainer.innerHTML = distData.distribution.map(d => `
        <div style="margin-bottom: 10px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:500;">
            <span style="color:var(--text-main);">${d.status} <span style="color:var(--text-muted);">(${d.percentage}%)</span></span>
            <span style="font-weight:600;">${d.count} MoUs</span>
          </div>
          <div style="height:4px; background:var(--border-color); border-radius:2px; overflow:hidden;">
            <div style="width:${s.total ? (d.count / s.total) * 100 : 0}%; height:100%; background:${d.status === 'Signed' ? '#10b981' : d.status === 'On Hold' ? '#d97706' : '#3b82f6'}; border-radius:2px; transition:width 0.5s ease;"></div>
          </div>
        </div>
      `).join('');
    }

    // Action Required Panel - Minimalist Clean Cards
    const actContainer = document.getElementById('actionRequiredList');
    if (actContainer) {
      const stuck = actData.actionRequired.stuckMous;
      const expiring = actData.actionRequired.expiringMous;

      let html = '';
      stuck.forEach(m => {
        html += `
          <div style="padding:10px 12px; border:1px solid var(--border-color); background:var(--bg-card); border-radius:var(--radius-sm); margin-bottom:8px;">
            <div style="font-weight:600; font-size:11px; color:#ef4444; text-transform:uppercase; letter-spacing:0.3px;">Stuck in Stage (${m.days_stuck} days)</div>
            <div style="font-weight:700; font-size:13px; margin-top:2px;">${m.title}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${m.industry_name} • ${m.department_name} • ${m.status}</div>
          </div>
        `;
      });

      expiring.forEach(m => {
        html += `
          <div style="padding:10px 12px; border:1px solid var(--border-color); background:var(--bg-card); border-radius:var(--radius-sm); margin-bottom:8px;">
            <div style="font-weight:600; font-size:11px; color:#d97706; text-transform:uppercase; letter-spacing:0.3px;">Expiring Soon (${m.days_to_expiry} days left)</div>
            <div style="font-weight:700; font-size:13px; margin-top:2px;">${m.title}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${m.industry_name} • Expiry: ${m.expiry_date}</div>
          </div>
        `;
      });

      if (!html) html = '<div style="color:var(--text-muted); font-size:12px;">No critical alerts at this time.</div>';
      actContainer.innerHTML = html;
    }
  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}

// ---------------- DEPARTMENT PROGRESS ----------------
async function loadDepartmentProgressData() {
  try {
    const data = await apiRequest('/dashboard/department-progress');
    if (!data || !data.departments) return;

    const grid = document.getElementById('deptProgressGrid');
    if (!grid) return;

    grid.innerHTML = data.departments.map(d => `
      <div class="dept-card" onclick="filterByDeptId(${d.id})">
        <div class="dept-card-header">
          <div>
            <div class="dept-name">${d.name}</div>
            <div class="dept-hod">HOD: ${d.hod_name || 'N/A'}</div>
          </div>
          ${createProgressRingHTML({ size: 'small', percentage: Math.round(d.avg_percent) })}
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:10px;">
          Total: <strong>${d.total_mous}</strong> • Signed: <strong style="color:var(--accent-green);">${d.signed_mous}</strong>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Dept progress error:', e);
  }
}

function filterByDeptId(deptId) {
  const navItem = document.querySelector('.nav-item[data-section="mou-tracker"]');
  if (navItem) navItem.click();

  const select = document.getElementById('filterDept');
  if (select) {
    select.value = deptId;
    loadMouTrackerData();
  }
}

// ---------------- MOU TRACKER ----------------
async function loadMouTrackerData() {
  try {
    const deptId = document.getElementById('filterDept')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    const health = document.getElementById('filterHealth')?.value || '';

    let query = `?department_id=${deptId}&status=${encodeURIComponent(status)}&health=${health}`;
    const data = await apiRequest(`/mous${query}`);
    if (!data) return;

    currentMousList = data.mous;
    renderMouTable(currentMousList);
    if (currentViewMode === 'kanban') {
      renderKanbanBoard(currentMousList);
    }
  } catch (e) {
    console.error('MoU tracker error:', e);
  }
}

function renderMouTable(mous) {
  const tbody = document.getElementById('mouTableBody');
  if (!tbody) return;

  if (mous.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:24px;">No MoUs found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = mous.map(m => `
    <tr onclick="openMouDetailDrawer(${m.id})">
      <td><strong>#${m.id}</strong></td>
      <td>
        <div style="font-weight:600;">${m.title}</div>
        <div style="font-size:11px; color:var(--text-muted);">${m.industry_name}</div>
      </td>
      <td>${m.department_name}</td>
      <td onclick="event.stopPropagation()">
        <select class="status-select" onchange="changeMouStatus(${m.id}, this.value)">
          ${getStatusOptionsHTML(m.status)}
        </select>
      </td>
      <td>
        ${createProgressRingHTML({ size: 'small', percentage: m.progress_percent, statusName: m.status })}
      </td>
      <td>
        <div style="font-size:12px;">${m.next_activity || 'N/A'}</div>
      </td>
      <td>${m.owner_name || 'Unassigned'}</td>
      <td>${m.days_in_stage !== null ? m.days_in_stage + ' d' : 'N/A'}</td>
      <td>
        <span class="badge badge-${m.health === 'Good' ? 'good' : m.health === 'At Risk' ? 'risk' : 'delayed'}">
          ${m.health}
        </span>
      </td>
    </tr>
  `).join('');
}

function getStatusOptionsHTML(currentStatus) {
  const statuses = [
    'Initial Communication', 'Discussion in Progress', 'Draft MoU to be Prepared',
    'Draft Shared with Company', 'Draft Under Review', 'Revision / Clarification Required',
    'Approval Awaited', 'Signing Date to be Finalized', 'Signed', 'On Hold', 'Not Proceeding'
  ];

  return statuses.map(s => `
    <option value="${s}" ${s === currentStatus ? 'selected' : ''}>${s}</option>
  `).join('');
}

async function changeMouStatus(mouId, newStatus) {
  const remark = prompt(`Updating MoU #${mouId} status to "${newStatus}".\nPlease enter a status change remark:`, 'Status updated via tracker table');
  if (remark === null) return;

  try {
    const res = await apiRequest(`/mous/${mouId}/status`, 'PATCH', { status: newStatus, remark });
    if (res && res.success) {
      loadMouTrackerData();
      loadDashboardData();
    }
  } catch (e) {
    alert('Error updating status: ' + e.message);
  }
}

// ---------------- KANBAN BOARD ----------------
function renderKanbanBoard(mous) {
  const board = document.getElementById('mouKanbanViewContainer');
  if (!board) return;

  const columns = [
    'Initial Communication', 'Discussion in Progress', 'Draft MoU to be Prepared',
    'Draft Shared with Company', 'Draft Under Review', 'Revision / Clarification Required',
    'Approval Awaited', 'Signing Date to be Finalized', 'Signed'
  ];

  board.innerHTML = `
    <div class="kanban-board">
      ${columns.map(col => {
        const colMous = mous.filter(m => m.status === col);
        return `
          <div class="kanban-column" ondragover="event.preventDefault()" ondrop="dropKanbanCard(event, '${col}')">
            <div class="kanban-header">
              <span>${col}</span>
              <span style="font-size:11px; font-weight:600; background:var(--bg-card); border:1px solid var(--border-color); padding:2px 6px; border-radius:10px;">${colMous.length}</span>
            </div>
            <div class="kanban-cards">
              ${colMous.map(m => `
                <div class="kanban-card" draggable="true" ondragstart="dragKanbanCard(event, ${m.id})" onclick="openMouDetailDrawer(${m.id})">
                  <div style="font-weight:600; font-size:12px; margin-bottom:2px;">${m.title}</div>
                  <div style="font-size:11px; color:var(--text-muted);">${m.industry_name} • ${m.department_name}</div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
                    <span style="font-size:11px; font-weight:700;">${m.progress_percent}%</span>
                    <span class="badge badge-${m.health === 'Good' ? 'good' : 'risk'}">${m.health}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function dragKanbanCard(ev, mouId) {
  ev.dataTransfer.setData('text/plain', mouId);
}

async function dropKanbanCard(ev, targetStatus) {
  ev.preventDefault();
  const mouId = ev.dataTransfer.getData('text/plain');
  if (!mouId) return;

  const remark = prompt(`Move MoU #${mouId} to "${targetStatus}"? Remark:`, 'Status updated via Kanban drag-and-drop');
  if (remark === null) return;

  try {
    await apiRequest(`/mous/${mouId}/status`, 'PATCH', { status: targetStatus, remark });
    loadMouTrackerData();
  } catch (e) {
    alert('Error moving Kanban card: ' + e.message);
  }
}

// ---------------- MOU DETAIL DRAWER ----------------
async function openMouDetailDrawer(mouId) {
  try {
    const data = await apiRequest(`/mous/${mouId}`);
    if (!data || !data.mou) return;

    currentMouDetail = data;
    const m = data.mou;

    // Header & Details
    document.getElementById('drawerMouTitle').innerText = m.title;
    document.getElementById('drawerIndustryName').innerText = `${m.industry_name} (${m.department_name})`;

    // Large Progress Ring
    const ringContainer = document.getElementById('drawerLargeRing');
    if (ringContainer) {
      ringContainer.innerHTML = createProgressRingHTML({
        size: 'large',
        percentage: m.progress_percent,
        statusName: m.status,
        daysInStage: m.days_in_stage || 0,
        isPaused: m.status === 'On Hold'
      });
    }

    // Metadata
    document.getElementById('drawerPurpose').innerText = m.purpose || 'No purpose statement provided.';
    document.getElementById('drawerMouDate').innerText = m.mou_date || 'Not Signed Yet';
    document.getElementById('drawerExpiryDate').innerText = m.expiry_date || 'N/A';
    document.getElementById('drawerNextActivity').innerText = m.next_activity || 'N/A';

    // Status Timeline
    const timeline = document.getElementById('drawerTimeline');
    if (timeline) {
      timeline.innerHTML = data.history.map(h => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-title">${h.new_status}</div>
          <div class="timeline-date">${h.changed_at} by ${h.changed_by_name || 'System'}</div>
          <div class="timeline-remark">${h.remark || 'No remark provided'}</div>
        </div>
      `).join('');
    }

    // Image Gallery
    renderGalleryImages(data.images);

    // Documents List
    renderDocumentsList(data.documents);

    // Chairperson Comments
    renderCommentsList(data.comments);

    // Show Drawer
    document.getElementById('mouDrawerBackdrop').classList.add('active');
    document.getElementById('mouDrawer').classList.add('active');
  } catch (e) {
    alert('Failed to load MoU details: ' + e.message);
  }
}

function closeMouDetailDrawer() {
  document.getElementById('mouDrawerBackdrop').classList.remove('active');
  document.getElementById('mouDrawer').classList.remove('active');
}

function renderGalleryImages(images) {
  const gallery = document.getElementById('drawerGallery');
  if (!gallery) return;

  let html = images.map(img => `
    <div class="gallery-item">
      <img src="${img.file_path}" alt="${img.caption || 'Signing Photo'}" onclick="window.open('${img.file_path}', '_blank')" />
    </div>
  `).join('');

  gallery.innerHTML = html || '<div style="font-size:11px; color:var(--text-muted);">No images uploaded yet.</div>';
}

function renderDocumentsList(docs) {
  const list = document.getElementById('drawerDocsList');
  if (!list) return;

  let html = docs.map(d => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:var(--bg-primary); border-radius:var(--radius-sm); margin-bottom:6px;">
      <div>
        <div style="font-weight:600; font-size:12px;">📄 ${d.title} (${d.version})</div>
        <div style="font-size:10px; color:var(--text-muted);">${d.doc_type} • Uploaded ${d.uploaded_at}</div>
      </div>
      <a href="${d.file_path}" target="_blank" class="btn btn-secondary btn-sm">Download</a>
    </div>
  `).join('');

  list.innerHTML = html || '<div style="font-size:11px; color:var(--text-muted);">No documents uploaded yet.</div>';
}

function renderCommentsList(comments) {
  const list = document.getElementById('drawerCommentsList');
  if (!list) return;

  let html = comments.map(c => `
    <div style="padding:8px 10px; background:var(--bg-primary); border-radius:var(--radius-sm); margin-bottom:6px;">
      <div style="font-weight:600; font-size:11px; color:var(--text-main);">${c.user_name} (${c.user_role})</div>
      <div style="font-size:12px; margin-top:2px;">"${c.message}"</div>
      <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${c.created_at}</div>
    </div>
  `).join('');

  list.innerHTML = html || '<div style="font-size:11px; color:var(--text-muted);">No remarks added yet.</div>';
}

async function addChairpersonRemark() {
  const input = document.getElementById('newRemarkInput');
  if (!input || !input.value.trim()) return;
  if (!currentMouDetail) return;

  try {
    const res = await apiRequest(`/mous/${currentMouDetail.mou.id}/comments`, 'POST', { message: input.value.trim() });
    if (res && res.success) {
      input.value = '';
      openMouDetailDrawer(currentMouDetail.mou.id);
    }
  } catch (e) {
    alert('Failed to add remark: ' + e.message);
  }
}

// ---------------- SIGNED REGISTER ----------------
async function loadSignedRegisterData() {
  try {
    const data = await apiRequest('/mous?status=Signed');
    if (!data) return;

    const tbody = document.getElementById('signedTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.mous.map(m => `
      <tr onclick="openMouDetailDrawer(${m.id})">
        <td><strong>#${m.id}</strong></td>
        <td>
          <div style="font-weight:600;">${m.title}</div>
          <div style="font-size:11px; color:var(--text-muted);">${m.industry_name}</div>
        </td>
        <td>${m.department_name}</td>
        <td>${m.mou_date || 'N/A'}</td>
        <td>${m.expiry_date || 'N/A'}</td>
        <td>
          <span class="badge ${m.days_to_expiry && m.days_to_expiry <= 90 ? 'badge-risk' : 'badge-good'}">
            ${m.days_to_expiry !== null ? m.days_to_expiry + ' days left' : 'Active'}
          </span>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Signed register error:', e);
  }
}

// ---------------- INDUSTRIES ----------------
async function loadIndustriesData() {
  try {
    const data = await apiRequest('/industries');
    if (!data) return;

    const tbody = document.getElementById('industriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.industries.map(i => `
      <tr>
        <td><strong>${i.name}</strong></td>
        <td>${i.sector || 'N/A'}</td>
        <td>${i.contact_person || 'N/A'} (${i.designation || ''})</td>
        <td>${i.email || ''} <br> ${i.phone || ''}</td>
        <td><span class="badge badge-good">${i.total_mous} MoUs</span></td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Industries error:', e);
  }
}

// ---------------- COMMITMENTS ----------------
async function loadCommitmentsData() {
  try {
    const data = await apiRequest('/commitments');
    if (!data) return;

    const tbody = document.getElementById('commitmentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.commitments.map(c => `
      <tr>
        <td>${c.mou_title}</td>
        <td><strong>${c.title}</strong></td>
        <td>${c.target || 'N/A'}</td>
        <td>${c.achieved || 'N/A'}</td>
        <td>${c.owner || 'Unassigned'}</td>
        <td>${c.due_date || 'N/A'}</td>
        <td>
          <span class="badge ${c.status === 'Achieved' ? 'badge-good' : c.status === 'Overdue' ? 'badge-delayed' : 'badge-risk'}">
            ${c.status}
          </span>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Commitments error:', e);
  }
}

// ---------------- MEETINGS ----------------
async function loadMeetingsData() {
  try {
    const data = await apiRequest('/meetings');
    if (!data) return;

    const tbody = document.getElementById('meetingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.meetings.map(m => `
      <tr>
        <td>${m.meeting_date}</td>
        <td>${m.industry_name || 'N/A'}</td>
        <td>${m.purpose || 'N/A'}</td>
        <td>${m.outcome || 'N/A'}</td>
        <td>${m.next_action || 'N/A'}</td>
        <td>${m.owner || 'N/A'}</td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Meetings error:', e);
  }
}

// ---------------- COE & MONETISATION ----------------
async function loadCoeData() {
  try {
    const [coesData, revData] = await Promise.all([
      apiRequest('/coe/coes'),
      apiRequest('/coe/revenue')
    ]);

    if (!coesData || !revData) return;

    const coeGrid = document.getElementById('coeCardsGrid');
    if (coeGrid) {
      coeGrid.innerHTML = coesData.coes.map(c => `
        <div class="card">
          <div class="card-title">
            <span>${c.name}</span>
            <span class="badge badge-good">₹${(c.realised_revenue || 0).toLocaleString('en-IN')}</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Domain: ${c.domain || 'N/A'} • Head: ${c.head || 'N/A'}</div>
          <div style="font-size:11px;">Total Activities: <strong>${c.activity_count}</strong></div>
        </div>
      `).join('');
    }

    const revTbody = document.getElementById('revenueTableBody');
    if (revTbody) {
      revTbody.innerHTML = revData.revenue.map(r => `
        <tr>
          <td>${r.coe_name}</td>
          <td>${r.source}</td>
          <td><strong>₹${r.amount.toLocaleString('en-IN')}</strong></td>
          <td>
            <span class="badge ${r.type === 'realised' ? 'badge-good' : 'badge-risk'}">${r.type}</span>
          </td>
          <td>${r.date}</td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error('COE load error:', e);
  }
}

// ---------------- USERS DATA ----------------
async function loadUsersData() {
  try {
    const data = await apiRequest('/users');
    if (!data) return;

    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.users.map(u => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="badge badge-good">${u.role}</span></td>
        <td>${u.department_name || 'All Departments'}</td>
        <td>${u.is_active ? 'Active' : 'Inactive'}</td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Users load error:', e);
  }
}

// ---------------- AUDIT LOGS ----------------
async function loadAuditLogsData() {
  try {
    const data = await apiRequest('/audit-logs');
    if (!data) return;

    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.logs.map(l => `
      <tr>
        <td>${l.created_at}</td>
        <td><strong>${l.user_name || 'System'}</strong></td>
        <td><span class="badge badge-good">${l.action}</span></td>
        <td>${l.entity} #${l.entity_id || ''}</td>
        <td style="font-size:11px;">${l.details}</td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Audit load error:', e);
  }
}

function loadReportsData() {}

function filterMouTable(val) {
  const filtered = currentMousList.filter(m =>
    m.title.toLowerCase().includes(val) ||
    m.industry_name.toLowerCase().includes(val) ||
    m.department_name.toLowerCase().includes(val)
  );
  renderMouTable(filtered);
}
