/**
 * Executive Portal JavaScript Logic (Read-Only + Executive Remarks)
 * Theme Inspired by Meuze.ai
 */

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await checkAuthUser();
  if (!currentUser) {
    window.location.href = '/login';
    return;
  }

  document.getElementById('userNameBadge').innerText = currentUser.name;

  // Load Overview Data
  loadChairpersonDashboard();
});

async function loadChairpersonDashboard() {
  try {
    const [sumData, deptData, signedData] = await Promise.all([
      apiRequest('/dashboard/summary'),
      apiRequest('/dashboard/department-progress'),
      apiRequest('/mous?status=Signed')
    ]);

    if (!sumData || !deptData || !signedData) return;

    // Render KPIs
    const s = sumData.summary;
    document.getElementById('cpTotalMous').innerText = s.total;
    document.getElementById('cpSignedMous').innerText = s.signed;
    document.getElementById('cpInProgress').innerText = s.inProgress;
    document.getElementById('cpAvgPercent').innerText = `${Math.round(s.avgPercent)}%`;

    // Portfolio Ring
    const heroRingContainer = document.getElementById('cpHeroRing');
    if (heroRingContainer) {
      heroRingContainer.innerHTML = createProgressRingHTML({
        size: 'medium',
        percentage: Math.round(s.avgPercent),
        statusName: 'Executive Portfolio',
        daysInStage: 0
      });
    }

    // Department Grid
    const deptGrid = document.getElementById('cpDeptGrid');
    if (deptGrid) {
      deptGrid.innerHTML = deptData.departments.map(d => `
        <div class="dept-card">
          <div class="dept-card-header">
            <div>
              <div class="dept-name">${d.name}</div>
              <div class="dept-hod">HOD: ${d.hod_name || 'N/A'}</div>
            </div>
            ${createProgressRingHTML({ size: 'small', percentage: Math.round(d.avg_percent) })}
          </div>
          <div style="font-size:11px; color:#9da2b3; margin-top:10px;">
            Total: <strong style="color:#ffffff;">${d.total_mous}</strong> • Signed: <strong style="color:#34d399;">${d.signed_mous}</strong>
          </div>
        </div>
      `).join('');
    }

    // Signed Register Table
    const signedTbody = document.getElementById('cpSignedTbody');
    if (signedTbody) {
      signedTbody.innerHTML = signedData.mous.map(m => `
        <tr onclick="openChairpersonMouModal(${m.id})">
          <td><strong style="color:#60a5fa;">#${m.id}</strong></td>
          <td>
            <div style="font-weight:600; color:#ffffff;">${m.title}</div>
            <div style="font-size:11px; color:#9da2b3;">${m.industry_name}</div>
          </td>
          <td>${m.department_name}</td>
          <td>${m.mou_date || 'N/A'}</td>
          <td>${m.expiry_date || 'N/A'}</td>
          <td><span class="badge badge-good">Signed 100%</span></td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error('Executive dashboard load error:', e);
  }
}

async function openChairpersonMouModal(mouId) {
  try {
    const data = await apiRequest(`/mous/${mouId}`);
    if (!data || !data.mou) return;

    const m = data.mou;
    document.getElementById('cpModalTitle').innerText = m.title;
    document.getElementById('cpModalSubtitle').innerText = `${m.industry_name} • ${m.department_name}`;

    document.getElementById('cpModalRing').innerHTML = createProgressRingHTML({
      size: 'large',
      percentage: m.progress_percent,
      statusName: m.status,
      daysInStage: m.days_in_stage || 0
    });

    document.getElementById('cpModalPurpose').innerText = m.purpose || 'No purpose statement.';
    
    // Timeline
    document.getElementById('cpModalTimeline').innerHTML = data.history.map(h => `
      <div class="timeline-item">
        <div class="timeline-dot" style="background:#60a5fa;"></div>
        <div class="timeline-title" style="color:#ffffff;">${h.new_status}</div>
        <div class="timeline-date">${h.changed_at}</div>
        <div class="timeline-remark" style="background:#171f2b; color:#cbd5e1;">${h.remark || ''}</div>
      </div>
    `).join('');

    // Comments
    document.getElementById('cpModalComments').innerHTML = data.comments.map(c => `
      <div style="padding:8px 10px; background:#171f2b; border-radius:var(--radius-sm); margin-bottom:6px;">
        <div style="font-weight:600; font-size:11px; color:#60a5fa;">${c.user_name} (${c.user_role})</div>
        <div style="font-size:12px; margin-top:2px; color:#ffffff;">"${c.message}"</div>
        <div style="font-size:10px; color:#9da2b3; margin-top:2px;">${c.created_at}</div>
      </div>
    `).join('');

    window.currentCpMouId = mouId;
    document.getElementById('cpModalOverlay').classList.add('active');
  } catch (e) {
    alert('Failed to load MoU detail: ' + e.message);
  }
}

function closeChairpersonMouModal() {
  document.getElementById('cpModalOverlay').classList.remove('active');
}

async function submitChairpersonRemark() {
  const input = document.getElementById('cpRemarkInput');
  if (!input || !input.value.trim() || !window.currentCpMouId) return;

  try {
    await apiRequest(`/mous/${window.currentCpMouId}/comments`, 'POST', { message: input.value.trim() });
    input.value = '';
    openChairpersonMouModal(window.currentCpMouId);
  } catch (e) {
    alert('Failed to add remark: ' + e.message);
  }
}
