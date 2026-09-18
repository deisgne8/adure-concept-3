// Visible, smoothed image drift, composed with existing reveal and carousel transforms.
const scope=document.querySelector('#home');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const items=new Map();
const visible=new Set();
let frame=0,lastTime=0;
const clamp=value=>Math.max(-1,Math.min(1,value));

function queue(){if(!frame)frame=requestAnimationFrame(update)}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{
    if(isIntersecting)visible.add(target);else visible.delete(target);
  });
  queue();
},{rootMargin:'80px'});

function register(){
  scope.querySelectorAll('img,.transition-visual-slide>svg').forEach(image=>{
    if(items.has(image)||image.closest('.leaflet-container,.property-map,.site-logo'))return;
    const logo=Boolean(image.closest('.client-logo'));
    image.classList.add(logo?'image-parallax-logo':'image-parallax-photo');
    items.set(image,{section:image.closest('section'),value:0,logo});
    observer.observe(image);
    image.addEventListener('load',queue,{once:true});
  });
  for(const image of items.keys())if(!image.isConnected){
    observer.unobserve(image);visible.delete(image);items.delete(image);
  }
  queue();
}

function update(now){
  frame=0;
  if(reduced.matches){
    items.forEach((item,image)=>{item.value=0;image.style.removeProperty('--image-parallax-y')});
    lastTime=0;return;
  }
  const dt=lastTime?Math.min(64,now-lastTime):1000/60;
  const smoothing=1-Math.pow(.88,dt/(1000/60));
  lastTime=now;
  const sections=new Map(),writes=[];
  let moving=false;
  // Read before writing; section coordinates keep pinned images moving as well.
  for(const image of visible){
    const item=items.get(image);
    if(!item||!image.isConnected)continue;
    const section=item.section;
    if(!sections.has(section))sections.set(section,section.getBoundingClientRect());
    const rect=sections.get(section);
    const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height)*2-1);
    const strength=innerWidth<768?.7:1;
    const distance=(item.logo?4:item.section?.id==='conversation'?Math.min(44,image.clientHeight*.075):Math.min(28,image.clientHeight*.05))*strength;
    const target=-progress*distance;
    item.value+=(target-item.value)*smoothing;
    if(Math.abs(target-item.value)>.04)moving=true;else item.value=target;
    writes.push([image,item.value]);
  }
  writes.forEach(([image,value])=>image.style.setProperty('--image-parallax-y',`${value.toFixed(2)}px`));
  if(moving)queue();else lastTime=0;
}

if(scope){
  register();
  new MutationObserver(register).observe(scope,{childList:true,subtree:true});
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue,{passive:true});
  addEventListener('pageshow',queue);
  reduced.addEventListener('change',queue);
}
