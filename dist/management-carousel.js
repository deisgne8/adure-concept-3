const root=document.querySelector('#management');

if(root){
  const layout=root.querySelector('.management-layout-v2');
  const copyParent=root.querySelector('.management-copy-v2');
  const title=copyParent?.querySelector('h2');
  const intro=copyParent?.querySelector('.intro');
  const stack=root.querySelector('.management-carousel-copy');
  const serviceRows=root.querySelector('.service-rows');
  const slides=[...root.querySelectorAll('.service-row')];
  const pagination=root.querySelector('.management-pagination');
  const cta=copyParent?.querySelector('.management-main-cta');
  const visual=root.querySelector('.management-visual-v2');
  const image=visual?.querySelector('img');
  const header=document.querySelector('.site-header');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact=matchMedia('(max-width: 800px)');
  const serviceMedia=[
    ['assets/hidd-al-saadiyat/management-leasing-lobby.jpg','Hidd Al Saadiyat lobby with a sculptural chandelier and timber screen'],
    ['assets/hidd-al-saadiyat/management-facility-facade.jpg','Hidd Al Saadiyat mixed-use facade and contemporary residences'],
    ['assets/hidd-al-saadiyat/urban-mixed-use.webp','Hidd Al Saadiyat mixed-use property and active street frontage']
  ];

  if(layout&&title&&intro&&stack&&serviceRows&&visual&&image&&slides.length){
    const titleLabel=title.textContent.trim();
    const titleLead=document.createElement('span');
    const titleMain=document.createElement('span');
    titleLead.className='management-title-lead';
    titleMain.className='management-title-main';
    titleLead.textContent='From Occupancy To Operations, ';
    titleMain.textContent='We Manage It All';
    title.setAttribute('aria-label',titleLabel);
    title.replaceChildren(titleLead,titleMain);

    const track=document.createElement('div');
    const sticky=document.createElement('div');
    track.className='management-stack-track';
    sticky.className='management-stack-sticky';

    layout.append(track);
    track.append(sticky,stack);
    sticky.append(title,intro);
    if(cta)sticky.append(cta);
    sticky.append(visual);
    copyParent.remove();
    if(pagination)pagination.hidden=true;

    slides.forEach((slide,index)=>{
      const [source,alt]=serviceMedia[index];
      const inner=slide.firstElementChild;
      const heading=inner?.querySelector('h3');
      const body=inner?.querySelector('p');
      slide.style.setProperty('--service-index',index);
      slide.removeAttribute('aria-hidden');

      if(inner&&heading&&body){
        const media=document.createElement('div');
        media.className='service-card-media';
        const cardImage=document.createElement('img');
        cardImage.src=source;
        cardImage.alt=alt;
        cardImage.width=900;
        cardImage.height=560;
        cardImage.loading='lazy';
        cardImage.decoding='async';
        media.append(cardImage);
        inner.insertBefore(media,body);
      }
    });

    image.src='assets/management-beachfront-photo.webp';
    image.alt='Beachfront residences, palm-lined promenade and turquoise sea at Hidd Al Saadiyat';
    root.classList.add('has-management-stack','has-scroll-entrance');

    let frame=0;
    let headerHeight=0;
    let stageHeight=0;
    let entranceDistance=0;
    const clamp=value=>Math.max(0,Math.min(1,value));
    const copyItems=[title,intro,cta].filter(Boolean);
    let entranceFrame=0;
    let entranceTarget=0;
    let entrancePosition=null;
    let entranceTime=0;

    function entrance(progress){
      // Start enlarging as soon as the landscape card enters the viewport,
      // reaching the full management stage as the section reaches the header.
      const rise=clamp(progress);
      const expansion=clamp(progress);
      root.style.setProperty('--management-scene-width',`${68+expansion*32}%`);
      root.style.setProperty('--management-scene-height',`${74+expansion*26}%`);
      root.style.setProperty('--management-scene-y',`${((1-rise)*stageHeight*.03).toFixed(2)}px`);
      root.style.setProperty('--management-scene-radius',`${(1-expansion)*30}px`);
      root.style.setProperty('--management-scene-border',`${(1-expansion)*8}px`);
      const showCopy=progress>=.9999;
      root.classList.toggle('is-scene-expanded',showCopy);
      copyItems.forEach(item=>{item.inert=!showCopy});
    }

    function renderEntrance(now){
      const elapsed=entranceTime?Math.min(64,now-entranceTime):1000/60;
      entranceTime=now;
      // Match the reference's 0.1 interpolation at 60 Hz at any refresh rate.
      entrancePosition+=(entranceTarget-entrancePosition)*(1-Math.pow(.9,elapsed/(1000/60)));
      if(Math.abs(entranceTarget-entrancePosition)<.0001)entrancePosition=entranceTarget;
      entrance(entrancePosition);
      if(entrancePosition!==entranceTarget)entranceFrame=requestAnimationFrame(renderEntrance);
      else{entranceFrame=0;entranceTime=0}
    }

    function updateEntrance(progress){
      entranceTarget=progress;
      if(entrancePosition===null||reduced){
        entrancePosition=progress;
        entrance(progress);
      }else if(!entranceFrame){
        entranceTime=0;
        entranceFrame=requestAnimationFrame(renderEntrance);
      }
    }

    function measure(){
      headerHeight=header?.getBoundingClientRect().height||0;
      stageHeight=Math.max(1,innerHeight-headerHeight);
      root.style.setProperty('--management-top',`${headerHeight}px`);
      root.style.setProperty('--management-stage-height',`${stageHeight}px`);
      entranceDistance=reduced||compact.matches?0:stageHeight*1.25;
      root.style.setProperty('--management-card-offset',`${stageHeight*.84+entranceDistance}px`);
      root.style.setProperty('--management-title-height',`${title.getBoundingClientRect().height}px`);
      root.style.setProperty('--management-intro-height',`${intro.getBoundingClientRect().height}px`);
      sync();
    }

    function sync(){
      frame=0;
      const trackRect=track.getBoundingClientRect();
      const introProgress=reduced?1:compact.matches
        ?clamp((innerHeight-trackRect.top)/(stageHeight*.95))
        :clamp((innerHeight-trackRect.top)/stageHeight);
      updateEntrance(introProgress);
      if(compact.matches||reduced){
        root.style.setProperty('--management-image-y','0px');
        slides.forEach(slide=>{
          slide.style.removeProperty('--service-scale');
          slide.style.removeProperty('--service-overlay-opacity');
          slide.style.removeProperty('--service-image-scale');
        });
        return;
      }

      const travel=Math.max(1,trackRect.height-stageHeight);
      const progress=Math.max(0,Math.min(1,(headerHeight-trackRect.top)/travel));
      root.style.setProperty('--management-image-y',`${Math.round((1-progress)*stageHeight*.045)}px`);

      let active=0;
      const cardTop=headerHeight+Math.max(32,Math.min(stageHeight*.07,72));
      slides.forEach((slide,index)=>{
        const passed=slide.getBoundingClientRect().top<=cardTop+1;
        if(passed)active=index;
      });
      slides.forEach((slide,index)=>{
        const rect=slide.getBoundingClientRect();
        const entering=Math.max(0,Math.min(1,(stageHeight-rect.top)/Math.max(1,stageHeight-cardTop)));
        const next=slides[index+1];
        const nextTop=next?.getBoundingClientRect().top;
        const stacked=next?Math.max(0,Math.min(1,(stageHeight-nextTop)/Math.max(1,stageHeight-cardTop))):0;
        slide.style.setProperty('--service-scale',(1-stacked*.1).toFixed(4));
        slide.style.setProperty('--service-overlay-opacity',(stacked*.18).toFixed(4));
        slide.style.setProperty('--service-image-scale',(1.3-entering*.3).toFixed(4));
        slide.classList.toggle('is-current',index===active);
        slide.classList.toggle('is-past',index<active);
      });
    }

    function queue(){if(!frame)frame=requestAnimationFrame(sync)}
    addEventListener('scroll',queue,{passive:true});
    addEventListener('resize',measure,{passive:true});
    compact.addEventListener?.('change',measure);
    if(header)new ResizeObserver(measure).observe(header);
    document.fonts?.ready.then(measure);
    addEventListener('pageshow',measure);
    measure();
  }
}
