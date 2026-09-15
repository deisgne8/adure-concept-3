const root=document.documentElement,hero=document.querySelector('.site-hero');
const landingHash=location.hash;
const openingStarted=Boolean(root.dataset.opening);
const video=document.querySelector('#hero-video'),intro=document.querySelector('#site-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let done=false,visible=true;
const animations=[],background=[...document.querySelectorAll('.site-header,main,.footer,.skip-link')];
const previous=background.map(element=>element.inert);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const animate=(element,frames,options)=>{const animation=element.animate(frames,{fill:'both',...options});animations.push(animation);return animation.finished.catch(()=>{});};

function playback(){
  if(reduced.matches||document.hidden||!visible)video.pause();
  else video.play().catch(()=>{});
}

function finish(){
  if(done)return;
  done=true;
  clearTimeout(window.adureOpeningTimer);
  animations.forEach(animation=>animation.cancel());
  hero.prepend(video);
  video.removeAttribute('style');
  intro.hidden=true;
  delete root.dataset.opening;
  background.forEach((element,index)=>element.inert=previous[index]);
  if(intro.contains(document.activeElement))document.querySelector('.site-logo').focus({preventScroll:true});
  playback();
  if(openingStarted&&landingHash&&landingHash!=='#home'&&location.hash===landingHash){
    const target=document.getElementById(decodeURIComponent(landingHash.slice(1)));
    if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
  }
}

document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!done)finish();});
intro?.querySelector('.intro-skip')?.addEventListener('click',finish);
window.addEventListener('resize',()=>{if(!done)finish();});
window.addEventListener('hashchange',finish);
document.addEventListener('visibilitychange',playback);
reduced.addEventListener('change',()=>{if(reduced.matches)finish();playback();});
new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(done)playback();}).observe(hero);
window.adureFinishOpening=finish;

async function open(){
  if(!root.dataset.opening||reduced.matches){finish();return;}
  background.forEach(element=>element.inert=true);
  intro.hidden=false;
  window.scrollTo({top:0,behavior:'instant'});
  await Promise.race([document.fonts.ready,wait(700)]);
  if(done)return;

  const brand=intro.querySelector('.intro-brand');
  const caption=[...intro.querySelectorAll('.intro-caption span')];
  const rings=[...intro.querySelectorAll('.intro-ring')];
  const brandBox=brand.getBoundingClientRect();
  const originX=brandBox.left+brandBox.width*.171;
  const originY=brandBox.top+brandBox.height*.5;
  const markRadius=brandBox.width*.171;
  const fullRadius=Math.hypot(Math.max(originX,innerWidth-originX),Math.max(originY,innerHeight-originY))+8;

  video.style.cssText='inset:0;width:100%;height:100%;opacity:0;clip-path:circle(0 at '+originX+'px '+originY+'px)';
  intro.prepend(video);
  root.dataset.opening='brand';

  rings.forEach((ring,index)=>animate(ring,[
    {opacity:0,transform:`translate(-50%,-50%) rotate(${index?-150:150}deg) scale(.78)`},
    {opacity:.72,transform:'translate(-50%,-50%) rotate(24deg) scale(1.04)',offset:.7},
    {opacity:.22,transform:'translate(-50%,-50%) rotate(0deg) scale(1)'}
  ],{duration:900,easing:'cubic-bezier(.4,0,.16,1)'}));
  await animate(brand,[
    {opacity:0,clipPath:'inset(0 76% 0 0)',transform:'translateX(38%) scale(.94)'},
    {opacity:1,clipPath:'inset(0 76% 0 0)',transform:'translateX(38%) scale(1)',offset:.46},
    {opacity:1,clipPath:'inset(0 0 0 0)',transform:'translateX(0) scale(1)'}
  ],{duration:1500,easing:'cubic-bezier(.22,1,.36,1)'});
  if(done)return;

  root.dataset.opening='message';
  caption.forEach((line,index)=>animate(line,[
    {opacity:0,transform:'translateY(8px)',clipPath:'inset(100% 0 0 0)'},
    {opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0 0)'}
  ],{delay:index*170,duration:520,easing:'cubic-bezier(.22,1,.36,1)'}));
  await wait(1150);
  if(done)return;

  root.dataset.opening='reveal';
  video.play().catch(()=>{});
  animate(brand,[{opacity:1},{opacity:0}],{delay:430,duration:420,easing:'ease-in'});
  animate(intro.querySelector('.intro-caption'),[{opacity:1},{opacity:0}],{delay:340,duration:420,easing:'ease-in'});
  rings.forEach(ring=>animate(ring,[{opacity:.22},{opacity:0}],{delay:250,duration:360,easing:'ease-in'}));
  await animate(video,[
    {opacity:0,clipPath:`circle(0 at ${originX}px ${originY}px)`,offset:0},
    {opacity:1,clipPath:`circle(${markRadius}px at ${originX}px ${originY}px)`,offset:.2},
    {opacity:1,clipPath:`circle(${markRadius}px at ${originX}px ${originY}px)`,offset:.32},
    {opacity:1,clipPath:`circle(${fullRadius}px at ${originX}px ${originY}px)`,offset:1}
  ],{duration:1750,easing:'cubic-bezier(.76,0,.18,1)'});
  if(done)return;

  await animate(intro,[{opacity:1},{opacity:0}],{duration:420,easing:'ease-out'});
  if(done)return;
  finish();
  document.querySelectorAll('.site-header,.hero-inner').forEach((element,index)=>element.animate([
    {opacity:0,transform:'translateY(14px)'},
    {opacity:1,transform:'none'}
  ],{delay:index*90,duration:650,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
}

open().catch(finish);
