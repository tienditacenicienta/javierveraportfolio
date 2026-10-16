const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#scrollLine').style.width=(max?scrollY/max*100:0)+'%'},{passive:true});
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));$$('.tile').forEach(tile=>tile.classList.toggle('hidden',btn.dataset.filter!=='all'&&tile.dataset.type!==btn.dataset.filter));}));
const detail=$('#detail');let previous=null;
$$('.tile').forEach(tile=>tile.addEventListener('click',()=>{previous=tile;$('#detailTitle').textContent=tile.dataset.name;$('#detailDesc').textContent=tile.dataset.desc;$('#detailLabel').textContent=tile.querySelector('.tile-label').textContent+' / DETALLE';detail.classList.add('open');detail.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('.detail-close').focus();}));
function closeDetail(){detail.classList.remove('open');detail.setAttribute('aria-hidden','true');document.body.style.overflow='';if(previous)previous.focus();}
$$('[data-close]').forEach(el=>el.addEventListener('click',closeDetail));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&detail.classList.contains('open'))closeDetail()});$('#detailContact').addEventListener('click',closeDetail);
