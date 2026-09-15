const root=document.documentElement,hero=document.querySelector('.site-hero');
const landingHash=location.hash;
const openingStarted=Boolean(root.dataset.opening);
const video=document.querySelector('#hero-video'),intro=document.querySelector('#site-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let done=false,visible=true;
const animations=[],background=[...document.querySelectorAll('.site-header,main,.footer,.skip-link')];
const previous=background.map(element=>element.inert);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clamp=(min,value,max)=>Math.max(min,Math.min(max,value));
const animate=(element,frames,options)=>{const animation=element.animate(frames,{fill:'both',...options});animations.push(animation);return animation.finished.catch(()=>{});};
const once=(target,event)=>new Promise(resolve=>target.addEventListener(event,resolve,{once:true}));

function criticalAssetsReady(){
  const assets=[];
  if(document.fonts?.ready)assets.push(document.fonts.ready);
  if(document.readyState!=='complete')assets.push(once(window,'load'));
  const logo=intro?.querySelector('.intro-brand img');
  if(logo&&!(logo.complete&&logo.naturalWidth))assets.push(Promise.race([once(logo,'load'),once(logo,'error')]));
  if(video&&video.readyState<2)assets.push(Promise.race([once(video,'loadeddata'),once(video,'error')]));
  return Promise.race([Promise.allSettled(assets),wait(2500)]);
}

const criticalReady=criticalAssetsReady();

function playback(){
  if(reduced.matches||document.hidden||!visible)video.pause();
  else video.play().catch(()=>{});
}

function finish(){
  if(done)return;
  done=true;
  clearTimeout(window.adureOpeningTimer);
  animations.forEach(animation=>animation.cancel());
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
  video.style.cssText='inset:0;width:100%;height:100%;opacity:1;transform:translate3d(0,25%,0) scale(1.075);transform-origin:50% 50%;clip-path:inset(100% 0 0 0)';
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
  await Promise.all([wait(1150),criticalReady]);
  if(done)return;

  root.dataset.opening='reveal';
  video.play().catch(()=>{});
  const brandBox=brand.getBoundingClientRect();
  const navLogo=document.querySelector('.site-header .site-logo img');
  const navLogoBox=navLogo?.getBoundingClientRect();
  const targetWidth=navLogoBox?.width||(innerWidth<=767?118:168);
  const targetLeft=navLogoBox?.left||(innerWidth<=767?20:clamp(30,innerWidth*.045,64));
  const targetTop=navLogoBox?.top||(innerWidth<=767?15:12);
  const brandScale=targetWidth/brandBox.width;
  brand.style.transformOrigin='top left';
  animate(brand,[
    {opacity:1,transform:'translate3d(0,0,0) scale(1)'},
    {opacity:1,transform:`translate3d(${targetLeft-brandBox.left}px,${targetTop-brandBox.top}px,0) scale(${brandScale})`,offset:.72},
    {opacity:1,transform:`translate3d(${targetLeft-brandBox.left}px,${targetTop-brandBox.top}px,0) scale(${brandScale})`}
  ],{duration:1375,easing:'cubic-bezier(.55,0,.1,1)'});
  animate(intro.querySelector('.intro-caption'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-14px)'}],{duration:480,easing:'ease-in'});
  rings.forEach(ring=>animate(ring,[{opacity:.22},{opacity:0}],{duration:420,easing:'ease-in'}));
  const heroScale=getComputedStyle(hero).getPropertyValue('--hero-media-scale').trim()||'1';
  // Full-width hero reveal: the reference's 1.375s easing, mirrored upward.
  // The media remains in the hero so playback stays continuous at handoff.
  await animate(video,[
    {opacity:1,transform:`translate3d(0,25%,0) scale(${heroScale})`,clipPath:'inset(100% 0 0 0)'},
    {opacity:1,transform:`translate3d(0,0,0) scale(${heroScale})`,clipPath:'inset(0 0 0 0)'}
  ],{duration:1375,easing:'cubic-bezier(.55,0,.1,1)'});
  if(done)return;

  // The playing video never leaves the hero. Reveal the real navigation behind
  // the aligned intro logo, then remove only the branding layer.
  root.dataset.opening='handoff';
  await animate(intro.querySelector('.intro-lockup'),[{opacity:1},{opacity:0}],{duration:420,easing:'ease-out'});
  if(done)return;
  finish();
  document.querySelectorAll('.hero-inner').forEach((element,index)=>element.animate([
    {opacity:0,transform:'translateY(14px)'},
    {opacity:1,transform:'none'}
  ],{delay:index*90,duration:650,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));
}

open().catch(finish);
