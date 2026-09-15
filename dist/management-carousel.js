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
    titleLead.textContent='Your Asset,';
    titleMain.textContent='Looked After As A Whole';
    title.setAttribute('aria-label',titleLabel);
    title.replaceChildren(titleLead,titleMain);

    const track=document.createElement('div');
    const sticky=document.createElement('div');
    track.className='management-stack-track';
    sticky.className='management-stack-sticky';

    layout.append(track);
    track.append(sticky,stack);
    sticky.append(title,intro,visual);
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

    image.src='assets/management-beachfront-community.webp';
    image.alt='Beachfront residential community with palm-lined gardens in Abu Dhabi';
    root.classList.add('has-management-stack','management-intro-ready');

    if(reduced||!('IntersectionObserver' in window)){
      root.classList.add('is-intro-visible');
    }else{
      const introObserver=new IntersectionObserver(entries=>{
        if(entries.some(entry=>entry.isIntersecting)){
          root.classList.add('is-intro-visible');
          introObserver.disconnect();
        }
      },{rootMargin:'0px 0px -12% 0px',threshold:.12});
      introObserver.observe(root);
    }

    let frame=0;
    let headerHeight=0;
    let stageHeight=0;

    function measure(){
      headerHeight=header?.getBoundingClientRect().height||0;
      stageHeight=Math.max(1,innerHeight-headerHeight);
      root.style.setProperty('--management-top',`${headerHeight}px`);
      root.style.setProperty('--management-stage-height',`${stageHeight}px`);
      root.style.setProperty('--management-card-offset',`${stageHeight*.84}px`);
      root.style.setProperty('--management-title-height',`${title.getBoundingClientRect().height}px`);
      sync();
    }

    function sync(){
      frame=0;
      if(compact.matches||reduced){
        root.style.setProperty('--management-image-y','0px');
        slides.forEach(slide=>{
          slide.style.removeProperty('--service-scale');
          slide.style.removeProperty('--service-overlay-opacity');
          slide.style.removeProperty('--service-image-scale');
        });
        return;
      }

      const trackRect=track.getBoundingClientRect();
      const travel=Math.max(1,trackRect.height-stageHeight);
      const progress=Math.max(0,Math.min(1,(headerHeight-trackRect.top)/travel));
      root.style.setProperty('--management-image-y',`${Math.round((1-progress)*stageHeight*.025)}px`);

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
    measure();
  }
}
