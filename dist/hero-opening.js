// Adapted from the retained intro.js timing: text, insert, hold, expand, arrival.
// One muted video element becomes the hero player without seeking its timeline.
const root=document.documentElement,hero=document.querySelector('.site-hero');
const landingHash=location.hash;
const openingStarted=Boolean(root.dataset.opening);
const video=document.querySelector('#hero-video'),intro=document.querySelector('#site-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let done=false,visible=true;
const animations=[],background=[...document.querySelectorAll('.site-header,main,.footer,.skip-link')];
const previous=background.map(e=>e.inert);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const animate=(el,frames,options)=>{const a=el.animate(frames,{fill:'both',...options});animations.push(a);return a.finished.catch(()=>{});};
function playback(){if(reduced.matches||document.hidden||!visible)video.pause();else video.play().catch(()=>{});}
function finish(){if(done)return;done=true;clearTimeout(window.adureOpeningTimer);animations.forEach(a=>a.cancel());hero.prepend(video);video.removeAttribute('style');intro.hidden=true;delete root.dataset.opening;background.forEach((e,i)=>e.inert=previous[i]);if(intro.contains(document.activeElement))document.querySelector('.site-logo').focus({preventScroll:true});playback();if(openingStarted&&landingHash&&landingHash!=='#home'&&location.hash===landingHash){const target=document.getElementById(decodeURIComponent(landingHash.slice(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));}}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!done)finish();});
window.addEventListener('resize',()=>{if(!done)finish();});
window.addEventListener('hashchange',finish);
document.addEventListener('visibilitychange',playback);
reduced.addEventListener('change',()=>{if(reduced.matches)finish();playback();});
new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(done)playback();}).observe(hero);
window.adureFinishOpening=finish;
async function open(){
 if(!root.dataset.opening||reduced.matches){finish();return;}
 background.forEach(e=>e.inert=true);intro.hidden=false;window.scrollTo({top:0,behavior:'instant'});
 await Promise.race([document.fonts.ready,wait(800)]);if(done)return;
 const before=intro.querySelector('.intro-before'),after=intro.querySelector('.intro-after'),slot=intro.querySelector('.intro-image-slot');
 const r=slot.getBoundingClientRect(),target=hero.getBoundingClientRect();
 const stacked=getComputedStyle(intro.querySelector('.intro-lockup')).flexDirection==='column';
 const gap=stacked?r.height+24:r.width+parseFloat(getComputedStyle(intro.querySelector('.intro-lockup')).gap);
 const compact=n=>stacked?`translateY(${n*gap/2}px)`:`translateX(${n*gap/2}px)`;
 video.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;opacity:0;border-radius:4px`;
 intro.prepend(video);root.dataset.opening='text';
 animate(before,[{opacity:0,transform:compact(1)+' translateY(20px)'},{opacity:1,transform:compact(1)}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});
 animate(after,[{opacity:0,transform:compact(-1)+' translateY(20px)'},{opacity:1,transform:compact(-1)}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});
 await wait(1250);if(done)return;root.dataset.opening='inserting';video.play().catch(()=>{});
 animate(before,[{transform:compact(1)},{transform:'translate(0,0)'}],{duration:800,easing:'ease-in-out'});
 animate(after,[{transform:compact(-1)},{transform:'translate(0,0)'}],{duration:800,easing:'ease-in-out'});
 await animate(video,[{opacity:0,clipPath:'inset(0 50%)'},{opacity:1,clipPath:'inset(0 0%)'}],{duration:800,easing:'ease-in-out'});
 root.dataset.opening='holding';await wait(800);if(done)return;root.dataset.opening='expanding';
 animate(before,[{opacity:1},{opacity:0}],{duration:450});animate(after,[{opacity:1},{opacity:0}],{duration:450});
 await animate(video,[{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',borderRadius:'4px'},{left:target.left+'px',top:target.top+'px',width:target.width+'px',height:target.height+'px',borderRadius:'0px'}],{duration:1700,easing:'cubic-bezier(.22,.61,.36,1)'});
 if(done)return;finish();
 document.querySelectorAll('.site-header,.hero-inner').forEach(el=>el.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:650,easing:'ease-out'}));
}
open().catch(finish);
