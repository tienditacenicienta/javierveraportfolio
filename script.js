
/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

// Cambia este número por tu WhatsApp internacional,
// sin el signo + ni espacios.
const WHATSAPP_NUMBER = '51999999999';


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
   IMPORTANTE:
   Estas imágenes son independientes de las del iPad.
   Se encuentran en assets/projects/.
   ========================================================= */

const projects = {
  campaign: {
    kicker: '01 / CAMPAÑAS PUBLICITARIAS',
    title: 'Una idea. Un universo visual.',
    image: 'assets/projects/work-01.svg',
    text: 'Presentación de campaña publicitaria y su desarrollo visual. Aquí podrás explicar el reto de comunicación, el concepto creativo y las piezas desarrolladas.'
  },

  system: {
    kicker: '02 / SISTEMAS GRÁFICOS',
    title: 'Una identidad que se adapta y conecta.',
    image: 'assets/projects/work-02.svg',
    text: 'Sistema gráfico y aplicaciones visuales del proyecto. Aquí podrás presentar la identidad, sus recursos y las adaptaciones realizadas.'
  },

  art: {
    kicker: '03 / DIRECCIÓN DE ARTE',
    title: 'Un lenguaje propio. Una sensación.',
    image: 'assets/projects/work-03.svg',
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
   VENTANA DE DETALLE DE PROYECTO
   ========================================================= */

const modal = document.getElementById('projectModal');

function openModal(key) {
  const project = projects[key];

  if (!project || !modal) return;

  const modalKicker = document.getElementById('modalKicker');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalText = document.getElementById('modalText');
  const modalClose = document.getElementById('modalClose');

  if (modalKicker) modalKicker.textContent = project.kicker;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalText) modalText.textContent = project.text;

  if (modalImage) {
    modalImage.onerror = () => {
      console.error(
        'No se pudo cargar la imagen del proyecto:',
        project.image
      );
    };

    modalImage.src = project.image;
    modalImage.alt = project.title;
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (modalClose) modalClose.focus();
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


/* =========================================================
   CLICS EN LOS PROYECTOS
   ========================================================= */

document.querySelectorAll('[data-project]').forEach(element => {
  element.addEventListener('click', event => {
    // Evita que un botón dentro de una tarjeta active otros clics.
    event.stopPropagation();

    const projectKey = element.dataset.project;
    openModal(projectKey);
  });
});

const modalClose = document.getElementById('modalClose');

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
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
   Esta parte conserva la reproducción de los videos.
   ========================================================= */

document.querySelectorAll(
  '.portfolio-reel .reel-video'
).forEach(video => {
  const screen = video.closest('.iphone-screen');

  if (!screen) return;

  // Mostrar el video cuando el navegador pueda reproducirlo.
  const showVideo = () => {
    screen.classList.add('video-ready');
  };

  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('canplay', showVideo);

  // Si el video falla, conservar el diseño de respaldo.
  video.addEventListener('error', () => {
    screen.classList.remove('video-ready');

    console.error(
      'No se pudo cargar el reel:',
      video.currentSrc || video.src
    );
  });

  // Configurar reproducción automática sin sonido.
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
