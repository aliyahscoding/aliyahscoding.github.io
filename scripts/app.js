// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header behavior + mobile nav
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile menu on link click
menu?.querySelectorAll('a.nav-link').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* =========================
   Section-reactive background orbs
   ========================= */
(() => {
  const root = document.getElementById('bg-orbs');
  if (!root) return;

  // Honor reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Orb palettes per section (feel free to tweak color combos)
  const SETS = {
    hero:     [ ['pink', -6,  12, 360, .75,  0.05], ['blue', 84, 10, 320, .55, -0.02], ['gold', 50, 22, 260, .45, 0.02] ],
    about:    [ ['teal', 60, 18, 280, .65, -0.02], ['pink',  8,  8, 300, .60,  0.04], ['mint', 85, 28, 240, .55, 0.03] ],
    projects: [ ['violet', 82, 16, 300, .60, 0.03], ['blue',  12, 20, 320, .55, -0.02], ['teal',  38, 34, 240, .50, 0.02] ],
    resume:   [ ['gold',  70, 42, 280, .50, 0.02], ['pink',  16, 38, 240, .55, -0.02], ['blue',  90, 50, 220, .45, 0.02] ],
    contact:  [ ['mint',  12, 70, 300, .55, 0.03], ['violet', 88, 62, 260, .55, -0.02], ['blue',  44, 78, 220, .45, 0.02] ],
  };

  // Utility to create one orb element
  function makeOrb([name, xvw, yvh, size, op, speed]) {
    const el = document.createElement('span');
    el.className = `orb orb--${name}`;
    el.style.setProperty('--x', `${xvw}vw`);
    el.style.setProperty('--y', `${yvh}vh`);
    el.style.setProperty('--size', `${size}px`);
    el.style.setProperty('--o', op);
    if (!prefersReduced) el.dataset.speed = speed;
    el.dataset.state = 'in';
    return el;
  }

  // Cross-fade: mark existing as "out", then remove after fade; add new "in"
  function setOrbs(key) {
    const config = SETS[key] || [];
    // fade out existing
    const olds = [...root.children];
    olds.forEach(n => n.dataset.state = 'out');

    // create new
    const frag = document.createDocumentFragment();
    config.forEach(spec => frag.appendChild(makeOrb(spec)));
    root.appendChild(frag);

    // after fade, remove old nodes
    setTimeout(() => olds.forEach(n => n.remove()), 600);
  }

  // Pick initial set by first visible section
  function currentKey() {
    const sections = document.querySelectorAll('section[data-bg]');
    const y = window.scrollY + innerHeight * 0.35;
    let key = 'hero';
    sections.forEach(s => {
      if (y >= s.offsetTop) key = s.dataset.bg;
    });
    return key;
  }

  // Observer swaps sets as sections enter
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.3) {
        setOrbs(e.target.dataset.bg);
      }
    });
  }, { rootMargin: '0px 0px -40% 0px', threshold: [0.25, 0.4, 0.6] });

  // Observe sections
  document.querySelectorAll('section[data-bg]').forEach(s => io.observe(s));

  // Initial paint (hero or first section in view)
  setOrbs(currentKey());

  // Recompute on resize (positions are vw/vh based; keep it fresh)
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => setOrbs(currentKey()), 150);
  });
})();
