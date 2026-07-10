/* ============================================================
   SHREEJI LASER - JAVASCRIPT
   Logic: Page routing, mobile menu, animations, counter count-up
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize App
  showPage('home');
  setupHeaderScroll();
  setupObserverReveal();
  
  // Initial animation trigger
  setTimeout(animateCounters, 400);
});

/* ──────────────────────────────────────────────────────
   PAGE NAVIGATION / ROUTING SYSTEM
────────────────────────────────────────────────────── */
function showPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    p.classList.remove('show');
    // Hide after animation finishes or quickly
    p.style.display = 'none';
    p.classList.remove('active');
  });

  const target = document.getElementById('page-' + id);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');
    
    // Quick reflow to trigger transition
    void target.offsetHeight;
    target.classList.add('show');
  }

  // Update navigation link highlighting
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  const pageMenuMap = {
    home: 'HOME',
    about: 'ABOUT US',
    services: 'OUR PRODUCTS ▾',
    gallery: 'PHOTOS & VIDEOS',
    global: 'GLOBAL PRESENCE',
    downloads: 'DOWNLOADS',
    contact: 'CONTACT US'
  };

  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.textContent.trim() === pageMenuMap[id]) {
      a.classList.add('active');
    }
  });

  // Scroll smoothly back to top on page swap
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeNavMenu();

  // Re-observe target elements for animations
  setTimeout(triggerReveal, 100);

  // If entering home page, run count counters
  if (id === 'home') {
    setTimeout(animateCounters, 300);
  }
}

/* ──────────────────────────────────────────────────────
   MOBILE NAVIGATION DRAWER
────────────────────────────────────────────────────── */
function toggleNav() {
  const nav = document.getElementById('navLinks');
  const closeBtn = document.getElementById('closeNav');
  if (nav && closeBtn) {
    nav.classList.toggle('open');
    closeBtn.classList.toggle('visible');
  }
}

function closeNavMenu() {
  const nav = document.getElementById('navLinks');
  const closeBtn = document.getElementById('closeNav');
  if (nav && closeBtn) {
    nav.classList.remove('open');
    closeBtn.classList.remove('visible');
  }
}

/* ──────────────────────────────────────────────────────
   HEADER SCROLL TRANSITION
────────────────────────────────────────────────────── */
function setupHeaderScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ──────────────────────────────────────────────────────
   SCROLL REVEAL (INTERSECTION OBSERVER)
────────────────────────────────────────────────────── */
let revealObserver;

function setupObserverReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });
  
  triggerReveal();
}

function triggerReveal() {
  if (!revealObserver) return;
  
  const targets = document.querySelectorAll(
    '.page.active .reveal, ' +
    '.page.active .reveal-left, ' +
    '.page.active .reveal-right, ' +
    '.page.active .stagger'
  );
  
  targets.forEach(el => {
    // Only observe if not already animated
    if (!el.classList.contains('visible')) {
      revealObserver.observe(el);
    }
  });
}

/* ──────────────────────────────────────────────────────
   STATS COUNT-UP ANIMATION
────────────────────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('.page.active .count-up');
  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    // Reset before animating
    el.textContent = '0';

    const duration = 1500; // ms
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula
      const easeValue = progress * (2 - progress);
      const currentValue = Math.floor(easeValue * target);
      
      el.textContent = currentValue;

      if (frame >= totalFrames) {
        el.textContent = target;
        clearInterval(counterInterval);
      }
    }, frameRate);
  });
}

/* ──────────────────────────────────────────────────────
   CONTACT FORM HANDLER
────────────────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  
  // Basic validation check (simulated)
  const inputs = btn.closest('.contact-form-wrap').querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  });

  if (!isValid) return;

  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#111111';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.disabled = false;
    
    // Clear inputs
    const allInputs = btn.closest('.contact-form-wrap').querySelectorAll('input, textarea, select');
    allInputs.forEach(i => i.value = '');
  }, 2500);
}
