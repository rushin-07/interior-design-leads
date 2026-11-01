// ==========================================================================
// 🌸 STUDIO SCOUT: PINK EDITION FRONTEND ENGINE
// ==========================================================================

let allLeads = [];
let filteredLeads = [];
let currentFilters = {
    search: '',
    city: 'all',
    category: 'all',
    contact: 'all'
};

// Password Verification Keys
// Accepts 'QT🌶️', 'QT🌶', 'QT', 'qt🌶️', 'qt🌶', 'qt'
const VALID_PASSWORDS = ['QT🌶️', 'QT🌶', 'QT', 'QT:chili:', 'qt🌶️', 'qt🌶', 'qt'];

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initFloatingSparkles();
    checkExistingAuth();
    setupEventListeners();
});

// ==========================================================================
// 1. FLOATING HEART & SPARKLE PARTICLES
// ==========================================================================
function initFloatingSparkles() {
    const container = document.getElementById('sparkles-container');
    if (!container) return;

    const symbols = ['💖', '🌸', '✨', '🎀', '🧸', '⭐'];
    
    for (let i = 0; i < 16; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = `${Math.random() * 95}%`;
        heart.style.animationDelay = `${Math.random() * 12}s`;
        heart.style.animationDuration = `${10 + Math.random() * 10}s`;
        heart.style.fontSize = `${0.9 + Math.random() * 0.8}rem`;
        container.appendChild(heart);
    }
}

// ==========================================================================
// 2. PASSWORD GATE & AUTHENTICATION
// ==========================================================================
function checkExistingAuth() {
    const isAuthed = localStorage.getItem('studio_scout_auth');
    if (isAuthed === 'true') {
        unlockDashboard(false);
    } else {
        document.getElementById('password-gate').style.display = 'flex';
        document.getElementById('main-dashboard').style.display = 'none';
    }
}

function handleUnlock() {
    const input = document.getElementById('password-input');
    const errorEl = document.getElementById('gate-error');
    const entered = (input.value || '').trim();

    // Check if entered password matches
    const isMatch = VALID_PASSWORDS.some(p => p.toLowerCase() === entered.toLowerCase());

    if (isMatch) {
        errorEl.style.display = 'none';
        localStorage.setItem('studio_scout_auth', 'true');
        
        // Launch Celebration Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ec407a', '#f48fb1', '#ffd54f', '#ffffff']
            });
        }

        showToast('Welcome in, beautiful! Dashboard unlocked 💖');
        setTimeout(() => {
            unlockDashboard(true);
        }, 350);
    } else {
        errorEl.textContent = 'Oops! Enter "QT" with the red pepper 🌶️';
        errorEl.style.display = 'block';
        input.focus();
    }
}

function unlockDashboard(animate = true) {
    const gate = document.getElementById('password-gate');
    const dashboard = document.getElementById('main-dashboard');
    
    if (animate) {
        gate.style.transition = 'opacity 0.4s ease';
        gate.style.opacity = '0';
        setTimeout(() => {
            gate.style.display = 'none';
            dashboard.style.display = 'block';
            dashboard.style.opacity = '0';
            dashboard.style.transition = 'opacity 0.4s ease';
            setTimeout(() => { dashboard.style.opacity = '1'; }, 20);
        }, 400);
    } else {
        gate.style.display = 'none';
        dashboard.style.display = 'block';
    }

    // Load initial leads
    fetchLeads();
}

function lockDashboard() {
    localStorage.removeItem('studio_scout_auth');
    document.getElementById('main-dashboard').style.display = 'none';
    const gate = document.getElementById('password-gate');
    gate.style.display = 'flex';
    gate.style.opacity = '1';
    document.getElementById('password-input').value = '';
    showToast('Dashboard locked 🔒');
}

// ==========================================================================
// 3. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
    // Red Pepper Button
    const pepperBtn = document.getElementById('pepper-btn');
    if (pepperBtn) {
        pepperBtn.addEventListener('click', () => {
            const input = document.getElementById('password-input');
            input.value += '🌶️';
            input.focus();
        });
    }

    // Lock Button
    const lockBtn = document.getElementById('lock-btn');
    if (lockBtn) {
        lockBtn.addEventListener('click', lockDashboard);
    }

    // Sync Button
    const syncBtn = document.getElementById('sync-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            syncBtn.classList.add('fa-spin');
            fetchLeads().finally(() => {
                setTimeout(() => syncBtn.classList.remove('fa-spin'), 600);
            });
        });
    }

    // Export CSV Button
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCSV);
    }

    // Search Input
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value.trim();
            if (clearBtn) clearBtn.style.display = currentFilters.search ? 'block' : 'none';
            applyFilters();
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentFilters.search = '';
            clearBtn.style.display = 'none';
            applyFilters();
        });
    }

    // Filter Pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            const filterType = pill.getAttribute('data-filter');
            const filterVal = pill.getAttribute('data-val');

            if (filterType === 'city') {
                document.querySelectorAll('.filter-pill[data-filter="city"]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilters.city = filterVal;
            } else if (filterType === 'cat') {
                document.querySelectorAll('.filter-pill[data-filter="cat"]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentFilters.category = filterVal;
            } else if (filterType === 'contact') {
                if (pill.classList.contains('active')) {
                    pill.classList.remove('active');
                    currentFilters.contact = 'all';
                } else {
                    document.querySelectorAll('.filter-pill[data-filter="contact"]').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    currentFilters.contact = filterVal;
                }
            }
            applyFilters();
        });
    });

    // Reset Filter Button
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters = { search: '', city: 'all', category: 'all', contact: 'all' };
            if (searchInput) searchInput.value = '';
            if (clearBtn) clearBtn.style.display = 'none';
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            document.querySelector('.filter-pill[data-filter="city"][data-val="all"]')?.classList.add('active');
            document.querySelector('.filter-pill[data-filter="cat"][data-val="all"]')?.classList.add('active');
            applyFilters();
        });
    }

    // Detail Drawer Close
    const drawerOverlay = document.getElementById('detail-drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');
    if (drawerClose && drawerOverlay) {
        drawerClose.addEventListener('click', () => { drawerOverlay.style.display = 'none'; });
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) drawerOverlay.style.display = 'none';
        });
    }

    // Pitch Modal Close
    const modalOverlay = document.getElementById('outreach-modal');
    const modalClose = document.getElementById('modal-close');
    const openPitchBtn = document.getElementById('open-outreach-modal');
    if (openPitchBtn && modalOverlay) {
        openPitchBtn.addEventListener('click', () => openPitchModal());
    }
    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', () => { modalOverlay.style.display = 'none'; });
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.style.display = 'none';
        });
    }

    // Modal select change
    const firmSelect = document.getElementById('modal-firm-select');
    if (firmSelect) {
        firmSelect.addEventListener('change', updatePitchDraft);
    }
    const senderInput = document.getElementById('pitch-sender-name');
    if (senderInput) {
        senderInput.addEventListener('input', updatePitchDraft);
    }
    const portfolioInput = document.getElementById('pitch-portfolio-url');
    if (portfolioInput) {
        portfolioInput.addEventListener('input', updatePitchDraft);
    }

    // Copy Pitch Button
    const copyPitchBtn = document.getElementById('copy-pitch-btn');
    if (copyPitchBtn) {
        copyPitchBtn.addEventListener('click', () => {
            const textarea = document.getElementById('pitch-body-text');
            textarea.select();
            navigator.clipboard.writeText(textarea.value).then(() => {
                showToast('Pitch copied to clipboard! 💌');
            });
        });
    }
}

// ==========================================================================
// 4. DATA FETCHING & RENDERING
// ==========================================================================
async function fetchLeads() {
    try {
        const response = await fetch('/api/leads');
        if (!response.ok) throw new Error('Network error loading leads');
        const data = await response.json();
        
        allLeads = data.leads || [];
        updateMetrics(data.stats || {});
        applyFilters();
        showToast(`Loaded ${allLeads.length} commercial & set design studios! 🌸`);
    } catch (err) {
        console.warn('API error, attempting local data fallback...', err);
        // Direct fallback to data/leads.json if static
        try {
            const fallbackRes = await fetch('./data/leads.json');
            if (fallbackRes.ok) {
                allLeads = await fallbackRes.json();
                applyFilters();
                return;
            }
        } catch (e) {
            console.error('Fallback failed', e);
        }
        showToast('Could not load live leads, retrying...', 3000);
    }
}

function updateMetrics(stats) {
    document.getElementById('stat-total').textContent = stats.total || allLeads.length;
    document.getElementById('stat-pune').textContent = stats.puneCount || allLeads.filter(l => l.city === 'Pune').length;
    document.getElementById('stat-mumbai').textContent = stats.mumbaiCount || allLeads.filter(l => l.city === 'Mumbai').length;
    document.getElementById('stat-hr').textContent = stats.directHrCount || allLeads.filter(l => (l.confidence || '').includes('Direct HR')).length;
}

function applyFilters() {
    let result = [...allLeads];

    // City Filter
    if (currentFilters.city !== 'all') {
        result = result.filter(l => (l.city || '').toLowerCase() === currentFilters.city.toLowerCase());
    }

    // Category Filter
    if (currentFilters.category !== 'all') {
        result = result.filter(l => (l.category || '').toLowerCase().includes(currentFilters.category.toLowerCase()));
    }

    // Contact Filter
    if (currentFilters.contact === 'direct_hr') {
        result = result.filter(l => (l.confidence || '').includes('Direct HR'));
    } else if (currentFilters.contact === 'has_email') {
        result = result.filter(l => Boolean(l.email && l.email.includes('@')));
    }

    // Search Query
    if (currentFilters.search) {
        const q = currentFilters.search.toLowerCase();
        result = result.filter(l => 
            (l.name || '').toLowerCase().includes(q) ||
            (l.what_firm_does || '').toLowerCase().includes(q) ||
            (l.address || '').toLowerCase().includes(q) ||
            (l.sub_category || '').toLowerCase().includes(q) ||
            (l.software_skills || '').toLowerCase().includes(q)
        );
    }

    filteredLeads = result;
    renderTable(filteredLeads);

    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = `Showing ${filteredLeads.length} of ${allLeads.length} verified studios`;

    const emptyEl = document.getElementById('empty-state');
    const tableEl = document.getElementById('leads-table');
    if (emptyEl && tableEl) {
        if (filteredLeads.length === 0) {
            emptyEl.style.display = 'block';
            tableEl.style.display = 'none';
        } else {
            emptyEl.style.display = 'none';
            tableEl.style.display = 'table';
        }
    }
}

function renderTable(leads) {
    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    leads.forEach((firm, index) => {
        const tr = document.createElement('tr');
        
        // City badge class
        const cityClass = firm.city === 'Pune' ? 'city-pune' : 'city-mumbai';
        const cityIcon = firm.city === 'Pune' ? '📍' : '🎬';

        // Category Tag
        let catClass = 'tag-workspace';
        if (firm.category.includes('Hospitality')) catClass = 'tag-hospitality';
        else if (firm.category.includes('Set')) catClass = 'tag-setdesign';
        else if (firm.category.includes('Exhibition')) catClass = 'tag-exhibition';

        // Direct HR Star
        const hrBadge = (firm.confidence || '').includes('Direct HR') 
            ? '<i class="fa-solid fa-star hr-star" title="Direct HR / Career Contact Verified"></i>' 
            : '';

        tr.innerHTML = `
            <td class="col-id">${index + 1}</td>
            <td class="firm-name-cell">
                <div class="name-title">${firm.name} ${hrBadge}</div>
                <div class="name-sub">${firm.sub_category || ''}</div>
            </td>
            <td>
                <span class="city-pill ${cityClass}">${cityIcon} ${firm.city}</span>
                <span class="locality-text">${extractLocality(firm.address)}</span>
            </td>
            <td>
                <span class="category-tag ${catClass}">${firm.category}</span>
            </td>
            <td class="contact-cell">
                ${firm.email ? `<a href="mailto:${firm.email}" class="contact-link" onclick="event.stopPropagation();"><i class="fa-solid fa-envelope"></i> ${firm.email}</a>` : '<span style="color:#aaa;">No email listed</span>'}
                ${firm.phone ? `<a href="tel:${firm.phone.replace(/[^0-9+]/g, '')}" class="contact-link" onclick="event.stopPropagation();"><i class="fa-solid fa-phone"></i> ${firm.phone}</a>` : ''}
            </td>
            <td class="links-cell" onclick="event.stopPropagation();">
                ${firm.website ? `<a href="${firm.website}" target="_blank" rel="noopener noreferrer" class="icon-link link-web" title="Visit Website"><i class="fa-solid fa-globe"></i></a>` : ''}
                ${firm.linkedin ? `<a href="${firm.linkedin}" target="_blank" rel="noopener noreferrer" class="icon-link link-in" title="LinkedIn Profile"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
            </td>
            <td>
                <div class="desc-text" title="${escapeHtml(firm.what_firm_does)}">${firm.what_firm_does}</div>
            </td>
            <td class="intern-cell">
                <div class="intern-timeline"><i class="fa-regular fa-calendar-check"></i> Dec 26 - Apr 26</div>
                <div class="software-pills">${firm.software_skills ? `Skills: ${firm.software_skills}` : ''}</div>
            </td>
            <td style="text-align: center;" onclick="event.stopPropagation();">
                <button class="btn-pitch" onclick="openPitchModalForFirm(${firm.id})">
                    <i class="fa-solid fa-paper-plane"></i> Pitch
                </button>
            </td>
        `;

        // Row click opens Drawer
        tr.addEventListener('click', () => openDrawer(firm));
        tbody.appendChild(tr);
    });
}

function extractLocality(address) {
    if (!address) return '';
    const parts = address.split(',');
    if (parts.length > 1) {
        return parts[parts.length - 2].trim();
    }
    return address.substring(0, 24);
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/"/g, '&quot;');
}

// ==========================================================================
// 5. DETAIL DRAWER (SLIDE-IN)
// ==========================================================================
function openDrawer(firm) {
    const overlay = document.getElementById('detail-drawer-overlay');
    const content = document.getElementById('drawer-content');
    if (!overlay || !content) return;

    const cityClass = firm.city === 'Pune' ? 'city-pune' : 'city-mumbai';

    content.innerHTML = `
        <div class="drawer-header">
            <div class="drawer-badges">
                <span class="city-pill ${cityClass}">${firm.city}</span>
                <span class="category-tag tag-workspace">${firm.category}</span>
            </div>
            <h2 class="drawer-title">${firm.name}</h2>
            <div class="drawer-sub">${firm.sub_category || ''}</div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-building"></i> About The Practice</h4>
            <div class="drawer-info-card">
                <p>${firm.what_firm_does}</p>
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-graduation-cap"></i> Internship Program Scope</h4>
            <div class="drawer-info-card">
                <p><strong>Timeline:</strong> Starting December 2026 through March/April 2026 (Winter to Spring)</p>
                <p style="margin-top:6px;"><strong>Details:</strong> ${firm.internship_details || 'Hands-on project work, site visits, and client presentations.'}</p>
                ${firm.stipend_range ? `<p style="margin-top:6px; color:#ad1457;"><strong>Expected Stipend:</strong> ${firm.stipend_range}</p>` : ''}
                ${firm.software_skills ? `<p style="margin-top:6px; font-size:0.84rem; color:#6e4857;"><strong>Key Tools:</strong> ${firm.software_skills}</p>` : ''}
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-address-book"></i> Direct Outreach Contacts</h4>
            <div class="drawer-contacts-list">
                ${firm.email ? `
                    <a href="mailto:${firm.email}" class="drawer-contact-item">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Primary Email: ${firm.email}</span>
                    </a>
                ` : ''}
                ${firm.alt_email ? `
                    <a href="mailto:${firm.alt_email}" class="drawer-contact-item">
                        <i class="fa-solid fa-at"></i>
                        <span>Alternative / Careers: ${firm.alt_email}</span>
                    </a>
                ` : ''}
                ${firm.phone ? `
                    <a href="tel:${firm.phone.replace(/[^0-9+]/g, '')}" class="drawer-contact-item">
                        <i class="fa-solid fa-phone"></i>
                        <span>Phone / WhatsApp: ${firm.phone}</span>
                    </a>
                ` : ''}
                ${firm.website ? `
                    <a href="${firm.website}" target="_blank" rel="noopener noreferrer" class="drawer-contact-item">
                        <i class="fa-solid fa-globe"></i>
                        <span>Website Portfolio: ${firm.website}</span>
                    </a>
                ` : ''}
                ${firm.linkedin ? `
                    <a href="${firm.linkedin}" target="_blank" rel="noopener noreferrer" class="drawer-contact-item">
                        <i class="fa-brands fa-linkedin"></i>
                        <span>LinkedIn Page: View Team</span>
                    </a>
                ` : ''}
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-location-dot"></i> Studio Location</h4>
            <div class="drawer-info-card">
                <p>${firm.address}</p>
            </div>
        </div>

        <button class="drawer-pitch-cta" onclick="openPitchModalForFirm(${firm.id})">
            <i class="fa-solid fa-paper-plane"></i> Generate Outreach Email for ${firm.name}
        </button>
    `;

    overlay.style.display = 'flex';
}

// ==========================================================================
// 6. SMART OUTREACH EMAIL PITCH GENERATOR
// ==========================================================================
function openPitchModal() {
    if (allLeads.length === 0) return;
    openPitchModalForFirm(allLeads[0].id);
}

function openPitchModalForFirm(firmId) {
    const modal = document.getElementById('outreach-modal');
    const select = document.getElementById('modal-firm-select');
    if (!modal || !select) return;

    // Populate Select Options
    select.innerHTML = allLeads.map(f => `
        <option value="${f.id}" ${f.id === firmId ? 'selected' : ''}>[${f.city}] ${f.name} — ${f.category}</option>
    `).join('');

    updatePitchDraft();
    modal.style.display = 'flex';
}

function updatePitchDraft() {
    const select = document.getElementById('modal-firm-select');
    const senderName = document.getElementById('pitch-sender-name').value.trim() || 'Your Name';
    const portfolioUrl = document.getElementById('pitch-portfolio-url').value.trim();
    
    const firmId = parseInt(select.value, 10);
    const firm = allLeads.find(f => f.id === firmId);
    if (!firm) return;

    const isSetDesign = firm.category.includes('Set') || firm.category.includes('Exhibition');
    const roleTitle = isSetDesign ? 'Set Design / Art Direction Intern' : 'Commercial Interior Design Intern';

    const subject = `Application for ${roleTitle} (Dec 2026 – Apr 2026) – ${senderName}`;
    document.getElementById('pitch-subject-text').textContent = subject;

    let body = `Dear ${firm.name} Design Team,\n\n`;
    body += `I hope this email finds you well.\n\n`;
    body += `I am writing to express my strong interest in joining ${firm.name} as a ${roleTitle} for the upcoming winter/spring internship term (available starting December 2026 through March/April 2026).\n\n`;
    
    if (isSetDesign) {
        body += `I have long admired your studio's innovative spatial storytelling, scenic environments, and production design. The way your team creates evocative physical sets and spatial atmospheres is truly inspiring to me.\n\n`;
    } else {
        body += `I have been following ${firm.name}'s commercial portfolio with great enthusiasm, particularly your thoughtful approach to modern workplaces, material textures, and human-centric commercial environments in ${firm.city}.\n\n`;
    }

    body += `I bring strong foundational proficiency in 2D drafting, 3D modeling, and moodboard visual development (${firm.software_skills || 'AutoCAD, SketchUp, 3ds Max/Rhino, and Adobe Creative Suite'}). I am eager to contribute actively to your ongoing projects, working drawings, site coordination, and client presentations.\n\n`;

    if (portfolioUrl) {
        body += `You can review my selected academic and spatial design projects in my portfolio here:\n${portfolioUrl}\n\n`;
    } else {
        body += `I have attached my curated PDF portfolio and resume for your review.\n\n`;
    }

    body += `I would welcome the opportunity to discuss how my passion and skills can support ${firm.name}'s upcoming projects. Thank you very much for your time and consideration!\n\n`;
    body += `Warm regards,\n${senderName}\nEmail: [Your Email]\nPhone: [Your Phone Number]`;

    document.getElementById('pitch-body-text').value = body;

    // Setup Mailto Link
    const mailtoBtn = document.getElementById('pitch-mailto-btn');
    if (mailtoBtn && firm.email) {
        const encodedSub = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        mailtoBtn.href = `mailto:${firm.email}?subject=${encodedSub}&body=${encodedBody}`;
    }
}

// ==========================================================================
// 7. CSV EXPORT ENGINE
// ==========================================================================
function exportCSV() {
    if (filteredLeads.length === 0) {
        showToast('No leads available to export!');
        return;
    }

    const headers = [
        'ID',
        'Firm Name',
        'City',
        'Category',
        'Specialization',
        'Website',
        'Email',
        'Alternative Email',
        'Phone Number',
        'LinkedIn',
        'Address',
        'What The Firm Does',
        'Internship Program Details',
        'Software Required',
        'Stipend Range',
        'Verification Status'
    ];

    const rows = filteredLeads.map(l => [
        l.id,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.city}"`,
        `"${l.category}"`,
        `"${(l.sub_category || '').replace(/"/g, '""')}"`,
        `"${l.website || ''}"`,
        `"${l.email || ''}"`,
        `"${l.alt_email || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.linkedin || ''}"`,
        `"${(l.address || '').replace(/"/g, '""')}"`,
        `"${(l.what_firm_does || '').replace(/"/g, '""')}"`,
        `"${(l.internship_details || '').replace(/"/g, '""')}"`,
        `"${(l.software_skills || '').replace(/"/g, '""')}"`,
        `"${l.stipend_range || ''}"`,
        `"${l.confidence || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `interior_set_design_internships_pune_mumbai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredLeads.length} leads to CSV spreadsheet! 📄`);
}

// ==========================================================================
// 8. CUTE TOAST NOTIFICATION
// ==========================================================================
function showToast(message, duration = 2500) {
    const toast = document.getElementById('cute-toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
