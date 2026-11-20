/**
 * Hospitality Studios Dashboard — Minimalist & Standout Mumbai Studios
 * Dedicated Dashboard for high-concept restaurants, cafes, bars & boutique hospitality
 */

let allStudios = [];
let filteredStudios = [];
let activeFilters = {
  subGenre: 'all',
  neighborhood: 'all',
  confidence: 'all'
};
let searchQuery = '';

// Mascot encouraging quotes
const mascotQuotes = [
  "You're going to crush these applications! 💼💣🌶️",
  "Top design studios in Mumbai await! 🏢✨",
  "Minimalist, standout portfolios lead the industry! 📐",
  "Your portfolio is going to turn heads! 🎨🌶️",
  "Craft-centric spaces and slow architecture inspire! 🏛️",
  "Keep building that dream career, one studio at a time! 🚀",
  "Tactile materials & sculptural lighting make spaces sing! 💡💣",
  "Confidence and precision win every interview! 🌟"
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  loadHospitalityData();
  setupEventListeners();
  initMascotCompanion();
  
  // Show surprise modal on page load
  setTimeout(() => {
    openSurpriseModal();
    fireConfetti();
  }, 350);
});

// Load JSON data
async function loadHospitalityData() {
  try {
    const res = await fetch('data/hospitality_leads.json');
    if (!res.ok) throw new Error('Network response not ok');
    allStudios = await res.json();
  } catch (err) {
    console.warn('Falling back to local data copy or relative path:', err);
    try {
      const res2 = await fetch('./data/hospitality_leads.json');
      allStudios = await res2.json();
    } catch (e) {
      console.error('Failed to load hospitality data:', e);
    }
  }
  
  filteredStudios = [...allStudios];
  updateMetricsDisplay();
  renderStudioCards();
}

// Update Metric Counters
function updateMetricsDisplay() {
  const total = allStudios.length;
  const verifiedHr = allStudios.filter(s => (s.confidence || '').includes('Direct HR')).length;
  
  const elTotal = document.getElementById('metric-total');
  const elHr = document.getElementById('metric-hr');
  const elProjects = document.getElementById('metric-projects');
  const elStipend = document.getElementById('metric-stipend');
  const elCount = document.getElementById('results-count-text');
  
  if (elTotal) elTotal.textContent = total;
  if (elHr) elHr.textContent = verifiedHr;
  if (elProjects) elProjects.textContent = '45+';
  if (elStipend) elStipend.textContent = '₹12k';
  if (elCount) elCount.textContent = filteredStudios.length;
}

// Render Studio Cards
function renderStudioCards() {
  const container = document.getElementById('studios-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!container) return;
  
  if (filteredStudios.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (emptyState) emptyState.style.display = 'none';
  
  container.innerHTML = filteredStudios.map((studio, idx) => {
    const skillsList = (studio.software_skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 4);
      
    const isDirectHr = (studio.confidence || '').includes('Direct HR');
    
    return `
      <article class="studio-card" style="animation-delay: ${idx * 0.04}s;">
        ${studio.reference_badge ? `
        <div class="card-reference-badge">
          <i class="fa-solid fa-star"></i> ${escapeHtml(studio.reference_badge)}
        </div>
        ` : ''}
        <div class="card-header-top">
          <div class="studio-title-group">
            <h2>
              ${escapeHtml(studio.name)}
              <button class="card-copy-name-btn" onclick="copyText('${escapeJs(studio.name)}', 'Studio name copied!')" title="Copy studio name">
                <i class="fa-regular fa-copy"></i>
              </button>
            </h2>
            <div class="studio-neighborhood-tag">
              <i class="fa-solid fa-location-dot"></i>
              ${escapeHtml(studio.neighborhood || studio.city)}
              ${isDirectHr ? '• <span style="color:#566952;font-weight:600;"><i class="fa-solid fa-circle-check"></i> Verified HR</span>' : ''}
            </div>
          </div>
          <span class="studio-subgenre-badge">${escapeHtml(studio.sub_genre || 'Hospitality')}</span>
        </div>

        <div class="card-aesthetic-highlight">
          <strong>Aesthetic:</strong> ${escapeHtml(studio.aesthetic_profile || '')}
        </div>

        <div class="card-signature-projects">
          <strong>Flagship Work:</strong> ${escapeHtml(studio.signature_projects || '')}
        </div>

        <p class="card-about-body">
          ${escapeHtml(studio.what_firm_does || '')}
        </p>

        <div class="card-tags-cloud">
          ${skillsList.map(skill => `<span class="software-skill-pill">${escapeHtml(skill)}</span>`).join('')}
          <span class="stipend-badge"><i class="fa-solid fa-coins"></i> ${escapeHtml(studio.stipend_range || 'Competitive')}</span>
        </div>

        <div class="card-contact-strip">
          <div class="contact-quick-item">
            <span class="contact-quick-left">
              <i class="fa-solid fa-envelope"></i>
              <span>${escapeHtml(studio.email || 'Inquire via website')}</span>
            </span>
            <button class="copy-mini-btn" onclick="copyText('${escapeJs(studio.email || '')}', 'Email copied!')" title="Copy email">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>

          ${studio.phone ? `
          <div class="contact-quick-item">
            <span class="contact-quick-left">
              <i class="fa-solid fa-phone"></i>
              <span>${escapeHtml(studio.phone)}</span>
            </span>
            <button class="copy-mini-btn" onclick="copyText('${escapeJs(studio.phone)}', 'Phone copied!')" title="Copy phone">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
          ` : ''}

          <div class="contact-quick-item">
            <span class="contact-quick-left">
              <i class="fa-solid fa-globe"></i>
              <span>Official Portfolio</span>
            </span>
            <div style="display:flex;gap:4px;">
              <button class="copy-mini-btn" onclick="copyText('${escapeJs(studio.website || '')}', 'Website link copied!')" title="Copy website link">
                <i class="fa-regular fa-copy"></i>
              </button>
              <a href="${escapeHtml(studio.website || '#')}" target="_blank" rel="noopener noreferrer" class="copy-mini-btn">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit
              </a>
            </div>
          </div>
        </div>

        <div class="card-actions-bar">
          <button class="card-action-btn pitch-btn" onclick="openPitchModal(${studio.id})">
            <i class="fa-solid fa-paper-plane"></i> Draft Pitch
          </button>
          <button class="card-action-btn dossier-btn" onclick="copyStudioDossier(${studio.id})">
            <i class="fa-regular fa-file-lines"></i> Copy Dossier
          </button>
          <a href="${escapeHtml(studio.linkedin || '#')}" target="_blank" rel="noopener noreferrer" class="card-action-icon-link" title="Open LinkedIn Profile">
            <i class="fa-brands fa-linkedin-in"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

// Filter and Search Logic
function applyFilters() {
  const query = searchQuery.toLowerCase().trim();
  
  filteredStudios = allStudios.filter(studio => {
    // Search query match
    if (query) {
      const matchName = (studio.name || '').toLowerCase().includes(query);
      const matchAesthetic = (studio.aesthetic_profile || '').toLowerCase().includes(query);
      const matchProjects = (studio.signature_projects || '').toLowerCase().includes(query);
      const matchAbout = (studio.what_firm_does || '').toLowerCase().includes(query);
      const matchNeighborhood = (studio.neighborhood || '').toLowerCase().includes(query);
      const matchSkills = (studio.software_skills || '').toLowerCase().includes(query);
      
      if (!matchName && !matchAesthetic && !matchProjects && !matchAbout && !matchNeighborhood && !matchSkills) {
        return false;
      }
    }
    
    // Sub-genre / Category filter
    if (activeFilters.subGenre !== 'all') {
      const filterKey = activeFilters.subGenre.toLowerCase();
      const sg = (studio.sub_genre || '').toLowerCase();
      const aesthetic = (studio.aesthetic_profile || '').toLowerCase();
      const projects = (studio.signature_projects || '').toLowerCase();
      const badge = (studio.reference_badge || '').toLowerCase();

      if (filterKey === 'speakeasies') {
        const matches = sg.includes('speakeasy') || sg.includes('cave') || sg.includes('cocktail') || 
                        sg.includes('club') || sg.includes('theatrical') || sg.includes('prohibition') ||
                        badge.includes('ocho') || badge.includes('little easy') || badge.includes('fielia') ||
                        badge.includes('charlee') || badge.includes('bar paradox');
        if (!matches) return false;
      } else if (filterKey === 'slow_spaces') {
        const matches = sg.includes('slow') || sg.includes('tactile') || sg.includes('plaster') || 
                        aesthetic.includes('lime plaster') || aesthetic.includes('slow') ||
                        badge.includes('studio rci') || badge.includes('studio hasta');
        if (!matches) return false;
      } else if (filterKey === 'audiophile_bistros') {
        const matches = sg.includes('audiophile') || sg.includes('bistro') || sg.includes('tapas') || 
                        sg.includes('memphis') || projects.includes('bistro') || projects.includes('listening');
        if (!matches) return false;
      } else if (filterKey === 'heritage') {
        const matches = sg.includes('heritage') || sg.includes('adaptive') || sg.includes('bungalow') || 
                        sg.includes('mill') || projects.includes('heritage') || aesthetic.includes('heritage');
        if (!matches) return false;
      } else if (filterKey === 'parametric') {
        const matches = sg.includes('parametric') || sg.includes('sculptural') || sg.includes('tessellated') ||
                        sg.includes('eco-resort') || aesthetic.includes('sculptural') || aesthetic.includes('parametric');
        if (!matches) return false;
      } else {
        if (!sg.includes(filterKey) && !aesthetic.includes(filterKey) && !badge.includes(filterKey)) return false;
      }
    }
    
    // Neighborhood filter
    if (activeFilters.neighborhood !== 'all') {
      const hood = (studio.neighborhood || '').toLowerCase();
      const filterHood = activeFilters.neighborhood.toLowerCase();
      if (!hood.includes(filterHood)) {
        return false;
      }
    }
    
    // Confidence filter
    if (activeFilters.confidence !== 'all') {
      if (!((studio.confidence || '').includes('Direct HR'))) {
        return false;
      }
    }
    
    return true;
  });
  
  const elCount = document.getElementById('results-count-text');
  if (elCount) elCount.textContent = filteredStudios.length;
  
  renderStudioCards();
}

// Setup Event Listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
      applyFilters();
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      applyFilters();
    });
  }
  
  // Chip button clicks
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const filterGroup = btn.getAttribute('data-filter-group');
      const filterValue = btn.getAttribute('data-filter-val');
      
      document.querySelectorAll(`.filter-chip[data-filter-group="${filterGroup}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (filterGroup === 'subGenre') activeFilters.subGenre = filterValue;
      if (filterGroup === 'neighborhood') activeFilters.neighborhood = filterValue;
      if (filterGroup === 'confidence') activeFilters.confidence = filterValue;
      
      applyFilters();
    });
  });
}

// Universal Copy Helper
async function copyText(text, successMsg = 'Copied to clipboard!') {
  if (!text) {
    showToast('No text available to copy');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMsg);
  }
}

// Toast notification
function showToast(msg) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(msg)}</span>`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease-out';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

// Copy Full Studio Dossier
function copyStudioDossier(studioId) {
  const studio = allStudios.find(s => s.id === studioId);
  if (!studio) return;
  
  const dossier = `STUDIO SCOUT | HOSPITALITY INTERIOR DESIGN DOSSIER
======================================================
Studio Name: ${studio.name}
Neighborhood: ${studio.neighborhood || studio.city}
Aesthetic / Sub-Genre: ${studio.sub_genre}
Website: ${studio.website}
Email: ${studio.email}
Phone: ${studio.phone || 'N/A'}
Address: ${studio.address || 'N/A'}
LinkedIn: ${studio.linkedin}

AESTHETIC PROFILE:
${studio.aesthetic_profile}

SIGNATURE F&B PROJECTS:
${studio.signature_projects}

ABOUT THE PRACTICE:
${studio.what_firm_does}

INTERNSHIP OPPORTUNITY:
${studio.internship_details}

SOFTWARE SKILLS REQUIRED:
${studio.software_skills}

STIPEND RANGE:
${studio.stipend_range}
======================================================`;

  copyText(dossier, `Dossier for ${studio.name} copied!`);
}

// Pitch Drafter Modal
let currentPitchStudio = null;

function openPitchModal(studioId) {
  const studio = allStudios.find(s => s.id === studioId);
  if (!studio) return;
  
  currentPitchStudio = studio;
  
  const modal = document.getElementById('pitch-modal');
  const titleEl = document.getElementById('pitch-studio-title');
  const subjectEl = document.getElementById('pitch-subject');
  const bodyEl = document.getElementById('pitch-body');
  
  if (!modal || !subjectEl || !bodyEl) return;
  
  if (titleEl) titleEl.textContent = `Draft Pitch: ${studio.name}`;
  
  const subject = `Internship Application (Hospitality Interior Design) — Winter/Spring 2026`;
  const body = `Dear ${studio.name} Design Team,

I have been closely following ${studio.name}'s distinctive hospitality projects—most notably your work on ${studio.signature_projects.split(',')[0]}—and admire your mastery over ${studio.aesthetic_profile.toLowerCase().split('.')[0]}.

I am writing to express my strong interest in an Interior Design Internship role for the upcoming Winter/Spring 2026 term. With proficiency in ${studio.software_skills || 'AutoCAD, SketchUp, and Rhino'}, I specialize in 3D spatial visualization for hospitality environments, bespoke bar & millwork detailing, and compiling tactile material palettes (lime plaster, custom masonry, and ambient illumination studies).

I would welcome the opportunity to contribute to ${studio.name}'s upcoming dining and commercial projects while learning from your design team.

Portfolio & CV: [Link to Portfolio]
Phone: [Your Phone Number]

Thank you for your time and consideration.

Best regards,
[Your Name]`;

  subjectEl.value = subject;
  bodyEl.value = body;
  
  modal.style.display = 'flex';
}

function closePitchModal() {
  const modal = document.getElementById('pitch-modal');
  if (modal) modal.style.display = 'none';
}

function copyPitchAndSubject() {
  const subjectEl = document.getElementById('pitch-subject');
  const bodyEl = document.getElementById('pitch-body');
  
  if (!subjectEl || !bodyEl) return;
  
  const fullText = `SUBJECT: ${subjectEl.value}\n\n${bodyEl.value}`;
  copyText(fullText, 'Pitch and subject line copied!');
}

function openMailClient() {
  if (!currentPitchStudio) return;
  
  const email = currentPitchStudio.email || '';
  const subjectEl = document.getElementById('pitch-subject');
  const bodyEl = document.getElementById('pitch-body');
  
  const subject = encodeURIComponent(subjectEl ? subjectEl.value : '');
  const body = encodeURIComponent(bodyEl ? bodyEl.value : '');
  
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
}

// Surprise Modal Logic
function openSurpriseModal() {
  const modal = document.getElementById('surprise-modal');
  if (modal) modal.style.display = 'flex';
}

function closeSurpriseModal() {
  const modal = document.getElementById('surprise-modal');
  if (modal) modal.style.display = 'none';
}

// Mascot Companion Logic
function initMascotCompanion() {
  const mascotText = document.getElementById('floating-mascot-text');
  let quoteIndex = 0;
  
  if (mascotText) {
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % mascotQuotes.length;
      mascotText.textContent = mascotQuotes[quoteIndex];
    }, 6000);
  }
}

function onMascotPillClick() {
  const mascotText = document.getElementById('floating-mascot-text');
  const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
  if (mascotText) mascotText.textContent = randomQuote;
  showToast(randomQuote);
  fireConfetti();
}

// Confetti System
let confettiCanvas, ctx, confettiPieces = [];

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  if (!confettiCanvas) return;
  
  ctx = confettiCanvas.getContext('2d');
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function fireConfetti() {
  if (!confettiCanvas || !ctx) return;
  
  const colors = ['#e05d84', '#f48fb1', '#fbcfe8', '#ff7597', '#c9466d', '#ffffff'];
  confettiPieces = [];
  
  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 150,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }
  
  let frame = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let active = false;
    for (let p of confettiPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;
      
      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    }
    
    frame++;
    if (active && frame < 180) {
      requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  
  requestAnimationFrame(updateConfetti);
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// Expose globals for inline onclicks
window.copyText = copyText;
window.copyStudioDossier = copyStudioDossier;
window.openPitchModal = openPitchModal;
window.closePitchModal = closePitchModal;
window.copyPitchAndSubject = copyPitchAndSubject;
window.openMailClient = openMailClient;
window.openSurpriseModal = openSurpriseModal;
window.closeSurpriseModal = closeSurpriseModal;
window.onMascotPillClick = onMascotPillClick;
window.fireConfetti = fireConfetti;
