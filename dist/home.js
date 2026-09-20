import './portfolio-carousel.js?v=portfolio-filter-position-2';
import './transition-carousel.js';
import './philosophy-story.js';
import './management-carousel.js?v=title-case-1';
import './proof-counter.js?v=units-1800-1';
import './hero-transition.js';
import './image-parallax.js';

function settleHomepageHashTarget(){
  const hash=location.hash;
  if(!hash||hash==='#home')return;
  const target=document.querySelector(hash);
  if(!target)return;
  const header=document.querySelector('.site-header');
  const transition=document.querySelector('#transition.has-transition-scroll');
  const align=()=>{
    const headerHeight=header?.getBoundingClientRect().height||0;
    const targetTop=window.scrollY+target.getBoundingClientRect().top;
    window.scrollTo({top:Math.max(0,targetTop-headerHeight),behavior:'instant'});
    const transitionBottom=transition?.getBoundingClientRect().bottom||0;
    const overlap=Math.max(0,transitionBottom-headerHeight);
    if(overlap>1)window.scrollBy({top:overlap,behavior:'instant'});
  };
  requestAnimationFrame(()=>{
    align();
    setTimeout(align,120);
    setTimeout(align,420);
  });
}

addEventListener('load',settleHomepageHashTarget,{once:true});
addEventListener('hashchange',settleHomepageHashTarget);

import {updatePropertyMap} from './property-map.js';
import {properties,matchProperties,reference} from './home-data.js';
const $=s=>document.querySelector(s);
const form=$('#property-search'),filterDialog=$('#filter-dialog'),menu=$('#mobile-menu');
const moreFiltersToggle=form.querySelector('.more-filters-toggle');
const moreFiltersPanel=form.querySelector('.more-filters-panel');
form.append(moreFiltersPanel);
const header=$('.site-header'),hero=$('.site-hero');
const filterHome=$('#filter-home'),intentTabs=$('.tabs'),filterOpen=$('.filter-open');

// Reveal the journey narrative in sequence when it enters the viewport.
const journeySection=$('#journeys');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(journeySection&&!reducedMotion.matches){
  journeySection.classList.add('journey-reveal-ready');
  const journeyObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    journeySection.classList.add('is-visible');
    journeyObserver.disconnect();
  },{threshold:.16,rootMargin:'0px 0px -8%'});
  journeyObserver.observe(journeySection);
}

// Keep section introductions consistent: title first, supporting copy second.
const sectionCopyGroups=[
  ['#discovery','.discovery-title h2','.discovery-title p'],
  ['#proof','.proof-statement h2','.proof-statement p'],
  ['#portfolio','.portfolio-intro h2','.portfolio-intro p'],
  ['#transition','.transition-head h2','.transition-head p'],
  ['#trust','.trust-copy h2','.trust-copy p']
].map(([sectionSelector,titleSelector,copySelector])=>{
  const section=$(sectionSelector);
  const title=section?.querySelector(titleSelector);
  const copy=section?.querySelector(copySelector);
  return section&&title&&copy?{section,title,copy}:null;
}).filter(Boolean);

if(!reducedMotion.matches&&'IntersectionObserver' in window){
  const sectionCopyObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-copy-visible');
      sectionCopyObserver.unobserve(entry.target);
    });
  },{threshold:.14,rootMargin:'0px 0px -10% 0px'});

  sectionCopyGroups.forEach(({section,title,copy})=>{
    section.classList.add('section-copy-reveal-ready');
    title.classList.add('section-copy-title');
    copy.classList.add('section-copy-intro');
    sectionCopyObserver.observe(section);
  });
}

// Let the conversation landscape establish first, then bring in the panel and its content.
const conversationSection=$('#conversation');
if(conversationSection&&!reducedMotion.matches&&'IntersectionObserver' in window){
  conversationSection.classList.add('conversation-reveal-ready');
  const conversationObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    conversationSection.classList.add('is-conversation-visible');
    conversationObserver.disconnect();
  },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  conversationObserver.observe(conversationSection);
}

// Reveal the trust introduction and client marks as one paced sequence.
const trustSection=$('#trust');
if(trustSection&&!reducedMotion.matches&&'IntersectionObserver' in window){
  trustSection.classList.add('trust-reveal-ready');
  const trustObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    trustSection.classList.add('is-trust-visible');
    trustObserver.disconnect();
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  trustObserver.observe(trustSection);
}
filterHome.after(filterOpen);
function updateHeader(){header.classList.toggle('is-glass',scrollY>Math.max(24,hero.offsetHeight*.08));}
updateHeader();
addEventListener('scroll',updateHeader,{passive:true});
let intent='buy';
let favourites=[];try{favourites=JSON.parse(localStorage.getItem('adure-favourites')||'[]');if(!Array.isArray(favourites))favourites=[];}catch{}
const format=p=>'AED '+p.price.toLocaleString('en-US')+(p.intent==='lease'?' / year':'');
function render(items){updatePropertyMap(items);$('#home-properties').innerHTML=items.length?items.map(p=>`<article class="property-card"><a class="property-image" href="${reference}#property-detail" aria-label="View ${p.title}"><img src="assets/${p.image}" alt="${p.title}" width="640" height="400" loading="lazy"><span class="tag">Available</span></a><div class="property-copy"><h3>${p.title}</h3><p class="meta">${p.place}</p><p class="price">${format(p)}</p><p class="meta">${p.facts}</p><p class="meta">Assigned contact · ${p.contact}</p><div class="property-actions"><a class="btn link" href="${reference}#property-detail">View property</a><div class="property-utilities"><button class="utility-button" data-favourite="${p.id}" aria-label="Save ${p.title}" aria-pressed="${favourites.includes(p.id)}">${favourites.includes(p.id)?'♥':'♡'}</button><button class="utility-button" data-share="${p.id}" aria-label="Share ${p.title}">Share</button></div></div></div></article>`).join(''):'<p class="empty-results">No properties match these filters. Try another selection or <button class="text-link" id="empty-reset">clear filters</button>.</p>';}
render(properties.slice(0,3));
$('#search-status').textContent='Featured properties';
function search(){const data=new FormData(form);const filters=Object.fromEntries(data);filters.intent=intent;filters.amenities=data.getAll('amenity');const results=matchProperties(filters);render(results);$('#search-status').textContent=`${results.length} ${results.length===1?'property':'properties'} available to ${intent==='buy'?'buy':'lease'}.`;}
let moreFiltersTimer;
function setMoreFiltersOpen(open){
  clearTimeout(moreFiltersTimer);
  form.classList.toggle('is-more-open',open);
  moreFiltersToggle.setAttribute('aria-expanded',String(open));
  const iconPath=moreFiltersToggle.querySelector('svg path');
  if(iconPath)iconPath.setAttribute('d',open?'M5 5l10 10M15 5L5 15':'M3 5h14M3 10h14M3 15h14M7 3v4m6 1v4');
  updateAmenitySummary();
  if(open){
    moreFiltersPanel.hidden=false;
    requestAnimationFrame(()=>requestAnimationFrame(()=>moreFiltersPanel.classList.add('is-visible')));
  }else{
    moreFiltersPanel.classList.remove('is-visible');
    const finish=()=>{if(moreFiltersToggle.getAttribute('aria-expanded')==='false')moreFiltersPanel.hidden=true;};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else moreFiltersTimer=setTimeout(finish,320);
  }
}
function updateAmenitySummary(){const count=form.querySelectorAll('input[name="amenity"]:checked').length;const action=moreFiltersToggle.getAttribute('aria-expanded')==='true'?'Close additional filters':'More filters';const label=count?`${action}, ${count} selected`:action;moreFiltersToggle.setAttribute('aria-label',label);moreFiltersToggle.title=label;}
moreFiltersToggle.addEventListener('click',()=>setMoreFiltersOpen(moreFiltersToggle.getAttribute('aria-expanded')!=='true'));
moreFiltersPanel.addEventListener('change',updateAmenitySummary);
form.addEventListener('submit',e=>{e.preventDefault();search();setMoreFiltersOpen(false);if(filterDialog.open)filterDialog.close();$('#search-status').scrollIntoView({block:'center',behavior:'instant'});});
document.querySelectorAll('[data-intent]').forEach(button=>button.addEventListener('click',()=>{intent=button.dataset.intent;document.querySelectorAll('[data-intent]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});search();}));
function reset(){form.reset();render(properties.slice(0,3));$('#search-status').textContent='Filters cleared. Showing featured properties.';}
form.addEventListener('reset',()=>{setMoreFiltersOpen(false);requestAnimationFrame(()=>{updateAmenitySummary();render(properties.slice(0,3));$('#search-status').textContent='Filters cleared. Showing featured properties.';});});
$('.filter-open').addEventListener('click',()=>{$('#filter-slot').append(form);filterDialog.showModal();});
$('.filter-close').addEventListener('click',()=>filterDialog.close());
filterDialog.addEventListener('close',()=>{$('#filter-home').append(form);$('.filter-open').focus();});
$('.menu-toggle').addEventListener('click',()=>{menu.showModal();$('.menu-toggle').setAttribute('aria-expanded','true');});
$('.menu-close').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>{$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus();});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
const services=$('#services-toggle'),servicesMenu=$('#services-menu');
function closeServices(focus=false){if(!services||!servicesMenu)return;servicesMenu.hidden=true;services.setAttribute('aria-expanded','false');if(focus)services.focus();}
services?.addEventListener('click',()=>{servicesMenu.hidden=!servicesMenu.hidden;services.setAttribute('aria-expanded',String(!servicesMenu.hidden));});
document.addEventListener('click',async e=>{if(!e.target.closest('.nav-disclosure'))closeServices();if(e.target.closest('#empty-reset'))reset();const save=e.target.closest('[data-favourite]');if(save){const id=save.dataset.favourite;favourites=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id];try{localStorage.setItem('adure-favourites',JSON.stringify(favourites));}catch{}save.setAttribute('aria-pressed',String(favourites.includes(id)));save.textContent=favourites.includes(id)?'♥':'♡';$('#action-status').textContent=favourites.includes(id)?'Property saved.':'Property removed from saved items.';}const share=e.target.closest('[data-share]');if(share){const p=properties.find(x=>x.id===share.dataset.share);const text=`${p.title} — ${p.place} — ${format(p)}\n${reference}#property-detail`;try{await navigator.clipboard.writeText(text);share.textContent='Copied';$('#action-status').textContent='Property details copied to clipboard.';}catch{$('#search-status').textContent='Share this property: '+text;}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMoreFiltersOpen(false);if(servicesMenu&&!servicesMenu.hidden)closeServices(true);}});
// Preserve meaningful image crop and avoid an unnecessary intro or scroll animation.
document.querySelectorAll('main img:not(.site-hero img)').forEach(img=>{img.loading='lazy';img.decoding='async';});

// Prepare a property enquiry in the visitor's email app without storing form data.
const sellForm=document.querySelector('[data-sell-form]');
if(sellForm)sellForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!sellForm.reportValidity())return;
  const details=new FormData(sellForm);
  const subject='Sell with ADURE — property enquiry';
  const body=[
    `Property location: ${details.get('location')}`,
    `Property type: ${details.get('type')}`,
    `Name: ${details.get('name')}`,
    `Phone: ${details.get('phone')}`,
    `Email: ${details.get('email')}`
  ].join('\n');
  location.href=`mailto:Inquiries@adu-re.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
