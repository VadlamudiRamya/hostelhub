// API Configuration and Service Layer
// When the frontend is served by the backend we can simply use a relative path
// which avoids CORS issues when the app is accessed via file:// or another port.
// `window.location.origin` returns "null" when the page is loaded via file://
// so we must guard against that case. The safest default is the relative
// "/api" path which will target the same origin serving the HTML (likely the
// Express server on :5000).
let API_BASE_URL;
if (window.location.origin && window.location.origin !== 'null') {
  API_BASE_URL = `${window.location.origin}/api`;
} else {
  API_BASE_URL = '/api';
}

console.log('API_BASE_URL set to', API_BASE_URL);

class APIService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.includeAuth !== false),
        ...options.headers
      }
    };

    try {
      console.log('[API] Request:', method || options.method || 'GET', url);
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.setToken(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userRole');
          window.location.href = '/login.html';
          throw new Error('Unauthorized - please login again');
        }

        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('[API] Error during fetch to', url, '-', err);
      throw err;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false
    });
  }

  async getCurrentProfile() {
    return this.request('/auth/profile', { method: 'GET' });
  }

  // Student endpoints
  async getAllStudents() {
    return this.request('/students', { method: 'GET' });
  }

  async getStudent(id) {
    return this.request(`/students/${id}`, { method: 'GET' });
  }

  async createStudent(data) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateStudent(id, data) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  // Room endpoints
  async getAllRooms() {
    return this.request('/rooms', { method: 'GET' });
  }

  async createRoom(data) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateRoom(id, data) {
    return this.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteRoom(id) {
    return this.request(`/rooms/${id}`, { method: 'DELETE' });
  }

  // Complaint endpoints
  async getAllComplaints(status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/complaints${query}`, { method: 'GET' });
  }

  async createComplaint(data) {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateComplaintStatus(id, status) {
    return this.request(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteComplaint(id) {
    return this.request(`/complaints/${id}`, { method: 'DELETE' });
  }

  // Notice endpoints
  async getAllNotices() {
    return this.request('/notices', { method: 'GET' });
  }

  async createNotice(data) {
    return this.request('/notices', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateNotice(id, data) {
    return this.request(`/notices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteNotice(id) {
    return this.request(`/notices/${id}`, { method: 'DELETE' });
  }

  // Menu endpoints
  async getAllMenuItems() {
    return this.request('/menu', { method: 'GET' });
  }

  async getTodayMenu() {
    return this.request('/menu/today', { method: 'GET' });
  }

  async updateMenuItem(data) {
    return this.request('/menu', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Fee & Attendance endpoints
  async getAttendance(studentId) {
    return this.request(`/fee-attendance/attendance/${studentId}`, { method: 'GET' });
  }

  async getFeeStatus(studentId) {
    return this.request(`/fee-attendance/fees/${studentId}`, { method: 'GET' });
  }

  async updateAttendance(studentId, attendance) {
    return this.request(`/fee-attendance/attendance/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ attendance })
    });
  }

  async updateFeeStatus(studentId, feesStatus) {
    return this.request(`/fee-attendance/fees/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ feesStatus })
    });
  }

  async getFeeReport() {
    return this.request('/fee-attendance/report/fees', { method: 'GET' });
  }

  async getAttendanceReport() {
    return this.request('/fee-attendance/report/attendance', { method: 'GET' });
  }
}

// Create global API instance
const api = new APIService();

// Utility function to get current user info from token + localStorage
function getCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    // Decode JWT (simple version - doesn't verify signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Combine JWT data with localStorage data
    return {
      id: payload.id || localStorage.getItem('userId'),
      email: payload.email,
      role: payload.role,
      name: localStorage.getItem('userName') || payload.email.split('@')[0],
      // Add demo data for compatibility with old dashboard code
      roomNo: localStorage.getItem('userRoom') || '-',
      feesStatus: localStorage.getItem('userFeesStatus') || 'Pending',
      attendance: parseInt(localStorage.getItem('userAttendance') || '0')
    };
  } catch (err) {
    console.error('Error parsing token:', err);
    return null;
  }
}

// Utility function to check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

// Utility function to check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Utility function to check if user is student
function isStudent() {
  const user = getCurrentUser();
  return user && user.role === 'student';
}

// Utility function to ensure user is authenticated
function requireAuth(redirectTo = '/login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Utility function to ensure user is admin
function requireAdmin(redirectTo = '/index.html') {
  if (!isAdmin()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Utility function to show toast notification
function showToast(message, type = 'info') {
  const alertClass = {
    'success': 'alert-success',
    'error': 'alert-danger',
    'warning': 'alert-warning',
    'info': 'alert-info'
  }[type] || 'alert-info';

  const toast = document.createElement('div');
  toast.className = `alert ${alertClass} alert-dismissible fade show`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  
  const container = document.querySelector('.container') || document.body;
  container.insertAdjacentElement('afterbegin', toast);

  setTimeout(() => toast.remove(), 5000);
}
