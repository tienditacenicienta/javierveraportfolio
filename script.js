
/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

// Cambia este número por tu WhatsApp internacional,
// sin el signo + ni espacios.
const WHATSAPP_NUMBER = '51999999999';

// Ruta del reel del proyecto Sistemas Gráficos.
const SYSTEM_REEL_PATH = 'assets/reels/reel-03.mp4';


/* =========================================================
   MENÚ PRINCIPAL
   ========================================================= */

const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

function closeMenu() {
  if (!menu || !menuButton) return;

  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');

  const menuIcon = menuButton.querySelector('span');
  if (menuIcon) menuIcon.textContent = '＋';
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('open');

    menu.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    menuButton.setAttribute('aria-expanded', String(isOpen));

    const menuIcon = menuButton.querySelector('span');
    if (menuIcon) menuIcon.textContent = isOpen ? '×' : '＋';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}


/* =========================================================
   ANIMACIONES DE ENTRADA AL DESPLAZARSE
   ========================================================= */

const revealElements = document.querySelectorAll(
  '.reveal:not(.hero .reveal), .project-reveal'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add('in-view');
  });
}


/* =========================================================
   LUZ DEL CURSOR Y MOVIMIENTO DEL HERO
   ========================================================= */

const glow = document.querySelector('.cursor-glow');
const heroArt = document.getElementById('heroArt');

const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (hasFinePointer && !prefersReducedMotion) {
  if (glow) {
    document.addEventListener('pointermove', event => {
      glow.style.opacity = '.9';
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    });
  }

  if (heroArt) {
    const mainFrame = heroArt.querySelector('.frame-main');

    if (mainFrame) {
      heroArt.addEventListener('pointermove', event => {
        const rect = heroArt.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        mainFrame.style.transform =
          `rotateY(${-5 + x * 7}deg) ` +
          `rotateX(${-y * 4}deg) ` +
          `translateY(${-7 - y * 5}px) ` +
          'translateZ(55px)';
      });

      heroArt.addEventListener('pointerleave', () => {
        mainFrame.style.transform = '';
      });
    }
  }
}


/* =========================================================
   PROYECTOS DE LA GALERÍA INFERIOR
   Las imágenes son independientes de las del iPad.
   ========================================================= */

const projects = {
  campaign: {
    kicker: '01 / CAMPAÑAS PUBLICITARIAS',
    title: 'Una idea. Un universo visual.',
    image: 'assets/projects/work-01.png',
    text: 'Presentación de campaña publicitaria y su desarrollo visual. Aquí podrás explicar el reto de comunicación, el concepto creativo y las piezas desarrolladas.'
  },

  system: {
    kicker: '02 / SISTEMAS GRÁFICOS',
    title: 'Una identidad que se adapta y conecta.',
    video: SYSTEM_REEL_PATH,
    image: 'assets/projects/work-02.svg',
    text: 'Sistema gráfico y aplicaciones visuales del proyecto. Una identidad que conecta sus distintas aplicaciones mediante un lenguaje visual consistente.'
  },

  art: {
    kicker: '03 / DIRECCIÓN DE ARTE',
    title: 'Un lenguaje propio. Una sensación.',
    image: 'assets/projects/proyecto-03.png',
    text: 'Dirección de arte, composición y lenguaje visual. Aquí podrás explicar las decisiones creativas y la atmósfera desarrollada para el proyecto.'
  },

  digital: {
    kicker: '04 / CONTENIDO DIGITAL',
    title: 'Diseñado para vivir en movimiento.',
    image: 'assets/projects/work-04.svg',
    text: 'Piezas visuales adaptadas a distintos formatos digitales. Aquí podrás mostrar cómo una idea se transforma para vivir en diferentes medios.'
  }
};


/* =========================================================
   TARJETA DE SISTEMAS GRÁFICOS: REEL 03
   Reemplaza la imagen de la tarjeta por el video vertical.
   ========================================================= */

function setupSystemReelCard() {
  const systemCard = document.querySelector(
    '[data-project="system"]'
  );

  if (!systemCard) {
    console.warn(
      'No se encontró el elemento [data-project="system"].'
    );
    return;
  }

  // Encontrar la imagen dentro de la tarjeta.
  const cardImage = systemCard.querySelector(
    '.project-visual img, .project-image img'
  );

  if (!cardImage) {
    console.warn(
      'No se encontró la imagen de la tarjeta de Sistemas Gráficos.'
    );
    return;
  }

  // Evitar insertar el mismo video dos veces.
  if (systemCard.querySelector('.system-project-reel')) return;

  const reel = document.createElement('video');

  reel.className = 'system-project-reel';
  reel.src = SYSTEM_REEL_PATH;
  reel.autoplay = true;
  reel.loop = true;
  reel.muted = true;
  reel.playsInline = true;
  reel.preload = 'metadata';
  reel.setAttribute(
    'aria-label',
    'Reel vertical del proyecto Sistemas Gráficos'
  );

  reel.addEventListener('error', () => {
    console.error(
      'No se pudo cargar el reel de Sistemas Gráficos:',
      SYSTEM_REEL_PATH
    );
  });

  // Mantener la tarjeta como elemento clicable.
  const cardContainer = cardImage.closest(
    '.project-visual, .project-image'
  );

  if (cardContainer) {
    cardContainer.classList.add('project-reel-card');
  }

  cardImage.replaceWith(reel);

  // Intentar reproducir sin sonido.
  const playback = reel.play();

  if (playback && typeof playback.catch === 'function') {
    playback.catch(() => {
      // Algunos navegadores pueden bloquear la reproducción automática.
    });
  }
}


/* =========================================================
   VENTANA DE DETALLE DE PROYECTO
   Admite imágenes y videos.
   ========================================================= */

const modal = document.getElementById('projectModal');

function openModal(key) {
  const project = projects[key];

  if (!project || !modal) return;

  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  let modalMedia = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const modalClose = document.getElementById('modalClose');

  if (modalKicker) {
    modalKicker.textContent = project.kicker;
  }

  if (modalTitle) {
    modalTitle.textContent = project.title;
  }

  if (modalText) {
    modalText.textContent = project.text;
  }

  if (modalMedia) {
    const wantsVideo = Boolean(project.video);
    const currentIsVideo = modalMedia.tagName === 'VIDEO';

    // Convertir el elemento multimedia si cambia el tipo de proyecto.
    if (wantsVideo && !currentIsVideo) {
      const video = document.createElement('video');

      video.id = 'modalImage';
      video.className = modalMedia.className;
      modalMedia.replaceWith(video);
      modalMedia = video;
    } else if (!wantsVideo && currentIsVideo) {
      const img = document.createElement('img');

      img.id = 'modalImage';
      img.className = modalMedia.className;
      modalMedia.pause();
      modalMedia.replaceWith(img);
      modalMedia = img;
    }

    if (wantsVideo) {
      // Configurar el reel vertical en el detalle.
      modalMedia.pause();
      modalMedia.removeAttribute('src');
      modalMedia.innerHTML = '';

      modalMedia.src = project.video;
      modalMedia.autoplay = true;
      modalMedia.loop = true;
      modalMedia.muted = true;
      modalMedia.playsInline = true;
      modalMedia.controls = true;
      modalMedia.preload = 'metadata';
      modalMedia.setAttribute(
        'aria-label',
        'Video del proyecto ' + project.title
      );

      modalMedia.onerror = () => {
        console.error(
          'No se pudo cargar el video:',
          project.video
        );
      };

      modalMedia.load();

      const playback = modalMedia.play();

      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          // El usuario podrá iniciarlo con los controles.
        });
      }
    } else {
      // Mostrar la imagen de los demás proyectos.
      modalMedia.removeAttribute('controls');
      modalMedia.removeAttribute('autoplay');
      modalMedia.removeAttribute('loop');
      modalMedia.removeAttribute('muted');
      modalMedia.removeAttribute('playsinline');

      modalMedia.onerror = () => {
        console.error(
          'No se pudo cargar la imagen del proyecto:',
          project.image
        );
      };

      modalMedia.src = project.image;
      modalMedia.alt = project.title;
    }
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (modalClose) modalClose.focus();
}


function closeModal() {
  if (!modal) return;

  // Detener el video al cerrar la ventana.
  const modalVideo = modal.querySelector('video#modalImage');

  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


/* =========================================================
   CLICS EN LOS PROYECTOS
   ========================================================= */

document.querySelectorAll('[data-project]').forEach(element => {
  element.addEventListener('click', event => {
    event.stopPropagation();

    const projectKey = element.dataset.project;
    openModal(projectKey);
  });
});


/* =========================================================
   CERRAR VENTANA DE PROYECTO
   ========================================================= */

const modalCloseButton = document.getElementById('modalClose');

if (modalCloseButton) {
  modalCloseButton.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });
}


/* =========================================================
   CERRAR MENÚ O VENTANA CON ESCAPE
   ========================================================= */

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    closeModal();
  }
});


/* =========================================================
   FORMULARIO DE CONTACTO POR WHATSAPP
   ========================================================= */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = form.get('nombre') || '';
    const type = form.get('tipo') || '';
    const details = form.get('detalle') || '';
    const budget = form.get('presupuesto') || 'No definido';

    const message = [
      `Hola, soy ${name}.`,
      `Me interesa: ${type}.`,
      details ? `Detalles / reto a resolver: ${details}` : '',
      `Presupuesto aproximado: ${budget}.`,
      'Me gustaría conversar sobre el alcance y el siguiente paso.'
    ]
      .filter(Boolean)
      .join('\n');

    if (WHATSAPP_NUMBER === '51999999999') {
      alert(
        'Antes de publicar, reemplaza 51999999999 en script.js ' +
        'por tu número real de WhatsApp internacional.'
      );
      return;
    }

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappURL,
      '_blank',
      'noopener,noreferrer'
    );
  });
}


/* =========================================================
   REELS DE LOS IPHONES
   Conserva la reproducción de los videos existentes.
   ========================================================= */

document.querySelectorAll(
  '.portfolio-reel .reel-video'
).forEach(video => {
  const screen = video.closest('.iphone-screen');

  if (!screen) return;

  const showVideo = () => {
    screen.classList.add('video-ready');
  };

  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('canplay', showVideo);

  video.addEventListener('error', () => {
    screen.classList.remove('video-ready');

    console.error(
      'No se pudo cargar el reel:',
      video.currentSrc || video.src
    );
  });

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';

  video.load();

  const playback = video.play();

  if (playback && typeof playback.catch === 'function') {
    playback.catch(error => {
      console.warn(
        'No se pudo iniciar la reproducción del reel:',
        error
      );
    });
  }
});


/* =========================================================
   INICIALIZACIÓN DEL REEL DE SISTEMAS GRÁFICOS
   ========================================================= */

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    setupSystemReelCard
  );
} else {
  setupSystemReelCard();
}
