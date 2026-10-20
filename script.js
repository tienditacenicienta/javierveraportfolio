// Cambia este número por tu WhatsApp internacional, sin + ni espacios.
const WHATSAPP_NUMBER = '51999999999';
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
function closeMenu(){menu.classList.remove('open');menu.setAttribute('aria-hidden','true');menuButton.setAttribute('aria-expanded','false');menuButton.querySelector('span').textContent='＋';}
menuButton.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('span').textContent=open?'×':'＋';});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeModal();}});
// Cinematic reveal while keeping the page as one continuous vertical story.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}}),{threshold:.13});
document.querySelectorAll('.reveal:not(.hero .reveal),.project-reveal').forEach(el=>revealObserver.observe(el));
// A restrained pointer glow and parallax layer; disabled for touch/reduced-motion users.
const glow=document.querySelector('.cursor-glow');const heroArt=document.getElementById('heroArt');
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.addEventListener('pointermove',e=>{glow.style.opacity='.9';glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});if(heroArt){heroArt.addEventListener('pointermove',e=>{const r=heroArt.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;heroArt.querySelector('.frame-main').style.transform=`rotateY(${-5+x*7}deg) rotateX(${-y*4}deg) translateY(${-7-y*5}px) translateZ(55px)`;});heroArt.addEventListener('pointerleave',()=>{heroArt.querySelector('.frame-main').style.transform='';});}}
const projects={campaign:{kicker:'01 / CAMPAÑAS PUBLICITARIAS',title:'Una idea. Un universo visual.',image:'assets/projects/01-campaign.svg',text:'Este espacio está preparado para presentar una campaña real: el reto de comunicación, el concepto creativo y las piezas desarrolladas para llevar la idea a diferentes formatos.'},system:{kicker:'02 / SISTEMAS GRÁFICOS',title:'Una identidad que se adapta y conecta.',image:'assets/projects/03-system.svg',text:'Sustituye esta descripción por el objetivo, el sistema gráfico y las aplicaciones reales que desarrollaste para la marca o campaña.'},art:{kicker:'03 / DIRECCIÓN DE ARTE',title:'Un lenguaje propio. Una sensación.',image:'assets/projects/04-artdirection.svg',text:'Presenta aquí la dirección visual, las decisiones de composición, el lenguaje gráfico y la atmósfera que definieron el proyecto real.'},digital:{kicker:'04 / CONTENIDO DIGITAL',title:'Diseñado para vivir en movimiento.',image:'assets/projects/06-digital.svg',text:'Añade piezas sociales, anuncios, contenido digital u otras adaptaciones que mantengan una misma idea visual en diferentes formatos.'}};
const modal=document.getElementById('projectModal');
function openModal(key){const p=projects[key];if(!p)return;document.getElementById('modalKicker').textContent=p.kicker;document.getElementById('modalTitle').textContent=p.title;document.getElementById('modalImage').src=p.image;document.getElementById('modalText').textContent=p.text;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.getElementById('modalClose').focus();}
function closeModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.project)));
document.getElementById('modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.currentTarget);const message=[`Hola, soy ${form.get('nombre')}.`,`Me interesa: ${form.get('tipo')}.`,form.get('detalle')?`Detalles / reto a resolver: ${form.get('detalle')}`:'',`Presupuesto aproximado: ${form.get('presupuesto')||'No definido'}.`,`Me gustaría conversar sobre el alcance y el siguiente paso.`].filter(Boolean).join('\n');if(WHATSAPP_NUMBER==='51999999999'){alert('Antes de publicar, abre script.js y reemplaza 51999999999 por tu número de WhatsApp internacional.');return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');});

/* Cargar y mostrar los videos reales de los reels */
document.querySelectorAll('.portfolio-reel .reel-video').forEach(video => {
  const screen = video.closest('.iphone-screen');

  if (!screen) return;

  // Mostrar el video cuando el navegador ya pueda reproducirlo.
  const showVideo = () => {
    screen.classList.add('video-ready');
  };

  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('canplay', showVideo);

  // Si el video falla, conservar el diseño de respaldo.
  video.addEventListener('error', () => {
    screen.classList.remove('video-ready');
    console.error('No se pudo cargar el reel:', video.currentSrc || video.src);
  });

  // Iniciar la carga y reproducción automática.
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.load();

  const playback = video.play();

  if (playback && typeof playback.catch === 'function') {
    playback.catch(error => {
      console.warn('No se pudo iniciar la reproducción del reel:', error);
    });
  }
});
