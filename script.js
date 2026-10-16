const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const menuBtn=$('#menuBtn'), menuPanel=$('#menuPanel');
menuBtn.addEventListener('click',()=>{const open=menuPanel.classList.toggle('open');menuBtn.querySelector('span').textContent=open?'−':'＋';});
$$('a',menuPanel).forEach(a=>a.addEventListener('click',()=>{menuPanel.classList.remove('open');menuBtn.querySelector('span').textContent='＋';}));

const solutions={
marca:{n:'A—01',icon:'◉',title:'Primero, encontrar el carácter.',text:'Definir qué debe sentir la gente, qué hace distinta a la marca y cómo se traduce eso a un sistema visual reconocible.',tags:['IDENTIDAD','SISTEMA VISUAL','CONSISTENCIA']},
campana:{n:'B—02',icon:'✳',title:'Una idea que detenga el scroll.',text:'Encontrar un concepto central y convertirlo en una pieza con jerarquía, contraste y una llamada a la acción clara.',tags:['CONCEPTO','KEY VISUAL','CAMPAÑA']},
contenido:{n:'C—03',icon:'↯',title:'Que se entienda en segundos.',text:'Reducir el mensaje a lo esencial y diseñar una secuencia visual que guíe la atención sin perder personalidad.',tags:['SÍNTESIS','CONTENIDO','DISEÑO DIGITAL']},
produccion:{n:'D—04',icon:'▦',title:'Crear un sistema, no apagar incendios.',text:'Organizar formatos, recursos y reglas visuales para producir piezas coherentes con menos fricción y más control.',tags:['SISTEMAS','ADAPTACIONES','PRODUCCIÓN']}
};
let selected='marca';
function setSolution(kind){selected=kind;const s=solutions[kind];$('#solutionNumber').textContent=s.n;$('#solutionIcon').textContent=s.icon;$('#solutionTitle').textContent=s.title;$('#solutionText').textContent=s.text;$('#solutionTags').replaceChildren(...s.tags.map(t=>{const el=document.createElement('span');el.textContent=t;return el;}));$$('.choice').forEach(b=>b.classList.toggle('selected',b.dataset.kind===kind));}
$$('.choice').forEach(b=>b.addEventListener('click',()=>setSolution(b.dataset.kind)));
$('#useSolution').addEventListener('click',()=>{const s=solutions[selected];const subject=encodeURIComponent('Tengo un reto de diseño: '+s.title);const body=encodeURIComponent('Hola Javier, me identifico con este reto: '+s.title+'\n\nMe gustaría conversar sobre una posible solución.');$('#contactLink').href='mailto:TU_CORREO@ejemplo.com?subject='+subject+'&body='+body;$('#contact').scrollIntoView({behavior:'smooth'});const toast=$('#toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2800);});
$$('.wf').forEach(b=>b.addEventListener('click',()=>{$$('.wf').forEach(x=>x.classList.toggle('active',x===b));$$('.case').forEach(c=>c.classList.toggle('hide',b.dataset.filter!=='all'&&c.dataset.type!==b.dataset.filter));}));
const modal=$('#caseModal');let focusBefore=null;
$$('.case').forEach(c=>c.addEventListener('click',()=>{focusBefore=c;$('#modalNum').textContent=c.dataset.num;$('#modalTitle').textContent=c.dataset.title;$('#modalCopy').textContent=c.dataset.copy;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('.modal-x').focus();}));
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';if(focusBefore)focusBefore.focus();}
$$('[data-dismiss]').forEach(el=>el.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});
$('#modalContact').addEventListener('click',closeModal);
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.body.classList.add('has-pointer');const orb=$('#cursorOrb');window.addEventListener('pointermove',e=>{orb.style.left=e.clientX+'px';orb.style.top=e.clientY+'px';});}
