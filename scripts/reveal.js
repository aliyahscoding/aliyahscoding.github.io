// Simple scroll-reveal using IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
