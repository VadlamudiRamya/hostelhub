function checkLogin(role) {
    const userRole = localStorage.getItem('userRole');
    const email   = localStorage.getItem('currentUser');
    if (!userRole || !email || userRole !== role) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ── Optimized helper for creating stat cards ─────────────
function createStatCard(icon, iconBg, number, label) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
        <div class="stat-icon" ${iconBg ? `style="background:${iconBg}"` : ''}>
            <i class="bi ${icon}"></i>
        </div>
        <div>
            <div class="stat-number">${number}</div>
            <div class="stat-label">${label}</div>
        </div>
    `;
    return card;
}

// ── Optimized Student summary cards ─────────────
function loadStudentSummary() {
    const user = getCurrentUser();
    if (!user) return;

    const el = document.getElementById('student-summary');
    if (!el) return;

    // Batch get complaints data (cached)
    const complaints = getData('complaints');
    
    // Single pass filter for pending complaints
    let pending = 0;
    for (let i = 0; i < complaints.length; i++) {
        if (complaints[i].studentName === user.name && complaints[i].status === 'Pending') {
            pending++;
        }
    }

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createStatCard('bi-check-circle', null, `${user.attendance}%`, 'Attendance'));
    fragment.appendChild(createStatCard('bi-currency-rupee', 'var(--secondary)', user.feesStatus === 'Paid' ? '0' : '₹8,500', 'Pending Fees'));
    fragment.appendChild(createStatCard('bi-exclamation-triangle', '#f59e0b', pending, 'Pending Complaints'));
    
    el.innerHTML = '';
    el.appendChild(fragment);
}

// ── Optimized Admin summary cards ─────────────
function loadAdminSummary() {
    const el = document.getElementById('admin-summary');
    if (!el) return;

    // Batch get all data at once (cached)
    const { students, complaints, rooms } = getBatchData(['students', 'complaints', 'rooms']);
    
    // Single pass calculations
    let pendingC = 0;
    let pendingF = 0;
    for (let i = 0; i < complaints.length; i++) {
        if (complaints[i].status === 'Pending') pendingC++;
    }
    for (let i = 0; i < students.length; i++) {
        if (students[i].feesStatus === 'Pending') pendingF++;
    }

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createStatCard('bi-people', null, students.length, 'Students'));
    fragment.appendChild(createStatCard('bi-house-door', 'var(--secondary)', rooms.length, 'Rooms'));
    fragment.appendChild(createStatCard('bi-chat-dots', '#f59e0b', pendingC, 'Pending Complaints'));
    fragment.appendChild(createStatCard('bi-currency-rupee', '#ef4444', `₹${pendingF * 8500}`, 'Fee Due'));
    
    el.innerHTML = '';
    el.appendChild(fragment);
}

// Logout listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.logout').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            logout();
        });
    });
});