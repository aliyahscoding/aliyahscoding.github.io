// Load projects.json and render cards; handle flip vs expand based on hover capability
const grid = document.getElementById('project-grid');
const canHover = window.matchMedia('(hover: hover)').matches;

function cardTemplate(p) {
  const media = `
    <div class="card-media">
      <img src="${p.image}" alt="${p.alt}" loading="lazy">
    </div>
  `;

  return `
  <article class="project-card" data-id="${p.id}">
    <div class="card-inner">
      <div class="card-face card-front">
        ${media}
        <div class="card-meta">
          <h3>${p.title}</h3>
          <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="card-face card-back">
        <p>${p.description}</p>
        <div class="card-actions">
          ${p.repo ? `<a class="btn btn-primary btn-sm" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
          ${p.demo ? `<a class="btn btn-secondary btn-sm" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
        </div>
      </div>
    </div>
  </article>`;
}

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    const items = await res.json();
    if (!Array.isArray(items)) return;
    grid.innerHTML = items.map(cardTemplate).join('');
    wireCards();
  } catch (e) {
    // fallback card
  }
}

function wireCards() {
  const cards = grid.querySelectorAll('.project-card');
  cards.forEach(card => {
    if (canHover) {
      // Desktop: click to flip
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    } else {
      // Mobile: expand/collapse by toggling a class that shows the back under the front
      const inner = card.querySelector('.card-inner');
      inner.addEventListener('click', () => {
        card.classList.toggle('flipped');
        /* DISABLED: In mobile, rely on the same class but no 3D transforms if no hover
        inner.style.transform = inner.style.transform ? '' : 'translateY(0)'; */
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', loadProjects);
