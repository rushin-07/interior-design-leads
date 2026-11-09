// ==========================================================================
// STUDIO SCOUT: MINIMALIST & PROFESSIONAL ENGINE
// ==========================================================================

let allLeads = [];
let filteredLeads = [];
let currentFilters = {
    search: '',
    city: 'all',
    category: 'all',
    contact: 'all'
};

// Encouraging application cheer messages (Playful, motivating, featuring QT😘)
const ENCOURAGING_QUOTES = [
    "Good luck QT😘! ✨",
    "You're going to crush these applications! 💼",
    "Top design studios in Pune & Mumbai await! 🏢",
    "Your portfolio is looking top tier, QT😘! 🎨",
    "Winter/Spring 2026 spots are open for you, QT😘! 🚀",
    "Go get that dream studio role, QT😘! 🌟",
    "One pitch at a time, you've got this QT😘! ✨",
    "Commercial design powerhouse QT😘! 💥💣🌶️"
];
let currentQuoteIdx = 0;

// Initialize on Load (Immediate Open - No Passcode)
document.addEventListener('DOMContentLoaded', () => {
    fetchLeads();
    setupEventListeners();
    setupMascotAndCharm();
    setupClickSparkles();
});

// ==========================================================================
// 1. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
    // Sync Button
    const syncBtn = document.getElementById('sync-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            syncBtn.classList.add('fa-spin');
            fetchLeads().finally(() => {
                setTimeout(() => syncBtn.classList.remove('fa-spin'), 500);
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
        pill.addEventListener('click', () => {
            pill.classList.add('jelly-pop');
            setTimeout(() => pill.classList.remove('jelly-pop'), 450);

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
        copyPitchBtn.addEventListener('click', (e) => {
            const textarea = document.getElementById('pitch-body-text');
            textarea.select();
            navigator.clipboard.writeText(textarea.value).then(() => {
                const rect = copyPitchBtn.getBoundingClientRect();
                triggerSymbolBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
                showToast('Application draft copied! 📋');
            });
        });
    }
}

// ==========================================================================
// 3. DATA FETCHING & RENDERING
// ==========================================================================
async function fetchLeads() {
    try {
        const response = await fetch('/api/leads');
        if (!response.ok) throw new Error('API offline, loading local source');
        const data = await response.json();
        
        allLeads = data.leads || [];
        updateMetrics(data.stats || {});
        applyFilters();
        showToast(`Loaded ${allLeads.length} commercial studios.`);
    } catch (err) {
        try {
            const fallbackRes = await fetch('./data/leads.json');
            if (fallbackRes.ok) {
                allLeads = await fallbackRes.json();
                applyFilters();
                updateMetrics({});
                showToast(`Loaded ${allLeads.length} commercial studios.`);
                return;
            }
        } catch (e) {
            console.error('Fallback read error', e);
        }
        showToast('Connecting to database...');
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
    if (countEl) countEl.textContent = `Showing ${filteredLeads.length} of ${allLeads.length} studios`;

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

function getLinkedInUrl(firm) {
    if (firm.linkedin && typeof firm.linkedin === 'string' && firm.linkedin.startsWith('http')) {
        return firm.linkedin;
    }
    const query = encodeURIComponent(`${firm.name || ''} ${firm.city || ''}`);
    return `https://www.linkedin.com/search/results/all/?keywords=${query}`;
}

function renderTable(leads) {
    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    leads.forEach((firm, index) => {
        const tr = document.createElement('tr');
        tr.className = 'table-row-animate';
        tr.style.animationDelay = `${Math.min(index * 22, 500)}ms`;
        
        const cityClass = firm.city === 'Pune' ? 'city-pune' : 'city-mumbai';

        let catClass = 'tag-workspace';
        if (firm.category.includes('Hospitality')) catClass = 'tag-hospitality';
        else if (firm.category.includes('Set')) catClass = 'tag-setdesign';
        else if (firm.category.includes('Exhibition')) catClass = 'tag-exhibition';

        const hrBadge = (firm.confidence || '').includes('Direct HR') 
            ? '<i class="fa-solid fa-star hr-star" title="Direct HR Verified"></i>' 
            : '';

        const liUrl = getLinkedInUrl(firm);

        tr.innerHTML = `
            <td class="col-id">${index + 1}</td>
            <td class="firm-name-cell">
                <div class="name-title">${firm.name} ${hrBadge}</div>
                <div class="name-sub">${firm.sub_category || ''}</div>
            </td>
            <td>
                <span class="city-pill ${cityClass}">${firm.city}</span>
                <span class="locality-text">${extractLocality(firm.address)}</span>
            </td>
            <td>
                <span class="category-tag ${catClass}">${firm.category}</span>
            </td>
            <td class="contact-cell">
                ${firm.email ? `<a href="mailto:${firm.email}" class="contact-link" onclick="event.stopPropagation();"><i class="fa-solid fa-envelope"></i> ${firm.email}</a>` : '<span style="color:#aaa;">Direct portal</span>'}
                ${firm.phone ? `<a href="tel:${firm.phone.replace(/[^0-9+]/g, '')}" class="contact-link" onclick="event.stopPropagation();"><i class="fa-solid fa-phone"></i> ${firm.phone}</a>` : ''}
            </td>
            <td class="links-cell" onclick="event.stopPropagation();">
                ${firm.website ? `<a href="${firm.website}" target="_blank" rel="noopener noreferrer" class="icon-link" title="Website"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                <a href="${liUrl}" target="_blank" rel="noopener noreferrer" class="icon-link" title="LinkedIn Profile"><i class="fa-brands fa-linkedin-in"></i></a>
            </td>
            <td>
                <div class="desc-text" title="${escapeHtml(firm.what_firm_does)}">${firm.what_firm_does}</div>
            </td>
            <td class="intern-cell">
                <div class="intern-timeline">Dec 2026 – Apr 2026</div>
                <div class="software-pills">${firm.software_skills ? `Tools: ${firm.software_skills}` : ''}</div>
            </td>
            <td style="text-align: center;" onclick="event.stopPropagation();">
                <button class="btn-pitch" onclick="openPitchModalForFirm(${firm.id})">
                    <i class="fa-solid fa-paper-plane"></i> Draft
                </button>
            </td>
        `;

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
// 4. DETAIL DRAWER (SLIDE-IN)
// ==========================================================================
function openDrawer(firm) {
    const overlay = document.getElementById('detail-drawer-overlay');
    const content = document.getElementById('drawer-content');
    if (!overlay || !content) return;

    const cityClass = firm.city === 'Pune' ? 'city-pune' : 'city-mumbai';
    const liUrl = getLinkedInUrl(firm);

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
            <h4 class="drawer-section-title"><i class="fa-solid fa-briefcase"></i> Practice Profile</h4>
            <div class="drawer-info-card">
                <p>${firm.what_firm_does}</p>
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-layer-group"></i> Internship Scope & Skills</h4>
            <div class="drawer-info-card">
                <p><strong>Timeline:</strong> December 2026 through March/April 2026</p>
                <p style="margin-top:6px;"><strong>Details:</strong> ${firm.internship_details || 'Working drawings, site visits, and client presentations.'}</p>
                ${firm.stipend_range ? `<p style="margin-top:6px; color:var(--accent-blush);"><strong>Stipend Range:</strong> ${firm.stipend_range}</p>` : ''}
                ${firm.software_skills ? `<p style="margin-top:6px; font-size:0.82rem; color:var(--text-secondary);"><strong>Key Software:</strong> ${firm.software_skills}</p>` : ''}
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-address-card"></i> Contact Information</h4>
            <div class="drawer-contacts-list">
                ${firm.email ? `
                    <a href="mailto:${firm.email}" class="drawer-contact-item">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Email: ${firm.email}</span>
                    </a>
                ` : ''}
                ${firm.alt_email ? `
                    <a href="mailto:${firm.alt_email}" class="drawer-contact-item">
                        <i class="fa-solid fa-at"></i>
                        <span>Careers Inbox: ${firm.alt_email}</span>
                    </a>
                ` : ''}
                ${firm.phone ? `
                    <a href="tel:${firm.phone.replace(/[^0-9+]/g, '')}" class="drawer-contact-item">
                        <i class="fa-solid fa-phone"></i>
                        <span>Direct: ${firm.phone}</span>
                    </a>
                ` : ''}
                ${firm.website ? `
                    <a href="${firm.website}" target="_blank" rel="noopener noreferrer" class="drawer-contact-item">
                        <i class="fa-solid fa-globe"></i>
                        <span>Portfolio: ${firm.website}</span>
                    </a>
                ` : ''}
                <a href="${liUrl}" target="_blank" rel="noopener noreferrer" class="drawer-contact-item">
                    <i class="fa-brands fa-linkedin"></i>
                    <span>LinkedIn Directory / Profile</span>
                </a>
            </div>
        </div>

        <div class="drawer-section">
            <h4 class="drawer-section-title"><i class="fa-solid fa-location-dot"></i> Studio Location</h4>
            <div class="drawer-info-card">
                <p>${firm.address}</p>
            </div>
        </div>

        <button class="drawer-pitch-cta" onclick="openPitchModalForFirm(${firm.id})">
            <i class="fa-solid fa-paper-plane"></i> Draft Application for ${firm.name}
        </button>
    `;

    overlay.style.display = 'flex';
}

// ==========================================================================
// 5. TAILORED PITCH DRAFTER
// ==========================================================================
function openPitchModal() {
    if (allLeads.length === 0) return;
    openPitchModalForFirm(allLeads[0].id);
}

function openPitchModalForFirm(firmId) {
    const modal = document.getElementById('outreach-modal');
    const select = document.getElementById('modal-firm-select');
    if (!modal || !select) return;

    select.innerHTML = allLeads.map(f => `
        <option value="${f.id}" ${f.id === firmId ? 'selected' : ''}>[${f.city}] ${f.name} — ${f.category}</option>
    `).join('');

    updatePitchDraft();
    modal.style.display = 'flex';
}

function updatePitchDraft() {
    const select = document.getElementById('modal-firm-select');
    const senderName = document.getElementById('pitch-sender-name').value.trim() || 'Applicant';
    const portfolioUrl = document.getElementById('pitch-portfolio-url').value.trim();
    
    const firmId = parseInt(select.value, 10);
    const firm = allLeads.find(f => f.id === firmId);
    if (!firm) return;

    const isSetDesign = firm.category.includes('Set') || firm.category.includes('Exhibition');
    const roleTitle = isSetDesign ? 'Set Design / Production Design Intern' : 'Commercial Interior Design Intern';

    const subject = `Internship Application: ${roleTitle} (Dec 2026 – Apr 2026) – ${senderName}`;
    document.getElementById('pitch-subject-text').textContent = subject;

    let body = `Dear ${firm.name} Design Team,\n\n`;
    body += `I hope this email finds you well.\n\n`;
    body += `I am writing to express my interest in joining ${firm.name} as a ${roleTitle} for the upcoming winter/spring internship cycle (available starting December 2026 through March/April 2026).\n\n`;
    
    if (isSetDesign) {
        body += `I have closely followed your studio's spatial environments, scenic fabrication, and production design. The precision and creative scale of your work is deeply inspiring to me.\n\n`;
    } else {
        body += `I have been following ${firm.name}'s commercial architecture and workplace portfolio with great appreciation, particularly your thoughtful approach to contemporary commercial spaces in ${firm.city}.\n\n`;
    }

    body += `My technical skillset covers 2D CAD drafting, 3D spatial modeling, and rendering (${firm.software_skills || 'AutoCAD, SketchUp, 3ds Max / Rhino, and Adobe Creative Suite'}). I am eager to contribute proactively to working drawings, design iterations, and site coordination.\n\n`;

    if (portfolioUrl) {
        body += `You can review my selected academic and spatial design projects in my portfolio here:\n${portfolioUrl}\n\n`;
    } else {
        body += `I have attached my curated PDF portfolio and CV for your review.\n\n`;
    }

    body += `I would welcome the opportunity to discuss how I can support ${firm.name}'s upcoming projects. Thank you for your time and consideration.\n\n`;
    body += `Sincerely,\n${senderName}\nEmail: [Your Email]\nPhone: [Your Phone Number]`;

    document.getElementById('pitch-body-text').value = body;

    const mailtoBtn = document.getElementById('pitch-mailto-btn');
    if (mailtoBtn && firm.email) {
        const encodedSub = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        mailtoBtn.href = `mailto:${firm.email}?subject=${encodedSub}&body=${encodedBody}`;
    }
}

// ==========================================================================
// 6. CSV EXPORT ENGINE
// ==========================================================================
function exportCSV() {
    if (filteredLeads.length === 0) {
        showToast('No leads to export.');
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
        'Scope of Practice',
        'Internship Program Details',
        'Software Required',
        'Stipend Range',
        'Status'
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
    link.setAttribute('download', `commercial_interior_set_design_studios_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSymbolBurst(window.innerWidth / 2, 80);
    showToast(`Exported ${filteredLeads.length} studios to CSV.`);
}

// ==========================================================================
// 7. TOAST NOTIFICATION
// ==========================================================================
function showToast(message, duration = 2200) {
    const toast = document.getElementById('cute-toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ==========================================================================
// 8. CUTE MASCOT & CHARM INTERACTION (💣🌶️)
// ==========================================================================
function setupMascotAndCharm() {
    // 1. Top Nav Symbol Mascot Pill
    const mascotBtn = document.getElementById('symbol-mascot');
    if (mascotBtn) {
        mascotBtn.addEventListener('click', (e) => {
            const rect = mascotBtn.getBoundingClientRect();
            triggerSymbolBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            showToast('Energy boosted! ⚡');
        });
    }

    // 2. Hero Section Symbol Tag Pill
    const heroPill = document.getElementById('hero-symbol-pill');
    if (heroPill) {
        heroPill.addEventListener('click', (e) => {
            const rect = heroPill.getBoundingClientRect();
            triggerSymbolBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            showToast('Special Edition active! ✨');
        });
    }

    // 3. Floating Bottom Charm Companion
    const charmFab = document.getElementById('cute-charm-fab');
    const charmBubble = document.getElementById('charm-bubble');
    const charmMessage = document.getElementById('charm-message');

    if (charmFab) {
        charmFab.addEventListener('click', (e) => {
            const rect = charmFab.getBoundingClientRect();
            triggerSymbolBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

            // Cycle encouraging message with a playful pop animation
            currentQuoteIdx = (currentQuoteIdx + 1) % ENCOURAGING_QUOTES.length;
            if (charmMessage) {
                charmMessage.textContent = ENCOURAGING_QUOTES[currentQuoteIdx];
            }
            if (charmBubble) {
                charmBubble.style.animation = 'none';
                void charmBubble.offsetWidth; // Trigger reflow for animation restart
                charmBubble.style.animation = 'bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    }
}

// ==========================================================================
// 9. DELIGHTFUL SYMBOL PARTICLE BURST (💣🌶️)
// ==========================================================================
function triggerSymbolBurst(originX, originY) {
    // 1. Canvas Confetti (blush & warm embers)
    if (typeof confetti === 'function') {
        try {
            confetti({
                particleCount: 30,
                spread: 65,
                origin: {
                    x: originX !== undefined ? originX / window.innerWidth : 0.9,
                    y: originY !== undefined ? originY / window.innerHeight : 0.9
                },
                colors: ['#c75677', '#ff6b8b', '#ff4757', '#ffa502', '#2f3542', '#ffffff']
            });
        } catch (err) {
            console.debug('Confetti canvas unavailable', err);
        }
    }

    // 2. Flying DOM Particle Emojis (💣 and 🌶️ and QT😘 with sparkles)
    const startX = originX !== undefined ? originX : (window.innerWidth - 60);
    const startY = originY !== undefined ? originY : (window.innerHeight - 60);
    const symbols = ['💣', '🌶️', 'QT😘', '✨', '💣', '🌶️', 'QT😘', '⭐', '💫'];

    for (let i = 0; i < 9; i++) {
        const p = document.createElement('div');
        p.className = 'flying-symbol-particle';
        p.textContent = symbols[i % symbols.length];
        p.style.left = `${startX + (Math.random() * 30 - 15)}px`;
        p.style.top = `${startY + (Math.random() * 30 - 15)}px`;

        const vx = (Math.random() * 160 - 80) + 'px';
        const vy = -(Math.random() * 110 + 60) + 'px';
        const rot = (Math.random() * 90 - 45) + 'deg';

        p.style.setProperty('--vx', vx);
        p.style.setProperty('--vy', vy);
        p.style.setProperty('--rot', rot);

        document.body.appendChild(p);

        setTimeout(() => {
            if (p.parentNode) {
                p.parentNode.removeChild(p);
            }
        }, 1450);
    }
}

// ==========================================================================
// 10. INTERACTIVE CLICK SPARKLE TRAIL (FEATURING QT😘 & 💣🌶️)
// ==========================================================================
function setupClickSparkles() {
    const sparkles = ['✨', '⭐', 'QT😘', '💣', '🌶️', '💫', '🌸'];
    let lastSparkleTime = 0;

    document.addEventListener('pointerdown', (e) => {
        // Prevent interfering with input typing
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const now = Date.now();
        if (now - lastSparkleTime < 70) return;
        lastSparkleTime = now;

        const count = 3;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'click-micro-sparkle';
            spark.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            
            const offsetX = (Math.random() * 24 - 12);
            const offsetY = (Math.random() * 24 - 12);
            spark.style.left = `${e.clientX + offsetX}px`;
            spark.style.top = `${e.clientY + offsetY}px`;

            const vx = (Math.random() * 50 - 25) + 'px';
            const vy = -(Math.random() * 40 + 25) + 'px';
            spark.style.setProperty('--svx', vx);
            spark.style.setProperty('--svy', vy);

            document.body.appendChild(spark);
            setTimeout(() => {
                if (spark.parentNode) spark.parentNode.removeChild(spark);
            }, 750);
        }
    }, { passive: true });
}
