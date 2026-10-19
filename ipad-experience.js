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
    {name:'SENSIBLE REALITY',category:'CAMPAÑA / DISEÑO GRÁFICO'},
    {name:'MOVE THE FUTURE',category:'CAMPAÑA / IDENTIDAD VISUAL'},
    {name:'CREATIVE MATTERS',category:'SISTEMA GRÁFICO / EDITORIAL'},
    {name:'GOOD VIBES ONLY',category:'DIRECCIÓN DE ARTE / CAMPAÑA'},
    {name:'MAKE ROOM FOR IDEAS',category:'DISEÑO EDITORIAL / CONCEPTO'}
  ];
  let target=0, current=0, running=false, focusSide=null;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const lerp=(a,b,t)=>a+(b-a)*t;

  function readScroll(){
    const rect=story.getBoundingClientRect();
    const range=Math.max(1,story.offsetHeight-window.innerHeight);
    target=clamp(-rect.top/range,0,1);
    if(!running){running=true;requestAnimationFrame(tick);}
  }
  function tick(){
    current=reduceMotion?target:lerp(current,target,.19);
    const p=current*4;
    const offset=current>=1?80:p*20;
    track.style.transform=`translate3d(${-offset}%,0,0)`;
    const active=clamp(Math.round(p),0,4);
    counter.innerHTML=`${String(active+1).padStart(2,'0')} <i>/</i> 05`;
    category.textContent=projects[active].category;
    projectName.textContent=projects[active].name;
    progressBar.style.width=`${current*100}%`;
    if(!reduceMotion && !focusSide){
      const float=Math.sin(current*Math.PI)*6;
      leftReel.style.setProperty('--reel-float',`${-float}px`);
      rightReel.style.setProperty('--reel-float',`${float}px`);
      device.style.setProperty('--ipad-scale',`${1+Math.sin(current*Math.PI)*.008}`);
    }
    if(!reduceMotion && Math.abs(target-current)>.0006){requestAnimationFrame(tick);}
    else {current=target;running=false;if(Math.abs(target-current)>.0006)readScroll();}
  }
  function setFocus(side){
    focusSide=side;
    stage.classList.toggle('reel-focused',!!side);
    stage.classList.toggle('focus-left',side==='left');
    stage.classList.toggle('focus-right',side==='right');
    leftReel.setAttribute('aria-pressed',String(side==='left'));
    rightReel.setAttribute('aria-pressed',String(side==='right'));
    leftReel.querySelector('video').pause();
    rightReel.querySelector('video').pause();
    if(side){
      const active=side==='left'?leftReel:rightReel;
      const video=active.querySelector('video');
      if(video.querySelector('source').getAttribute('src')) video.play().catch(()=>{});
    }
  }
  [leftReel,rightReel].forEach(button=>{
    const video=button.querySelector('video');
    video.addEventListener('canplay',()=>button.querySelector('.iphone-screen').classList.add('video-ready'));
    video.addEventListener('error',()=>button.querySelector('.iphone-screen').classList.remove('video-ready'));
  });
  leftReel.addEventListener('click',()=>setFocus(focusSide==='left'?null:'left'));
  rightReel.addEventListener('click',()=>setFocus(focusSide==='right'?null:'right'));
  // Al seleccionar un reel, el iPad se mueve al lateral opuesto y también permite
  // hacer clic para volver a la composición original, sin depender del botón de retorno.
  deviceShell.setAttribute('role','button');
  deviceShell.setAttribute('tabindex','0');
  deviceShell.setAttribute('aria-label','Volver a la vista de los proyectos');
  deviceShell.addEventListener('click',()=>{if(focusSide)setFocus(null);});
  deviceShell.addEventListener('keydown',e=>{
    if(focusSide&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setFocus(null);}
  });
  returnButton.addEventListener('click',()=>setFocus(null));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&focusSide)setFocus(null);});
  addEventListener('scroll',readScroll,{passive:true});
  addEventListener('resize',readScroll);
  readScroll();
})();