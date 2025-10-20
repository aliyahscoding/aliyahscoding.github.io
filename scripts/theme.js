// theme.js — toggles light/dark, remembers choice, swaps logo, respects system prefs

const root = document.documentElement;
const btn = document.querySelector('.theme-toggle');
const logo = document.querySelector('.brand-logo');
const META_THEME = document.querySelector('meta[name="theme-color"]');

// paths for your two logo versions
const LOGO_LIGHT = 'assets/images/logo-light.png';
const LOGO_DARK  = 'assets/images/logo-dark.png';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  btn?.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  if (logo) logo.src = theme === 'dark' ? LOGO_DARK : LOGO_LIGHT;
  // set browser UI color on mobile
  if (META_THEME) META_THEME.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
}

function getStoredTheme() {
  try { return localStorage.getItem('theme'); } catch { return null; }
}

function storeTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch {}
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  const stored = getStoredTheme();
  const initial = stored || getSystemTheme() || 'light';
  applyTheme(initial);

  // Listen for system changes if user hasn't explicitly chosen
  if (!stored && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }
}

btn?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});

initTheme();

// Show or hide back-to-top arrow
window.addEventListener('scroll', () => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  if (window.scrollY > 400) btn.classList.add('show');
  else btn.classList.remove('show');
});

// Smooth scroll to top when arrow is clicked
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
