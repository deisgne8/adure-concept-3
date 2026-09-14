const root=document.querySelector('#management');
if(root){
  const slides=[...root.querySelectorAll('.service-row')];
  const dots=[...root.querySelectorAll('.management-pagination button')];
  const visual=root.querySelector('.management-visual-v2');
  const image=visual.querySelector('img');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active=0;
  let timer;

  slides.slice(1).forEach(slide=>{const preload=new Image();preload.src=slide.dataset.image;});

  function select(index,focus=false){
    active=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      const current=i===active;
      slide.classList.toggle('is-active',current);
      slide.setAttribute('aria-hidden',String(!current));
    });
    dots.forEach((dot,i)=>{
      const current=i===active;
      dot.classList.toggle('is-active',current);
      dot.setAttribute('aria-pressed',String(current));
      dot.tabIndex=current?0:-1;
    });
    const slide=slides[active];
    if(image.getAttribute('src')!==slide.dataset.image){
      visual.classList.add('is-changing');
      const next=new Image();
      next.src=slide.dataset.image;
      next.alt=slide.dataset.alt;
      const reveal=()=>{
        image.src=next.src;
        image.alt=next.alt;
        requestAnimationFrame(()=>visual.classList.remove('is-changing'));
      };
      next.complete?reveal():next.addEventListener('load',reveal,{once:true});
    }
    if(focus)dots[active].focus();
  }

  function start(){if(!reduced&&!timer)timer=setInterval(()=>select(active+1),6500);}
  function stop(){clearInterval(timer);timer=undefined;}
  dots.forEach((dot,index)=>{
    dot.addEventListener('click',()=>{select(index);stop();start();});
    dot.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();select(active+1,true);}
      if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();select(active-1,true);}
      if(event.key==='Home'){event.preventDefault();select(0,true);}
      if(event.key==='End'){event.preventDefault();select(slides.length-1,true);}
    });
  });
  root.addEventListener('mouseenter',stop);
  root.addEventListener('mouseleave',start);
  root.addEventListener('focusin',stop);
  root.addEventListener('focusout',start);
  select(0);
  start();
}
