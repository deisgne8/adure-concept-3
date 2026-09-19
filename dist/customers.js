const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));
const header=$('.site-header');
const mobileMenu=$('#customers-mobile-menu');
const menuToggle=$('.menu-toggle');
function updateHeader(){header?.classList.toggle('is-glass',scrollY>24)}
updateHeader();
addEventListener('scroll',updateHeader,{passive:true});
menuToggle?.addEventListener('click',()=>{mobileMenu?.showModal();menuToggle.setAttribute('aria-expanded','true')});
$('.menu-close')?.addEventListener('click',()=>mobileMenu?.close());
mobileMenu?.addEventListener('close',()=>menuToggle?.setAttribute('aria-expanded','false'));

const assetCarousel=$('[data-asset-carousel]');
if(assetCarousel){
  const track=$('.asset-carousel-track',assetCarousel);
  const cards=$$('.asset-story-card',assetCarousel);
  const dotsWrap=$('.asset-carousel-dots',assetCarousel);
  const prev=$('[data-asset-prev]',assetCarousel);
  const next=$('[data-asset-next]',assetCarousel);
  let index=0;
  const dots=cards.map((card,i)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.className='asset-carousel-dot';
    dot.setAttribute('aria-label',`Show ${card.querySelector('h3')?.textContent || `asset ${i+1}`}`);
    dot.addEventListener('click',()=>setIndex(i));
    dotsWrap?.append(dot);
    return dot;
  });
  function syncOffset(){
    const active=cards[index];
    if(active)assetCarousel.style.setProperty('--asset-offset',`${active.offsetLeft}px`);
  }
  function setIndex(nextIndex){
    index=(nextIndex+cards.length)%cards.length;
    cards.forEach((card,i)=>{
      const isActive=i===index;
      card.classList.toggle('is-active',isActive);
    });
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
    dots.forEach((dot,i)=>dot.setAttribute('aria-current',i===index?'true':'false'));
    requestAnimationFrame(syncOffset);
  }
  assetCarousel.addEventListener('click',event=>{
    const card=event.target.closest('.asset-story-card');
    if(!card)return;
    const cardIndex=cards.indexOf(card);
    if(cardIndex>-1)setIndex(cardIndex);
  });
  cards.forEach((card,i)=>{
    $('.asset-story-select',card)?.addEventListener('click',event=>{
      event.stopPropagation();
      setIndex(i);
    });
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter' || event.key===' '){
        event.preventDefault();
        setIndex(i);
      }
    });
  });
  prev?.addEventListener('click',()=>setIndex(index-1));
  next?.addEventListener('click',()=>setIndex(index+1));
  addEventListener('resize',syncOffset,{passive:true});
  track?.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft')setIndex(index-1);
    if(event.key==='ArrowRight')setIndex(index+1);
  });
  let startX=0;
  let dragX=0;
  track?.addEventListener('pointerdown',event=>{startX=event.clientX;dragX=startX;track.setPointerCapture?.(event.pointerId)});
  track?.addEventListener('pointermove',event=>{if(startX)dragX=event.clientX});
  track?.addEventListener('pointerup',()=>{if(Math.abs(dragX-startX)>48)setIndex(index+(dragX<startX?1:-1));startX=0;dragX=0});
  setIndex(0);
}




const commitmentGrid=$('.commitment-grid');
if(commitmentGrid){
  const section=commitmentGrid.closest('.customer-commitment');
  const items=$$('article',commitmentGrid);
  let activeCommitment=-1;
  function setCommitment(index){
    const safeIndex=Math.max(0,Math.min(items.length-1,index));
    if(safeIndex===activeCommitment)return;
    activeCommitment=safeIndex;
    commitmentGrid.classList.toggle('is-start',activeCommitment===0);
    items.forEach((item,i)=>{
      const isActive=i===activeCommitment;
      item.style.setProperty('--stack-offset',i);
      item.classList.toggle('is-active',isActive);
      item.classList.toggle('is-before',i<activeCommitment);
      item.classList.toggle('is-after',i>activeCommitment);
      item.setAttribute('aria-expanded',isActive?'true':'false');
      item.tabIndex=0;
    });
  }
  function updateCommitmentFromScroll(){
    if(!section || innerWidth<981)return;
    const rect=section.getBoundingClientRect();
    const travel=Math.max(1,section.offsetHeight-innerHeight);
    const progress=Math.min(1,Math.max(0,-rect.top/travel));
    setCommitment(Math.round(progress*(items.length-1)));
  }
  items.forEach((item,i)=>{
    item.setAttribute('role','button');
    item.addEventListener('mouseenter',()=>setCommitment(i));
    item.addEventListener('focus',()=>setCommitment(i));
    item.addEventListener('click',()=>setCommitment(i));
    item.addEventListener('keydown',event=>{
      if(event.key==='Enter' || event.key===' '){
        event.preventDefault();
        setCommitment(i);
      }
    });
  });
  addEventListener('scroll',updateCommitmentFromScroll,{passive:true});
  addEventListener('resize',updateCommitmentFromScroll,{passive:true});
  setCommitment(0);
  updateCommitmentFromScroll();
}
