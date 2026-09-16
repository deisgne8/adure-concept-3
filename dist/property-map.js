import './vendor/leaflet.js';
import {reference} from './home-data.js';

// Neighbourhood-level demo locations, not surveyed building addresses.
export const propertyLocations = {
  'ADU-304':[24.553,54.455],
  'ADU-002':[24.476,54.349],
  'ADU-003':[24.464,54.378],
  'ADU-004':[24.444,54.386],
  'ADU-005':[25.198,55.274],
  'ADU-006':[24.546,54.448]
};
const cards=document.querySelector('#home-properties');
const status=document.querySelector('#search-status');
const toolbar=document.createElement('div');
toolbar.className='property-view-toolbar';
status.before(toolbar);
toolbar.append(status);
const switcher=document.createElement('div');
switcher.className='property-view-switch';
switcher.setAttribute('role','group');
switcher.setAttribute('aria-label','Property view');
switcher.innerHTML='<button type="button" data-property-view="list" aria-pressed="false" aria-controls="home-properties"><span aria-hidden="true">☷</span> List view</button><button type="button" data-property-view="map" aria-pressed="true" aria-controls="property-map-view"><span aria-hidden="true">⌖</span> Map view</button>';
toolbar.append(switcher);
const panel=document.createElement('div');
panel.id='property-map-view';
panel.className='property-map-view';
panel.innerHTML='<div id="property-map-canvas" aria-label="Property locations map. Use arrow keys to pan and plus or minus to zoom."></div><aside class="property-map-locations" aria-label="Available locations"><div class="map-list-heading">Our locations <span class="map-result-count"></span></div><div class="map-location-list"></div><small class="map-location-note">Approximate locations shown</small></aside><article class="map-property-preview" aria-label="Selected property" hidden></article><div class="map-load-message" role="status" hidden>Map imagery is unavailable. You can still explore the properties using the location list.</div><button class="map-fit" type="button" aria-label="Show all property locations">⌖ <span>Show all</span></button>';
cards.before(panel);
cards.hidden=true;
const list=panel.querySelector('.map-location-list');
const preview=panel.querySelector('.map-property-preview');
let map,layer,items=[],selectedId,view='map',markers=new Map(),previewVisible=false;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const price=p=>'AED '+p.price.toLocaleString('en-US')+(p.intent==='lease'?' / year':'');
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const small=()=>matchMedia('(max-width: 800px)').matches;

async function loadEnglishBasemap(){
  const message=panel.querySelector('.map-load-message');
  try{
    await import('./vendor/maplibre-gl-5.6.2.js');
    await import('./vendor/leaflet-maplibre-gl-0.1.3.js');
    const basemap=window.L.maplibreGL({
      style:new URL('./vendor/openfreemap-positron-en.json',import.meta.url).href,
      attributionControl:{customAttribution:'<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}
    }).addTo(map);
    const backgroundMap=basemap.getMaplibreMap();
    backgroundMap.on('error',()=>{message.hidden=false;});
    backgroundMap.on('idle',()=>{message.hidden=true;});
  }catch(error){
    message.hidden=false;
    console.warn('English basemap could not load',error);
  }
}

function initMap(){
  if(map||view!=='map')return;
  const L=window.L;
  map=L.map('property-map-canvas',{zoomControl:false,scrollWheelZoom:false,minZoom:5,maxZoom:18}).setView([24.5,54.41],11);
  map.on('click',()=>{previewVisible=false;preview.hidden=true;});
  L.control.zoom({position:'bottomright'}).addTo(map);
  loadEnglishBasemap();
  layer=L.layerGroup().addTo(map);
  refreshMarkers();
  new ResizeObserver(()=>{if(view==='map'){map.invalidateSize();}}).observe(panel);
}
function fit(){
  if(!map||!items.length)return;
  map.invalidateSize();
  const desktop=!small();
  map.fitBounds(items.map(p=>propertyLocations[p.id]),{
    paddingTopLeft:desktop?[panel.querySelector('aside').offsetWidth+60,65]:[35,35],
    paddingBottomRight:desktop?[preview.offsetWidth+65,70]:[35,65],maxZoom:12,animate:!reduced()
  });
}
function refreshMarkers(){
  if(!map)return;
  layer.clearLayers();markers.clear();
  items.forEach(p=>{
    const marker=window.L.marker(propertyLocations[p.id],{
      icon:window.L.divIcon({className:'adure-map-marker',html:'<span></span>',iconSize:[32,40],iconAnchor:[16,40]}),
      title:p.title,alt:'Show '+p.title,keyboard:true,bubblingMouseEvents:false
    }).addTo(layer).on('click',()=>select(p.id,true,true));
    marker.getElement().setAttribute('aria-label','Show '+p.title);
    markers.set(p.id,marker);
  });
  select(selectedId,false,previewVisible);
  fit();
}
function select(id,move,showPreview=previewVisible){
  const p=items.find(p=>p.id===id)||items[0];
  if(!p){previewVisible=false;preview.hidden=true;return;}
  selectedId=p.id;previewVisible=Boolean(showPreview);preview.hidden=!previewVisible;
  list.querySelectorAll('[data-map-property]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mapProperty===p.id)));
  markers.forEach((marker,key)=>{
    marker.getElement()?.classList.toggle('is-selected',key===p.id);
    marker.getElement()?.setAttribute('aria-pressed',String(key===p.id));
    marker.setZIndexOffset(key===p.id?1000:0);
  });
  if(previewVisible)preview.innerHTML=`<img src="assets/${escape(p.image)}" alt="${escape(p.title)}" width="640" height="400"><div class="map-preview-copy"><span class="map-preview-place">${escape(p.place)}</span><h3>${escape(p.title)}</h3><div class="map-preview-price">${price(p)}</div><div class="map-preview-facts">${escape(p.facts)}</div><a class="btn primary" href="${reference}#property-detail">View property <span aria-hidden="true">→</span></a></div>`;
  if(move&&map)map.flyTo(propertyLocations[p.id],12,{animate:!reduced(),duration:.8});
}
export function updatePropertyMap(results){
  items=results.filter(p=>propertyLocations[p.id]);
  panel.querySelector('.map-result-count').textContent=String(items.length).padStart(2,'0');
  list.innerHTML=items.length?items.map(p=>`<button type="button" class="map-location" data-map-property="${p.id}" aria-pressed="false"><span class="map-location-media" aria-hidden="true"><img src="assets/${escape(p.image)}" alt="" width="360" height="270" loading="lazy" decoding="async"></span><span class="map-location-details"><strong>${escape(p.title)}</strong><span class="map-location-address">${escape(p.place)}</span><span class="map-location-facts">${escape(p.facts)}</span><span class="map-location-footer"><span class="map-location-action">View on map <span aria-hidden="true">→</span></span><span class="map-location-price">${price(p)}</span></span></span></button>`).join(''):'<div class="map-empty">No properties match these filters. Adjust your search or <button class="text-link" type="button" id="map-empty-reset">clear filters</button>.</div>';
  if(!items.some(p=>p.id===selectedId))selectedId=items[0]?.id;
  previewVisible=false;
  select(selectedId,false,false);
  refreshMarkers();
  panel.querySelector('.map-fit').disabled=!items.length;
}
list.addEventListener('click',event=>{
  const button=event.target.closest('[data-map-property]');
  if(button)select(button.dataset.mapProperty,true,false);
  if(event.target.closest('#map-empty-reset'))document.querySelector('#property-search').reset();
});
panel.querySelector('.map-fit').addEventListener('click',fit);
switcher.addEventListener('click',event=>{
  const button=event.target.closest('[data-property-view]');if(!button)return;
  view=button.dataset.propertyView;
  switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  panel.hidden=view!=='map';cards.hidden=view!=='list';
  if(view==='map'){initMap();requestAnimationFrame(fit);}
});
// Load geographic tiles only once the property section approaches the viewport.
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){initMap();observer.disconnect();}},{rootMargin:'300px'});
observer.observe(panel);
