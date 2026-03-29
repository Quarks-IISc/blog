// Load announcements from JSON file
async function loadAnnouncements() {
  try {
    const baseurl = (document.currentScript?.getAttribute('data-baseurl') || window.site?.baseurl || '');
    const response = await fetch(baseurl + '/assets/data/announcements.json');
    if (!response.ok) {
      const el = document.getElementById('announcements-list');
      if (el) el.innerHTML = '<li class="text-muted text-center py-3">Unable to load announcements</li>';
      return;
    }
    
    const announcements = await response.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNum = parseInt(today.toISOString().slice(0, 10).replace(/-/g, ''));
    
    // Separate active and past announcements
    const active = announcements.filter(a => {
      if (!a.deadline) return true;
      const deadlineNum = parseInt(a.deadline.replace(/-/g, ''));
      return deadlineNum >= todayNum;
    }).sort((a, b) => {
      const aDate = a.deadline ? parseInt(a.deadline.replace(/-/g, '')) : 99999999;
      const bDate = b.deadline ? parseInt(b.deadline.replace(/-/g, '')) : 99999999;
      return aDate - bDate;
    });
    
    const past = announcements.filter(a => {
      if (!a.deadline) return false;
      const deadlineNum = parseInt(a.deadline.replace(/-/g, ''));
      return deadlineNum < todayNum;
    }).sort((a, b) => {
      const aDate = parseInt(a.deadline.replace(/-/g, ''));
      const bDate = parseInt(b.deadline.replace(/-/g, ''));
      return bDate - aDate;
    });
    
    const html = active.map(a => `
      <li class="mb-4 pb-3 border-bottom">
        <div class="font-weight-bold" style="font-size: 1.15rem; line-height: 1.4;">
          ${a.title}
          <span class="text-muted" style="font-weight: 400; font-size: 0.95rem; margin-left: 8px;">— ${a.description}</span>
        </div>
        <div class="mt-3 ${a.deadline ? 'd-flex align-items-center justify-content-between flex-wrap' : ''}" style="gap: 10px;">
          <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="magazine-link" style="font-size: 0.95rem; padding-bottom: 2px;">${a.link_text} <span class="arrow" style="font-size: 1.2rem; margin-left: 8px;">&xrarr;</span></a>
          ${a.deadline ? `<span class="deadline-badge"><i class="far fa-calendar-alt mr-1"></i> Deadline: ${a.deadline_text}</span>` : ''}
        </div>
      </li>
    `).join('');
    
    const pastHtml = past.length > 0 ? `
      <div class="mt-5 mb-3">
        <h5 class="text-muted text-uppercase" style="letter-spacing: 2px; font-size: 0.9rem; font-weight: 700; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 10px;">Past Announcements</h5>
      </div>
      ${past.map(a => `
        <li class="mb-3 pb-2 border-bottom">
          <div class="font-weight-bold" style="font-size: 1.15rem; line-height: 1.4;">
            ${a.title}
            <span class="text-muted" style="font-weight: 400; font-size: 0.95rem; margin-left: 8px;">— ${a.description}</span>
          </div>
          <div class="mt-2 d-flex align-items-center justify-content-between flex-wrap" style="gap: 10px;">
            <a href="${a.link}" target="_blank" rel="noopener noreferrer" class="magazine-link" style="font-size: 0.85rem; padding-bottom: 2px;">Details <span class="arrow" style="font-size: 1rem; margin-left: 5px;">&xrarr;</span></a>
            <span class="deadline-badge"><i class="far fa-calendar-alt mr-1"></i> Deadline: ${a.deadline_text}</span>
          </div>
        </li>
      `).join('')}
    ` : '';
    
    const listEl = document.getElementById('announcements-list');
    if (listEl) {
      listEl.innerHTML = html + pastHtml || '<li class="text-muted text-center py-3">No announcements</li>';
    }
  } catch (e) {
    console.error('Failed to load announcements:', e);
    const el = document.getElementById('announcements-list');
    if (el) el.innerHTML = '<li class="text-muted text-center py-3">Unable to load announcements</li>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAnnouncements);
} else {
  loadAnnouncements();
}
