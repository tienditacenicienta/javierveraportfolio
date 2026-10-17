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
