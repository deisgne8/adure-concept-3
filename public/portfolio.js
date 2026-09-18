import {cities, propertiesForCity} from './portfolio-data.js';

const root=document.querySelector('#portfolio');
const $=selector=>root.querySelector(selector);
const $$=selector=>[...root.querySelectorAll(selector)];
const events=new AbortController();
const on=(target,name,handler,options={})=>target.addEventListener(name,handler,{...options,signal:events.signal});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// UI and renderer share this state. Scene coordinates never stand in for geography.
const state={city:cities[0].id,selected:null,hovered:null,focused:null,loading:'idle',mode:'map'};
let scene=null,loadEpoch=0,cityEpoch=0,visible=false,near=false,destroyed=false;
const city=()=>cities.find(item=>item.id===state.city);
const properties=()=>propertiesForCity(state.city);
const announce=message=>$('#pm-announcement').textContent=message;
function setLoading(value){state.loading=value;root.dataset.loading=value;$$('[data-map-action]').forEach(button=>button.disabled=value!=='ready');}
function syncEmphasis(){
  $$('[data-property]').forEach(button=>{
    const selected=button.dataset.property===state.selected;
    button.setAttribute('aria-pressed',String(selected));
    button.classList.toggle('is-hovered',button.dataset.property===(state.focused||state.hovered));
    const symbol=button.querySelector('.pm-select-symbol');if(symbol)symbol.textContent=selected?'−':'↗';
  });
  scene?.emphasize(state.selected,state.focused||state.hovered);
}
function renderIndex(){
  $('#pm-properties').replaceChildren();
  properties().forEach((item,index)=>{
    const li=document.createElement('li'),button=document.createElement('button');
    button.type='button';button.className='pm-property';button.dataset.property=item.id;
    button.setAttribute('aria-pressed','false');button.setAttribute('aria-controls','pm-details');
    const number=document.createElement('span');number.className='pm-number';number.textContent=String(index+1).padStart(2,'0');
    const copy=document.createElement('span'),name=document.createElement('strong'),location=document.createElement('small');
    name.textContent=item.name;location.textContent='Image study · '+item.neighbourhood;copy.append(name,location);
    const symbol=document.createElement('span');symbol.className='pm-select-symbol';symbol.textContent='↗';symbol.setAttribute('aria-hidden','true');button.append(number,copy,symbol);li.append(button);$('#pm-properties').append(li);
  });
  if(!properties().length){const empty=document.createElement('li');empty.textContent='Portfolio details for this city are being prepared. Enquire with ADURE for more information.';$('#pm-properties').append(empty);}
}
function renderDetails(){
  const item=properties().find(item=>item.id===state.selected),first=properties()[0];
  const img=$('#pm-detail-image');img.hidden=false;
  const source=item?.image||first?.image||'assets/architecture-waterfront.webp';
  if(img.getAttribute('src')!==source){img.style.opacity='0';img.src=source;}
  img.alt=item?.alt||first?.alt||'Waterfront architecture from the ADURE company profile';
  $('#pm-detail-title').textContent=item?.name||'Architecture. In context.';
  $('#pm-detail-meta').textContent=item?`${city().name} study · ${item.neighbourhood}`:'From the ADURE portfolio';
  $('#pm-detail-description').textContent=item?.shortDescription||'Select a blue building or an image study to take a closer look.';
  $('#pm-detail-status').textContent=item?`${item.category}. Photo, model and city pairing is illustrative.`:'Property identities and city associations await confirmation.';
  const link=$('#pm-detail-link');link.href=item?.detailUrl||'#contact';link.firstChild.textContent=item?.detailUrl?'View property ':'Enquire with ADURE ';
}
function select(id){
  const item=properties().find(item=>item.id===id);if(!item)return;
  state.selected=id;syncEmphasis();renderDetails();scene?.select(item,reduced.matches);
  announce(`${item.name} selected. ${city().name} image study. Location and property identity unconfirmed.`);
}
async function setCity(id){
  if(id===state.city)return;
  const next=cities.find(item=>item.id===id);if(!next)return;
  const epoch=++cityEpoch;state.city=id;state.selected=null;state.hovered=null;state.focused=null;
  $$('[data-city]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.city===id)));
  $('#pm-city-title').textContent=next.name;$('#pm-city-number').textContent=next.number;
  renderIndex();renderDetails();syncEmphasis();
  // A fade between independent city models avoids suggesting continuous geography.
  if(scene){
    scene.setVisible(false);$('#pm-markers').replaceChildren();$('#pm-canvas').style.opacity='0';
    if(!reduced.matches)await new Promise(resolve=>setTimeout(resolve,180));
    if(epoch!==cityEpoch||destroyed)return;
    scene.setCity(next,properties());
    if(state.selected)scene.select(properties().find(item=>item.id===state.selected),true);
    syncEmphasis();scene.setVisible(visible&&state.mode==='map');
    $('#pm-canvas').style.opacity='';
  }
  announce(`${next.name} illustrative scene. ${properties().length} image studies. Locations to be confirmed.`);
}
async function loadScene(){
  if(destroyed||state.loading==='loading'||state.loading==='ready'||state.mode==='list')return;
  const epoch=++loadEpoch;setLoading('loading');$('#pm-retry').hidden=true;
  $('#pm-load-message').textContent='Preparing the architectural model. The collection is ready to explore.';
  let timer;
  try{
    const module=await Promise.race([import('./portfolio-scene.js'),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Loading timed out')),15000);})]);
    clearTimeout(timer);if(epoch!==loadEpoch||destroyed)return;
    scene=module.createPortfolioScene({container:$('#pm-canvas'),markers:$('#pm-markers'),onSelect:select,onFail:fail,reducedMotion:reduced.matches});
    scene.setCity(city(),properties());scene.setVisible(visible&&state.mode==='map');
    if(state.selected)scene.select(properties().find(item=>item.id===state.selected),true);
    setLoading('ready');syncEmphasis();
    if(!state.selected)scene.enter(reduced.matches);
  }catch(error){clearTimeout(timer);if(epoch===loadEpoch&&!destroyed)fail(error);}
}
function fail(error){
  loadEpoch++;scene?.dispose();scene=null;$('#pm-markers').replaceChildren();$('#pm-canvas').replaceChildren();
  $('#pm-canvas').style.opacity='';setLoading('failed');
  $('#pm-load-message').textContent='The 3D view is unavailable. Explore every image study in the collection, or switch to list view.';
  $('#pm-retry').hidden=false;announce('3D view unavailable. The complete collection and enquiries remain available.');
  console.warn('ADURE portfolio: list fallback is active.',error?.message||'WebGL unavailable');
}
on(root,'click',event=>{
  const bounds=root.getBoundingClientRect();
  visible=bounds.top<innerHeight&&bounds.bottom>0;
  scene?.setVisible(visible&&state.mode==='map'&&!document.hidden);
  // Explicit interaction also starts loading if an embedded browser deferred observers.
  if(state.loading==='idle'&&state.mode==='map')loadScene();
  const property=event.target.closest('[data-property]');if(property){select(property.dataset.property);return;}
  const cityButton=event.target.closest('[data-city]');if(cityButton){setCity(cityButton.dataset.city);return;}
  const control=event.target.closest('[data-map-action]');if(!control||!scene)return;
  const action=control.dataset.mapAction;
  if(action==='reset'){state.selected=null;state.hovered=null;state.focused=null;syncEmphasis();renderDetails();scene.reset(reduced.matches);announce(`${city().name} overview restored.`);}
  else scene.control(action,reduced.matches);
});
on(root,'pointerover',event=>{const button=event.target.closest('[data-property]');if(button){state.hovered=button.dataset.property;syncEmphasis();}});
on(root,'pointerout',event=>{const button=event.target.closest('[data-property]');if(button&&!button.contains(event.relatedTarget)){state.hovered=null;syncEmphasis();}});
on(root,'focusin',event=>{const button=event.target.closest('[data-property]');state.focused=button?.dataset.property||null;syncEmphasis();});
on(root,'focusout',event=>{if(!event.target.contains(event.relatedTarget)){state.focused=null;syncEmphasis();}});
on($('#pm-detail-image'),'load',()=>{$('#pm-detail-image').style.opacity='1';});
on($('#pm-detail-image'),'error',()=>{$('#pm-detail-image').hidden=true;});
on($('#pm-retry'),'click',loadScene);
on($('#pm-view'),'click',()=>{
  state.mode=state.mode==='map'?'list':'map';root.dataset.mode=state.mode;
  $('#pm-view').setAttribute('aria-pressed',String(state.mode==='list'));
  $('#pm-view-label').textContent=state.mode==='list'?'View as map':'View as list';
  scene?.setVisible(visible&&state.mode==='map');
  if(state.mode==='map'){scene?.resize();if(near&&state.loading==='idle')loadScene();}
  announce(state.mode==='list'?'List view. Select an image study to explore its details.':'Map view. The image study list remains available.');
});
on(reduced,'change',()=>scene?.setReducedMotion(reduced.matches));
on(document,'visibilitychange',()=>scene?.setVisible(visible&&state.mode==='map'&&!document.hidden));
const lazy=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near&&state.loading==='idle')loadScene();},{rootMargin:'450px'});
const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&state.loading==='idle')loadScene();scene?.setVisible(visible&&state.mode==='map'&&!document.hidden);});
lazy.observe(root);visibility.observe(root);
on(window,'pagehide',event=>{if(event.persisted){scene?.setVisible(false);return;}destroyed=true;loadEpoch++;cityEpoch++;lazy.disconnect();visibility.disconnect();events.abort();scene?.dispose();});
on(window,'pageshow',()=>scene?.setVisible(visible&&state.mode==='map'));
renderIndex();renderDetails();setLoading('idle');
