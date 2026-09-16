const hero=document.querySelector('#hero');
const nextSection=document.querySelector('#journeys');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');

if(hero&&nextSection&&!reducedMotion.matches){
  let frame=0;

  const clamp=value=>Math.max(0,Math.min(1,value));
  const paint=()=>{
    frame=0;

    // The panel travels one viewport from the lower edge to fully covering the
    // hero. Tying the media shift to that distance keeps the motion scrubbed
    // directly to the user's scroll, as on the reference.
    const panelTop=nextSection.getBoundingClientRect().top;
    const progress=clamp(1-(panelTop/window.innerHeight));
    const eased=1-Math.pow(1-progress,2.2);
    const mediaTravel=Math.min(window.innerHeight*.13,120)*eased;
    const copyTravel=Math.min(window.innerHeight*.06,54)*eased;

    hero.style.setProperty('--hero-media-y',`${mediaTravel.toFixed(2)}px`);
    // Extra image coverage prevents exposed edges as the film moves down.
    hero.style.setProperty('--hero-media-scale',(1.09+eased*.18).toFixed(4));
    hero.style.setProperty('--hero-copy-y',`${(-copyTravel).toFixed(2)}px`);
    hero.style.setProperty('--hero-copy-opacity',Math.max(0,1-eased*1.18).toFixed(3));
  };

  const queue=()=>{
    if(!frame)frame=requestAnimationFrame(paint);
  };

  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue,{passive:true});
  addEventListener('pageshow',queue);
  paint();
}
