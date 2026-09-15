import {site, journeys, management, collections, matchCollections, portfolio, transition, clients} from './content.js';

const $ = (selector, parent=document) => parent.querySelector(selector);
const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
const lifecycle = new AbortController();
const on = (target, event, callback, options={}) => target.addEventListener(event, callback, {...options,signal:lifecycle.signal});
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const escape = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let galleryIndex=0, stageIndex=0, searchEpoch=0;
const imageRequests=new WeakMap();
let revealObserver=null;

// The philosophy rail behaves as a timed, directly selectable tab sequence.
// It only advances while visible; interaction and reduced-motion preferences
// keep control with the visitor.
const philosophyItems=[
  {title:'Positioning',image:'architecture-curves',alt:'Curved contemporary waterfront residences'},
  {title:'Performance',image:'architecture-facade',alt:'Ordered balconies and windows across a contemporary residential facade'},
  {title:'Stewardship',image:'architecture-waterfront',alt:'Waterfront residences in warm evening light'},
];
const philosophyTabs=$$('[data-value-tab]');
const philosophySection=$('#perspective');
let philosophyIndex=0,philosophyVisible=false,philosophyProgress=null;
const philosophyDuration=5000;
function pausePhilosophy(){philosophyProgress?.pause();}
function resumePhilosophy(){if(philosophyVisible&&!reduced.matches&&document.visibilityState==='visible')philosophyProgress?.play();}
function runPhilosophyProgress(){
  philosophyProgress?.cancel();philosophyProgress=null;
  const fill=$('.value-progress>span',philosophyTabs[philosophyIndex]);
  if(!fill)return;
  if(reduced.matches){fill.style.transform='scaleX(1)';return;}
  fill.style.transform='';
  philosophyProgress=fill.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:philosophyDuration,easing:'linear',fill:'forwards'});
  philosophyProgress.onfinish=()=>{if(philosophyVisible)selectPhilosophy((philosophyIndex+1)%philosophyItems.length,false);};
  if(!philosophyVisible||document.visibilityState!=='visible')philosophyProgress.pause();
}
function selectPhilosophy(index,announce=true){
  if(index<0||index>=philosophyItems.length)return;
  philosophyIndex=index;const data=philosophyItems[index];
  philosophyTabs.forEach((tab,i)=>{const selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  const panel=$('#philosophy-panel');panel.setAttribute('aria-labelledby','philosophy-tab-'+index);
  changePicture($('#philosophy-image'),data.image,data.alt);
  $('#philosophy-current').textContent='0'+(index+1);
  if(announce)$('#philosophy-announcement').textContent=data.title+'. '+data.alt+'.';
  runPhilosophyProgress();
}
philosophyTabs.forEach(tab=>on(tab,'click',()=>selectPhilosophy(Number(tab.dataset.valueTab))));
const philosophyObserver=new IntersectionObserver(entries=>{
  philosophyVisible=entries[0].isIntersecting;
  if(philosophyVisible){if(!philosophyProgress)runPhilosophyProgress();else resumePhilosophy();}
  else pausePhilosophy();
},{threshold:.28});
philosophyObserver.observe(philosophySection);
on(document,'visibilitychange',()=>document.visibilityState==='visible'?resumePhilosophy():pausePhilosophy());
on(reduced,'change',()=>selectPhilosophy(philosophyIndex,false));

// Carry the hero's measured, directional motion into the editorial chapters.
// Content remains fully visible without JavaScript and for reduced-motion users.
const revealTargets=$$('.section-pad .chapter, .perspective-editorial, .value-pillars, .journey-heading, .journey-grid, .discovery-heading, .search-form, .results-toolbar, .discovery-results, .management-layout, .proof-composition, .proof-metrics, .proof-foot, .proof-trust, .portfolio-heading, .portfolio-feature, .portfolio-rail-head, .portfolio-rail, .transition-heading, .transition-layout, .closing-content, .closing-signoff');
if(!reduced.matches&&'IntersectionObserver'in window){
  revealTargets.forEach((element,index)=>{element.dataset.reveal=element.matches('.journey-grid,.management-layout,.portfolio-feature,.closing-content')?'masked':'line';element.style.setProperty('--reveal-delay',(index%2)*70+'ms');});
  document.documentElement.classList.add('motion-ready');
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{rootMargin:'0px 0px -9% 0px',threshold:.08});
  revealTargets.forEach(element=>revealObserver.observe(element));
}

function animateChange(element, duration=350) {
  if(reduced.matches || !element.animate) return;
  element.getAnimations().forEach(a=>a.cancel());
  element.animate([{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration,easing:'cubic-bezier(.22,.61,.36,1)'});
}
async function changePicture(element, name, alt, animated=true) {
  const epoch=(imageRequests.get(element)||0)+1;imageRequests.set(element,epoch);
  const source='assets/'+name+'.webp';
  const preload=new Image();preload.src=source;
  try{await preload.decode();}catch{/* Keep the supplied alt text if loading fails. */}
  if(epoch!==imageRequests.get(element))return;
  element.src=source;element.alt=alt;
  if(animated)animateChange(element,450);
}

const menuButton=$('.menu-toggle'), menu=$('#mobile-menu'), header=$('#site-header');
let headerFrame=0;
function paintHeader(){
  headerFrame=0;
  const trigger=innerWidth<=800?116:140;
  header.classList.toggle('is-sticky',$('#perspective').getBoundingClientRect().top<=trigger);
}
function queueHeader(){if(!headerFrame)headerFrame=requestAnimationFrame(paintHeader);}
on(window,'scroll',queueHeader,{passive:true});
on(window,'resize',queueHeader);
paintHeader();
function closeMenu(returnFocus=false){
  menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');
  header.classList.remove('menu-open');document.body.classList.remove('locked');
  $('#main').inert=false;$('.footer').inert=false;
  if(returnFocus)menuButton.focus();
}
on(menuButton,'click',()=>{
  if(!menu.hidden){closeMenu(true);return;}
  menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close navigation');
  header.classList.add('menu-open');document.body.classList.add('locked');
  $('#main').inert=true;$('.footer').inert=true;
});
$$('a',menu).forEach(a=>on(a,'click',()=>closeMenu()));
on(document,'keydown',e=>{
  if(menu.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeMenu(true);}
  if(e.key==='Tab'){
    const available=[...$$('a,button',header),...$$('a,button',menu)].filter(el=>el.getClientRects().length);
    const first=available[0],last=available.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
on(window,'resize',()=>{if(innerWidth>800&&!menu.hidden)closeMenu();});

$$('[role=tablist]').forEach(list=>on(list,'keydown',e=>{
  const tabs=$$('[role=tab]',list),i=tabs.indexOf(document.activeElement);if(i<0)return;let next=i;
  if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%tabs.length;
  else if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i-1+tabs.length)%tabs.length;
  else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
  e.preventDefault();tabs[next].focus();
}));
$$('[data-journey-card]').forEach(link=>on(link,'click',e=>{
  const journey=link.dataset.journeyCard,data=journeys[journey];
  if(data)$('#journey-announcement').textContent=journey.charAt(0).toUpperCase()+journey.slice(1)+'. '+data.body;
  if(journey==='buy'||journey==='rent'){setIntent(journey);runSearch();}
  else if(journey==='sell'){e.preventDefault();openEnquiry('sell');}
}));
$$('[data-nav-intent]').forEach(link=>on(link,'click',()=>{setIntent(link.dataset.navIntent);runSearch();}));

// A concise, conversation-led property direction finder.
const searchForm=$('#property-search'),results=$('#collection-results'),searchSubmit=$('.search-submit');
const currentIntent=()=>new FormData(searchForm).get('intent');
const budgetOptions={
  buy:[['any','Any price'],['under-1m','Under AED 1M'],['1m-3m','AED 1M–3M'],['3m-plus','AED 3M+']],
  rent:[['any','Any annual rent'],['under-100k','Under AED 100K'],['100k-200k','AED 100K–200K'],['200k-plus','AED 200K+']],
};
function setIntent(intent){
  if(!['buy','rent'].includes(intent))return;
  $('input[name=intent][value='+intent+']',searchForm).checked=true;
  const budget=$('#search-budget'),current=budget.value;
  budget.innerHTML=budgetOptions[intent].map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('');
  if(budgetOptions[intent].some(([value])=>value===current))budget.value=current;
}
function searchFilters(){const data=Object.fromEntries(new FormData(searchForm));return {intent:data.intent,location:data.location,type:data.type,beds:data.beds,budget:data.budget};}
function renderCollections(items, intent){
  results.innerHTML=items.map(item=>'<article class="collection-card"><button type="button" class="collection-image" data-collection="'+item.id+'" aria-label="Enquire about '+escape(item.name)+'"><img src="assets/'+item.image+'.webp" srcset="assets/'+item.image+'-small.webp 600w, assets/'+item.image+'.webp 900w" sizes="(max-width:600px) 85vw, 36vw" alt="'+escape(item.alt)+'" width="900" height="488" loading="lazy"></button><div class="collection-body"><p class="collection-meta">'+escape(item.location)+' · '+escape(item.type)+'</p><h3>'+escape(item.name)+'</h3><div class="collection-bottom"><button type="button" data-collection="'+item.id+'">Enquire now <span aria-hidden="true">↗</span></button></div></div></article>').join('');
  $('#search-empty').hidden=items.length>0;
  results.hidden=items.length===0;
  $('#search-empty [data-enquiry]').dataset.enquiry=intent;
  $('#search-status').textContent=items.length+' '+(items.length===1?'property':'properties')+' for '+(intent==='buy'?'buying':'leasing');
  results.scrollLeft=0;
}
async function runSearch(){
  const epoch=++searchEpoch,filters=searchFilters();
  searchSubmit.disabled=true;searchSubmit.setAttribute('aria-busy','true');results.setAttribute('aria-busy','true');
  $('#search-status').textContent='Searching properties…';
  await new Promise(resolve=>setTimeout(resolve,reduced.matches?0:180));
  if(epoch!==searchEpoch)return;
  renderCollections(matchCollections(filters),filters.intent);
  searchSubmit.disabled=false;searchSubmit.removeAttribute('aria-busy');results.removeAttribute('aria-busy');
}
on(searchForm,'submit',e=>{e.preventDefault();runSearch();});
on(searchForm,'change',e=>{
  if(e.target.name==='intent'){setIntent(e.target.value);runSearch();}
  else $('#search-status').textContent='Filters updated. Search to see matches.';
});
function resetSearch(){
  const intent=currentIntent();searchForm.reset();setIntent(intent);runSearch();
}
on($('#reset-search'),'click',resetSearch);on($('#empty-reset'),'click',resetSearch);
renderCollections(collections,'buy');

// Three management pillars with one coordinated visual.
$('#management-index').innerHTML=management.map((item,i)=>'<article class="management-entry"><h3><button type="button" id="management-button-'+i+'" data-management="'+i+'" aria-expanded="'+(i===0)+'" aria-controls="management-detail-'+i+'"><span>'+escape(item.title)+'</span><span aria-hidden="true">'+(i===0?'−':'+')+'</span></button></h3><div class="management-detail" id="management-detail-'+i+'" role="region" aria-labelledby="management-button-'+i+'"'+(i===0?'':' hidden')+'><p>'+escape(item.body)+'</p><ul>'+item.examples.map(label=>'<li>'+escape(label)+'</li>').join('')+'</ul></div></article>').join('');
on($('#management-index'),'click',e=>{
  const button=e.target.closest('[data-management]');if(!button)return;
  const index=Number(button.dataset.management),data=management[index];
  $$('[data-management]').forEach((b,i)=>{b.setAttribute('aria-expanded',String(i===index));b.lastElementChild.textContent=i===index?'−':'+';$('#management-detail-'+i).hidden=i!==index;});
  changePicture($('#management-image'),data.image,data.alt,false);$('#management-outcome').textContent=data.outcome;
});
$$('[data-proof]').forEach(el=>el.textContent=site.proof[el.dataset.proof]);

function showGallery(index){
  galleryIndex=Math.max(0,Math.min(portfolio.length-1,index));
  const item=portfolio[galleryIndex],img=$('#gallery-image');img.src='assets/'+item.image+'.webp';img.alt=item.alt;
  $('#gallery-caption').textContent=item.caption;$('#gallery-count').textContent='0'+(galleryIndex+1)+' / 05';
  $('#gallery-prev').disabled=galleryIndex===0;$('#gallery-next').disabled=galleryIndex===portfolio.length-1;
}
on($('#gallery-prev'),'click',()=>showGallery(galleryIndex-1));on($('#gallery-next'),'click',()=>showGallery(galleryIndex+1));
on($('#gallery-dialog'),'keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showGallery(galleryIndex+(e.key==='ArrowRight'?1:-1));}});

// The 30-day transition is always directly selectable; no forced scrolling.
function selectStage(index){
  if(index<0||index>=transition.length)return;
  stageIndex=index;const data=transition[index];
  $$('[data-stage]').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  $('#stage-panel').setAttribute('aria-labelledby','stage-tab-'+index);
  $('#stage-week').textContent=data.week+' / 30-day transition';
  $('#stage-number').textContent='0'+(index+1);$('#stage-count').textContent='0'+(index+1)+' / 04';
  $('#stage-title').textContent=data.title+'.';$('#stage-body').textContent=data.body;$('#stage-gain').textContent=data.gain;
  $('#stage-evidence').innerHTML=data.evidence.map(item=>'<li>'+escape(item)+'</li>').join('');
  $('#next-stage').innerHTML=(data.next?'Next: '+escape(data.next):'Discuss your transition')+' <span aria-hidden="true">'+(data.next?'→':'↗')+'</span>';
  $('#stage-panel').style.setProperty('--stage-progress',(index+1)/4);animateChange($('#stage-title'),250);
}
$$('[data-stage]').forEach(button=>on(button,'click',()=>selectStage(Number(button.dataset.stage))));
on($('#next-stage'),'click',()=>{if(stageIndex<3)selectStage(stageIndex+1);else openEnquiry('manage');});

// Approved client data can be added without a layout rewrite.
const approvedClients=clients.filter(c=>c.approved===true);
if(approvedClients.length){$('#client-logos').hidden=false;$('#client-logos').innerHTML=approvedClients.map(c=>'<img src="'+escape(c.image)+'" alt="'+escape(c.name)+'" width="200" height="80" loading="lazy">').join('');}

// Enquiries prepare a draft only. No API calls, persistence or success claims.
const enquiryDialog=$('#enquiry-dialog'),enquiryForm=$('#enquiry-form');
const enquiryNames={buy:'A place for your ambitions.',sell:'Your property. New possibilities.',rent:'A place to feel at home.',manage:'A wider view of your property.',general:'Let’s see what’s possible.'};
function openEnquiry(intent='general',collection=null){
  if(!enquiryNames[intent])intent='general';
  closeMenu();
  $('#enquiry-interest').value=intent;$('#enquiry-heading').textContent=enquiryNames[intent];
  $('#enquiry-draft').hidden=true;enquiryForm.hidden=false;$('#draft-status').textContent='';
  if(collection)enquiryForm.elements.message.value='I would like to discuss '+(intent==='rent'?'leasing':'buying')+' options aligned with “'+collection.name+'”. My preferred location is '+collection.location+'.';
  if(!enquiryDialog.open)enquiryDialog.showModal();
}
on($('#enquiry-interest'),'change',e=>$('#enquiry-heading').textContent=enquiryNames[e.target.value]);
on(document,'click',e=>{
  const enquiryButton=e.target.closest('[data-enquiry]');
  if(enquiryButton){openEnquiry(enquiryButton.dataset.enquiry);return;}
  const collectionButton=e.target.closest('[data-collection]');
  if(collectionButton){const item=collections.find(c=>c.id===collectionButton.dataset.collection);if(item)openEnquiry(currentIntent(),item);return;}
  const galleryButton=e.target.closest('[data-portfolio]');
  if(galleryButton){showGallery(Number(galleryButton.dataset.portfolio));$('#gallery-dialog').showModal();return;}
  const closeButton=e.target.closest('[data-close-dialog]');
  if(closeButton)$('#'+closeButton.dataset.closeDialog).close();
});
$$('dialog').forEach(dialog=>{
  on(dialog,'click',e=>{
    if(e.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
  });
  on(dialog,'keydown',e=>{
    if(e.key!=='Tab')return;
    const controls=$$('a[href],button,input,select,textarea,[tabindex]',dialog).filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
});
on(enquiryForm,'submit',e=>{
  e.preventDefault();if(!enquiryForm.reportValidity())return;
  const values=Object.fromEntries(new FormData(enquiryForm));
  const interest=$('#enquiry-interest').selectedOptions[0].textContent;
  const subject='ADURE enquiry — '+interest;
  const body=['Hello ADURE,','','I would like to discuss: '+interest,'Location: '+(values.location||'Not decided yet'),'','Name: '+values.name,'Email: '+values.email,'',values.message,'','Kind regards,',values.name].join('\n');
  $('#draft-preview').value='To: '+site.email+'\nSubject: '+subject+'\n\n'+body;
  $('#send-email').href='mailto:'+site.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  enquiryForm.hidden=true;$('#enquiry-draft').hidden=false;$('#draft-preview').focus();
});
on($('#edit-draft'),'click',()=>{$('#enquiry-draft').hidden=true;enquiryForm.hidden=false;enquiryForm.elements.message.focus();});
on($('#copy-draft'),'click',async()=>{
  try{await navigator.clipboard.writeText($('#draft-preview').value);$('#draft-status').textContent='Draft copied. You can paste it into your email app.';}
  catch{$('#draft-preview').focus();$('#draft-preview').select();$('#draft-status').textContent='Select and copy the draft above using your device’s copy command.';}
});
$$('[data-email]').forEach(el=>{el.textContent=site.email;el.href='mailto:'+site.email;});
$$('[data-year]').forEach(el=>el.textContent=site.year);

// The hero borrows the reference's sticky scroll runway: the editorial groups
// separate horizontally while the film moves with a restrained parallax.
let frame=0,heroVisible=true;
function paintHero(){
  frame=0;const hero=$('#home'),rect=hero.getBoundingClientRect();
  const runway=Math.max(1,rect.height-innerHeight);
  const raw=reduced.matches?0:Math.max(0,Math.min(1,-rect.top/runway));
  const p=1-Math.pow(1-raw,1.15);
  const travel=Math.min(innerWidth*(innerWidth<=600?1.05:1.12),1560)*p;
  const parallax=-Math.min(innerHeight*.045,42)*p;
  const scale=1.035+.025*p;
  hero.style.setProperty('--hero-progress',p.toFixed(3));
  hero.style.setProperty('--hero-left-x',(-travel).toFixed(1)+'px');
  hero.style.setProperty('--hero-right-x',travel.toFixed(1)+'px');
  hero.style.setProperty('--hero-parallax-y',parallax.toFixed(1)+'px');
  hero.style.setProperty('--hero-video-scale',scale.toFixed(4));
}
function queueHero(){if(!frame&&heroVisible)frame=requestAnimationFrame(paintHero);}
const observer=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)queueHero();});
observer.observe($('#home'));
on(window,'scroll',queueHero,{passive:true});on(window,'resize',queueHero);
on(reduced,'change',()=>{paintHero();});
on(window,'pagehide',event=>{if(event.persisted)return;lifecycle.abort();observer.disconnect();philosophyObserver.disconnect();philosophyProgress?.cancel();revealObserver?.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(headerFrame);searchEpoch++;});
paintHero();
