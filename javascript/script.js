document.addEventListener("DOMContentLoaded", () => {
  let currentActivePanelId = 'home';

  try {
  // --- 1. INITIALIZATION ---
  const introNodes = setupIntroNodes();
  setupIntro(introNodes);
  setupTypingEffect();
  setupNavbar();
  setupPanelNavigation();
  initPixelDust(); 
  setupProjectExplorer();
  setupProjectSlideshows();
  setupBadgeGallery();
  setupAboutSection();
  setupThemeToggling();

  } catch (e) {
    console.error("Script.js is crashed:", e)
  }

  // --- 2. INTRO MODULE ---
  function setupIntro(introNodes) {
    const intro = document.getElementById("intro");
    const bootLog = document.getElementById("boot-log");
    const bootAction = document.getElementById("boot-action");
    const bootTerminal = document.querySelector(".boot-terminal");
    const bootBtn = document.querySelector(".boot-btn");
    if (!intro || !bootLog || !bootAction || !bootTerminal) return;

    // Prevent clicks inside the terminal from closing the intro immediately
    bootTerminal.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const removeIntro = () => {
      if (intro.style.display === "none") return;
      intro.classList.add("fade-out");
      if (introNodes && typeof introNodes.stop === 'function') {
        introNodes.stop();
      }
      setTimeout(() => {
        intro.style.display = "none";
      }, 1000);
    };

    intro.addEventListener("click", removeIntro);
    window.addEventListener("scroll", removeIntro, { once: true });
    
    if (bootBtn) {
      bootBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeIntro();
      });
    }

    // Auto-skip after 30 seconds to prevent getting stuck if left idle
    const autoSkipTimeout = setTimeout(removeIntro, 30000);

    // Boot lines simulation (Generates dynamic values and random harmless events)
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;
    
    const cpuGhz = (Math.random() * 1.6 + 3.8).toFixed(2);
    const cpuName = Math.random() > 0.5 ? "Intel(R) Core(TM) i9" : "AMD Ryzen(TM) 9";
    const ramSize = [16384, 32768, 65536][Math.floor(Math.random() * 3)];
    const ipAddr = `192.168.1.${Math.floor(Math.random() * 250 + 4)}`;
    const temp = Math.floor(Math.random() * 18 + 38);

    const logLines = [
      { text: "azim-os v1.0.3 loading...", class: "command" },
      { text: `BIOS Date: ${dateStr} ${timeStr}`, class: "progress" },
      { text: `CPU: ${cpuName} @ ${cpuGhz}GHz`, class: "" },
      { text: `Memory Test: ${ramSize}MB OK`, class: "success" },
      { text: `Core Temperature: ${temp}°C [OPTIMAL]`, class: "success" }
    ];

    logLines.push({ text: "Initializing storage devices...", class: "" });
    if (Math.random() < 0.35) {
      logLines.push({ text: "  sda1: unclean shutdown detected. checking blocks...", class: "warning" });
      logLines.push({ text: "  sda1: fsck complete. journal recovered. [OK]", class: "success" });
    } else {
      logLines.push({ text: "  sda1: Ext4 System Root Mounted [OK]", class: "success" });
    }

    logLines.push({ text: "Detecting network configurations...", class: "" });
    logLines.push({ text: "  lo: 127.0.0.1 (Loopback)", class: "progress" });
    if (Math.random() < 0.40) {
      logLines.push({ text: "  eth0: link negotiating... half-duplex fallback", class: "warning" });
      logLines.push({ text: `  eth0: assigned IP address ${ipAddr} [OK]`, class: "success" });
    } else {
      logLines.push({ text: `  eth0: ${ipAddr} (DHCP Active) [OK]`, class: "success" });
    }

    logLines.push({ text: "Establishing secure ssh-rsa tunnels...", class: "progress" });
    logLines.push({ text: "Connection established successfully.", class: "success" });
    logLines.push({ text: "Loading user profile 'azim'... [OK]", class: "success" });
    logLines.push({ text: "Executing system_boot.sh...", class: "command" });
    logLines.push({ text: "-------------------------------------", class: "progress" });
    logLines.push({ text: "  - Loading Core Stylesheet [DONE]", class: "success" });
    logLines.push({ text: "  - Loading Interactive Modules [DONE]", class: "success" });

    if (Math.random() < 0.25) {
      logLines.push({ text: "  - [WARN] Local telemetry service unreachable (ignored)", class: "warning" });
    }

    logLines.push({ text: "  - Initializing Portfolio Projects [DONE]", class: "success" });
    logLines.push({ text: "  - Preparing Pixel Dust Engine [DONE]", class: "success" });
    logLines.push({ text: "SYSTEM READY. INITIALIZE SESSION...", class: "success" });

    let lineIndex = 0;
    
    function printNextLine() {
      if (lineIndex < logLines.length) {
        const item = logLines[lineIndex];
        const line = document.createElement("div");
        line.className = `boot-line ${item.class}`;
        
        if (item.class === "command") {
          let charIndex = 0;
          line.textContent = "";
          bootLog.appendChild(line);
          
          function typeChar() {
            if (charIndex < item.text.length) {
              line.textContent += item.text[charIndex];
              charIndex++;
              bootLog.scrollTop = bootLog.scrollHeight;
              setTimeout(typeChar, 25);
            } else {
              lineIndex++;
              setTimeout(printNextLine, Math.random() * 200 + 100);
            }
          }
          typeChar();
        } else {
          line.textContent = item.text;
          bootLog.appendChild(line);
          bootLog.scrollTop = bootLog.scrollHeight;
          lineIndex++;
          
          let delay = Math.random() * 120 + 30;
          if (item.text.includes("Establishing") || item.text.includes("Initializing")) {
            delay = 400;
          } else if (item.text.includes("sda1") || item.text.includes("eth0")) {
            delay = 200;
          }
          
          setTimeout(printNextLine, delay);
        }
      } else {
        // Show Initiate Button
        bootAction.classList.remove("hidden");
      }
    }

    setTimeout(printNextLine, 300);
  }

  // --- 2.1 Animated Nodes ---
  function setupIntroNodes() {
    const canvas = document.getElementById("node-network-canvas");
    if (!canvas) return { stop: () => {} }; 
    const ctx = canvas.getContext("2d");
    const intro = document.getElementById("intro");
    
    let animationFrameId;
    const NODE_COUNT = 65; 
    const MAX_LINK_DISTANCE = 160; 
    const NODE_SPEED = 0.35; 
    let particles = [];
    
    let mouse = { x: null, y: null };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    if (intro) {
      intro.addEventListener("mousemove", handleMouseMove);
      intro.addEventListener("mouseleave", handleMouseLeave);
    }

    function getAccentColorRgb() {
      const style = getComputedStyle(document.documentElement);
      const rgb = style.getPropertyValue('--color-accent-rgb').trim();
      return rgb || '165, 200, 214';
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      particles = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    class Particle { 
      constructor() {
        this.x = Math.random() * canvas.clientWidth;
        this.y = Math.random() * canvas.clientHeight;
        this.vx = (Math.random() - 0.5) * NODE_SPEED;
        this.vy = (Math.random() - 0.5) * NODE_SPEED; 
        this.radius = Math.random() * 2 + 1;        
      }

      update() {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            this.vx += (dx / dist) * 0.015;
            this.vy += (dy / dist) * 0.015;
            
            const speed = Math.hypot(this.vx, this.vy);
            if (speed > NODE_SPEED * 2.5) {
              this.vx = (this.vx / speed) * NODE_SPEED * 2.5;
              this.vy = (this.vy / speed) * NODE_SPEED * 2.5;
            }
          }
        }
        
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.99;
        this.vy *= 0.99;

        if (this.x < 0 || this.x > canvas.clientWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.clientHeight) this.vy *= -1;
      }

      draw(colorRgb) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, 0.15)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb}, 0.85)`;
        ctx.fill(); 
      }
    }

    function connect(colorRgb) {
      for (let a = 0; a < particles.length; a++) {
        if (mouse.x !== null && mouse.y !== null) {
          const mDistance = Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y);
          if (mDistance < 180) {
            const mOpacity = 1 - (mDistance / 180);
            ctx.strokeStyle = `rgba(${colorRgb}, ${mOpacity * 0.75})`;
            ctx.lineWidth = 1.2 / (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let b = a + 1; b < particles.length; b++) {
          const distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
          
          if (distance < MAX_LINK_DISTANCE) {
            const opacity = 1 - (distance / MAX_LINK_DISTANCE);
            ctx.strokeStyle = `rgba(${colorRgb}, ${opacity * 0.35})`; 
            ctx.lineWidth = 0.8 / (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      const colorRgb = getAccentColorRgb();
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles.forEach(p => {
        p.update();
        p.draw(colorRgb);
      });
      connect(colorRgb);
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);

    resize();
    animate();

    return {
      stop: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (intro) {
          intro.removeEventListener("mousemove", handleMouseMove);
          intro.removeEventListener("mouseleave", handleMouseLeave);
        }
      }
    };
  }


  // --- 3. SCRAMBLING ROLES EFFECT MODULE ---
  function setupTypingEffect() {
    const heroRoles = document.getElementById("hero-roles");
    if (!heroRoles) return;

    const roles = ["Programmer", "Software Engineer", "Pixel Artist"];
    let roleIndex = 0;

    const MIN_STANDBY_TIME = 500;
    const MAX_STANDBY_TIME = 1000;
    const MIN_TYPING_SPEED = 50;
    const MAX_TYPING_SPEED = 100;

    const scrambleSets = [
      "!<>-_\\/[]{}—=+*^?#",   
      "01010101010101",       
      "<>|{}()[]#?/",         
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
      "abcdefghijklmnopqrstuvwxyz",        
      "0123456789",                       
      "@$%&*+-~!?^=:",                   
      "▓▒░█▄▀▌▐■□◆◇◉◎○●◍◌",         
      "★☆✦✧✩✪✫✬✭✮✯✰",                  
      "☯☮☢☠⚡⚙⚔♠♣♥♦☾☀☁☂",
      "⎈⍟⍣⍤⍥⍨⍩⍪⍫⍬⍭⍮⍯⍰",                           
      "⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯",                           
      "⸮‽⁂※†‡•◦‣⁜⁂⁕⁑⁂⁂⁛",
    ];
     const scramble = (text) => {
      const currentScrambleChars = scrambleSets[Math.floor(Math.random() * scrambleSets.length)];

      const randomTypingSpeed = Math.random() * (MAX_TYPING_SPEED - MIN_TYPING_SPEED) + MIN_TYPING_SPEED;
      const randomStandbyTime = Math.random() * (MAX_STANDBY_TIME - MIN_STANDBY_TIME) + MIN_STANDBY_TIME;
      
      let i = 0;
      const interval = setInterval(() => {
        heroRoles.textContent = text
          .split("")
          .map((char, index) => {
            if (index < i) {
              return text[index]; 
            }
            return currentScrambleChars[Math.floor(Math.random() * currentScrambleChars.length)];
          })
          .join("");

        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(deleteText, randomStandbyTime);
        }
        i++;
      }, randomTypingSpeed);
    };

    const deleteText = () => {
      const currentText = heroRoles.textContent;
      let i = currentText.length;
      const interval = setInterval(() => {
        heroRoles.textContent = currentText.substring(0, i);
        
        if (i <= 0){
          clearInterval(interval);
          // Move to the next role and start scrambling it
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(() => scramble(roles[roleIndex]), 50);
        }
        i--;
      }, 50);
    };
    
    scramble(roles[roleIndex]);
  }

  // --- 4. NAVIGATION MODULE ---
  function setupNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.getElementById("nav-links");
    const hamburger = document.getElementById("hamburger");
    if (!navbar || !navLinks || !hamburger) return;

    const closeMenu = () => {
      if (!navLinks.classList.contains("open")) return;
      navLinks.classList.add("closing");
      navLinks.classList.remove("open");
      navLinks.addEventListener("animationend", () => {
        navLinks.classList.remove("closing");
      }, { once: true });
    };

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        navLinks.classList.add("open");
      }
    });

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains("open")) {
        closeMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    let idleTimer;
    
    const showNavbar = () => navbar.classList.remove("hidden");
    const hideNavbar = () => {
      if (!navLinks.classList.contains("open")) {
        navbar.classList.add("hidden");
      }
    };

    const resetIdleTimer = () => {
      showNavbar();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(hideNavbar, 2000);
    };

    resetIdleTimer();
    ["mousemove", "touchmove", "keydown", "wheel"].forEach(evt => window.addEventListener(evt, resetIdleTimer));
  }

  // --- 5. PANEL ROUTER & TRANSITION MODULE ---
  function setupPanelNavigation() {
    const navLinks = document.querySelectorAll('#nav-links a');
    const scrollDownBtn = document.querySelector('.scroll-down-link');
    const panels = document.querySelectorAll('.panel');

    const switchPanel = (targetId) => {
      currentActivePanelId = targetId.substring(1);

      // 1. Update nav links active class
      navLinks.forEach(link => {
        if (link.getAttribute('href') === targetId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // 2. Activate target panel
      panels.forEach(panel => {
        if (`#${panel.id}` === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    };

    // Listen to nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        switchPanel(targetId);
      });
    });

    // Listen to home section scroll down arrow
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = scrollDownBtn.getAttribute('href');
        switchPanel(targetId);
      });
    }
  }

   // --- 6. PIXEL DUST CANVAS MODULE (Your Preferred Version) ---
  function initPixelDust() {
    const canvas = document.getElementById("pixelDust");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.imageSmoothingEnabled = false;

    const dpr = window.devicePixelRatio || 1;
    const renderScale = 2.5;
    let W = 0, H = 0;
    const dusts = [];

    // --- State for Idle Constellation ---
    let lastInteractionTime = Date.now();
    const IDLE_THRESHOLD = 5000; // 5 seconds of inactivity to form a constellation
    let constellationActive = false;
    let constellationTimer = 0;
    let constellationShape = null;
    let constellationScale = 1.0;
    const constellationCenter = { x: 0, y: 0 };
    let constellationAssignedParticles = [];

    // Generators & geometries for constellation shapes
    function generateStarPoints(numPoints = 5) {
      const points = [];
      const lines = [];
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const r = i % 2 === 0 ? 1.0 : 0.45;
        points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      }
      for (let i = 0; i < numPoints * 2; i++) {
        lines.push([i, (i + 1) % (numPoints * 2)]);
      }
      return { points, lines };
    }

    function generateHeartPoints() {
      const points = [];
      const lines = [];
      const count = 12;
      for (let i = 0; i < count; i++) {
        const t = (i * 2 * Math.PI) / count;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        points.push({ x: x / 16, y: y / 17 });
      }
      for (let i = 0; i < count; i++) {
        lines.push([i, (i + 1) % count]);
      }
      return { points, lines };
    }

    const bigDipper = {
      points: [
        { x: -0.6, y: -0.4 },
        { x: -0.3, y: -0.3 },
        { x: -0.1, y: -0.1 },
        { x: 0.1, y: 0.1 },
        { x: 0.2, y: 0.4 },
        { x: 0.6, y: 0.3 },
        { x: 0.5, y: -0.1 }
      ],
      lines: [
        [0, 1], [1, 2], [2, 3],
        [3, 4], [4, 5], [5, 6], [6, 3]
      ]
    };

    const deltaShape = {
      points: [
        { x: 0.0, y: -0.6 },
        { x: 0.5, y: 0.4 },
        { x: -0.5, y: 0.4 },
        { x: 0.0, y: 0.1 }
      ],
      lines: [
        [0, 1], [1, 2], [2, 0],
        [0, 3], [1, 3], [2, 3]
      ]
    };

    const starShape = generateStarPoints(5);
    const heartShape = generateHeartPoints();
    const shapesList = [starShape, bigDipper, heartShape, deltaShape];

    function dissolveConstellation() {
      if (!constellationActive) return;
      constellationActive = false;
      dusts.forEach(d => {
        d.isConstellation = false;
        d.constellationTarget = null;
      });
      constellationAssignedParticles = [];
    }

    function resize() {
      dissolveConstellation();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const newW = Math.round(vw / renderScale);
      const newH = Math.round(vh / renderScale);

      const oldW = W || newW;
      const oldH = H || newH;
      W = newW; H = newH;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = vw + "px";
      canvas.style.height = vh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (dusts.length) {
        const sx = W / oldW, sy = H / oldH;
        dusts.forEach(d => { d.x *= sx; d.y *= sy; });
      }
    }
    window.addEventListener("resize", resize);
    resize();

    let lastScroll = window.scrollY || 0;
    let scrollSpeed = 0, scrollBoost = 0;

    window.addEventListener("scroll", () => {
      lastInteractionTime = Date.now();
      dissolveConstellation();
      const cur = window.scrollY || 0;
      const delta = cur - lastScroll;
      scrollSpeed += delta * 0.48;
      scrollBoost = Math.min(1, Math.abs(delta) / 100);
      lastScroll = cur;
    });

    window.addEventListener("wheel", (e) => {
      lastInteractionTime = Date.now();
      dissolveConstellation();
      scrollSpeed += e.deltaY * 0.12;
      scrollBoost = Math.min(1, Math.abs(e.deltaY) / 200);
    }, { passive: true });

    const targetAttractor = { x: 0, y: 0 };
    const attractor = { x: 0, y: 0, active: false, strength: 1.0 };
    let prevMouseX = 0, prevMouseY = 0;

    function updateAttractor(clientX, clientY) {
      // Prevent browser pointer-jitter from constantly resetting the idle constellation timer
      if (clientX === prevMouseX && clientY === prevMouseY) return;
      prevMouseX = clientX;
      prevMouseY = clientY;

      lastInteractionTime = Date.now();
      dissolveConstellation();
      
      targetAttractor.x = clientX / renderScale;
      targetAttractor.y = clientY / renderScale;
      
      if (!attractor.active) {
        // Snap to initial mouse position on first hover to prevent dragging across screen
        attractor.x = targetAttractor.x;
        attractor.y = targetAttractor.y;
      }
      attractor.active = true;
    }

    // Attach listeners to window and document to allow interaction even with pointer-events: none on canvas
    window.addEventListener("pointermove", (e) => updateAttractor(e.clientX, e.clientY), { passive: true });
    window.addEventListener("pointerup", () => attractor.active = false, { passive: true });
    window.addEventListener("pointerdown", () => {
      lastInteractionTime = Date.now();
      dissolveConstellation();
    }, { passive: true });
    document.addEventListener("pointerleave", () => attractor.active = false);

    const dustCount = 333;
    
    // Rare Shapes Setup: exactly 1.35% rare pixels
    const rareCount = Math.round(dustCount * 0.0135); // 333 * 0.0135 = 4.4955 -> 4 rare particles
    const rareShapes = ['triangle', 'pentagon', 'hexagon', 'octagon'];

    for (let i = 0; i < dustCount; i++) {
      const size = Math.random() * 2 + 1;
      let shape = 'square';
      let originalSize = size;
      
      if (i < rareCount) {
        shape = rareShapes[i % rareShapes.length];
        originalSize = Math.random() * 3 + 3.5; // Slightly larger rare shape to be visually distinct (3.5px to 6.5px)
      }

      dusts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        ax: 0, ay: 0,
        size: originalSize,
        glow: Math.random() * Math.PI * 2,
        parallax: Math.random() * 0.6 + 0.4,
        colorIndex: Math.floor(Math.random() * 5), // Color index for dynamic theme-aligned rendering
        isSizing: false,
        originalSize: originalSize,
        targetSize: originalSize,
        shape: shape,
        isConstellation: false,
        constellationTarget: null
      });
    }

    const ATTRACTOR_RADIUS = 85;
    const ATTRACTOR_FORCE = 0.06; // Reduced force for gentler, slower, and smoother repulsion
    const FLASH_PROB = 0.0007;
    const COLOR_FLICKER_PROB = 0.0006;
    const RARE_TWINKLE_PROB = 0.00001; 

    function drawPixel(x, y, size, color, alpha, shape = 'square') {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      
      if (shape === 'square') {
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.round(size), Math.round(size));
      } else {
        const cx = x + size / 2;
        const cy = y + size / 2;
        const radius = size / 2;
        
        ctx.beginPath();
        if (shape === 'triangle') {
          drawPolygonPath(ctx, cx, cy, radius, 3);
        } else if (shape === 'pentagon') {
          drawPolygonPath(ctx, cx, cy, radius, 5);
        } else if (shape === 'hexagon') {
          drawPolygonPath(ctx, cx, cy, radius, 6);
        } else if (shape === 'octagon') {
          drawPolygonPath(ctx, cx, cy, radius, 8);
        }
        ctx.fill();
      }
    }

    function drawPolygonPath(ctx, cx, cy, radius, sides) {
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    let currentThemeColors = ['#A5C8D6', '#D9E4E0', '#F0F4F8', '#3F4E4F', '#FFFFFF'];
    let currentThemeRgb = '165, 200, 214';

    function updateThemeColors() {
      try {
        const style = getComputedStyle(document.documentElement);
        const accent = style.getPropertyValue('--color-accent').trim() || '#A5C8D6';
        const accentSubtle = style.getPropertyValue('--color-accent-subtle').trim() || '#D9E4E0';
        const lightText = style.getPropertyValue('--color-light-text').trim() || '#F0F4F8';
        const darkAccent = style.getPropertyValue('--color-dark-accent').trim() || '#3F4E4F';
        currentThemeColors = [accent, accentSubtle, lightText, darkAccent, '#FFFFFF'];

        const accentRgb = style.getPropertyValue('--color-accent-rgb').trim();
        if (accentRgb) {
          currentThemeRgb = accentRgb;
        } else if (accent.startsWith('#')) {
          const r = parseInt(accent.slice(1, 3), 16);
          const g = parseInt(accent.slice(3, 5), 16);
          const b = parseInt(accent.slice(5, 7), 16);
          currentThemeRgb = `${r}, ${g}, ${b}`;
        } else {
          currentThemeRgb = '165, 200, 214';
        }
      } catch (e) {
        console.error("Failed to update theme colors, using defaults:", e);
      }
    }

    // Initialize cached colors
    updateThemeColors();

    // Listen to theme dot click events (delay to let custom properties update first)
    document.querySelectorAll('.terminal-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        setTimeout(updateThemeColors, 25);
      });
    });

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // Smooth easing of attractor towards target coordinates
      if (attractor.active) {
        attractor.x += (targetAttractor.x - attractor.x) * 0.075;
        attractor.y += (targetAttractor.y - attractor.y) * 0.075;
      }

      const allowedPanels = ['about', 'projects', 'gallery'];

      // Dissolve constellation if active panel is not allowed (checked only when active)
      if (constellationActive) {
        const activePanelId = currentActivePanelId || 'home';
        if (!allowedPanels.includes(activePanelId)) {
          dissolveConstellation();
        }
      }

      // Check idle status for constellation formation
      if (Date.now() - lastInteractionTime > IDLE_THRESHOLD) {
        const activePanelId = currentActivePanelId || 'home';

        if (allowedPanels.includes(activePanelId)) {
          if (!constellationActive) {
            constellationActive = true;
            constellationShape = shapesList[Math.floor(Math.random() * shapesList.length)];
            
            // Random scale (relative to viewport dimensions)
            constellationScale = Math.min(W, H) * (0.16 + Math.random() * 0.12);
            
            // Random center coordinate (safe zone within 25% to 75% of viewport)
            constellationCenter.x = W * 0.25 + Math.random() * W * 0.5;
            constellationCenter.y = H * 0.25 + Math.random() * H * 0.5;
            
            // Random duration (8 to 14 seconds)
            constellationTimer = Date.now() + 8000 + Math.random() * 6000;
            
            // Assign random dust particles
            constellationAssignedParticles = [];
            const usedIndices = new Set();
            for (let pIdx = 0; pIdx < constellationShape.points.length; pIdx++) {
              let idx = Math.floor(Math.random() * dusts.length);
              while (usedIndices.has(idx)) {
                idx = Math.floor(Math.random() * dusts.length);
              }
              usedIndices.add(idx);
              constellationAssignedParticles.push(idx);

              const pt = constellationShape.points[pIdx];
              const targetX = constellationCenter.x + pt.x * constellationScale;
              const targetY = constellationCenter.y + pt.y * constellationScale;
              
              const d = dusts[idx];
              d.constellationTarget = { x: targetX, y: targetY };
              d.isConstellation = true;
            }
          } else if (Date.now() > constellationTimer) {
            dissolveConstellation();
          }
        }
      }

      dusts.forEach(d => {
        // --- MOVEMENT LOGIC ---
        d.ax += (Math.random() - 0.5) * 0.006;
        d.ay += (Math.random() - 0.5) * 0.004;
        d.vx += d.ax;
        d.vy += d.ay;
        d.y += scrollSpeed * 0.02 * d.parallax;

        let proximityBoost = 0;
        
        if (attractor.active) {
          const dx = attractor.x - d.x;
          const dy = attractor.y - d.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = ATTRACTOR_RADIUS * ATTRACTOR_RADIUS;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            if (dist > 0.001) {
              proximityBoost = (ATTRACTOR_RADIUS - dist) / ATTRACTOR_RADIUS;
              const strength = proximityBoost * ATTRACTOR_FORCE;
              // Repel dust particles from mouse position
              d.vx -= (dx / dist) * strength * (1 + d.parallax * 0.6);
              d.vy -= (dy / dist) * strength * (1 + d.parallax * 0.6);
            }
          }
        }

        if (d.isConstellation && d.constellationTarget) {
          // Attract particle towards target constellation coordinates
          const dx = d.constellationTarget.x - d.x;
          const dy = d.constellationTarget.y - d.y;
          
          d.vx += dx * 0.015;
          d.vy += dy * 0.015;
          
          // Dampen movement to settle nicely onto the constellation points
          d.vx *= 0.92;
          d.vy *= 0.92;
          
          // Constellation stars shimmer brighter
          proximityBoost = Math.max(proximityBoost, 0.6);
        }
        
        d.vx *= 0.995;
        d.vy *= 0.995;
        const maxSpeed = 0.4 * d.parallax;
        const speed = Math.hypot(d.vx, d.vy);
        if (speed > maxSpeed) {
          d.vx = (d.vx / speed) * maxSpeed;
          d.vy = (d.vy / speed) * maxSpeed;
        }
        
        d.x += d.vx;
        d.y += d.vy;

        if (!d.isSizing && Math.random() < RARE_TWINKLE_PROB) {
          d.isSizing = true;
          d.targetSize = (Math.random() < 0.2) 
            ? d.originalSize * 0.2 // Shrink
            : d.originalSize * (Math.random() * 3 + 2); // Grow
        }

        if (d.isSizing) {
          d.size += (d.targetSize - d.size) * 0.05; // Easing effect
          
          if (Math.abs(d.size - d.targetSize) < 0.05) {
            if (d.targetSize !== d.originalSize) {
              d.targetSize = d.originalSize;
            } else {
              d.isSizing = false;
            }
          }
        }

        if (!d.isConstellation && Math.random() < 0.00016) {
          // Respawn offscreen/randomly if they drift out of scope (constellation stars are protected from dying)
          d.x = Math.random() * W; d.y = Math.random() * H;
          d.vx = (Math.random() - 0.5) * 0.2; d.vy = (Math.random() - 0.5) * 0.2;
          d.colorIndex = Math.floor(Math.random() * currentThemeColors.length);
        }
        
        if (d.x < 0) d.x += W; if (d.x > W) d.x -= W;
        if (d.y < 0) d.y += H; if (d.y > H) d.y -= H;

        // --- DRAWING LOGIC ---
        d.glow += 0.02 + Math.random() * 0.005;
        let glowAlpha = 0.25 + Math.abs(Math.sin(d.glow)) * (0.45 + scrollBoost * 0.8);
        let renderSize = d.size;

        if (d.isConstellation) {
          // Beautiful breathing/twinkle effect specifically for constellation stars
          const pulse = Math.sin(Date.now() * 0.002 + d.glow) * 0.2 + 0.8; // oscillates 0.6 to 1.0
          glowAlpha = Math.min(1.0, 0.45 + pulse * 0.55);
          renderSize = d.size + 1.8;
        } else if (proximityBoost > 0) {
          // Boost glow and size near attractor (mouse pointer)
          glowAlpha = Math.min(1.0, glowAlpha + proximityBoost * 0.45);
          renderSize = d.size + proximityBoost * 1.5;
        }

        if (Math.random() < COLOR_FLICKER_PROB)
          d.colorIndex = Math.floor(Math.random() * currentThemeColors.length);
        
        drawPixel(d.x, d.y, renderSize, currentThemeColors[d.colorIndex], glowAlpha, d.shape);

        // Increase flash likelihood when cursor is nearby or constellation is active
        const activeFlashProb = proximityBoost > 0 ? FLASH_PROB * 5 : FLASH_PROB;
        if (Math.random() < activeFlashProb)
          drawPixel(d.x - 0.5, d.y - 0.5, renderSize + 2, "#FFFFFF", 0.98);
        
        d.ax = 0; d.ay = 0;
      });

      // Draw faint constellation lines if active
      if (constellationActive && constellationShape) {
        constellationShape.lines.forEach(([p1Idx, p2Idx]) => {
          const d1 = dusts[constellationAssignedParticles[p1Idx]];
          const d2 = dusts[constellationAssignedParticles[p2Idx]];
          if (d1 && d2 && d1.constellationTarget && d2.constellationTarget) {
            const distToTarget1 = Math.hypot(d1.constellationTarget.x - d1.x, d1.constellationTarget.y - d1.y);
            const distToTarget2 = Math.hypot(d2.constellationTarget.x - d2.x, d2.constellationTarget.y - d2.y);
            
            // Draw connection lines once particles are close to their target positions (within 25 grid units)
            if (distToTarget1 < 25 && distToTarget2 < 25) {
              const assembleFactor = (1 - distToTarget1 / 25) * (1 - distToTarget2 / 25);
              ctx.beginPath();
              ctx.moveTo(d1.x, d1.y);
              ctx.lineTo(d2.x, d2.y);
              
              // Brighter and thicker connection lines (so they are visually striking yet elegant)
              const lineAlpha = 0.26 * assembleFactor * (0.65 + Math.abs(Math.sin(Date.now() * 0.0012)) * 0.35);
              ctx.strokeStyle = `rgba(${currentThemeRgb}, ${lineAlpha})`;
              ctx.lineWidth = 0.95;
              ctx.stroke();
            }
          }
        });
      }

      scrollSpeed *= 0.92;
      scrollBoost *= 0.94;
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }


  // --- 7. PROJECT SLIDESHOW MODULE ---
  function setupProjectSlideshows() {
    const projectCards = document.querySelectorAll('.project-card, .project-view');

    projectCards.forEach(card => {
      const slides = card.querySelectorAll('.project-slide');
      const prevBtn = card.querySelector('.prev-btn');
      const nextBtn = card.querySelector('.next-btn');
      let currentSlide = 0;

      if (!slides || slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
      }

      const showSlide = (index) => {
        slides.forEach((slide, i) => {
          slide.classList.remove('active');
          if (i === index) {
            slide.classList.add('active');
          }
        });
      };

      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });

      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    });
  }

  // --- 7.5. IDE/EXPLORER MODULE ---
  function setupProjectExplorer() {
    const fileElements = document.querySelectorAll('.tree-file');
    const tabsContainer = document.querySelector('.viewer-tabs');
    const projectViews = document.querySelectorAll('.project-view');
    const viewerContent = document.querySelector('.viewer-content');

    if (!fileElements || !tabsContainer || !viewerContent) return;

    // Custom Alert Overlay bindings
    const alertOverlay = document.getElementById('editor-alert-overlay');
    const closeAlertBtn = document.getElementById('close-editor-alert');
    if (closeAlertBtn && alertOverlay) {
      closeAlertBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alertOverlay.classList.add('hidden');
      });
    }

    // Track open tabs: { project: string, fileType: string, label: string }
    let openTabs = [
      { project: 'coco-sorter', fileType: 'readme', label: 'README.md (coco-sorter)' }
    ];
    let activeTabIndex = 0;

    // Create a beautiful placeholder for the empty editor state
    let emptyState = document.getElementById('editor-empty-state');
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.id = 'editor-empty-state';
      emptyState.style.display = 'none';
      emptyState.style.flexDirection = 'column';
      emptyState.style.alignItems = 'center';
      emptyState.style.justifyContent = 'center';
      emptyState.style.height = '100%';
      emptyState.style.color = 'rgba(var(--color-accent-rgb, 165, 200, 214), 0.25)';
      emptyState.style.fontFamily = 'var(--font-mono)';
      emptyState.style.fontSize = '0.9rem';
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '2rem';
      emptyState.innerHTML = `
        <span style="font-size: 2.5rem; margin-bottom: 0.8rem; display: block; opacity: 0.65;">📂</span>
        <p style="font-weight: bold; margin-bottom: 0.2rem;">No Files Open</p>
        <p style="font-size: 0.75rem; opacity: 0.8;">Select a file from the workspace explorer on the left to open it.</p>
      `;
      viewerContent.appendChild(emptyState);
    }

    function renderTabs() {
      tabsContainer.innerHTML = '';

      if (openTabs.length === 0) {
        activeTabIndex = -1;
        emptyState.style.display = 'flex';
      } else {
        emptyState.style.display = 'none';
      }

      openTabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = `viewer-tab ${index === activeTabIndex ? 'active' : ''}`;

        const icon = tab.fileType === 'readme' ? '📄' : '🖼️';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = `${icon} ${tab.label}`;
        tabEl.appendChild(labelSpan);

        const closeBtn = document.createElement('span');
        closeBtn.className = 'tab-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeTab(index);
        });
        tabEl.appendChild(closeBtn);

        tabEl.addEventListener('click', () => {
          activateTab(index);
        });

        tabsContainer.appendChild(tabEl);
      });

      // Update active state of views
      projectViews.forEach(view => {
        view.classList.remove('active');
      });

      fileElements.forEach(el => el.classList.remove('active'));

      if (activeTabIndex !== -1 && openTabs[activeTabIndex]) {
        const activeTab = openTabs[activeTabIndex];
        const targetViewId = `view-${activeTab.project}-${activeTab.fileType}`;
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
          targetView.classList.add('active');
        }

        // Highlight matching file in sidebar tree
        fileElements.forEach(el => {
          const p = el.getAttribute('data-project');
          const f = el.getAttribute('data-file');
          if (p === activeTab.project && f === activeTab.fileType) {
            el.classList.add('active');
          }
        });
      }
    }

    function activateTab(index) {
      activeTabIndex = index;
      renderTabs();
    }

    function closeTab(index) {
      openTabs.splice(index, 1);
      if (index === activeTabIndex) {
        // Shift active tab left or right
        activeTabIndex = Math.max(0, index - 1);
        if (openTabs.length === 0) {
          activeTabIndex = -1;
        }
      } else if (index < activeTabIndex) {
        activeTabIndex--;
      }
      
      // Auto-hide alert if tab count drops below 5
      if (openTabs.length < 5 && alertOverlay) {
        alertOverlay.classList.add('hidden');
      }

      renderTabs();
    }

    fileElements.forEach(fileEl => {
      fileEl.addEventListener('click', () => {
        const project = fileEl.getAttribute('data-project');
        const fileType = fileEl.getAttribute('data-file');
        const fileName = fileType === 'readme' ? 'README.md' : 'preview.png';
        const tabLabel = `${fileName} (${project})`;

        // Check if tab is already open
        const existingIndex = openTabs.findIndex(
          t => t.project === project && t.fileType === fileType
        );

        if (existingIndex !== -1) {
          activateTab(existingIndex);
          if (alertOverlay) {
            alertOverlay.classList.add('hidden');
          }
        } else {
          // Max limit check
          if (openTabs.length >= 5) {
            if (alertOverlay) {
              alertOverlay.classList.remove('hidden');
            }
            return;
          }

          openTabs.push({
            project: project,
            fileType: fileType,
            label: tabLabel
          });
          activeTabIndex = openTabs.length - 1;
          if (alertOverlay) {
            alertOverlay.classList.add('hidden');
          }
          renderTabs();
        }
      });
    });

    // Toggle for YouTube video inside CocoSorter README
    const cocoVideoBtn = document.getElementById('coco-video-btn');
    const cocoVideoEmbed = document.getElementById('coco-video-embed');
    if (cocoVideoBtn && cocoVideoEmbed) {
      cocoVideoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (cocoVideoEmbed.style.display === 'none') {
          cocoVideoEmbed.style.display = 'block';
          cocoVideoBtn.textContent = 'Hide Video';
        } else {
          cocoVideoEmbed.style.display = 'none';
          cocoVideoBtn.textContent = 'Video Demo';
        }
      });
    }

    // Run initial rendering
    renderTabs();
  }

// --- 8. GALLERY CAROUSEL MODULE (with Directional Drag) ---
  // --- 8. RETRO BADGE GALLERY MODULE (Yume 2kki Inspired) ---
  function setupBadgeGallery() {
    const badgeSlots = document.querySelectorAll('.badge-slot');
    const detailIconImg = document.getElementById('detail-icon-img');
    const detailIconTxt = document.getElementById('detail-icon-txt');
    const detailName = document.getElementById('detail-badge-name');
    const detailDesc = document.getElementById('detail-badge-desc');

    const badgeModal = document.getElementById('badge-modal');
    const modalBadgeImg = document.getElementById('modal-badge-img');
    const modalBadgeTxt = document.getElementById('modal-badge-txt');
    const modalBadgeName = document.getElementById('modal-badge-name');
    const modalBadgeDesc = document.getElementById('modal-badge-desc');
    const closeBadgeModal = document.getElementById('close-badge-modal');

    if (badgeSlots.length === 0 || !detailName || !detailDesc) return;

    function openFullView(slot) {
      if (!badgeModal || !modalBadgeName || !modalBadgeDesc) return;

      const name = slot.getAttribute('data-name');
      const desc = slot.getAttribute('data-desc');
      const img = slot.getAttribute('data-img');

      modalBadgeName.textContent = name;
      modalBadgeDesc.textContent = desc;

      if (img) {
        if (modalBadgeImg) {
          modalBadgeImg.src = img;
          modalBadgeImg.style.display = 'block';
        }
        if (modalBadgeTxt) {
          modalBadgeTxt.style.display = 'none';
        }
      } else {
        if (modalBadgeImg) {
          modalBadgeImg.style.display = 'none';
        }
        if (modalBadgeTxt) {
          modalBadgeTxt.style.display = 'block';
        }
      }

      badgeModal.classList.remove('hidden');
    }

    badgeSlots.forEach(slot => {
      // 1. Click handling: Selects if not active, opens full view if clicked again while active
      slot.addEventListener('click', () => {
        if (slot.classList.contains('active')) {
          openFullView(slot);
        } else {
          // Remove active state from all slots
          badgeSlots.forEach(s => s.classList.remove('active'));
          
          // Add active state to clicked slot
          slot.classList.add('active');

          // Read badge data
          const name = slot.getAttribute('data-name');
          const desc = slot.getAttribute('data-desc');
          const img = slot.getAttribute('data-img');

          // Update details panel
          detailName.textContent = name;
          detailDesc.textContent = desc;

          if (img) {
            // Unlocked badge
            if (detailIconImg) {
              detailIconImg.src = img;
              detailIconImg.style.display = 'block';
            }
            if (detailIconTxt) {
              detailIconTxt.style.display = 'none';
            }
          } else {
            // Locked badge
            if (detailIconImg) {
              detailIconImg.style.display = 'none';
            }
            if (detailIconTxt) {
              detailIconTxt.style.display = 'block';
            }
          }
        }
      });

      // 2. Double click handling: Opens full view directly
      slot.addEventListener('dblclick', () => {
        openFullView(slot);
      });
    });

    // 3. Modal close bindings
    if (closeBadgeModal && badgeModal) {
      closeBadgeModal.addEventListener('click', (e) => {
        e.stopPropagation();
        badgeModal.classList.add('hidden');
      });
      
      badgeModal.addEventListener('click', (e) => {
        if (e.target === badgeModal) {
          badgeModal.classList.add('hidden');
        }
      });
    }
  }

  // --- 9. ABOUT SECTION MODULE (Static partitioned pages & Photo Navigation Modal) ---
  function setupAboutSection() {
    // 1. Terminal page switcher
    const nextBtn = document.getElementById('terminal-next-btn');
    const indicator = document.querySelector('.terminal-page-indicator');
    const pages = document.querySelectorAll('.terminal-page');
    if (nextBtn && indicator && pages.length > 0) {
      let currentPage = 0;
      const showPage = (index) => {
        pages.forEach((page, i) => {
          if (i === index) {
            page.classList.add('active');
          } else {
            page.classList.remove('active');
          }
        });
        indicator.textContent = `PAGE ${index + 1}/${pages.length}`;
      };

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPage = (currentPage + 1) % pages.length;
        showPage(currentPage);
      });
    }

    // 2. Photo Modal Highlight controls
    const viewPhotosLink = document.getElementById('view-photos-link');
    const photoModal = document.getElementById('photo-modal');
    const modalCloseBtn = photoModal ? photoModal.querySelector('.modal-close-btn') : null;

    const openModal = (e) => {
      if (e) e.preventDefault();
      if (photoModal) {
        photoModal.classList.add('active');
      }
      // Pause background canvas loop & rain animations to boost modal transition FPS
      const dust = document.getElementById('pixelDust');
      if (dust) dust.style.display = 'none';
      const rain = document.querySelector('.digital-rain-container');
      if (rain) rain.style.display = 'none';
    };

    const closeModal = (e) => {
      if (e) e.preventDefault();
      if (photoModal) {
        photoModal.classList.remove('active');
      }
      // Restore background animations once modal is closed
      const dust = document.getElementById('pixelDust');
      if (dust) dust.style.display = '';
      const rain = document.querySelector('.digital-rain-container');
      if (rain) rain.style.display = '';
    };

    if (viewPhotosLink) viewPhotosLink.addEventListener('click', openModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (photoModal) {
      photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
          closeModal();
        }
      });
    }

    // 2. Polaroid Single-View Slider (Robust Center Scale/Fade Swap)
    const deck = document.getElementById('photo-deck');
    if (deck) {
      const cards = Array.from(deck.querySelectorAll('.polaroid-frame'));
      let currentPhotoIndex = 0;
      let isAnimating = false;

      // Initialize first photo as active
      cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === 0) {
          card.classList.add('active');
        }
      });

      deck.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAnimating || cards.length < 2) return;
        isAnimating = true;

        const currentCard = cards[currentPhotoIndex];
        const nextPhotoIndex = (currentPhotoIndex + 1) % cards.length;
        const nextCard = cards[nextPhotoIndex];

        // Scale down and fade out current card
        currentCard.style.transform = 'scale(0.9) translateZ(0)';
        currentCard.classList.remove('active');

        // Transition duration is 350ms matching the CSS transition
        setTimeout(() => {
          currentPhotoIndex = nextPhotoIndex;
          
          // Reset styling transforms on previous card
          currentCard.style.transform = '';
          
          // Scale up and fade in next card
          nextCard.classList.add('active');
          isAnimating = false;
        }, 350);
      });
    }
  }

  // --- 10. TERMINAL THEME TOGGLING EASTER EGG ---
  function setupThemeToggling() {
    const dots = document.querySelectorAll('.terminal-dot');
    if (!dots.length) return;

    let rainbowIndex = 0;
    const rainbowThemes = ['matrix', 'amber', 'synthwave', 'cyan', 'crimson', 'mint', 'sunset', 'yellow'];

    const presets = {
      matrix: {
        '--color-dark-bg': '#050B05',
        '--color-dark-bg-rgb': '5, 11, 5',
        '--color-light-text': '#00FF66',
        '--color-accent': '#00FF66',
        '--color-accent-rgb': '0, 255, 102',
        '--color-accent-subtle': '#009933',
        '--color-dark-accent': '#0F200F',
        '--color-light-bg': '#00FF66',
        '--color-dark-text': '#050B05'
      },
      amber: {
        '--color-dark-bg': '#0F0A00',
        '--color-dark-bg-rgb': '15, 10, 0',
        '--color-light-text': '#FFB000',
        '--color-accent': '#FFB000',
        '--color-accent-rgb': '255, 176, 0',
        '--color-accent-subtle': '#B37B00',
        '--color-dark-accent': '#261C02',
        '--color-light-bg': '#FFB000',
        '--color-dark-text': '#0F0A00'
      },
      synthwave: {
        '--color-dark-bg': '#1A0B2E',
        '--color-dark-bg-rgb': '26, 11, 46',
        '--color-light-text': '#F3E8FF',
        '--color-accent': '#BD93F9',
        '--color-accent-rgb': '189, 147, 249',
        '--color-accent-subtle': '#8B5CF6',
        '--color-dark-accent': '#3B0764',
        '--color-light-bg': '#F3E8FF',
        '--color-dark-text': '#1A0B2E'
      },
      cyan: {
        '--color-dark-bg': '#0B1E2D',
        '--color-dark-bg-rgb': '11, 30, 45',
        '--color-light-text': '#E0F2FE',
        '--color-accent': '#00F0FF',
        '--color-accent-rgb': '0, 240, 255',
        '--color-accent-subtle': '#0284C7',
        '--color-dark-accent': '#0F3A5F',
        '--color-light-bg': '#E0F2FE',
        '--color-dark-text': '#0B1E2D'
      },
      crimson: {
        '--color-dark-bg': '#1A0505',
        '--color-dark-bg-rgb': '26, 5, 5',
        '--color-light-text': '#FFEAEF',
        '--color-accent': '#FF2D55',
        '--color-accent-rgb': '255, 45, 85',
        '--color-accent-subtle': '#F43F5E',
        '--color-dark-accent': '#450A0A',
        '--color-light-bg': '#FFEAEF',
        '--color-dark-text': '#1A0505'
      },
      mint: {
        '--color-dark-bg': '#022C22',
        '--color-dark-bg-rgb': '2, 44, 34',
        '--color-light-text': '#ECFDF5',
        '--color-accent': '#34D399',
        '--color-accent-rgb': '52, 211, 153',
        '--color-accent-subtle': '#059669',
        '--color-dark-accent': '#064E3B',
        '--color-light-bg': '#ECFDF5',
        '--color-dark-text': '#022C22'
      },
      sunset: {
        '--color-dark-bg': '#1C0F0A',
        '--color-dark-bg-rgb': '28, 15, 10',
        '--color-light-text': '#FFF7ED',
        '--color-accent': '#FF5E00',
        '--color-accent-rgb': '255, 94, 0',
        '--color-accent-subtle': '#EA580C',
        '--color-dark-accent': '#451A03',
        '--color-light-bg': '#FFF7ED',
        '--color-dark-text': '#1C0F0A'
      },
      yellow: {
        '--color-dark-bg': '#171405',
        '--color-dark-bg-rgb': '23, 20, 5',
        '--color-light-text': '#FEFCE8',
        '--color-accent': '#FFE600',
        '--color-accent-rgb': '255, 230, 0',
        '--color-accent-subtle': '#CA8A04',
        '--color-dark-accent': '#423805',
        '--color-light-bg': '#FEFCE8',
        '--color-dark-text': '#171405'
      }
    };

    const themes = {
      default: () => {
        const root = document.documentElement;
        root.style.removeProperty('--color-dark-bg');
        root.style.removeProperty('--color-dark-bg-rgb');
        root.style.removeProperty('--color-light-text');
        root.style.removeProperty('--color-accent');
        root.style.removeProperty('--color-accent-rgb');
        root.style.removeProperty('--color-accent-subtle');
        root.style.removeProperty('--color-dark-accent');
        root.style.removeProperty('--color-light-bg');
        root.style.removeProperty('--color-dark-text');
        
        document.body.classList.remove('light-mode');
        document.body.classList.remove('mono-chrome-mode');
      },
      mono: () => {
        setThemeProperties({
          '--color-dark-bg': '#000000',
          '--color-dark-bg-rgb': '0, 0, 0',
          '--color-light-text': '#ffffff',
          '--color-accent': '#ffffff',
          '--color-accent-rgb': '255, 255, 255',
          '--color-accent-subtle': '#dddddd',
          '--color-dark-accent': '#262626',
          '--color-light-bg': '#ffffff',
          '--color-dark-text': '#000000'
        });
        document.body.classList.remove('light-mode');
        document.body.classList.add('mono-chrome-mode');
      },
      rainbow: () => {
        const selectedTheme = rainbowThemes[rainbowIndex];
        setThemeProperties(presets[selectedTheme]);
        document.body.classList.remove('light-mode');
        document.body.classList.add('mono-chrome-mode');
        
        // Cycle to next colorful theme
        rainbowIndex = (rainbowIndex + 1) % rainbowThemes.length;
      }
    };

    function setThemeProperties(props) {
      const root = document.documentElement;
      for (const [key, value] of Object.entries(props)) {
        root.style.setProperty(key, value);
      }
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeName = dot.getAttribute('data-theme');
        if (themes[themeName]) {
          themes[themeName]();
        }
      });
    });
  }
});