const rail=document.querySelector('#portfolio .portfolio-mosaic');
const previous=document.querySelector('#portfolio .portfolio-prev');
const next=document.querySelector('#portfolio .portfolio-next');
if(rail){
 const cards=[...rail.children];
 const filters=[...document.querySelectorAll('#portfolio .portfolio-filters button')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let autoTimer=0;
 let paused=false;
 let drag=null;
 let dragged=false;
 const step=()=>{
  const first=cards.find(card=>!card.hidden);
  if(!first)return rail.clientWidth;
  const gap=parseFloat(getComputedStyle(rail).columnGap)||0;
  return first.getBoundingClientRect().width+gap;
 };
 const update=()=>{
  const end=Math.max(0,rail.scrollWidth-rail.clientWidth);
  if(previous)previous.disabled=rail.scrollLeft<=2;
  if(next)next.disabled=rail.scrollLeft>=end-2;
 };
 const move=direction=>rail.scrollBy({left:direction*step(),behavior:reduced.matches?'auto':'smooth'});
 const stopAuto=()=>{clearInterval(autoTimer);autoTimer=0};
 const startAuto=()=>{
  stopAuto();
  if(reduced.matches||paused||document.hidden)return;
  autoTimer=setInterval(()=>{
   const end=Math.max(0,rail.scrollWidth-rail.clientWidth);
   if(end<=2)return;
   if(rail.scrollLeft>=end-2)rail.scrollTo({left:0,behavior:'smooth'});
   else move(1);
  },3200);
 };
 if(previous)previous.addEventListener('click',()=>move(-1));
 if(next)next.addEventListener('click',()=>move(1));
 rail.addEventListener('scroll',update,{passive:true});
 rail.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  event.preventDefault();
  move(event.key==='ArrowRight'?1:-1);
 });
 filters.forEach(button=>button.addEventListener('click',()=>{
  const selected=button.dataset.filter;
  filters.forEach(filter=>{
   const active=filter===button;
   filter.classList.toggle('is-active',active);
   filter.setAttribute('aria-pressed',String(active));
  });
  cards.forEach(card=>{card.hidden=selected!=='all'&&card.dataset.type!==selected});
  rail.scrollTo({left:0,behavior:reduced.matches?'auto':'smooth'});
  requestAnimationFrame(()=>{update();startAuto()});
 }));
 rail.addEventListener('pointerenter',()=>{paused=true;stopAuto()});
 rail.addEventListener('pointerleave',()=>{paused=false;startAuto()});
 rail.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse'||event.button!==0)return;
  drag={id:event.pointerId,x:event.clientX,left:rail.scrollLeft};
  dragged=false;
  paused=true;
  stopAuto();
  rail.setPointerCapture(event.pointerId);
  rail.classList.add('is-dragging');
 });
 rail.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  const distance=event.clientX-drag.x;
  if(Math.abs(distance)>5)dragged=true;
  rail.scrollLeft=drag.left-distance;
 });
 const finishDrag=event=>{
  if(!drag||event.pointerId!==drag.id)return;
  if(rail.hasPointerCapture(event.pointerId))rail.releasePointerCapture(event.pointerId);
  drag=null;
  rail.classList.remove('is-dragging');
  paused=rail.matches(':hover');
  if(!paused)startAuto();
 };
 rail.addEventListener('pointerup',finishDrag);
 rail.addEventListener('pointercancel',finishDrag);
 rail.addEventListener('click',event=>{
  if(!dragged)return;
  event.preventDefault();
  event.stopPropagation();
  dragged=false;
 },true);
 rail.addEventListener('focusin',()=>{paused=true;stopAuto()});
 rail.addEventListener('focusout',event=>{if(!rail.contains(event.relatedTarget)){paused=false;startAuto()}});
 document.addEventListener('visibilitychange',()=>document.hidden?stopAuto():startAuto());
 reduced.addEventListener('change',startAuto);
 new ResizeObserver(update).observe(rail);
 requestAnimationFrame(()=>{update();startAuto()});
}
