const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const revealSelector='main section, main article, main h1, main h2, main h3, main p, main .btn, main form, main dl, main li';
const imageSelector='main img, main picture, main video, main .guides-values, main .portfolio-expanded-card';
const excluded='header, footer, nav, dialog, .site-logo, .mobile-menu, .leaflet-container, .maplibregl-map, .property-map, .client-logo, svg, .value-icon, .contact-icon, .portfolio-card-icon';
const parallaxItems=new Map();
let revealObserver=null,parallaxObserver=null,frame=0,lastTime=0;
const clamp=value=>Math.max(-1,Math.min(1,value));
function shouldSkip(node){return !node||node.closest(excluded)||node.matches?.('[hidden],[aria-hidden="true"]')}
function revealCandidates(){return [...document.querySelectorAll(revealSelector)].filter(node=>!shouldSkip(node)&&node.offsetParent!==null)}
function parallaxCandidates(){return [...document.querySelectorAll(imageSelector)].filter(node=>!shouldSkip(node)&&node.offsetParent!==null)}
function initReveal(){
  const nodes=revealCandidates();
  if(reduced.matches||!('IntersectionObserver' in window)){
    nodes.forEach(node=>node.classList.add('is-site-visible'));
    return;
  }
  revealObserver ||= new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-site-visible');
      revealObserver.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  nodes.forEach((node,index)=>{
    if(node.dataset.siteReveal)return;
    node.dataset.siteReveal='';
    node.style.setProperty('--site-reveal-delay',`${Math.min(index%4,3)*70}ms`);
    revealObserver.observe(node);
  });
}
function queue(){if(!frame)frame=requestAnimationFrame(updateParallax)}
function initParallax(){
  if(!('IntersectionObserver' in window))return;
  parallaxObserver ||= new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const item=parallaxItems.get(entry.target);
      if(item)item.visible=entry.isIntersecting;
    });
    queue();
  },{rootMargin:'120px'});
  parallaxCandidates().forEach(node=>{
    if(parallaxItems.has(node))return;
    node.dataset.siteParallax='';
    parallaxItems.set(node,{visible:false,value:0});
    parallaxObserver.observe(node);
    node.addEventListener?.('load',queue,{once:true});
  });
  for(const [node] of parallaxItems){
    if(!node.isConnected){parallaxObserver.unobserve(node);parallaxItems.delete(node)}
  }
  queue();
}
function updateParallax(now){
  frame=0;
  if(reduced.matches){
    parallaxItems.forEach((item,node)=>{item.value=0;node.style.removeProperty('--site-parallax-y')});
    lastTime=0;
    return;
  }
  const dt=lastTime?Math.min(64,now-lastTime):1000/60;
  const smoothing=1-Math.pow(.86,dt/(1000/60));
  lastTime=now;
  let moving=false;
  for(const [node,item] of parallaxItems){
    if(!item.visible||!node.isConnected)continue;
    const rect=node.getBoundingClientRect();
    const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height)*2-1);
    const strength=innerWidth<768?.45:1;
    const distance=Math.min(34,Math.max(10,rect.height*.055))*strength;
    const target=-progress*distance;
    item.value+=(target-item.value)*smoothing;
    if(Math.abs(target-item.value)>.05)moving=true;else item.value=target;
    node.style.setProperty('--site-parallax-y',`${item.value.toFixed(2)}px`);
  }
  if(moving)queue();else lastTime=0;
}
function init(){initReveal();initParallax()}
init();
new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
addEventListener('scroll',queue,{passive:true});
addEventListener('resize',queue,{passive:true});
addEventListener('pageshow',()=>{init();queue()});
reduced.addEventListener('change',()=>{init();queue()});
