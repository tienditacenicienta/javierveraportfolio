// Navegación entre vistas con transición Liquid Glass; no usa scroll a anclas.
const viewLinks = document.querySelectorAll('[data-view-link]');
const viewPanels = document.querySelectorAll('[data-view]');
let currentView = document.querySelector('.view-panel.is-active')?.dataset.view || 'inicio';
let switchingView = false;

function showView(nextView, updateHistory = true) {
  if (!nextView || nextView === currentView || switchingView) return;
  const nextPanel = document.querySelector(`[data-view="${nextView}"]`);
  const currentPanel = document.querySelector(`[data-view="${currentView}"]`);
  if (!nextPanel || !currentPanel) return;
  switchingView = true;
  currentPanel.classList.remove('is-active');
  currentPanel.classList.add('is-leaving');
  nextPanel.classList.add('is-active');
  viewLinks.forEach(link => {
    const active = link.dataset.viewLink === nextView;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  currentView = nextView;
  if (updateHistory) history.replaceState({ view: nextView }, '', `#${nextView}`);
  window.setTimeout(() => {
    currentPanel.classList.remove('is-leaving');
    switchingView = false;
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
}

viewLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showView(link.dataset.viewLink);
}));

// Admite enlaces directos a una vista y los botones atrás/adelante del navegador.
function syncViewFromHash() {
  const requested = window.location.hash.replace('#', '') || 'inicio';
  showView(requested, false);
}
window.addEventListener('hashchange', syncViewFromHash);
if (['inicio', 'proyectos', 'enfoque', 'contacto'].includes(location.hash.slice(1))) {
  const requested = location.hash.slice(1);
  if (requested !== 'inicio') {
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('is-active'));
    document.querySelector(`[data-view="${requested}"]`)?.classList.add('is-active');
    currentView = requested;
    viewLinks.forEach(link => link.classList.toggle('active', link.dataset.viewLink === requested));
  }
}

// Cambia este número por tu WhatsApp en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = '51999999999';

const form = document.querySelector('#brief-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nombre = (data.get('nombre') || '').toString().trim();
  const marca = (data.get('marca') || '').toString().trim();
  const brief = (data.get('brief') || '').toString().trim();
  const presupuesto = (data.get('presupuesto') || 'Por definir').toString();
  if (!brief) return;
  const message = [
    'Hola, Javier. Me gustaría conversar sobre un proyecto.',
    nombre && `Nombre: ${nombre}`,
    marca && `Empresa / marca: ${marca}`,
    `Proyecto: ${brief}`,
    `Presupuesto estimado: ${presupuesto}`
  ].filter(Boolean).join('\n');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

// Las piezas flotan sutilmente con el cursor en escritorio; se desactiva en táctil.
document.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', event => { event.preventDefault(); showView('contacto'); }));

const cards = document.querySelectorAll('.project-card');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelector('.project-stage')?.addEventListener('pointermove', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    cards.forEach((card, index) => {
      const depth = (index % 4 + 1) * 3;
      card.style.setProperty('--move-x', `${x * depth}px`);
      card.style.setProperty('--move-y', `${y * depth}px`);
    });
  });
  document.querySelector('.project-stage')?.addEventListener('pointerleave', () => {
    cards.forEach(card => { card.style.removeProperty('--move-x'); card.style.removeProperty('--move-y'); });
  });
}
