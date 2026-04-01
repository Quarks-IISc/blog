(function() {
  /**
   * ANNOUNCEMENTS LOADER (Airtable Version)
   */

  // --- CONFIGURATION ---
  const AIRTABLE_BASE_ID = 'appZL8Aqpgy1IsIUY'; 
  const AIRTABLE_TABLE_NAME = 'tblgSwoYBQLlufAND'; 
  const OBFUSCATED_TOKEN = 'cGF0STN2Q21QTXlleFJBbEUuNTFlNTc4ZjJlNzg0MjEwM2QzNTMwYzNkY2YxMmE0OWQxYTM1NzliNjdmODExYzkzYjcxMDFkMmFlYTVlNzE4YQ=='; 
  // ---------------------

  async function loadAnnouncements() {
    const listEl = document.getElementById('announcements-list');
    if (!listEl) return;

    try {
      const token = atob(OBFUSCATED_TOKEN);
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const announcements = data.records.map(record => {
        const f = record.fields;
        return {
          id: record.id,
          title: f['Title'] || f['title'] || '',
          description: f['Description'] || f['description'] || '',
          link: f['Link'] || f['link'] || '#',
          link_text: f['Link Text'] || f['link text'] || 'Apply Here',
          deadline: f['Deadline'] || f['deadline'] || '',
          deadline_text: (typeof formatHumanDate === 'function' ? formatHumanDate(f['Deadline'] || f['deadline']) : (f['Deadline'] || f['deadline'] || ''))
        };
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNum = parseInt(today.toISOString().slice(0, 10).replace(/-/g, ''));
      
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
            ${a.deadline ? `<span class="deadline-badge"><i class="far fa-calendar-alt mr-1"></i> Deadline: ${a.deadline_text || a.deadline}</span>` : ''}
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
              <span class="deadline-badge"><i class="far fa-calendar-alt mr-1"></i> Deadline: ${a.deadline_text || a.deadline}</span>
            </div>
          </li>
        `).join('')}
      ` : '';
      
      listEl.innerHTML = html + pastHtml || '<li class="text-muted text-center py-3">No announcements</li>';
      
    } catch (e) {
      console.error('Failed to load announcements:', e);
      listEl.innerHTML = '<li class="text-muted text-center py-3">Unable to load announcements</li>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAnnouncements);
  } else {
    loadAnnouncements();
  }
})();
