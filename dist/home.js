import './portfolio-carousel.js';
import './transition-carousel.js';
import './philosophy-story.js';
import './management-carousel.js';
import {updatePropertyMap} from './property-map.js';
import {properties,matchProperties,reference} from './home-data.js';
const $=s=>document.querySelector(s);
function removeHyperlinks(root=document){
 const links=[];
 if(root.matches?.('a[href]'))links.push(root);
 root.querySelectorAll?.('a[href]').forEach(link=>links.push(link));
 links.forEach(link=>{
  link.removeAttribute('href');
  link.removeAttribute('target');
  link.removeAttribute('rel');
 });
}
removeHyperlinks();
new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
 if(node.nodeType===1)removeHyperlinks(node);
}))).observe(document.body,{childList:true,subtree:true});
const form=$('#property-search'),filterDialog=$('#filter-dialog'),menu=$('#mobile-menu');
const header=$('.site-header'),hero=$('.site-hero');
const filterHome=$('#filter-home'),intentTabs=$('.tabs'),filterOpen=$('.filter-open');
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
function search(){const filters=Object.fromEntries(new FormData(form));filters.intent=intent;const results=matchProperties(filters);render(results);$('#search-status').textContent=`${results.length} ${results.length===1?'property':'properties'} available to ${intent==='buy'?'buy':'lease'}.`;}
form.addEventListener('submit',e=>{e.preventDefault();search();if(filterDialog.open)filterDialog.close();$('#search-status').scrollIntoView({block:'center',behavior:'instant'});});
document.querySelectorAll('[data-intent]').forEach(button=>button.addEventListener('click',()=>{intent=button.dataset.intent;document.querySelectorAll('[data-intent]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});search();}));
function reset(){form.reset();render(properties.slice(0,3));$('#search-status').textContent='Filters cleared. Showing featured properties.';}
form.addEventListener('reset',()=>{requestAnimationFrame(()=>{render(properties.slice(0,3));$('#search-status').textContent='Filters cleared. Showing featured properties.';});});
$('.filter-open').addEventListener('click',()=>{$('#filter-slot').append(form);filterDialog.showModal();});
$('.filter-close').addEventListener('click',()=>filterDialog.close());
filterDialog.addEventListener('close',()=>{$('#filter-home').append(form);$('.filter-open').focus();});
$('.menu-toggle').addEventListener('click',()=>{menu.showModal();$('.menu-toggle').setAttribute('aria-expanded','true');});
$('.menu-close').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>{$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus();});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
const services=$('#services-toggle'),servicesMenu=$('#services-menu');
function closeServices(focus=false){servicesMenu.hidden=true;services.setAttribute('aria-expanded','false');if(focus)services.focus();}
services.addEventListener('click',()=>{servicesMenu.hidden=!servicesMenu.hidden;services.setAttribute('aria-expanded',String(!servicesMenu.hidden));});
document.addEventListener('click',async e=>{if(!e.target.closest('.nav-disclosure'))closeServices();if(e.target.closest('#empty-reset'))reset();const save=e.target.closest('[data-favourite]');if(save){const id=save.dataset.favourite;favourites=favourites.includes(id)?favourites.filter(x=>x!==id):[...favourites,id];try{localStorage.setItem('adure-favourites',JSON.stringify(favourites));}catch{}save.setAttribute('aria-pressed',String(favourites.includes(id)));save.textContent=favourites.includes(id)?'♥':'♡';$('#action-status').textContent=favourites.includes(id)?'Property saved.':'Property removed from saved items.';}const share=e.target.closest('[data-share]');if(share){const p=properties.find(x=>x.id===share.dataset.share);const text=`${p.title} — ${p.place} — ${format(p)}\n${reference}#property-detail`;try{await navigator.clipboard.writeText(text);share.textContent='Copied';$('#action-status').textContent='Property details copied to clipboard.';}catch{$('#search-status').textContent='Share this property: '+text;}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!servicesMenu.hidden)closeServices(true);});
// Preserve meaningful image crop and avoid an unnecessary intro or scroll animation.
document.querySelectorAll('main img:not(.site-hero img)').forEach(img=>{img.loading='lazy';img.decoding='async';});
