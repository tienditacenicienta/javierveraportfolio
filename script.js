// Cambia este número por tu WhatsApp en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = '51999999999';
const views = [...document.querySelectorAll('.view')];
const menu = document.getElementById('menuPanel');
const menuToggle = document.getElementById('menuToggle');
let activeView = 'inicio';
function showView(name, scroll = true) {
  const target = document.getElementById(`view-${name}`);
  if (!target) return;
  views.forEach(view => view.classList.toggle('active', view === target));
  activeView = name;
  menu.classList.remove('open'); menu.setAttribute('aria-hidden','true');
  menuToggle.setAttribute('aria-expanded','false'); menuToggle.querySelector('span').textContent = '＋';
  if (scroll) window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'', name === 'inicio' ? location.pathname : `#${name}`);
}
menuToggle.addEventListener('click', () => {
  const open = !menu.classList.contains('open'); menu.classList.toggle('open',open);
  menu.setAttribute('aria-hidden',String(!open)); menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.querySelector('span').textContent = open ? '×' : '＋';
});
document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); showView(el.dataset.view); }));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');closeModal();}});
const projectInfo = {
 campaign:{kicker:'01 / CAMPAÑAS',title:'Ideas que capturan atención.',image:'assets/projects/01-campaign.svg',text:'Aquí puedes contar el reto, la idea creativa, las piezas desarrolladas y cómo se conectó el concepto con la audiencia.'},
 brand:{kicker:'02 / BRANDING',title:'Marcas con una voz propia.',image:'assets/projects/02-brand.svg',text:'Presenta la estrategia visual, el sistema de identidad, sus aplicaciones y las decisiones que dieron coherencia a la marca.'},
 system:{kicker:'03 / SISTEMAS GRÁFICOS',title:'Coherencia en cada punto.',image:'assets/projects/03-system.svg',text:'Muestra cómo una idea visual puede crecer y mantenerse consistente en múltiples formatos y puntos de contacto.'},
 art:{kicker:'04 / DIRECCIÓN DE ARTE',title:'Un mundo visual reconocible.',image:'assets/projects/04-artdirection.svg',text:'Describe la dirección visual, el lenguaje gráfico, la composición y la atmósfera que definieron el proyecto.'},
 editorial:{kicker:'05 / DISEÑO EDITORIAL',title:'Contenido con intención.',image:'assets/projects/05-editorial.svg',text:'Explica cómo la jerarquía, el ritmo y la tipografía ayudaron a contar mejor la historia.'},
 digital:{kicker:'06 / DIGITAL',title:'Diseño pensado para moverse.',image:'assets/projects/06-digital.svg',text:'Añade aquí interfaces, piezas sociales, contenido para campañas o experiencias digitales reales.'}
};
const modal = document.getElementById('projectModal');
function openModal(key){const p=projectInfo[key];if(!p)return;document.getElementById('modalKicker').textContent=p.kicker;document.getElementById('modalTitle').textContent=p.title;document.getElementById('modalImage').src=p.image;document.getElementById('modalText').textContent=p.text;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.project)));
document.getElementById('modalClose').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.getElementById('contactForm').addEventListener('submit',e=>{
 e.preventDefault();const form=new FormData(e.currentTarget);
 const msg=[`Hola, soy ${form.get('nombre')}.`,`Me interesa: ${form.get('tipo')}.`,form.get('detalle')?`Detalles: ${form.get('detalle')}`:'',`Presupuesto aproximado: ${form.get('presupuesto')||'No definido'}.`].filter(Boolean).join('\n');
 if(WHATSAPP_NUMBER==='51999999999'){alert('Antes de publicar, abre script.js y reemplaza 51999999999 por tu número de WhatsApp internacional.');return;}
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');
});
document.getElementById('directWhatsapp').addEventListener('click',e=>{e.preventDefault();if(WHATSAPP_NUMBER==='51999999999'){showView('contacto');alert('Configura tu número de WhatsApp en script.js antes de publicar.');return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me gustaría conversar sobre un proyecto de diseño.')}`,'_blank','noopener,noreferrer');});
if(location.hash && document.getElementById(`view-${location.hash.slice(1)}`)) showView(location.hash.slice(1),false);
