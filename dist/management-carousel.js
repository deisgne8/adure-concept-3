const root=document.querySelector('#management');
if(root){
  const slides=[...root.querySelectorAll('.service-row')];
  const dots=[...root.querySelectorAll('.management-pagination button')];
  const visual=root.querySelector('.management-visual-v2');
  const image=visual.querySelector('img');
  const serviceMedia=[
    ['assets/hidd-al-saadiyat/waterfront-view.webp','Hidd Al Saadiyat residences opening toward the beach and sea'],
    ['assets/hidd-al-saadiyat/promenade-mixed-use.webp','Hidd Al Saadiyat mixed-use building and landscaped promenade'],
    ['assets/hidd-al-saadiyat/urban-mixed-use.webp','Hidd Al Saadiyat mixed-use property and active street frontage']
  ];
  slides.forEach((slide,index)=>{
    const [source,alt]=serviceMedia[index];
    slide.dataset.image=source;
    slide.dataset.alt=alt;
  });
  image.src=slides[0].dataset.image;
  image.alt=slides[0].dataset.alt;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layout=root.querySelector('.management-layout-v2');
  const copy=root.querySelector('.management-carousel-copy');
  const header=document.querySelector('.site-header');
  const track=document.createElement('div');
  track.className='management-scroll-track';
  const sticky=document.createElement('div');
  sticky.className='management-scroll-sticky';
  layout.append(track);
  track.append(sticky);
  sticky.append(copy,visual);
  root.classList.add('has-management-scroll');
  let active=-1,frame=0,step=1,headerHeight=0,imageVersion=0;

  const preloads=slides.map(slide=>{const preload=new Image();preload.src=slide.dataset.image;return preload;});

  function select(index,focus=false){
    const nextIndex=(index+slides.length)%slides.length;
    if(nextIndex===active){if(focus)dots[active].focus();return;}
    active=nextIndex;
    const version=++imageVersion;
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
      image.src=slide.dataset.image;
      image.alt=slide.dataset.alt;
      const reveal=()=>{
        if(version!==imageVersion)return;
        requestAnimationFrame(()=>visual.classList.remove('is-changing'));
      };
      image.decode().then(reveal,reveal);
    }else visual.classList.remove('is-changing');
    if(focus)dots[active].focus();
  }

  function syncScroll(){
    frame=0;
    const distance=headerHeight-track.getBoundingClientRect().top;
    select(Math.max(0,Math.min(slides.length-1,Math.floor(distance/step))));
  }
  function queueScroll(){if(!frame)frame=requestAnimationFrame(syncScroll);}
  function measure(){
    headerHeight=header?.getBoundingClientRect().height||0;
    const height=Math.max(1,window.innerHeight-headerHeight);
    step=Math.max(320,height*.7);
    root.style.setProperty('--management-top',`${headerHeight}px`);
    root.style.setProperty('--management-stage-height',`${Math.min(780,height)}px`);
    root.style.setProperty('--management-scroll-distance',`${step*slides.length}px`);
    syncScroll();
  }
  function navigate(index,focus=false){
    const next=(index+slides.length)%slides.length;
    const top=scrollY+track.getBoundingClientRect().top-headerHeight+step*(next+.15);
    if(focus){dots[next].tabIndex=0;dots[next].focus({preventScroll:true});}
    window.scrollTo({top,behavior:reduced?'instant':'smooth'});
  }
  dots.forEach((dot,index)=>{
    dot.addEventListener('click',()=>navigate(index));
    dot.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();navigate(index+1,true);}
      if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();navigate(index-1,true);}
      if(event.key==='Home'){event.preventDefault();navigate(0,true);}
      if(event.key==='End'){event.preventDefault();navigate(slides.length-1,true);}
    });
  });
  addEventListener('scroll',queueScroll,{passive:true});
  addEventListener('resize',measure,{passive:true});
  if(header)new ResizeObserver(measure).observe(header);
  measure();
}
