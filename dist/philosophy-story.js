const section=document.querySelector('#philosophy');
const stage=section?.querySelector('.philosophy-stage');
if(stage){
 const steps=[...section.querySelectorAll('[data-philosophy-step]')];
 const pairs=[...section.querySelectorAll('[data-philosophy-pair]')];
 // Prepare every image pair before its scroll reveal to avoid a blank transition.
 const imageObserver=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  pairs.forEach(pair=>pair.querySelectorAll('img').forEach(image=>{image.loading='eager';}));
  imageObserver.disconnect();
 },{rootMargin:'400px'});
 imageObserver.observe(section);
 const desktop=matchMedia('(min-width:801px)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let selected='',frame=0;
 section.classList.add('has-philosophy-story');
 function select(index){
  const staticLayout=!desktop.matches||reduced.matches;
  const key=`${index}:${staticLayout}`;
  if(key===selected)return;
  selected=key;
  section.classList.toggle('is-static',staticLayout);
  steps.forEach((step,i)=>{const visible=staticLayout||i===index;step.classList.toggle('is-active',i===index);step.setAttribute('aria-hidden',String(!visible));step.inert=!visible;});
  pairs.forEach((pair,i)=>pair.classList.toggle('is-active',i===index));
  section.style.setProperty('--philosophy-fill',(index+1)/steps.length);
 }
 function range(){
  const sticky=section.querySelector('.philosophy-sticky');
  return {start:stage.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(sticky).top)||0),distance:Math.max(1,stage.offsetHeight-sticky.offsetHeight)};
 }
 function update(){
  frame=0;
  if(!desktop.matches||reduced.matches){select(0);return;}
  const {start,distance}=range();
  select(Math.min(steps.length-1,Math.max(0,Math.floor((scrollY-start)/distance*steps.length))));
 }
 function queue(){if(!frame)frame=requestAnimationFrame(update);}
 select(0);
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',queue,{passive:true});
 desktop.addEventListener('change',queue);
 reduced.addEventListener('change',queue);
 update();
}
