const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
const header=$('.site-header');
const mobileMenu=$('#about-mobile-menu');
function updateHeader(){header.classList.toggle('is-glass',scrollY>24)}
updateHeader();addEventListener('scroll',updateHeader,{passive:true});
$('.menu-toggle')?.addEventListener('click',()=>{mobileMenu.showModal();$('.menu-toggle').setAttribute('aria-expanded','true')});
$('.menu-close')?.addEventListener('click',()=>mobileMenu.close());
mobileMenu?.addEventListener('close',()=>$('.menu-toggle').setAttribute('aria-expanded','false'));
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  $$('[data-reveal]').forEach(node=>observer.observe(node));
}else{$$('[data-reveal]').forEach(node=>node.classList.add('is-visible'))}


// Scale metric counter animation.
const scaleMetrics=$$('.scale-impact-metrics strong');
if(scaleMetrics.length){
  function parseMetric(text){
    const match=text.trim().match(/([\d,.]+)(.*)/);
    const value=match?Number(match[1].replace(/,/g,'')):0;
    const suffix=match?.[2]||'';
    return {value,suffix};
  }
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  scaleMetrics.forEach(metric=>{
    const parsed=parseMetric(metric.textContent);
    metric.dataset.target=String(parsed.value);
    metric.dataset.suffix=parsed.suffix;
    metric.textContent=prefersReduced?`${parsed.value}${parsed.suffix}`:`0${parsed.suffix}`;
  });
  function formatMetric(value,suffix){
    const rounded=Math.round(value);
    return `${rounded}${suffix}`;
  }
  function animateMetric(metric){
    if(metric.dataset.counted==='true')return;
    metric.dataset.counted='true';
    const target=Number(metric.dataset.target||0);
    const suffix=metric.dataset.suffix||'';
    if(prefersReduced){metric.textContent=formatMetric(target,suffix);return;}
    const start=performance.now();
    const duration=1300;
    function tick(now){
      const progress=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-progress,3);
      metric.textContent=formatMetric(target*eased,suffix);
      if(progress<1)requestAnimationFrame(tick);
      else metric.textContent=formatMetric(target,suffix);
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window){
    const metricObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          $$('.scale-impact-metrics strong',entry.target).forEach(animateMetric);
          metricObserver.unobserve(entry.target);
        }
      });
    },{threshold:.35});
    const metricWrap=$('.scale-impact-metrics');
    if(metricWrap)metricObserver.observe(metricWrap);
  }else{
    scaleMetrics.forEach(animateMetric);
  }
}

const storySection=$('.story-tilton-section');
if(storySection){
  const milestones=[
    {
      year:'2002',
      title:'Over Two Decades Of Excellence.',
      body:[
        'Since 2002, ADURE has built its real estate experience around the professional management of properties and the day-to-day disciplines that protect their performance.',
        'That foundation now brings together leasing and operations, facility management, and financial and legal management, alongside buying and selling.'
      ],
      left:'assets/hidd-al-saadiyat/curved-residences.webp',
      right:'assets/hidd-al-saadiyat/landscaped-community.webp'
    },
    {
      year:'2009',
      title:'A growing UAE footprint.',
      body:[
        'ADURE expanded its operating experience across more communities, strengthening the systems and service standards behind every managed asset.',
        'The portfolio grew around the same principle: protect quality, improve continuity and support the people using each place.'
      ],
      left:'assets/portfolio-reference/al-mushrif-villas-v2.webp',
      right:'assets/hidd-al-saadiyat/landscaped-community.webp'
    },
    {
      year:'2010',
      title:'Integrated property support.',
      body:[
        'The business continued building joined-up capability across leasing, operations, facilities coordination and owner support.',
        'Each discipline strengthened ADURE’s ability to look at a property as a complete long-term asset.'
      ],
      left:'assets/hidd-al-saadiyat/promenade-mixed-use.webp',
      right:'assets/management-beachfront-photo.webp'
    },
    {
      year:'2018',
      title:'Performance through management.',
      body:[
        'Operational oversight, reporting and service coordination became a stronger part of the ADURE management approach.',
        'This period shaped the company’s focus on occupancy, asset care and better experiences for owners and occupiers.'
      ],
      left:'assets/hidd-al-saadiyat/management-facility-facade.jpg',
      right:'assets/hidd-al-saadiyat/management-leasing-lobby.jpg'
    },
    {
      year:'2020',
      title:'A connected real estate model.',
      body:[
        'ADURE’s offer evolved into a clearer real estate model connecting buying, selling, leasing and management through one operating view.',
        'That wider perspective allows each property decision to support what comes next.'
      ],
      left:'assets/journeys/sell.jpg',
      right:'assets/journeys/manage.jpg'
    },
    {
      year:'2021',
      title:'Built for what comes next.',
      body:[
        'ADURE continues to bring long-term thinking to every property relationship across Abu Dhabi, Dubai and Al Ain.',
        'The focus remains consistent: create value through clarity, accountability and everyday care.'
      ],
      left:'assets/hidd-al-saadiyat/saadiyat-aerial-beach.webp',
      right:'assets/hidd-al-saadiyat/golden-waterfront.webp'
    }
  ];
  const stage=$('.story-tilton-stage',storySection);
  const prev=$('.story-tilton-prev',storySection);
  const next=$('.story-tilton-next',storySection);
  const year=$('.story-tilton-year',storySection);
  const title=$('#story-title',storySection);
  const card=$('.story-tilton-card',storySection);
  const paragraphs=$$('p:not(.story-tilton-year)',card).filter(p=>!p.classList.contains('about-eyebrow'));
  const leftImage=$('.story-tilton-image-left img',storySection);
  const rightImage=$('.story-tilton-image-right img',storySection);
  const railItems=$$('.story-tilton-years li',storySection);
  const railButtons=$$('.story-tilton-years button',storySection);
  let index=0;
  let locked=false;
  function preload(item){[item.left,item.right].forEach(src=>{const image=new Image();image.src=src;});}
  milestones.forEach(preload);
  function paint(nextIndex){
    const item=milestones[nextIndex];
    year.textContent=item.year;
    title.textContent=item.title;
    item.body.forEach((copy,i)=>{if(paragraphs[i])paragraphs[i].textContent=copy;});
    leftImage.src=item.left;
    rightImage.src=item.right;
    leftImage.alt=item.title;
    rightImage.alt=item.title;
    railItems.forEach((li,i)=>li.classList.toggle('is-active',i===nextIndex));
    railButtons.forEach((button,i)=>button.setAttribute('aria-current',i===nextIndex?'true':'false'));
    prev.disabled=nextIndex===0;
    next.disabled=nextIndex===milestones.length-1;
    index=nextIndex;
  }
  function go(nextIndex){
    if(locked||nextIndex===index||nextIndex<0||nextIndex>=milestones.length)return;
    locked=true;
    const direction=nextIndex>index?'next':'prev';
    storySection.classList.add(direction==='next'?'is-moving-next':'is-moving-prev');
    window.setTimeout(()=>{
      paint(nextIndex);
      storySection.classList.remove('is-moving-next','is-moving-prev');
      stage.animate([
        {transform:`translateX(${direction==='next'?'10vw':'-10vw'})`,opacity:.62},
        {transform:'translateX(0)',opacity:1}
      ],{duration:620,easing:'cubic-bezier(.22,1,.36,1)'});
      window.setTimeout(()=>{locked=false;},640);
    },360);
  }
  prev?.addEventListener('click',()=>go(index-1));
  next?.addEventListener('click',()=>go(index+1));
  railButtons.forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.storyIndex))));
  storySection.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight')go(index+1);
    if(event.key==='ArrowLeft')go(index-1);
  });
  paint(0);
}

const visionScrollSection=$('.vision-scroll-section');
if(visionScrollSection){
  const visionImages=$$('.vision-scroll-image',visionScrollSection);
  const visionPanels=$$('[data-vision-panel]',visionScrollSection);
  let activeVisionStep=-1;
  let visionTicking=false;
  function setVisionStep(step){
    if(step===activeVisionStep)return;
    activeVisionStep=step;
    visionScrollSection.dataset.activeStep=String(step);
    visionImages.forEach((image,index)=>image.classList.toggle('is-active',index===step));
    visionPanels.forEach((panel,index)=>{
      const isActive=index===step;
      panel.classList.toggle('is-active',isActive);
      panel.setAttribute('aria-hidden',isActive?'false':'true');
    });
  }
  function updateVisionScroll(){
    visionTicking=false;
    const rect=visionScrollSection.getBoundingClientRect();
    const travel=Math.max(1,visionScrollSection.offsetHeight-window.innerHeight);
    const scrolled=Math.min(Math.max(-rect.top,0),travel);
    const progress=scrolled/travel;
    const step=Math.min(visionPanels.length-1,Math.max(0,Math.round(progress*(visionPanels.length-1))));
    visionScrollSection.style.setProperty('--vision-progress',progress.toFixed(4));
    visionScrollSection.style.setProperty('--vision-image-y',`${Math.round(progress*38)}px`);
    setVisionStep(step);
  }
  function requestVisionUpdate(){
    if(visionTicking)return;
    visionTicking=true;
    requestAnimationFrame(updateVisionScroll);
  }
  addEventListener('scroll',requestVisionUpdate,{passive:true});
  addEventListener('resize',requestVisionUpdate);
  updateVisionScroll();
}

const valuesScrubSection=$('.values-expedition-section');
if(valuesScrubSection){
  const valueRows=$$('.values-expedition-list article',valuesScrubSection);
  const valueImages=$$('.values-expedition-visual img',valuesScrubSection);
  let activeValueIndex=-1;
  let valuesTicking=false;
  function setActiveValue(index){
    if(index===activeValueIndex)return;
    activeValueIndex=index;
    valuesScrubSection.style.setProperty('--values-active',String(index));
    valueRows.forEach((row,rowIndex)=>{
      row.classList.toggle('is-active',rowIndex===index);
      row.classList.toggle('is-before',rowIndex<index);
      row.classList.toggle('is-after',rowIndex>index);
    });
    valueImages.forEach((image,imageIndex)=>image.classList.toggle('is-active',imageIndex===index));
  }
  function updateValuesScrub(){
    valuesTicking=false;
    const sectionRect=valuesScrubSection.getBoundingClientRect();
    const travel=Math.max(1,valuesScrubSection.offsetHeight-window.innerHeight);
    const scrolled=Math.min(Math.max(-sectionRect.top,0),travel);
    const progress=scrolled/travel;
    const targetLine=window.innerHeight*.48;
    let closestIndex=0;
    let closestDistance=Infinity;
    valueRows.forEach((row,index)=>{
      const rect=row.getBoundingClientRect();
      const rowCenter=rect.top+(rect.height*.5);
      const distance=Math.abs(rowCenter-targetLine);
      if(distance<closestDistance){
        closestDistance=distance;
        closestIndex=index;
      }
    });
    valuesScrubSection.style.setProperty('--values-progress',progress.toFixed(4));
    setActiveValue(closestIndex);
  }
  function requestValuesScrub(){
    if(valuesTicking)return;
    valuesTicking=true;
    requestAnimationFrame(updateValuesScrub);
  }
  addEventListener('scroll',requestValuesScrub,{passive:true});
  addEventListener('resize',requestValuesScrub);
  updateValuesScrub();
}
