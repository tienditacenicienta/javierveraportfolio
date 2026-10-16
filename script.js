const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, {passive:true});

const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.topbar nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰';
}));

// Filtro de empresas: resalta los logos asociados a la categoría elegida.
const companies = document.querySelectorAll('.company');
const brands = document.querySelectorAll('.brand');
companies.forEach(button => button.addEventListener('click', () => {
  companies.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  const category = button.dataset.company;
  brands.forEach(brand => {
    const show = category === 'all' || brand.dataset.type === category;
    brand.classList.toggle('dim', !show);
  });
}));

// Filtro de proyectos.
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(f => f.classList.remove('active'));
  filter.classList.add('active');
  const category = filter.dataset.filter;
  projects.forEach(project => {
    project.classList.toggle('hidden', category !== 'all' && project.dataset.category !== category);
  });
}));

// Modal accesible con detalles del proyecto.
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
let lastFocused = null;
projects.forEach(project => project.addEventListener('click', () => {
  lastFocused = project;
  modalTitle.textContent = project.dataset.title;
  modalDescription.textContent = project.dataset.description;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}));
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  if(lastFocused) lastFocused.focus();
}
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// Reveal suave al entrar en pantalla, con alternativa para navegadores sin IntersectionObserver.
const revealTargets = document.querySelectorAll('.stats > div, .brand, .project, .tool-group');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('seen'); observer.unobserve(entry.target); }
    });
  }, {threshold:.12});
  revealTargets.forEach(el => observer.observe(el));
} else revealTargets.forEach(el => el.classList.add('seen'));
