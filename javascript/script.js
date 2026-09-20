/* ==========================================================================
   AZIM-OS CONTROL DECK MASTER SCRIPT (v2026.09 - DYNAMIC CONFIG)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  try {
    const introNodes = setupIntroNodes();
    setupIntro(introNodes);
    setupTypingEffect();
    initPixelDust();
    setupProjectExplorer();
    setupProjectSlideshows();
    setupBadgeGalleryDynamic();
    setupThemeToggling();
    setupDeckLaunchers();
    setupRetroPhotoViewer();
    setupWindowControls();
    setupDesktopHero();
    setupProfileActiveButton();
    setupContactFormSubmission();
    setupContactCharCounter();
    setupTypographySwitcher();
    setupVisualOverlays();
    setupJournalLog();
    setupLiveClock();
    setupSystemStats();
    setupConfigEndpoints();
    setupSocials();
    setupSkills();
    setupAboutConsoleDynamic();
    setupDesktopFolders();
    setupJournalForumModal();
    setupAdvancedSpotifyPlayer();
  } catch (e) {
    console.error("Script init error:", e);
  }

  // --- 1. DYNAMIC INTRO & BOOT LOGS ---
  function setupIntro(introNodes) {
    const intro = document.getElementById("intro");
    const bootLog = document.getElementById("boot-log");
    const bootAction = document.getElementById("boot-action");
    const bootTerminal = document.querySelector(".boot-terminal");
    const bootBtn = document.querySelector(".boot-btn");
    if (!intro || !bootLog || !bootAction || !bootTerminal) return;

    bootTerminal.addEventListener("click", (e) => e.stopPropagation());

    const removeIntro = () => {
      if (intro.style.display === "none") return;
      intro.classList.add("fade-out");
      if (introNodes && typeof introNodes.stop === 'function') {
        introNodes.stop();
      }
      setTimeout(() => {
        intro.style.display = "none";
      }, 800);
    };

    intro.addEventListener("click", removeIntro);
    if (bootBtn) {
      bootBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeIntro();
      });
    }

    const logLines = window.AZIM_CONFIG?.logLines || [];
    let lineIndex = 0;
    
    function printNextLine() {
      if (lineIndex < logLines.length) {
        const item = logLines[lineIndex];
        const line = document.createElement("div");
        line.className = `boot-line ${item.class || ''}`;
        line.textContent = item.text;
        bootLog.appendChild(line);
        lineIndex++;
        setTimeout(printNextLine, 150);
      } else {
        bootAction.classList.remove("hidden");
      }
    }
    setTimeout(printNextLine, 200);
  }

  // --- 2. INTRO NODES BACKGROUND ---
  function setupIntroNodes() {
    const canvas = document.getElementById("node-network-canvas");
    if (!canvas) return { stop: () => {} };
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    return {
      stop: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    };
  }

  // --- 3. DYNAMIC SCRAMBLING ROLES EFFECT ---
  function setupTypingEffect() {
    const heroRoles = document.getElementById("hero-roles");
    if (!heroRoles) return;

    const roles = window.AZIM_CONFIG?.roles || ["Software Engineer"];
    let roleIndex = 0;
    const scrambleChars = "!<>-_\\/[]{}—=+*^?#0101";

    const scramble = (text) => {
      let i = 0;
      const interval = setInterval(() => {
        heroRoles.textContent = text
          .split("")
          .map((char, index) => {
            if (index < i) return text[index];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("");

        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(deleteText, 1500);
        }
        i++;
      }, 50);
    };

    const deleteText = () => {
      const current = heroRoles.textContent;
      let i = current.length;
      const interval = setInterval(() => {
        heroRoles.textContent = current.substring(0, i);
        if (i <= 0) {
          clearInterval(interval);
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(() => scramble(roles[roleIndex]), 80);
        }
        i--;
      }, 35);
    };

    scramble(roles[roleIndex]);
  }

  // --- 5. WORK & GALLERY LAUNCHERS ---
  function setupDeckLaunchers() {
    const projectsBtn = document.getElementById('open-projects-btn');
    const galleryBtn = document.getElementById('open-gallery-btn');
    const projectsModal = document.getElementById('projects-modal');
    const galleryModal = document.getElementById('gallery-modal');

    if (projectsBtn && projectsModal) {
      projectsBtn.addEventListener('click', () => projectsModal.classList.remove('hidden'));
    }
    if (galleryBtn && galleryModal) {
      galleryBtn.addEventListener('click', () => galleryModal.classList.remove('hidden'));
    }
  }

  // --- 6. IDE / PROJECT EXPLORER ---
  function setupProjectExplorer() {
    const fileElements = document.querySelectorAll('.tree-file');
    const tabsContainer = document.querySelector('.viewer-tabs');
    const projectViews = document.querySelectorAll('.project-view');
    const DEFAULT_VIEW = { project: 'coco-sorter', fileType: 'readme' };
    if (!fileElements.length || !tabsContainer) return;

    const MAX_TABS = 5;
    const alertOverlay = document.getElementById('editor-alert-overlay');
    const dismissAlertBtn = document.getElementById('close-editor-alert');

    if (dismissAlertBtn && alertOverlay) {
      dismissAlertBtn.addEventListener('click', () => alertOverlay.classList.add('hidden'));
    }

    let openTabs = [{ project: 'coco-sorter', fileType: 'readme', label: 'README.md (coco-sorter)' }];
    let activeTabIndex = 0;

    function closeTab(index) {
      openTabs.splice(index, 1);
      if (!openTabs.length) {
        activeTabIndex = -1;
      } else if (index < activeTabIndex) {
        activeTabIndex -= 1;
      } else if (activeTabIndex >= openTabs.length) {
        activeTabIndex = openTabs.length - 1;
      }
      renderTabs();
    }

    function renderTabs() {
      tabsContainer.innerHTML = '';
      openTabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = `viewer-tab ${index === activeTabIndex ? 'active' : ''}`;

        const labelEl = document.createElement('span');
        labelEl.className = 'viewer-tab-label';
        labelEl.textContent = tab.label;
        labelEl.addEventListener('click', () => {
          activeTabIndex = index;
          renderTabs();
        });
        tabEl.appendChild(labelEl);

        const closeEl = document.createElement('span');
        closeEl.className = 'viewer-tab-close';
        closeEl.textContent = '\u00d7';
        closeEl.setAttribute('role', 'button');
        closeEl.setAttribute('aria-label', `Close ${tab.label}`);
        closeEl.addEventListener('click', (e) => {
          e.stopPropagation();
          closeTab(index);
        });
        tabEl.appendChild(closeEl);

        tabsContainer.appendChild(tabEl);
      });

      projectViews.forEach(v => v.classList.remove('active'));
      fileElements.forEach(f => f.classList.remove('active'));

      // No tab open: fall back to the default README view (no tab is drawn for it)
      const cur = openTabs[activeTabIndex] || DEFAULT_VIEW;
      const targetView = document.getElementById(`view-${cur.project}-${cur.fileType}`);
      if (targetView) targetView.classList.add('active');

      fileElements.forEach(el => {
        if (el.getAttribute('data-project') === cur.project && el.getAttribute('data-file') === cur.fileType) {
          el.classList.add('active');
        }
      });
    }

    fileElements.forEach(fileEl => {
      fileEl.addEventListener('click', () => {
        const project = fileEl.getAttribute('data-project');
        const fileType = fileEl.getAttribute('data-file');
        const fileName = fileType === 'readme' ? 'README.md' : 'preview.png';

        const existing = openTabs.findIndex(t => t.project === project && t.fileType === fileType);
        if (existing !== -1) {
          activeTabIndex = existing;
          renderTabs();
          return;
        }

        if (openTabs.length >= MAX_TABS) {
          if (alertOverlay) alertOverlay.classList.remove('hidden');
          return;
        }

        openTabs.push({ project, fileType, label: `${fileName} (${project})` });
        activeTabIndex = openTabs.length - 1;
        renderTabs();
      });
    });

    const cocoVideoBtn = document.getElementById('coco-video-btn');
    const cocoVideoEmbed = document.getElementById('coco-video-embed');
    if (cocoVideoBtn && cocoVideoEmbed) {
      cocoVideoBtn.addEventListener('click', () => {
        cocoVideoEmbed.style.display = (cocoVideoEmbed.style.display === 'none') ? 'block' : 'none';
      });
    }

    renderTabs();
  }

  // --- 7. SLIDESHOWS ---
  function setupProjectSlideshows() {
    const cards = document.querySelectorAll('.project-image-container');
    cards.forEach(card => {
      const slides = card.querySelectorAll('.project-slide');
      const prev = card.querySelector('.prev-btn');
      const next = card.querySelector('.next-btn');
      let cur = 0;
      if (slides.length <= 1) return;

      const update = () => {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === cur));
      };

      if (next) next.addEventListener('click', () => { cur = (cur + 1) % slides.length; update(); });
      if (prev) prev.addEventListener('click', () => { cur = (cur - 1 + slides.length) % slides.length; update(); });
    });
  }

  // --- 8. DYNAMIC BADGE GALLERY ---
  function setupBadgeGalleryDynamic() {
    const gridContainer = document.getElementById('badge-grid-container') || document.querySelector('.badge-grid');
    const detailImg = document.getElementById('detail-icon-img');
    const detailTxt = document.getElementById('detail-icon-txt');
    const detailName = document.getElementById('detail-badge-name');
    const detailDesc = document.getElementById('detail-badge-desc');

    if (!gridContainer || !window.AZIM_CONFIG || !window.AZIM_CONFIG.badges) return;

    const badges = window.AZIM_CONFIG.badges;
    gridContainer.innerHTML = '';

    badges.forEach((badge, index) => {
      const slot = document.createElement('div');
      slot.className = `badge-slot ${badge.unlocked ? 'unlocked active' : 'locked'} ${index === 0 ? 'active' : ''}`;
      slot.setAttribute('data-name', badge.name);
      slot.setAttribute('data-desc', badge.desc);

      if (badge.unlocked && badge.img) {
        slot.setAttribute('data-img', badge.img);
        const img = document.createElement('img');
        img.src = badge.img;
        img.alt = badge.name;
        slot.appendChild(img);
      } else {
        slot.textContent = '?';
      }

      slot.addEventListener('click', () => {
        document.querySelectorAll('.badge-slot').forEach(s => s.classList.remove('active'));
        slot.classList.add('active');

        if (detailName) detailName.textContent = badge.name;
        if (detailDesc) detailDesc.textContent = badge.desc;

        if (badge.unlocked && badge.img) {
          if (detailImg) { detailImg.src = badge.img; detailImg.style.display = 'block'; }
          if (detailTxt) detailTxt.style.display = 'none';
        } else {
          if (detailImg) detailImg.style.display = 'none';
          if (detailTxt) detailTxt.style.display = 'block';
        }
      });

      gridContainer.appendChild(slot);
    });
  }

  // --- 10. PIXEL DUST BACKGROUND ---
  function initPixelDust() {
    const canvas = document.getElementById("pixelDust");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }, 100);
    });

    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = 0;

    const mouseRadius = 180;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = 1;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      mouseActive = 0;
      mouseX = -9999;
      mouseY = -9999;
    }, { passive: true });

    const MAX_SHOCKWAVES = 8;
    const shockwaves = new Float32Array(MAX_SHOCKWAVES * 4);
    let shockwaveHead = 0;

    window.addEventListener("pointerdown", (e) => {
      const idx = shockwaveHead * 4;
      shockwaves[idx] = e.clientX;
      shockwaves[idx + 1] = e.clientY;
      shockwaves[idx + 2] = 2.0;  
      shockwaves[idx + 3] = 0.90; 
      shockwaveHead = (shockwaveHead + 1) % MAX_SHOCKWAVES;
    }, { passive: true });

    const COUNT = 110;
    const STRIDE = 10;
    const pData = new Float32Array(COUNT * STRIDE);

    for (let i = 0; i < COUNT; i++) {
      const o = i * STRIDE;
      pData[o] = Math.random() * W;                 
      pData[o + 1] = Math.random() * H;             
      pData[o + 2] = 0.0;                           
      pData[o + 3] = 0.0;                           
      pData[o + 4] = (Math.random() - 0.5) * 0.8;   
      pData[o + 5] = (Math.random() - 0.5) * 0.8;   
      pData[o + 6] = (Math.random() * 4) | 0;       
      pData[o + 7] = (Math.random() * 3) | 0;       
      pData[o + 8] = ((Math.random() * 2) | 0) + 2; 
      pData[o + 9] = 0;                             
    }

    let colPrimary = '#00FF66';
    let colSubtle = '#009933';
    let colHighlight = '#ffffff';

    const syncColors = () => {
      const style = getComputedStyle(document.documentElement);
      colPrimary = style.getPropertyValue('--color-accent').trim() || '#00FF66';
      colSubtle = style.getPropertyValue('--color-accent-subtle').trim() || '#009933';
      colHighlight = style.getPropertyValue('--color-light-text').trim() || '#ffffff';
    };
    syncColors();

    document.querySelectorAll('.terminal-dot').forEach(d => {
      d.addEventListener('click', () => setTimeout(syncColors, 60));
    });

    function renderShape(shapeId, x, y, size) {
      if (shapeId === 0) {
        ctx.fillRect(x, y, size, size);
      } else if (shapeId === 1) {
        ctx.fillRect(x, y - size, size, size);
        ctx.fillRect(x - size, y, size, size);
        ctx.fillRect(x + size, y, size, size);
        ctx.fillRect(x, y + size, size, size);
      } else if (shapeId === 2) {
        ctx.fillRect(x, y - size, size, size * 3);
        ctx.fillRect(x - size, y, size * 3, size);
      } else {
        const bSize = (size * 1.6) | 0;
        ctx.fillRect(x, y, bSize, bSize);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      for (let s = 0; s < MAX_SHOCKWAVES; s++) {
        const sIdx = s * 4;
        const sAlpha = shockwaves[sIdx + 3];
        if (sAlpha > 0.01) {
          const sX = (shockwaves[sIdx] + 0.5) | 0;
          const sY = (shockwaves[sIdx + 1] + 0.5) | 0;
          const sRad = (shockwaves[sIdx + 2] + 0.5) | 0;

          ctx.strokeStyle = colPrimary;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = sAlpha * 0.6;
          ctx.strokeRect(sX - sRad, sY - sRad, sRad << 1, sRad << 1);

          shockwaves[sIdx + 2] += 8.0;   
          shockwaves[sIdx + 3] -= 0.035; 
        }
      }

      for (let i = 0; i < COUNT; i++) {
        const o = i * STRIDE;

        pData[o] += pData[o + 4] + pData[o + 2];
        pData[o + 1] += pData[o + 5] + pData[o + 3];

        pData[o + 2] *= 0.93;
        pData[o + 3] *= 0.93;

        if (mouseActive) {
          const dx = pData[o] - mouseX;
          const dy = pData[o + 1] - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq && distSq > 1.0) {
            const dist = Math.sqrt(distSq);
            const force = (mouseRadius - dist) / mouseRadius;
            const invDist = 1.0 / dist;
            pData[o + 2] += dx * invDist * force * 2.5;
            pData[o + 3] += dy * invDist * force * 2.5;

            ctx.strokeStyle = colPrimary;
            ctx.lineWidth = 1;
            ctx.globalAlpha = force * 0.4;
            ctx.beginPath();
            ctx.moveTo((pData[o] + 0.5) | 0, (pData[o + 1] + 0.5) | 0);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }

        if (pData[o] < 0) pData[o] = W;
        else if (pData[o] > W) pData[o] = 0;

        if (pData[o + 1] < 0) pData[o + 1] = H;
        else if (pData[o + 1] > H) pData[o + 1] = 0;

        ctx.fillStyle = (pData[o + 7] === 0 ? colPrimary : (pData[o + 7] === 1 ? colSubtle : colHighlight));
        ctx.globalAlpha = 0.7;

        const px = (pData[o] + 0.5) | 0;
        const py = (pData[o + 1] + 0.5) | 0;
        renderShape(pData[o + 6] | 0, px, py, pData[o + 8] | 0);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // --- 10. COLOR PALETTE SWITCHER ---
  function setupThemeToggling() {
    const dots = document.querySelectorAll('.terminal-dot');
    const root = document.documentElement;
    let rainbowIdx = 0;

    const rainbowPresets = [
      { '--color-dark-bg': '#0D0014', '--color-dark-bg-rgb': '13, 0, 20', '--color-accent': '#FF2079', '--color-accent-rgb': '255, 32, 121', '--color-light-text': '#FF2079', '--color-accent-subtle': '#B30057' },
      { '--color-dark-bg': '#140D00', '--color-dark-bg-rgb': '20, 13, 0', '--color-accent': '#FFB000', '--color-accent-rgb': '255, 176, 0', '--color-light-text': '#FFB000', '--color-accent-subtle': '#B37B00' },
      { '--color-dark-bg': '#020A02', '--color-dark-bg-rgb': '2, 10, 2', '--color-accent': '#00FF66', '--color-accent-rgb': '0, 255, 102', '--color-light-text': '#00FF66', '--color-accent-subtle': '#009933' },
      { '--color-dark-bg': '#150000', '--color-dark-bg-rgb': '21, 0, 0', '--color-accent': '#FF1E1E', '--color-accent-rgb': '255, 30, 30', '--color-light-text': '#FF1E1E', '--color-accent-subtle': '#B30000' },
      { '--color-dark-bg': '#001014', '--color-dark-bg-rgb': '0, 16, 20', '--color-accent': '#00F0FF', '--color-accent-rgb': '0, 240, 255', '--color-light-text': '#00F0FF', '--color-accent-subtle': '#0284C7' },
      { '--color-dark-bg': '#1A0B2E', '--color-dark-bg-rgb': '26, 11, 46', '--color-accent': '#BD93F9', '--color-accent-rgb': '189, 147, 249', '--color-light-text': '#BD93F9', '--color-accent-subtle': '#8B5CF6' }
    ];

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const theme = dot.getAttribute('data-theme');
        if (theme === 'default') {
          root.style.setProperty('--color-dark-bg', '#050B05');
          root.style.setProperty('--color-dark-bg-rgb', '5, 11, 5');
          root.style.setProperty('--color-accent', '#00FF66');
          root.style.setProperty('--color-accent-rgb', '0, 255, 102');
          root.style.setProperty('--color-light-text', '#00FF66');
          root.style.setProperty('--color-accent-subtle', '#009933');
        } else if (theme === 'mono') {
          root.style.setProperty('--color-dark-bg', '#000000');
          root.style.setProperty('--color-dark-bg-rgb', '0, 0, 0');
          root.style.setProperty('--color-accent', '#ffffff');
          root.style.setProperty('--color-accent-rgb', '255, 255, 255');
          root.style.setProperty('--color-light-text', '#ffffff');
          root.style.setProperty('--color-accent-subtle', '#aaaaaa');
        } else if (theme === 'rainbow') {
          const p = rainbowPresets[rainbowIdx];
          for (let [k, v] of Object.entries(p)) root.style.setProperty(k, v);
          rainbowIdx = (rainbowIdx + 1) % rainbowPresets.length;
        }
      });
    });
  }

  // --- 11. CUSTOM WINDOW CONTROLS ---
  function setupWindowControls() {
    const deckCards = document.querySelectorAll('.deck-card');

    deckCards.forEach(card => {
      const contentWrap = card.querySelector('.card-content-wrap');
      const emptyRestore = card.querySelector('.card-empty-restore');
      const closeBtn = card.querySelector('.control-btn.red');
      const toggleBtn = card.querySelector('.control-btn.green');
      const restoreBtn = card.querySelector('.restore-file-btn');

      const hideCard = () => {
        if (contentWrap) contentWrap.classList.add('hidden');
        if (emptyRestore) emptyRestore.classList.remove('hidden');
        card.classList.remove('maximized');
      };

      const showCard = () => {
        if (contentWrap) contentWrap.classList.remove('hidden');
        if (emptyRestore) emptyRestore.classList.add('hidden');
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          hideCard();
        });
      }

      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showCard();
        });
      }

      if (restoreBtn) {
        restoreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showCard();
        });
      }
    });

    ['projects-modal', 'gallery-modal', 'photo-modal', 'contact-alert-modal'].forEach(overlayId => {
      const overlay = document.getElementById(overlayId);
      if (!overlay) return;
      const closeBtn = overlay.querySelector('[data-action="close"], .control-dot.red');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          overlay.classList.add('hidden');
        });
      }
    });
  }
});

// --- RETRO CRT PHOTO ARCHIVE VIEWER CONTROLLER ---
function setupRetroPhotoViewer() {
  const viewPhotosLink = document.getElementById('view-photos-link');
  const photoModal = document.getElementById('photo-modal');
  const closeBtn = document.getElementById('close-retro-photo-btn');
  const crtScreen = document.getElementById('retro-crt-screen');
  const slides = document.querySelectorAll('.retro-slide');
  const prevBtn = document.getElementById('retro-prev-btn');
  const nextBtn = document.getElementById('retro-next-btn');
  const captionEl = document.getElementById('retro-file-caption');
  const indexIndicator = document.getElementById('retro-index-indicator');
  const originalBtn = document.getElementById('mode-original-btn');
  const terminalBtn = document.getElementById('mode-terminal-btn');

  if (!photoModal || !slides.length) return;

  let currentIndex = 0;
  if (crtScreen) crtScreen.classList.add('mode-terminal');

  const showSlide = (index) => {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
    currentIndex = index;
    const currentSlide = slides[currentIndex];
    const caption = currentSlide.getAttribute('data-caption') || `PHOTO_${index + 1}.PNG`;
    if (captionEl) captionEl.textContent = caption;
    if (indexIndicator) indexIndicator.textContent = `IMAGE 0${index + 1} / 0${slides.length}`;
  };

  if (viewPhotosLink) {
    viewPhotosLink.addEventListener('click', (e) => {
      e.preventDefault();
      photoModal.classList.remove('hidden');
      showSlide(currentIndex);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => photoModal.classList.add('hidden'));

  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) photoModal.classList.add('hidden');
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide((currentIndex + 1) % slides.length);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide((currentIndex - 1 + slides.length) % slides.length);
    });
  }

  if (originalBtn && terminalBtn && crtScreen) {
    originalBtn.addEventListener('click', () => {
      crtScreen.classList.remove('mode-terminal');
      crtScreen.classList.add('mode-original');
      originalBtn.classList.add('active');
      terminalBtn.classList.remove('active');
    });

    terminalBtn.addEventListener('click', () => {
      crtScreen.classList.remove('mode-original');
      crtScreen.classList.add('mode-terminal');
      terminalBtn.classList.add('active');
      originalBtn.classList.remove('active');
    });
  }
}

// --- DESKTOP HERO STAGE LAUNCHER ---
function setupDesktopHero() {
  const heroTrigger = document.getElementById('desktop-hero-trigger');
  const deckContainer = document.getElementById('deck-container');
  if (!heroTrigger || !deckContainer) return;

  heroTrigger.addEventListener('click', () => deckContainer.classList.remove('minimized-to-desktop'));

  const deckCloseBtn = deckContainer.querySelector('[data-action="deck-close"]');
  const deckMaxBtn = deckContainer.querySelector('[data-action="deck-maximize"]');

  if (deckCloseBtn) deckCloseBtn.addEventListener('click', () => deckContainer.classList.add('minimized-to-desktop'));
  if (deckMaxBtn) deckMaxBtn.addEventListener('click', () => deckContainer.classList.toggle('maximized'));
}

// --- PROFILE ACTIVE / DEACTIVATED TOGGLE ---
function setupProfileActiveButton() {
  const btn = document.getElementById('profile-active-btn');
  const profileImg = document.getElementById('profile-img');
  const staticLayer = document.getElementById('tv-static-layer');
  const frameContainer = document.getElementById('profile-frame-container');
  if (!btn || !staticLayer) return;

  let isActive = true;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isActive = !isActive;
    if (isActive) {
      btn.classList.remove('offline');
      btn.innerHTML = `<span class="status-dot-mini"></span> ACTIVE`;
      staticLayer.classList.add('hidden');
      if (frameContainer) frameContainer.classList.remove('deactivated');
      if (profileImg) profileImg.style.display = 'block';
    } else {
      btn.classList.add('offline');
      btn.innerHTML = `<span class="status-dot-mini"></span> DEACTIVATED`;
      if (profileImg) profileImg.style.display = 'none';
      staticLayer.classList.remove('hidden');
      if (frameContainer) frameContainer.classList.add('deactivated');
    }
  });
}

// --- CONTACT FORM AJAX SUBMISSION ---
function setupContactFormSubmission() {
  const form = document.getElementById('contact-form');
  const alertModal = document.getElementById('contact-alert-modal');
  const dismissBtn = document.getElementById('dismiss-contact-alert');
  const closeDot = document.getElementById('close-contact-alert');
  const statusText = document.getElementById('form-status');
  if (!form || !alertModal) return;

  const hideAlert = () => alertModal.classList.add('hidden');
  if (dismissBtn) dismissBtn.addEventListener('click', hideAlert);
  if (closeDot) closeDot.addEventListener('click', hideAlert);
  alertModal.addEventListener('click', (e) => { if (e.target === alertModal) hideAlert(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    if (statusText) {
      statusText.style.color = 'var(--color-accent)';
      statusText.textContent = 'Transmitting packet...';
      statusText.style.display = 'block';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();

      if (response.ok) {
        form.reset();
        const counter = document.getElementById('char-counter');
        if (counter) counter.textContent = '0 / 300';
        if (statusText) statusText.style.display = 'none';
        alertModal.classList.remove('hidden');
      } else {
        if (statusText) {
          statusText.style.color = '#ff5f56';
          statusText.textContent = data.error || 'Transmission failed. Try again.';
          statusText.style.display = 'block';
        }
      }
    } catch (error) {
      if (statusText) {
        statusText.style.color = '#ff5f56';
        statusText.textContent = 'Network error. Check connection.';
        statusText.style.display = 'block';
      }
    }
  });
}

// --- CONTACT MESSAGE CHARACTER COUNTER ---
function setupContactCharCounter() {
  const textarea = document.getElementById('form-message');
  const counter = document.getElementById('char-counter');
  if (!textarea || !counter) return;

  textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    counter.textContent = `${currentLength} / 300`;
    counter.style.color = currentLength >= 300 ? '#ff5f56' : 'var(--color-accent-subtle)';
  });
}

// --- TYPOGRAPHY SWITCHER ---
function setupTypographySwitcher() {
  const fontBtns = document.querySelectorAll('.font-switch-btn');
  const body = document.body;
  body.classList.add('font-avant-garde');

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      body.classList.remove('font-formal', 'font-cyber', 'font-avant-garde');
      fontBtns.forEach(b => b.classList.remove('active'));
      body.classList.add(`font-${btn.getAttribute('data-font')}`);
      btn.classList.add('active');
    });
  });
}

// --- QUICK-BURST VISUAL EFFECT ---
function setupVisualOverlays() {
  const triggerBtn = document.getElementById('trigger-fx-burst');
  if (!triggerBtn) return;

  let burstCanvas = document.getElementById('matrixBurstCanvas');
  if (!burstCanvas) {
    burstCanvas = document.createElement('canvas');
    burstCanvas.id = 'matrixBurstCanvas';
    burstCanvas.style.cssText = `
      position: fixed; inset: 0; width: 100vw; height: 100vw;
      z-index: 9999; pointer-events: none; opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(burstCanvas);
  }

  const bCtx = burstCanvas.getContext('2d');
  triggerBtn.addEventListener('click', () => {
    burstCanvas.style.opacity = '1';
    let frames = 0;
    const maxFrames = 40;
    const fontSize = 16;
    burstCanvas.width = window.innerWidth;
    burstCanvas.height = window.innerHeight;
    const columns = Math.floor(burstCanvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#00FF66';

    function playBurst() {
      bCtx.fillStyle = 'rgba(5, 11, 5, 0.25)';
      bCtx.fillRect(0, 0, burstCanvas.width, burstCanvas.height);
      bCtx.fillStyle = accentColor;
      bCtx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        bCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
      }

      frames++;
      if (frames < maxFrames) {
        requestAnimationFrame(playBurst);
      } else {
        burstCanvas.style.opacity = '0';
      }
    }
    playBurst();
  });
}

// --- JOURNAL LOG CONTROLLER ---
function setupJournalLog() {
  const container = document.getElementById('journal-entries-container');
  const modalContainer = document.getElementById('full-journal-container');
  const toggleBtn = document.getElementById('journal-toggle-view-btn');
  const modal = document.getElementById('journal-forum-modal');
  const closeBtn = document.getElementById('close-journal-modal');
  
  const journalData = window.AZIM_CONFIG?.journal || [];
  if (!container) return;

  const renderEntries = (limit) => {
    const items = limit ? journalData.slice(0, limit) : journalData;
    container.innerHTML = items.map(j => `
      <div class="journal-entry">
        <span style="color: var(--color-accent); font-weight: bold;">[${j.date}]</span>: ${j.text}
      </div>
    `).join('');
  };

  renderEntries(2);

  if (toggleBtn && modal) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.remove('hidden');
      if (modalContainer) {
        modalContainer.innerHTML = journalData.map(j => `
          <div style="border-bottom: 1px dashed rgba(var(--color-accent-rgb), 0.3); padding-bottom: 8px;">
            <span style="color: var(--color-accent); font-weight: bold;">[${j.date}]</span>
            <p style="color: var(--color-light-text); margin-top: 4px; font-size: 0.95rem;">${j.text}</p>
          </div>
        `).join('');
      }
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
}

// --- LIVE CLOCK ---
function setupLiveClock() {
  const clockEl = document.getElementById('pc-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedString = now.toLocaleDateString('en-US', options);
    const tzMatch = now.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
    const timezone = tzMatch || Intl.DateTimeFormat().resolvedOptions().timeZone;
    clockEl.textContent = `${formattedString} ${timezone}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// --- DYNAMIC SYSTEM STATS INITIALIZER ---
function setupSystemStats() {
  if (!window.AZIM_CONFIG || !window.AZIM_CONFIG.stats) return;
  const stats = window.AZIM_CONFIG.stats;

  const versionEl = document.getElementById('stat-version');
  const systemsEl = document.getElementById('stat-systems');
  const artifactsEl = document.getElementById('stat-artifacts');
  const statusEl = document.getElementById('stat-status');

  if (versionEl) versionEl.textContent = stats.version;
  if (systemsEl) systemsEl.textContent = stats.systemsCount;
  if (artifactsEl) artifactsEl.textContent = stats.artifactsCount;
  if (statusEl) statusEl.textContent = stats.statusText;
}

// --- DYNAMIC CONFIG ENDPOINTS & FORM ACTION ---
function setupConfigEndpoints() {
  if (!window.AZIM_CONFIG) return;
  const cfg = window.AZIM_CONFIG;

  const contactForm = document.getElementById('contact-form');
  if (contactForm && cfg.formspreeEndpoint) {
    contactForm.action = cfg.formspreeEndpoint;
  }
}

// --- DYNAMIC SOCIALS LAUNCHERS INJECTION ---
function setupSocials() {
  const container = document.getElementById('social-launchers-container');
  if (!container || !window.AZIM_CONFIG || !window.AZIM_CONFIG.socials) return;

  container.innerHTML = '';
  window.AZIM_CONFIG.socials.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'deck-launcher-btn social-launcher';
    a.innerHTML = `
      <div class="launcher-icon"><i class="${s.icon}"></i></div>
      <div class="launcher-meta">
        <div class="launcher-title">${s.name}</div>
        <div class="launcher-desc">${s.handle}</div>
      </div>
      <span class="launcher-arrow">→</span>
    `;
    container.appendChild(a);
  });
}

// --- DYNAMIC SKILLS CHIPS INJECTION ---
function setupSkills() {
  const skillsBody = document.querySelector('.skills-body');
  if (!skillsBody || !window.AZIM_CONFIG || !window.AZIM_CONFIG.skills) return;

  const skillsData = window.AZIM_CONFIG.skills;
  skillsBody.innerHTML = '';

  Object.entries(skillsData).forEach(([categoryName, items]) => {
    if (!items || !items.length) return;
    
    const catDiv = document.createElement('div');
    catDiv.className = 'skills-category';

    const titleEl = document.createElement('span');
    titleEl.className = 'skills-category-title';
    titleEl.textContent = `// ${categoryName.toUpperCase()}:`;
    catDiv.appendChild(titleEl);

    const gridDiv = document.createElement('div');
    gridDiv.className = 'skills-pill-grid';

    items.forEach(skill => {
      const chip = document.createElement('span');
      chip.className = 'skill-chip';
      chip.textContent = skill;
      gridDiv.appendChild(chip);
    });

    catDiv.appendChild(gridDiv);
    skillsBody.appendChild(catDiv);
  });
}

// --- DYNAMIC ABOUT ME / CONSOLE INITIALIZER ---
function setupAboutConsoleDynamic() {
  const consoleBody = document.getElementById('about-console-body');
  if (!consoleBody || !window.AZIM_CONFIG || !window.AZIM_CONFIG.about) return;

  const about = window.AZIM_CONFIG.about;
  consoleBody.innerHTML = '';

  const page1 = document.createElement('div');
  page1.className = 'terminal-page active';
  page1.id = 'terminal-page-1';
  page1.innerHTML = `
    <p class="console-cmd">${about.page1.command}</p>
    <p class="console-text">${about.page1.text}</p>
  `;
  consoleBody.appendChild(page1);

  const page2 = document.createElement('div');
  page2.className = 'terminal-page';
  page2.id = 'terminal-page-2';
  page2.innerHTML = `
    <p class="console-cmd">${about.page2.command}</p>
    <p class="console-text">${about.page2.text}</p>
  `;
  consoleBody.appendChild(page2);

  const page3 = document.createElement('div');
  page3.className = 'terminal-page';
  page3.id = 'terminal-page-3';
  
  let gamesHtml = about.page3.games.map(g => `<li>${g.text}</li>`).join('');
  let factsHtml = about.page3.facts.map(f => `<li>${f.text}</li>`).join('');

  page3.innerHTML = `
    <p class="console-cmd">${about.page3.command}</p>
    <div class="terminal-bulletin-board">
      <div class="bulletin-pin"></div>
      <div class="bulletin-content">
        <span class="retro-emoji">🎮</span> <strong>My Games</strong><br>
        <ul class="retro-o-list">${gamesHtml}</ul>
        <span class="retro-emoji">📚</span> <strong>A Few Things About Me</strong><br>
        <ul class="retro-o-list">${factsHtml}</ul>
      </div>
    </div>
  `;
  consoleBody.appendChild(page3);

  const nextBtn = document.getElementById('terminal-next-btn');
  const indicator = document.getElementById('about-page-indicator');
  const pages = consoleBody.querySelectorAll('.terminal-page');
  let currentPage = 0;

  if (nextBtn && pages.length) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pages[currentPage].classList.remove('active');
      currentPage = (currentPage + 1) % pages.length;
      pages[currentPage].classList.add('active');
      if (indicator) indicator.textContent = `PAGE ${currentPage + 1}/${pages.length}`;
    });
  }
}

function setupDesktopFolders() {
  const projFolder = document.getElementById('open-desktop-projects');
  const galFolder = document.getElementById('open-desktop-gallery');
  const projModal = document.getElementById('projects-modal');
  const galModal = document.getElementById('gallery-modal');

  if (projFolder && projModal) {
    projFolder.addEventListener('click', () => projModal.classList.remove('hidden'));
  }
  if (galFolder && galModal) {
    galFolder.addEventListener('click', () => galModal.classList.remove('hidden'));
  }
}

function setupJournalForumModal() {
  const toggleBtn = document.getElementById('journal-toggle-view-btn');
  const modal = document.getElementById('journal-forum-modal');
  const closeBtn = document.getElementById('close-journal-modal');
  const container = document.getElementById('full-journal-container');

  if (!toggleBtn || !modal) return;

  const journalData = window.AZIM_CONFIG?.journal || [];

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.remove('hidden');
    if (container) {
      container.innerHTML = journalData.map(j => `
        <div style="border-bottom: 1px dashed rgba(var(--color-accent-rgb), 0.3); padding-bottom: 8px;">
          <span style="color: var(--color-accent); font-weight: bold;">[${j.date}]</span>
          <p style="color: var(--color-light-text); margin-top: 4px; font-size: 0.95rem;">${j.text}</p>
        </div>
      `).join('');
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
}

// --- COMPLETE ADVANCED SPOTIFY PLAYER (WITH LOOP & BEAT GLOW) ---
function setupAdvancedSpotifyPlayer() {
  const btn = document.getElementById('audio-toggle-btn');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');
  const speedBtn = document.getElementById('speed-toggle-btn');
  const vinyl = document.getElementById('vinyl-record');
  const vinylContainer = document.querySelector('.vinyl-disc-container');
  const status = document.getElementById('track-status');
  const titleEl = document.getElementById('track-title');
  const progressEl = document.getElementById('progress-bar-fill');
  const volumeSlider = document.getElementById('volume-slider');
  const spotifyBody = document.querySelector('.terminal-spotify-body');
  if (!btn || !vinyl) return;

  const NOTE_FREQ = {
    C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  const playlist = [
    {
      title: "Before The Fade",
      bpm: 90, wave: "square", bassWave: "triangle",
      lead: ["A3", null, "C4", "E4", "A3", null, "G3", "E3", "F3", null, "A3", "C4", "E3", null, null, null],
      bass: ["A2", null, null, null, "F2", null, null, null, "G2", null, null, null, "E2", null, null, null]
    },
    {
      title: "Cybernetic Drift",
      bpm: 128, wave: "sawtooth", bassWave: "square",
      lead: ["E4", "G4", "A4", "G4", "E4", "D4", "E4", null, "C4", "D4", "E4", "D4", "C4", "B3", "C4", null],
      bass: ["E2", null, "E2", null, "C2", null, "C2", null, "D2", null, "D2", null, "B2", null, "B2", null]
    },
    {
      title: "Neon Skyline",
      bpm: 140, wave: "square", bassWave: "triangle",
      lead: ["C5", "E5", "G5", "E5", "A4", "C5", "E5", "C5", "F4", "A4", "C5", "A4", "G4", "B4", "D5", null],
      bass: ["C3", null, "C3", null, "A2", null, "A2", null, "F2", null, "F2", null, "G2", null, "G2", null]
    }
  ];

  let audioCtx = null;
  let masterGain = null;
  let currentIndex = 0;
  let isPlaying = false;
  let stepIndex = 0;
  let schedulerTimer = null;
  let currentSpeedMultiplier = 1.0;
  const speeds = [1.0, 1.5, 2.0];
  let speedIndex = 0;
  let isLooping = false;
  let activeOscillators = [];

  function playNote(freq, startTime, duration, wave) {
    if (!freq || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    osc.connect(noteGain);
    noteGain.connect(masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
    
    activeOscillators.push(osc);
    osc.onended = () => {
      osc.disconnect();
      noteGain.disconnect();
      activeOscillators = activeOscillators.filter(o => o !== osc);
    };
  }

  function stopPlayback() {
    clearTimeout(schedulerTimer);
    activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    activeOscillators = [];
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
    setPlayingUI(false);
  }

  function ensureContext() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volumeSlider ? parseFloat(volumeSlider.value) : 0.5;
    masterGain.connect(audioCtx.destination);
  }

  function spawnMusicNote() {
    if (!spotifyBody || !isPlaying) return;
    const note = document.createElement('div');
    note.className = 'floating-music-note';
    note.textContent = ['♫', '♪', '♬', '♩'][Math.floor(Math.random() * 4)];
    note.style.left = `${40 + Math.random() * 20}%`;
    note.style.top = `${30 + Math.random() * 20}%`;
    spotifyBody.appendChild(note);
    setTimeout(() => note.remove(), 800);
  }

  function playNote(freq, startTime, duration, wave) {
    if (!freq) return;
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(noteGain);
    noteGain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function updateProgress(step, total) {
    if (!progressEl) return;
    const filled = Math.round((step / total) * 10);
    progressEl.textContent = `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}]`;
  }

  function scheduleStep() {
    if (!isPlaying) return;
    const track = playlist[currentIndex];
    
    if (stepIndex >= track.lead.length) {
      if (isLooping) {
        stepIndex = 0;
      } else {
        currentIndex = (currentIndex + 1) % playlist.length;
        stepIndex = 0;
        if (titleEl) titleEl.textContent = playlist[currentIndex].title;
      }
    }

    const stepSeconds = (60 / track.bpm / 2) / currentSpeedMultiplier;
    const now = audioCtx.currentTime;
    const i = stepIndex % track.lead.length;

    playNote(NOTE_FREQ[track.lead[i]], now, stepSeconds * 0.9, track.wave);
    playNote(NOTE_FREQ[track.bass[i]], now, stepSeconds * 0.9, track.bassWave);
    updateProgress(i, track.lead.length);

    if (vinylContainer) {
      vinylContainer.classList.add('beating');
      setTimeout(() => vinylContainer.classList.remove('beating'), 150);
    }

    if (i % 2 === 0) spawnMusicNote();

    stepIndex++;
    schedulerTimer = setTimeout(scheduleStep, stepSeconds * 1000);
  }

  function setPlayingUI(playing) {
    isPlaying = playing;
    vinyl.className = 'vinyl-record';
    if (playing) {
      vinyl.classList.add('spinning');
      if (currentSpeedMultiplier === 1.5) vinyl.classList.add('speed-1-5');
      if (currentSpeedMultiplier === 2.0) vinyl.classList.add('speed-2');
    }
    btn.textContent = playing ? '⏸ PAUSE' : '♫ PLAY';
    if (status) status.textContent = playing ? '// STREAMING' : '// PAUSED';
  }

  function startPlayback() {
    ensureContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    stepIndex = 0;
    if (titleEl) titleEl.textContent = playlist[currentIndex].title;
    setPlayingUI(true);
    scheduleStep();
  }

  function stopPlayback() {
    clearTimeout(schedulerTimer);
    setPlayingUI(false);
  }

  function loadTrack(index) {
    currentIndex = (index + playlist.length) % playlist.length;
    if (titleEl) titleEl.textContent = playlist[currentIndex].title;
    if (isPlaying) {
      clearTimeout(schedulerTimer);
      stepIndex = 0;
      scheduleStep();
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlaying ? stopPlayback() : startPlayback();
  });

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); loadTrack(currentIndex + 1); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); loadTrack(currentIndex - 1); });

  if (speedBtn) {
    speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speedIndex = (speedIndex + 1) % speeds.length;
      currentSpeedMultiplier = speeds[speedIndex];
      speedBtn.textContent = `${currentSpeedMultiplier}x`;
      if (isPlaying) {
        clearTimeout(schedulerTimer);
        setPlayingUI(true);
        scheduleStep();
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (masterGain) masterGain.gain.value = parseFloat(e.target.value);
    });
  }

  // Auto-pause when card is closed or minimized
  const cardCloseBtn = document.querySelector('#card-new .control-btn.red');
  if (cardCloseBtn) cardCloseBtn.addEventListener('click', stopPlayback);

  if (titleEl) titleEl.textContent = playlist[currentIndex].title;
}