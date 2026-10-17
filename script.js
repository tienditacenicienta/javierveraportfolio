// Navegación por vistas con una expansión líquida que revela la siguiente pantalla.
const viewLinks = document.querySelectorAll('[data-view-link]');
const viewPanels = document.querySelectorAll('[data-view]');
const liquidWipe = document.querySelector('#liquid-wipe');
let currentView = document.querySelector('.view-panel.is-active')?.dataset.view || 'inicio';
let switchingView = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setActiveView(nextView) {
  viewPanels.forEach(panel => {
    const active = panel.dataset.view === nextView;
    panel.classList.toggle('is-active', active);
    panel.classList.remove('is-leaving');
    panel.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  viewLinks.forEach(link => {
    const active = link.dataset.viewLink === nextView;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  currentView = nextView;
}

function showView(nextView, updateHistory = true, sourceElement = null) {
  if (!nextView || nextView === currentView || switchingView) return;
  if (!document.querySelector(`[data-view="${nextView}"]`)) return;
  if (updateHistory) history.replaceState({ view: nextView }, '', `#${nextView}`);
  if (reducedMotion.matches || !liquidWipe) {
    setActiveView(nextView);
    return;
  }

  switchingView = true;
  const rect = sourceElement?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  liquidWipe.style.setProperty('--origin-x', `${x}px`);
  liquidWipe.style.setProperty('--origin-y', `${y}px`);
  liquidWipe.classList.remove('is-spreading', 'is-clearing');
  // Reinicia la animación para que cada clic produzca una expansión nueva.
  void liquidWipe.offsetWidth;
  liquidWipe.classList.add('is-spreading');

  window.setTimeout(() => {
    setActiveView(nextView); // El cambio sucede bajo la capa líquida, ya expandida.
    liquidWipe.classList.remove('is-spreading');
    liquidWipe.classList.add('is-clearing');
    window.setTimeout(() => {
      liquidWipe.classList.remove('is-clearing');
      switchingView = false;
    }, 260);
  }, 590);
}

viewLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showView(link.dataset.viewLink, true, link);
}));

function syncViewFromHash() {
  const requested = window.location.hash.replace('#', '') || 'inicio';
  if (requested !== currentView) showView(requested, false);
}
window.addEventListener('hashchange', syncViewFromHash);
const initialView = location.hash.slice(1);
if (['inicio', 'proyectos', 'enfoque', 'contacto'].includes(initialView)) setActiveView(initialView);

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
