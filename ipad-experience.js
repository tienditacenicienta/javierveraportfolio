
(() => {
  const story = document.getElementById('ipadScrollStory');
  if (!story) return;

  const stage = story.querySelector('.ipad-scroll-stage');
  const track = story.querySelector('.ipad-project-track');
  const progressBar = document.getElementById('ipadProgressBar');
  const counter = document.getElementById('ipadProjectCount');
  const category = document.getElementById('ipadProjectCategory');
  const projectName = document.getElementById('ipadProjectName');
  const device = story.querySelector('.ipad-device-wrap');
  const deviceShell = story.querySelector('.ipad-device');
  const leftReel = story.querySelector('.portfolio-reel-left');
  const rightReel = story.querySelector('.portfolio-reel-right');
  const returnButton = story.querySelector('.ipad-return-button');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const projects = [
    { name: 'SENSIBLE REALITY', category: 'CAMPAÑA / DISEÑO GRÁFICO' },
    { name: 'MOVE THE FUTURE', category: 'CAMPAÑA / IDENTIDAD VISUAL' },
    { name: 'CREATIVE MATTERS', category: 'SISTEMA GRÁFICO / EDITORIAL' },
    { name: 'GOOD VIBES ONLY', category: 'DIRECCIÓN DE ARTE / CAMPAÑA' },
    { name: 'MAKE ROOM FOR IDEAS', category: 'DISEÑO EDITORIAL / CONCEPTO' }
  ];

  let target = 0;
  let current = 0;
  let running = false;
  let focusSide = null;
  let frozenProgress = 0;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  function readScroll() {
    // Al seleccionar un reel, el scroll vertical deja de controlar
    // el carrusel horizontal y permite salir de la sección.
    if (focusSide) {
      target = frozenProgress;
      return;
    }

    const rect = story.getBoundingClientRect();
    const range = Math.max(1, story.offsetHeight - window.innerHeight);

    target = clamp(-rect.top / range, 0, 1);

    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    current = reduceMotion ? target : lerp(current, target, 0.19);

    const p = current * 4;
    const offset = current >= 1 ? 80 : p * 20;

    track.style.transform = `translate3d(${-offset}%, 0, 0)`;

    const active = clamp(Math.round(p), 0, 4);

    counter.innerHTML = `${String(active + 1).padStart(2, '0')} <i>/</i> 05`;
    category.textContent = projects[active].category;
    projectName.textContent = projects[active].name;
    progressBar.style.width = `${current * 100}%`;

    if (!reduceMotion && !focusSide) {
      const float = Math.sin(current * Math.PI) * 6;

      leftReel.style.setProperty('--reel-float', `${-float}px`);
      rightReel.style.setProperty('--reel-float', `${float}px`);
      device.style.setProperty(
        '--ipad-scale',
        `${1 + Math.sin(current * Math.PI) * 0.008}`
      );
    }

    if (!reduceMotion && Math.abs(target - current) > 0.0006) {
      requestAnimationFrame(tick);
    } else {
      current = target;
      running = false;
    }
  }

  // Configura y reproduce el video del iPhone seleccionado.
  function playReel(button) {
    if (!button) return;

    const video = button.querySelector('video');
    if (!video) return;

    const source = video.querySelector('source');

    if (!source || !source.getAttribute('src')) {
      console.warn('Este iPhone no tiene una ruta de video configurada.');
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.loop = true;

    // Fuerza al navegador a cargar el archivo MP4 configurado.
    if (video.readyState === 0) {
      video.load();
    }

    const startPlayback = () => {
      video.play().catch(error => {
        console.error('No se pudo reproducir el reel:', error);
      });
    };

    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener('canplay', startPlayback, { once: true });
      video.addEventListener('error', () => {
        console.error(
          'Error al cargar el reel:',
          video.currentSrc || source.src,
          video.error
        );
      }, { once: true });
    }
  }

  function pauseReel(button) {
    if (!button) return;

    const video = button.querySelector('video');
    if (video) video.pause();
  }

  function setFocus(side) {
    if (side && !focusSide) {
      frozenProgress = current;

      // Conserva el comportamiento original del scroll al seleccionar un reel.
      const rect = story.getBoundingClientRect();

      story.style.height = `${
        Math.max(window.innerHeight, window.innerHeight - rect.top)
      }px`;

      story.dataset.focusScrollHeight = story.style.height;
    }

    focusSide = side;

    if (!side) {
      story.style.height = '';
      delete story.dataset.focusScrollHeight;
    }

    stage.classList.toggle('reel-focused', !!side);
    stage.classList.toggle('focus-left', side === 'left');
    stage.classList.toggle('focus-right', side === 'right');

    leftReel.setAttribute('aria-pressed', String(side === 'left'));
    rightReel.setAttribute('aria-pressed', String(side === 'right'));

    // Detiene ambos videos antes de reproducir el seleccionado.
    pauseReel(leftReel);
    pauseReel(rightReel);

    if (side === 'left') {
      playReel(leftReel);
    } else if (side === 'right') {
      playReel(rightReel);
    }
  }

  // Actualiza el estado visual cuando el video está listo o falla.
  [leftReel, rightReel].forEach(button => {
    const video = button.querySelector('video');
    const screen = button.querySelector('.iphone-screen');

    video.addEventListener('canplay', () => {
      screen.classList.add('video-ready');
    });

    video.addEventListener('error', () => {
      screen.classList.remove('video-ready');
      console.error(
        'Error de video:',
        video.currentSrc || video.querySelector('source')?.src,
        video.error
      );
    });
  });

  leftReel.addEventListener('click', () => {
    setFocus(focusSide === 'left' ? null : 'left');
  });

  rightReel.addEventListener('click', () => {
    setFocus(focusSide === 'right' ? null : 'right');
  });

  // El iPad permite volver a la composición original.
  deviceShell.setAttribute('role', 'button');
  deviceShell.setAttribute('tabindex', '0');
  deviceShell.setAttribute(
    'aria-label',
    'Volver a la vista de los proyectos'
  );

  deviceShell.addEventListener('click', () => {
    if (focusSide) setFocus(null);
  });

  deviceShell.addEventListener('keydown', e => {
    if (focusSide && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setFocus(null);
    }
  });

  returnButton.addEventListener('click', () => setFocus(null));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && focusSide) {
      setFocus(null);
    }
  });

  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', readScroll);

  readScroll();
})();
