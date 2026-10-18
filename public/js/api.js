/**
 * API Wrapper Utility for MoU Management System
 */

const API_BASE = '/api';

const mouSyncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('mou_live_sync') : null;

function notifyMouDataChanged() {
  if (mouSyncChannel) {
    try { mouSyncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() }); } catch(e){}
  }
  try { localStorage.setItem('mou_live_sync_trigger', Date.now().toString()); } catch(e){}
}

async function apiRequest(endpoint, method = 'GET', body = null, isFormData = false) {
  const options = {
    method,
    headers: {}
  };

  if (body && !isFormData) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  } else if (body && isFormData) {
    options.body = body; // Multer FormData
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);

    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      window.location.href = '/login';
      return null;
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      notifyMouDataChanged();
    }

    return data;
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err);
    throw err;
  }
}

// Global Auth State Helper
async function checkAuthUser() {
  try {
    const data = await apiRequest('/auth/me');
    return data ? data.user : null;
  } catch (e) {
    return null;
  }
}

async function logoutUser() {
  try {
    await apiRequest('/auth/logout', 'POST');
  } finally {
    window.location.href = '/login';
  }
}
