(() => {
  const navButtons = [...document.querySelectorAll('[data-view]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const transitionLayer = document.getElementById('transitionLayer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentView = 'home';
  let switching = false;
  let transitionTimer;

  function setView(nextView) {
    if (!nextView || nextView === currentView || switching) return;
    const nextPanel = document.querySelector(`[data-panel="${nextView}"]`);
    if (!nextPanel) return;
    switching = true;
    navButtons.forEach(button => {
      const active = button.dataset.view === nextView;
      if (button.classList.contains('nav-link')) button.classList.toggle('is-active', active);
    });

    if (reducedMotion) {
      panels.forEach(panel => {
        const active = panel.dataset.panel === nextView;
        panel.classList.toggle('is-visible', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
      currentView = nextView;
      switching = false;
      history.replaceState(null, '', `#${nextView}`);
      return;
    }

    transitionLayer.classList.remove('is-running');
    void transitionLayer.offsetWidth;
    transitionLayer.classList.add('is-running');
    // A single, brief overlap is intentional during the wipe; the old view is hidden
    // before the new view becomes fully visible, avoiding a persistent double image.
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      panels.forEach(panel => {
        const active = panel.dataset.panel === nextView;
        panel.classList.toggle('is-visible', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
      currentView = nextView;
      history.replaceState(null, '', `#${nextView}`);
      window.setTimeout(() => {
        transitionLayer.classList.remove('is-running');
        switching = false;
      }, 90);
    }, 330);
    window.setTimeout(() => {
      transitionLayer.classList.remove('is-running');
      switching = false;
    }, 850);
  }

  navButtons.forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  const hashView = location.hash.replace('#', '');
  if (panels.some(panel => panel.dataset.panel === hashView)) {
    panels.forEach(panel => {
      const active = panel.dataset.panel === hashView;
      panel.classList.toggle('is-visible', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    navButtons.forEach(button => button.classList.toggle('is-active', button.classList.contains('nav-link') && button.dataset.view === hashView));
    currentView = hashView;
  }

  // Free-canvas cards: drag with pointer, preserve their starting layout and add depth on hover.
  const canvas = document.getElementById('projectCanvas');
  const cards = [...document.querySelectorAll('.project-card')];
  let topZ = 10;
  cards.forEach(card => {
    let dragging = false, moved = false, startX = 0, startY = 0, initialX = 0, initialY = 0;
    card.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      dragging = true; moved = false;
      startX = event.clientX; startY = event.clientY;
      const translateValue = getComputedStyle(card).translate;
      const parts = translateValue && translateValue !== 'none' ? translateValue.split(' ') : ['0px', '0px'];
      initialX = parseFloat(parts[0]) || 0;
      initialY = parseFloat(parts[1]) || 0;
      card.style.zIndex = String(++topZ);
      card.setPointerCapture(event.pointerId);
      card.style.transition = 'filter .2s';
      card.style.filter = 'drop-shadow(0 35px 30px rgba(0,10,50,.4))';
    });
    card.addEventListener('pointermove', event => {
      if (!dragging) return;
      const dx = event.clientX - startX, dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      card.style.translate = `${initialX + dx}px ${initialY + dy}px`;
    });
    const endDrag = event => {
      if (!dragging) return;
      dragging = false;
      try { card.releasePointerCapture(event.pointerId); } catch (_) {}
      card.style.filter = '';
      if (moved) card.dataset.moved = 'true';
      window.setTimeout(() => { card.dataset.moved = 'false'; }, 180);
    };
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
    card.addEventListener('click', () => {
      if (card.dataset.moved === 'true') return;
      openProject(card.dataset.project);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(card.dataset.project); }
    });
    card.addEventListener('pointerenter', () => { if (!dragging) card.style.filter = 'drop-shadow(0 28px 24px rgba(0,10,50,.3))'; });
    card.addEventListener('pointerleave', () => { if (!dragging) card.style.filter = ''; });
  });

  const modal = document.getElementById('projectModal');
  const modalIndex = modal.querySelector('.modal-index b');
  function openProject(index) {
    modalIndex.textContent = index;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeProject() { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); }
  modal.querySelector('.modal-close').addEventListener('click', closeProject);
  modal.addEventListener('click', event => { if (event.target === modal) closeProject(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeProject(); });

  document.getElementById('contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = (form.get('name') || '').toString().trim();
    const company = (form.get('company') || '').toString().trim();
    const brief = (form.get('brief') || '').toString().trim();
    const budget = (form.get('budget') || 'Por definir').toString();
    const message = `Hola Javier, quiero conversar sobre un proyecto.%0A%0A${name ? `Nombre: ${encodeURIComponent(name)}%0A` : ''}${company ? `Marca/empresa: ${encodeURIComponent(company)}%0A` : ''}Proyecto: ${encodeURIComponent(brief)}%0APresupuesto estimado: ${encodeURIComponent(budget)}`;
    // Replace this example number with your WhatsApp number in international format.
    window.open(`https://wa.me/51999999999?text=${message}`, '_blank', 'noopener,noreferrer');
  });

  // Subtle pointer parallax for the home background; disable on touch devices.
  if (window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - .5) * 9;
      const y = (event.clientY / window.innerHeight - .5) * 9;
      document.documentElement.style.setProperty('--pointer-x', `${x}px`);
      document.documentElement.style.setProperty('--pointer-y', `${y}px`);
    }, { passive: true });
  }
})();
