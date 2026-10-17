const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max?scrollY/max*100:0)+'%'},{passive:true});
const hero=$('#heroCore'),section=$('.hero');
window.addEventListener('load',()=>section.classList.add('loaded'));
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
 hero.style.setProperty('--mx',x*17+'px');hero.style.setProperty('--my',y*12+'px');
 $('.target-a').style.transform=`translate(calc(-50% + ${-x*20}px),calc(-50% + ${-y*15}px))`;
 $('.target-b').style.transform=`translate(calc(-50% + ${x*25}px),calc(-50% + ${y*20}px)) rotate(54deg) scaleX(.48)`;
 $('.orbit-one').style.transform=`translate(calc(-50% + ${x*15}px),calc(-50% + ${y*10}px))`;
 $('#readout').textContent=`X ${String(Math.round((x+.5)*100)).padStart(2,'0')} / Y ${String(Math.round((y+.5)*100)).padStart(2,'0')}`;
 });
 hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--mx','0px');hero.style.setProperty('--my','0px');$('#readout').textContent='X 50 / Y 50';});
}
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));$$('.work-card').forEach(c=>c.classList.toggle('hidden',btn.dataset.filter!=='all'&&c.dataset.type!==btn.dataset.filter));}));
$('#reconfigure').addEventListener('click',()=>{const grid=$('#workGrid'),cards=$$('.work-card',grid);for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}cards.forEach(c=>grid.appendChild(c));grid.animate([{opacity:.35,transform:'scale(.99)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'ease-out'});});
const overlay=$('#overlay');let previous=null;
$$('.work-card').forEach(card=>card.addEventListener('click',()=>{previous=card;$('#detailCategory').textContent=card.dataset.category;$('#detailTitle').textContent=card.dataset.title;$('#detailDescription').textContent=card.dataset.description;$('#detailProcess').textContent=card.dataset.process;overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('.close').focus();}));
function closeOverlay(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow='';if(previous)previous.focus();}
$$('[data-close]').forEach(el=>el.addEventListener('click',closeOverlay));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeOverlay();});$('#detailContact').addEventListener('click',closeOverlay);
