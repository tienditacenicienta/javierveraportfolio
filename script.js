// Navegación por vistas con una membrana líquida WebGL, centrada en la pantalla.
const viewLinks = document.querySelectorAll('[data-view-link]');
const viewPanels = document.querySelectorAll('[data-view]');
const liquidCanvas = document.querySelector('#liquid-canvas');
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
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  currentView = nextView;
}

// Shader procedural: frente orgánico, refracción simulada, borde especular fino y reflejos animados.
function createLiquidShader(canvas) {
  const gl = canvas?.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return null;
  const vertexSource = `attribute vec2 a_position; varying vec2 v_uv; void main(){ v_uv=a_position*.5+.5; gl_Position=vec4(a_position,0.,1.); }`;
  const fragmentSource = `precision highp float;
    varying vec2 v_uv; uniform vec2 u_resolution; uniform float u_time; uniform float u_progress;
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
    void main(){
      vec2 uv=v_uv; vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);
      float angle=atan(p.y,p.x); float radius=length(p);
      float n=noise(vec2(angle*2.2+u_time*.16, angle*1.4-u_time*.11));
      float organic=1.0 + .035*sin(angle*3.0+u_time*.52) + .021*sin(angle*5.0-u_time*.37) + (n-.5)*.075;
      float maxRadius=length(vec2(u_resolution.x/u_resolution.y,1.))*.59;
      float front=u_progress*maxRadius*organic;
      float edgeDist=abs(radius-front);
      float edgeWidth=.0038 + .0022*sin(angle*4.0+u_time*.7);
      float rim=1.0-smoothstep(edgeWidth,edgeWidth+.004,edgeDist);
      float inner=1.0-smoothstep(front-.018,front+.004,radius);
      float shimmer=noise(vec2(uv.x*6.0+u_time*.18,uv.y*8.0-u_time*.13));
      float specA=pow(max(0.,1.-abs(sin(angle*2.7+u_time*.35))),22.0);
      float specB=pow(max(0.,1.-abs(sin(angle*4.1-u_time*.24))),34.0);
      float highlight=clamp(rim*(.44+specA*.42+specB*.28),0.,.95);
      vec3 pearl=mix(vec3(.67,.91,1.0),vec3(1.0,.99,.94),.5+.5*sin(angle*3.0+u_time*.3));
      vec3 chroma=mix(vec3(.22,.78,1.0),vec3(.88,.96,1.0),.5+.5*sin(angle*5.0-u_time*.42));
      float fineEdge=1.0-smoothstep(edgeWidth*.25,edgeWidth*1.35,edgeDist);
      float glow=exp(-edgeDist*240.0)*.16;
      // Casi no hay relleno: la forma se percibe por refracción y reflejos, no por opacidad.
      float body=inner*(.012 + shimmer*.014);
      vec3 color=pearl*highlight + chroma*(fineEdge*.24+glow) + vec3(.56,.84,1.)*body;
      float alpha=clamp(highlight*.72 + fineEdge*.2 + glow + body,0.,.88);
      // El inicio y el final se suavizan sin dejar un aro estacionado.
      float fade=smoothstep(0.,.07,u_progress)*(1.0-smoothstep(.91,1.0,u_progress));
      gl_FragColor=vec4(color,alpha*fade);
    }`;
  function compile(type, source){ const sh=gl.createShader(type); gl.shaderSource(sh,source); gl.compileShader(sh); if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){ console.warn(gl.getShaderInfoLog(sh)); return null;} return sh; }
  const vs=compile(gl.VERTEX_SHADER,vertexSource), fs=compile(gl.FRAGMENT_SHADER,fragmentSource); if(!vs||!fs) return null;
  const program=gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniforms={resolution:gl.getUniformLocation(program,'u_resolution'),time:gl.getUniformLocation(program,'u_time'),progress:gl.getUniformLocation(program,'u_progress')};
  let start=0, raf=0, duration=1120, active=false;
  function resize(){ const dpr=Math.min(window.devicePixelRatio||1,1.75); const w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr); if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;} gl.viewport(0,0,w,h); gl.uniform2f(uniforms.resolution,w,h); }
  function frame(now){ if(!active)return; resize(); const raw=Math.min(1,(now-start)/duration); const eased=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2; gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uniforms.time,now*.001); gl.uniform1f(uniforms.progress,eased); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); if(raw<1) raf=requestAnimationFrame(frame); else {active=false; canvas.classList.remove('is-active');} }
  return { run(onCover){ cancelAnimationFrame(raf); resize(); start=performance.now(); duration=1120; active=true; canvas.classList.add('is-active'); let changed=false; function tick(now){ if(!active)return; resize(); const raw=Math.min(1,(now-start)/duration); const eased=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2; gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uniforms.time,now*.001); gl.uniform1f(uniforms.progress,eased); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); if(!changed && raw>.48){changed=true;onCover();} if(raw<1)raf=requestAnimationFrame(tick); else {active=false;canvas.classList.remove('is-active');} } raf=requestAnimationFrame(tick); }, cancel(){active=false;cancelAnimationFrame(raf);canvas.classList.remove('is-active');} };
}
const liquid = createLiquidShader(liquidCanvas);
function showView(nextView, updateHistory=true) {
  if(!nextView || nextView===currentView || switchingView) return;
  if(!document.querySelector(`[data-view="${nextView}"]`)) return;
  if(updateHistory) history.replaceState({view:nextView},'',`#${nextView}`);
  if(reducedMotion.matches || !liquid){setActiveView(nextView);return;}
  switchingView=true;
  let swapped=false;
  const swap=()=>{if(swapped)return;swapped=true;setActiveView(nextView);};
  liquid.run(swap);
  window.setTimeout(()=>{swap();switchingView=false;},1250);
}
viewLinks.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showView(link.dataset.viewLink,true);}));
function syncViewFromHash(){const requested=window.location.hash.replace('#','')||'inicio';if(requested!==currentView)showView(requested,false);}
window.addEventListener('hashchange',syncViewFromHash);
const initialView=location.hash.slice(1); if(['inicio','proyectos','enfoque','contacto'].includes(initialView))setActiveView(initialView);

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
