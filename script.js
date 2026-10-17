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
      vec2 uv=v_uv;
      vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);
      float angle=atan(p.y,p.x);
      float radius=length(p);
      float t=u_time;
      // An asymmetric liquid sheet with slow, broad folds rather than a circular outline.
      float lobes=sin(angle*2.0-t*.30)*.13 + sin(angle*3.0+t*.22)*.075;
      float folds=sin(angle*5.0-t*.38)*.035 + sin(angle*7.0+t*.27)*.018;
      float travelling=sin(angle*1.7-t*.52)*.035;
      float organic=1.0+lobes+folds+travelling;
      float maxRadius=length(vec2(u_resolution.x/u_resolution.y,1.))*.72;
      float front=u_progress*maxRadius*organic;
      float d=front-radius;
      float edgeBand=exp(-pow(d/.075,2.0));
      float innerMask=smoothstep(-.018,.035,d);
      float outerFade=1.0-smoothstep(-.045,.005,d);
      float edgeFade=smoothstep(-.055,-.012,d)*(1.0-smoothstep(.025,.085,d));
      float flow1=noise(vec2(uv.x*3.2+t*.08,uv.y*4.4-t*.12));
      float flow2=noise(vec2(uv.x*7.0-t*.12,uv.y*5.2+t*.08));
      float waves=sin(angle*2.4+t*.35+flow1*1.8);
      // Broad body gives the membrane visible volume; layered edge lights sell clear gel.
      float bodyShade=innerMask*(.12 + .10*flow1 + .055*flow2 + .045*max(0.0,waves));
      float rimSoft=edgeBand*(.12+.12*flow2);
      float rimSharp=exp(-pow((d-(.012+.009*sin(angle*2.0+t*.3)))/.009,2.0));
      float innerReflection=exp(-pow((d-.045)/.022,2.0))*(.25+.4*max(0.0,waves));
      float underside=exp(-pow((d+.025)/.018,2.0))*.45;
      float streak=pow(max(0.0,1.0-abs(sin(angle*2.3-t*.23+flow1))),18.0);
      float streak2=pow(max(0.0,1.0-abs(sin(angle*4.7+t*.19+flow2))),26.0);
      float glint=clamp(streak*.8+streak2*.55,0.0,1.0);
      vec3 cool=vec3(.22,.78,1.0);
      vec3 pearl=mix(vec3(.72,.91,1.0),vec3(1.0,.97,.88),.5+.5*sin(angle*1.6-t*.16));
      vec3 spectral=mix(vec3(.12,.72,1.0),vec3(.70,.42,1.0),.5+.5*sin(angle*3.0+t*.22));
      vec3 bodyColor=vec3(.48,.78,.98)*bodyShade;
      vec3 color=bodyColor + cool*(rimSoft*.7+underside*.35) + pearl*(rimSharp*.95+innerReflection*.42) + spectral*(rimSharp*.22) + vec3(1.0,.98,.93)*glint*edgeFade*.58;
      float alpha=bodyShade*.48 + rimSoft*.22 + rimSharp*.70 + innerReflection*.22 + underside*.10 + glint*edgeFade*.22;
      // Fade the entire gel sheet only at the very beginning/end of the transition.
      float intro=smoothstep(0.0,.035,u_progress);
      float outro=1.0-smoothstep(.965,1.0,u_progress);
      alpha=clamp(alpha,0.0,.76)*intro*outro;
      gl_FragColor=vec4(color*intro*outro,alpha);
    }`;
  function compile(type, source){ const sh=gl.createShader(type); gl.shaderSource(sh,source); gl.compileShader(sh); if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){ console.warn(gl.getShaderInfoLog(sh)); return null;} return sh; }
  const vs=compile(gl.VERTEX_SHADER,vertexSource), fs=compile(gl.FRAGMENT_SHADER,fragmentSource); if(!vs||!fs) return null;
  const program=gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniforms={resolution:gl.getUniformLocation(program,'u_resolution'),time:gl.getUniformLocation(program,'u_time'),progress:gl.getUniformLocation(program,'u_progress')};
  let start=0, raf=0, duration=1380, active=false;
  function resize(){ const dpr=Math.min(window.devicePixelRatio||1,1.75); const w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr); if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;} gl.viewport(0,0,w,h); gl.uniform2f(uniforms.resolution,w,h); }
  function frame(now){ if(!active)return; resize(); const raw=Math.min(1,(now-start)/duration); const eased=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2; gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uniforms.time,now*.001); gl.uniform1f(uniforms.progress,eased); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); if(raw<1) raf=requestAnimationFrame(frame); else {active=false; canvas.classList.remove('is-active');} }
  return { run(onCover){ cancelAnimationFrame(raf); resize(); start=performance.now(); duration=1380; active=true; canvas.classList.add('is-active'); let changed=false; function tick(now){ if(!active)return; resize(); const raw=Math.min(1,(now-start)/duration); const eased=raw<.5?4*raw*raw*raw:1-Math.pow(-2*raw+2,3)/2; gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uniforms.time,now*.001); gl.uniform1f(uniforms.progress,eased); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); if(!changed && raw>.52){changed=true;onCover();} if(raw<1)raf=requestAnimationFrame(tick); else {active=false;canvas.classList.remove('is-active');} } raf=requestAnimationFrame(tick); }, cancel(){active=false;cancelAnimationFrame(raf);canvas.classList.remove('is-active');} };
}
const liquid = createLiquidShader(liquidCanvas);
function makeLiquidMask(progress, time = 0) {
  const points = 84;
  const maxR = Math.hypot(window.innerWidth, window.innerHeight) * 0.78;
  const radius = Math.max(1, progress * maxR);
  const cx = 50, cy = 50;
  const rx = radius / Math.max(1, window.innerWidth) * 100;
  const ry = radius / Math.max(1, window.innerHeight) * 100;
  const coords = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    // Ondulación amplia, orgánica y suave; evita el círculo perfecto.
    const wave = 1 + 0.13 * Math.sin(a * 2.0 + time * 0.75)
      + 0.075 * Math.sin(a * 3.0 - time * 0.55)
      + 0.035 * Math.sin(a * 5.0 + time * 0.38);
    const x = cx + Math.cos(a) * rx * wave;
    const y = cy + Math.sin(a) * ry * wave;
    coords.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(${coords.join(',')})`;
}

function showView(nextView, updateHistory=true) {
  if(!nextView || nextView===currentView || switchingView) return;
  const nextPanel = document.querySelector(`[data-view="${nextView}"]`);
  if(!nextPanel) return;
  if(updateHistory) history.replaceState({view:nextView},'',`#${nextView}`);
  if(reducedMotion.matches || !liquid){setActiveView(nextView);return;}

  switchingView = true;
  const oldPanel = document.querySelector(`[data-view="${currentView}"]`);
  const started = performance.now();
  const duration = 1320;
  nextPanel.classList.add('is-revealing');
  nextPanel.style.clipPath = makeLiquidMask(0);
  nextPanel.setAttribute('aria-hidden','false');
  let raf = 0;
  const animateMask = (now) => {
    const raw = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - raw, 3.2);
    nextPanel.style.clipPath = makeLiquidMask(eased, now * 0.001);
    if (raw < 1) {
      raf = requestAnimationFrame(animateMask);
    } else {
      nextPanel.style.clipPath = '';
      nextPanel.classList.remove('is-revealing');
      setActiveView(nextView);
      switchingView = false;
    }
  };
  nextPanel.style.display = 'block';
  nextPanel.style.position = 'absolute';
  nextPanel.style.inset = '0';
  nextPanel.style.width = '100%';
  nextPanel.style.zIndex = '2';
  oldPanel?.classList.add('is-under-reveal');
  liquid.run(() => {});
  raf = requestAnimationFrame(animateMask);
  window.setTimeout(() => {
    oldPanel?.classList.remove('is-under-reveal');
    nextPanel.style.position = '';
    nextPanel.style.inset = '';
    nextPanel.style.width = '';
    nextPanel.style.zIndex = '';
  }, duration + 30);
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
