import './vendor/leaflet.js';

const detailUrl=property=>`property-detail.html?id=${encodeURIComponent(property.id)}`;
const shareIcon='<svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="19" r="2.5"></circle><path d="M8.25 10.85 15.75 6.15M8.25 13.15l7.5 4.7"></path></svg>';
const heartIcon='<svg class="heart-icon" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="m256.001 477.407c-2.59 0-5.179-.669-7.499-2.009-2.52-1.454-62.391-36.216-123.121-88.594-35.994-31.043-64.726-61.833-85.396-91.513-26.748-38.406-40.199-75.348-39.982-109.801.254-40.09 14.613-77.792 40.435-106.162 26.258-28.848 61.3-44.734 98.673-44.734 47.897 0 91.688 26.83 116.891 69.332 25.203-42.501 68.994-69.332 116.891-69.332 35.308 0 68.995 14.334 94.859 40.362 28.384 28.563 44.511 68.921 44.247 110.724-.218 34.393-13.921 71.279-40.728 109.632-20.734 29.665-49.426 60.441-85.279 91.475-60.508 52.373-119.949 87.134-122.45 88.588-2.331 1.354-4.937 2.032-7.541 2.032z"></path></svg>';

const properties=[
  {id:'adu-502',intent:'lease',title:'Two-Bedroom Sea-View Apartment',building:'Sunrise Residence 2',unit:'Unit 502',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:2,baths:4,area:246.97,price:280000,status:'Available',date:12,image:'assets/portfolio-reference/sunrise-residence-3-v2.webp',map:[69,37]},
  {id:'adu-207',intent:'lease',title:'Waterfront Residence with Open Living',building:'Sunset Residence 1',unit:'Unit 207',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:2,baths:4,area:180,price:170888,status:'Available',date:11,image:'assets/hidd-al-saadiyat/waterfront-view.webp',map:[63,44]},
  {id:'adu-110',intent:'lease',title:'Three-Bedroom Family Residence',building:'Sunrise Residence 5',unit:'Unit 110',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:3,baths:5,area:195.29,price:280000,status:'Available',date:10,image:'assets/hidd-al-saadiyat/curved-residences.webp',map:[72,49]},
  {id:'adu-306',intent:'lease',title:'Garden-Facing One-Bedroom Home',building:'Garden Residences 5',unit:'Unit 306',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:1,baths:2,area:84.98,price:110000,status:'Available',date:9,image:'assets/hidd-al-saadiyat/landscaped-community.webp',map:[59,52]},
  {id:'adu-612',intent:'lease',title:'High-Floor Apartment with Sea View',building:'Sunrise Residence 2',unit:'Unit 612',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:2,baths:3,area:145.53,price:245000,status:'Reserved',date:8,image:'assets/hidd-al-saadiyat/golden-waterfront.webp',map:[67,32]},
  {id:'adu-105',intent:'lease',title:'One-Bedroom Community Residence',building:'Sunset Residence 2',unit:'Unit 105',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:1,baths:2,area:84.64,price:160000,status:'Available',date:7,image:'assets/portfolio-reference/qaryat-al-hidd-v2.webp',map:[76,42]},
  {id:'adu-404',intent:'lease',title:'Bright Two-Bedroom Waterfront Home',building:'Sunrise Residence 2',unit:'Unit 404',community:'Saadiyat Island',city:'Abu Dhabi',type:'Apartment',beds:2,baths:4,area:136.34,price:235000,status:'Available',date:6,image:'assets/hidd-al-saadiyat/hero-wave-facade.webp',map:[81,28]},
  {id:'adu-103',intent:'lease',title:'Two-Bedroom Residence Near the Beach',building:'Sunrise Residence 5',unit:'Unit 103',community:'Saadiyat Island',city:'Abu Dhabi',type:'Apartment',beds:2,baths:4,area:147.04,price:240000,status:'Leased',date:5,image:'assets/hidd-al-saadiyat/promenade-mixed-use.webp',map:[84,35]},
  {id:'adu-v12',intent:'lease',title:'Four-Bedroom Villa with Private Garden',building:'Al Mushrif Villas',unit:'Villa 12',community:'Al Mushrif',city:'Abu Dhabi',type:'Villa',beds:4,baths:5,area:418,price:320000,status:'Available',date:4,image:'assets/portfolio-reference/al-mushrif-villas-v2.webp',map:[31,48]},
  {id:'dxb-48b',intent:'lease',title:'Contemporary Office with City Access',building:'48 Burj Gate',unit:'Suite 1704',community:'Sheikh Zayed Road',city:'Dubai',type:'Commercial',beds:0,baths:2,area:210,price:295000,status:'Available',date:3,image:'assets/portfolio-reference/48-burj-gate-v2.webp',map:[21,24]},
  {id:'ain-g02',intent:'lease',title:'Landscaped Three-Bedroom Villa',building:'Garden Community',unit:'Villa G02',community:'Al Ain',city:'Al Ain',type:'Villa',beds:3,baths:4,area:312,price:185000,status:'Available',date:2,image:'assets/portfolio-reference/ghantoot-complex-v2.webp',map:[18,68]},
  {id:'adu-p18',intent:'lease',title:'One-Bedroom Promenade Apartment',building:'Marina View Residences',unit:'Unit 318',community:'Saadiyat Island',city:'Abu Dhabi',type:'Apartment',beds:1,baths:2,area:92.5,price:145000,status:'Available',date:1,image:'assets/hidd-al-saadiyat/saadiyat-beach.webp',map:[78,56]},
  {id:'sale-sr3',intent:'buy',title:'Three-Bedroom Waterfront Residence',building:'Sunrise Residence 3',unit:'Residence 302',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:3,baths:4,area:238,price:3850000,status:'Available',date:12,image:'assets/portfolio-reference/sunrise-residence-3-v2.webp',map:[69,37]},
  {id:'sale-qr7',intent:'buy',title:'Two-Bedroom Home by the Water',building:'Qaryat Al Hidd',unit:'Residence 507',community:'Qaryat Al Hidd',city:'Abu Dhabi',type:'Apartment',beds:2,baths:3,area:164,price:2750000,status:'Available',date:10,image:'assets/portfolio-reference/qaryat-al-hidd-v2.webp',map:[74,45]},
  {id:'sale-mv5',intent:'buy',title:'Five-Bedroom Villa in Al Mushrif',building:'Al Mushrif Villas',unit:'Villa 5',community:'Al Mushrif',city:'Abu Dhabi',type:'Villa',beds:5,baths:6,area:510,price:7200000,status:'Reserved',date:8,image:'assets/portfolio-reference/al-mushrif-villas-v2.webp',map:[31,48]},
  {id:'sale-bg8',intent:'buy',title:'Investment Office on Sheikh Zayed Road',building:'48 Burj Gate',unit:'Office 804',community:'Sheikh Zayed Road',city:'Dubai',type:'Commercial',beds:0,baths:2,area:188,price:4900000,status:'Available',date:6,image:'assets/portfolio-reference/48-burj-gate-v2.webp',map:[21,24]},
  {id:'sale-ai4',intent:'buy',title:'Four-Bedroom Garden Villa',building:'Garden Community',unit:'Villa 14',community:'Al Ain',city:'Al Ain',type:'Villa',beds:4,baths:5,area:430,price:3100000,status:'Available',date:4,image:'assets/portfolio-reference/ghantoot-complex-v2.webp',map:[18,68]},
  {id:'sale-sa1',intent:'buy',title:'One-Bedroom Saadiyat Residence',building:'Sunset Residence 2',unit:'Unit 401',community:'Saadiyat Island',city:'Abu Dhabi',type:'Apartment',beds:1,baths:2,area:91,price:1650000,status:'Available',date:2,image:'assets/hidd-al-saadiyat/golden-waterfront.webp',map:[82,34]}
];

const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
const state={intent:new URLSearchParams(location.search).get('intent')==='lease'?'lease':'buy',view:'grid',sort:'recommended',quick:'all',page:1,pageSize:6,filters:{city:[],community:[],building:[],type:[],beds:[],status:[],min:0,max:99999999},hero:{location:'all',query:'',community:'all',type:'all',beds:'all',price:'all'}};
const saved=new Set(JSON.parse(localStorage.getItem('adure-property-favourites')||'[]'));
const grid=$('#property-grid'),empty=$('#empty-state'),pagination=$('.pagination'),filterPanel=$('#filter-panel'),filterHome=$('#filter-home'),filterDialog=$('#filter-dialog');
let selectedMapAreaId=null;
let propertyMap=null,propertyMapLayer=null,propertyBasemapLoaded=false;
let mapAreaMarkers=new Map();
const propertyCoordinates={
  'adu-502':[24.553,54.455],
  'adu-207':[24.546,54.448],
  'adu-110':[24.548,54.452],
  'adu-306':[24.476,54.349],
  'adu-612':[24.552,54.457],
  'adu-105':[24.551,54.45],
  'adu-404':[24.555,54.461],
  'adu-103':[24.557,54.458],
  'adu-v12':[24.444,54.386],
  'dxb-48b':[25.198,55.274],
  'ain-g02':[24.207,55.744],
  'adu-p18':[24.553,54.463],
  'sale-sr3':[24.553,54.455],
  'sale-qr7':[24.548,54.452],
  'sale-mv5':[24.444,54.386],
  'sale-bg8':[25.198,55.274],
  'sale-ai4':[24.207,55.744],
  'sale-sa1':[24.553,54.463]
};
const mapAreas=[
  {id:'dubai',name:'Dubai',coords:[25.198,55.274],match:property=>property.city==='Dubai'},
  {id:'qaryat',name:'Qaryat Al Hidd',coords:[24.548,54.452],match:property=>property.community==='Qaryat Al Hidd'},
  {id:'saadiyat',name:'Saadiyat Island',coords:[24.555,54.461],match:property=>property.community==='Saadiyat Island'},
  {id:'mushrif',name:'Al Mushrif',coords:[24.444,54.386],match:property=>property.community==='Al Mushrif'},
  {id:'abu-dhabi',name:'Abu Dhabi',coords:[24.4539,54.3773],match:property=>property.city==='Abu Dhabi'&&!['Qaryat Al Hidd','Saadiyat Island','Al Mushrif'].includes(property.community)},
  {id:'al-ain',name:'Al Ain',coords:[24.207,55.744],match:property=>property.city==='Al Ain'}
];

const esc=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const number=value=>new Intl.NumberFormat('en-AE').format(value);
const priceLabel=property=>`AED ${number(property.price)}${property.intent==='lease'?' / year':''}`;
const modeLabel=property=>property.intent==='lease'?'For Lease':'For Sale';
const factLabel=property=>property.type==='Commercial'?`${property.baths} Bath · ${property.area} m²`:`${property.beds} Bed · ${property.baths} Bath · ${property.area} m²`;

function specItems(property){
  const items=[];
  if(property.type!=='Commercial')items.push({icon:'bed',label:`${property.beds} Bed`});
  else items.push({icon:'area',label:'Commercial'});
  items.push({icon:'bath',label:`${property.baths} Bath`});
  items.push({icon:'area',label:`${property.area} m²`});
  return items;
}

function specMarkup(property){
  return specItems(property).map(item=>`<span><img src="assets/property-icons/${item.icon}.svg" alt="" aria-hidden="true">${esc(item.label)}</span>`).join('');
}

function syncIntentButtons(){
  $$('[data-intent]').forEach(button=>{const active=button.dataset.intent===state.intent;button.classList.toggle('is-active',active);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  $('#hero-price-label').textContent='Price range';
}

function buildBuildingFilters(){
  const buildings=[...new Set(properties.filter(p=>p.intent===state.intent).map(p=>p.building))].sort();
  $('.building-options').innerHTML=buildings.map(building=>`<label><input type="checkbox" value="${esc(building)}"${state.filters.building.includes(building)?' checked':''}> ${esc(building)}</label>`).join('');
}

function selectedValues(group){return $$(`[data-filter-group="${group}"] input[type=checkbox]:checked`,filterPanel).map(input=>input.value)}

function readSidebar(){
  ['city','community','building','type','beds','status'].forEach(group=>state.filters[group]=selectedValues(group));
  state.filters.min=Number($('#price-min').value);state.filters.max=Number($('#price-max').value);
  state.page=1;
}

function matchesHero(property){
  const h=state.hero;
  if(h.location!=='all'&&property.city!==h.location)return false;
  if(h.query&&!`${property.city} ${property.community} ${property.building} ${property.title}`.toLowerCase().includes(h.query.toLowerCase()))return false;
  if(h.community!=='all'&&property.community!==h.community)return false;
  if(h.type!=='all'&&property.type!==h.type)return false;
  if(h.beds!=='all'&&(h.beds==='4'?property.beds<4:property.beds!==Number(h.beds)))return false;
  if(h.price==='under-150'&&property.price>=150000)return false;
  if(h.price==='150-250'&&(property.price<150000||property.price>250000))return false;
  if(h.price==='250-plus'&&property.price<250000)return false;
  return true;
}

function matchesSidebar(property){
  const f=state.filters;
  for(const key of ['city','community','building','type','status'])if(f[key].length&&!f[key].includes(property[key]))return false;
  if(f.beds.length&&!f.beds.some(value=>value==='4'?property.beds>=4:property.beds===Number(value)))return false;
  return property.price>=f.min&&property.price<=f.max;
}

function results(){
  const list=properties.filter(property=>property.intent===state.intent&&matchesHero(property)&&matchesSidebar(property)&&(
    state.quick==='all'||
    (state.quick==='waterfront'&&['Qaryat Al Hidd','Saadiyat Island'].includes(property.community))||
    (state.quick==='villa'&&property.type==='Villa')||
    (state.quick==='commercial'&&property.type==='Commercial')
  ));
  return list.sort((a,b)=>state.sort==='low'?a.price-b.price:state.sort==='high'?b.price-a.price:b.date-a.date);
}

function card(property,index){
  const reference=`REF # ADU-${property.id.toUpperCase().replace(/[^A-Z0-9]/g,'-')}`;
  return `<article class="property-card" data-property-id="${property.id}" data-index="${String((state.page-1)*state.pageSize+index+1).padStart(2,'0')}" style="animation-delay:${Math.min(index,6)*55}ms">
    <div class="property-card-media"><img src="${property.image}" alt="${esc(property.title)} at ${esc(property.building)}" loading="lazy" decoding="async"><span class="property-status">${esc(property.status)} · ${modeLabel(property)}</span><div class="property-media-actions"><button class="share-button" type="button" data-share="${property.id}" aria-label="Share ${esc(property.title)}">${shareIcon}</button><button class="favourite-button" type="button" data-favourite="${property.id}" aria-label="${saved.has(property.id)?'Remove from saved properties':'Save property'}" aria-pressed="${saved.has(property.id)}">${heartIcon}</button></div></div>
    <div class="property-card-body"><div class="property-location"><span class="location-pin-icon" aria-hidden="true"></span><span>${esc(property.community)} · ${esc(property.city)}</span></div><h3>${esc(property.title)}</h3><p class="property-building">${esc(property.building)} · ${esc(property.unit)}</p><div class="property-price">${priceLabel(property)}</div><div class="property-facts">${specMarkup(property)}</div><div class="property-card-footer"><span>${esc(reference)}</span><span class="view-property"><span>View property</span><span aria-hidden="true">→</span></span></div></div>
    <a class="property-card-link" href="${detailUrl(property)}" aria-label="View ${esc(property.title)}"></a>
  </article>`;
}

function updateCounts(){
  const mode=properties.filter(p=>p.intent===state.intent);
  $$('[data-count]').forEach(node=>{const [key,value]=node.dataset.count.split(':');node.textContent=mode.filter(p=>p[key]===value).length;});
  const active=Object.entries(state.filters).reduce((sum,[key,value])=>sum+(Array.isArray(value)?value.length:(key==='min'&&value>0)||(key==='max'&&value<99999999)?1:0),0);
  $$('.active-filter-count').forEach(node=>node.textContent=active);
}

function renderPagination(total){
  const pages=Math.ceil(total/state.pageSize);
  if(pages<=1){pagination.innerHTML='';return;}
  const buttons=[];
  buttons.push(`<button type="button" data-page="${Math.max(1,state.page-1)}" aria-label="Previous page">←</button>`);
  for(let page=1;page<=pages;page++)buttons.push(`<button type="button" data-page="${page}"${page===state.page?' aria-current="page"':''}>${String(page).padStart(2,'0')}</button>`);
  buttons.push(`<button type="button" data-page="${Math.min(pages,state.page+1)}" aria-label="Next page">→</button>`);
  pagination.innerHTML=buttons.join('');
}

function render(){
  const list=results();
  const start=(state.page-1)*state.pageSize;
  const pageItems=list.slice(start,start+state.pageSize);
  $('#result-count').innerHTML=`<span class="result-number">${String(list.length).padStart(2,'0')}</span><span class="result-copy"><b>${list.length===1?'Property':'Properties'}</b><small>Available to ${state.intent==='lease'?'lease':'buy'}</small></span>`;$('#result-count').setAttribute('aria-label',`${list.length} ${list.length===1?'property':'properties'} available to ${state.intent==='lease'?'lease':'buy'}.`);
  const advancedCount=$('#advanced-result-count');if(advancedCount)advancedCount.textContent=number(list.length);
  $('#map-result-count').dataset.count=String(list.length).padStart(2,'0');
  $$('[data-quick-filter]').forEach(button=>{const active=button.dataset.quickFilter===state.quick;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  grid.innerHTML=pageItems.map(card).join('');
  grid.hidden=!pageItems.length;empty.hidden=Boolean(pageItems.length);
  renderPagination(list.length);if(state.view==='map')renderMap(list);updateCounts();
}


function shareUrl(property){
  return `${location.origin}${location.pathname}?intent=${property.intent}&property=${encodeURIComponent(property.id)}#results`;
}

async function shareProperty(id,button){
  const property=properties.find(item=>item.id===id);
  if(!property)return;
  const data={title:property.title,text:`${property.title} — ${property.building}, ${property.city}`,url:shareUrl(property)};
  try{
    if(navigator.share)await navigator.share(data);
    else if(navigator.clipboard)await navigator.clipboard.writeText(data.url);
    button?.setAttribute('data-shared','true');
    setTimeout(()=>button?.removeAttribute('data-shared'),1100);
  }catch(error){
    if(error?.name!=='AbortError')console.warn('Unable to share property',error);
  }
}

function toggleFavourite(id){
  saved.has(id)?saved.delete(id):saved.add(id);
  localStorage.setItem('adure-property-favourites',JSON.stringify([...saved]));
  render();
}

function compactPrice(property){
  if(property.price>=1000000)return `AED ${(property.price/1000000).toFixed(property.price%1000000?1:0)}M`;
  return `AED ${Math.round(property.price/1000)}K`;
}

function areaMarkerLabel(area,items){
  if(items.length>1)return `${String(items.length).padStart(2,'0')} units`;
  return compactPrice(items[0]);
}

function mapDrawerCard(property){
  return `<article class="map-drawer-card" data-map-listing="${property.id}">
    <a href="${detailUrl(property)}" aria-label="View ${esc(property.title)}"></a>
    <div class="map-drawer-media"><img src="${property.image}" alt="${esc(property.title)}" loading="lazy" decoding="async"><div class="map-drawer-actions"><button class="map-drawer-share" type="button" data-share="${property.id}" aria-label="Share ${esc(property.title)}">${shareIcon}</button><button class="map-drawer-save" type="button" data-favourite="${property.id}" aria-label="${saved.has(property.id)?'Remove from saved properties':'Save property'}" aria-pressed="${saved.has(property.id)}">${heartIcon}</button></div></div>
    <div class="map-drawer-copy"><small class="map-drawer-location"><span class="location-pin-icon" aria-hidden="true"></span><span>${esc(property.community)} · ${esc(property.city)}</span></small><h3>${esc(property.title)}</h3><p>${esc(property.building)} · ${esc(property.unit)}</p><strong>${priceLabel(property)}</strong><div class="map-drawer-facts">${specMarkup(property)}</div></div>
  </article>`;
}

function renderAreaPanel(area,items){
  const panel=$('#map-results-panel');
  panel.hidden=false;
  panel.classList.add('is-open');
  $('#map-result-count').dataset.count=String(items.length).padStart(2,'0');
  $('#map-area-label').textContent=`${area.name} · ${items.length} ${items.length===1?'listing':'listings'} for ${state.intent==='lease'?'lease':'sale'}`;
  $('#map-property-list').innerHTML=items.map(mapDrawerCard).join('');
  propertyMap?.invalidateSize();
}

function hideMapPanel(){
  const panel=$('#map-results-panel');
  panel.hidden=true;
  panel.classList.remove('is-open');
  $('#map-property-list').innerHTML='';
  selectedMapAreaId=null;
  mapAreaMarkers.forEach(({marker})=>marker.getElement()?.classList.remove('is-selected'));
}

async function loadPropertyBasemap(){
  if(propertyBasemapLoaded||!propertyMap)return;
  propertyBasemapLoaded=true;
  const message=$('.map-load-message');
  try{
    await import('./vendor/maplibre-gl-5.6.2.js');
    await import('./vendor/leaflet-maplibre-gl-0.1.3.js');
    const basemap=window.L.maplibreGL({
      style:new URL('./vendor/openfreemap-positron-en.json',import.meta.url).href,
      attributionControl:{customAttribution:'<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}
    }).addTo(propertyMap);
    const maplibreMap=basemap.getMaplibreMap();
    maplibreMap.on('error',()=>{if(message)message.hidden=false;});
    maplibreMap.on('idle',()=>{if(message)message.hidden=true;});
  }catch(error){
    if(message)message.hidden=false;
    console.warn('Property basemap could not load',error);
  }
}

function initPropertyMap(){
  if(propertyMap)return;
  propertyMap=window.L.map('property-map',{zoomControl:false,scrollWheelZoom:true,minZoom:5,maxZoom:18}).setView([24.5,54.9],7);
  window.L.control.zoom({position:'bottomright'}).addTo(propertyMap);
  propertyMapLayer=window.L.layerGroup().addTo(propertyMap);
  propertyMap.on('click',event=>{if(event.originalEvent?.target?.closest?.('.leaflet-marker-icon'))return;hideMapPanel();});
  new ResizeObserver(()=>propertyMap.invalidateSize()).observe($('#map-view'));
  loadPropertyBasemap();
}

function activeMapAreas(list){
  return mapAreas.map(area=>({...area,items:list.filter(area.match)})).filter(area=>area.items.length);
}

function fitPropertyMap(list){
  if(!propertyMap||!list.length)return;
  const areas=activeMapAreas(list);
  if(!areas.length)return;
  propertyMap.invalidateSize();
  const bounds=window.L.latLngBounds(areas.map(area=>area.coords));
  propertyMap.fitBounds(bounds,{paddingTopLeft:[80,90],paddingBottomRight:[$('#map-results-panel')?.hidden?120:460,90],maxZoom:7,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
}

function refreshPropertyMarkers(list){
  if(!propertyMapLayer)return;
  propertyMapLayer.clearLayers();
  mapAreaMarkers=new Map();
  activeMapAreas(list).forEach(area=>{
    const marker=window.L.marker(area.coords,{
      icon:window.L.divIcon({className:'propertyfinder-area-marker',html:`<span>${areaMarkerLabel(area,area.items)}</span>`,iconSize:[1,1],iconAnchor:[42,18]}),
      title:area.name,
      alt:`Show properties in ${area.name}`,
      keyboard:true,
      bubblingMouseEvents:false
    }).addTo(propertyMapLayer).on('click',event=>{event.originalEvent?.stopPropagation?.();selectMapArea(area.id,true);});
    marker.getElement()?.setAttribute('aria-label',`Show properties in ${area.name}`);
    mapAreaMarkers.set(area.id,{marker,area});
  });
}

function selectMapArea(areaId,move=false){
  const entry=mapAreaMarkers.get(areaId);if(!entry)return;
  selectedMapAreaId=areaId;
  mapAreaMarkers.forEach(({marker},id)=>{
    marker.getElement()?.classList.toggle('is-selected',id===areaId);
    marker.setZIndexOffset(id===areaId?1000:0);
  });
  renderAreaPanel(entry.area,entry.area.items);
  if(move&&propertyMap)propertyMap.flyTo(entry.area.coords,entry.area.id==='qaryat'||entry.area.id==='saadiyat'?11:10,{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches,duration:.75});
}

function focusMapListing(id){
  const property=results().find(item=>item.id===id);if(!property||!propertyMap||!propertyCoordinates[property.id])return;
  propertyMap.flyTo(propertyCoordinates[property.id],12,{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches,duration:.75});
}

function selectMapProperty(id){
  focusMapListing(id);
}

function renderMap(list){
  $('#map-result-count').dataset.count=String(list.length).padStart(2,'0');
  initPropertyMap();
  refreshPropertyMarkers(list);
  if(selectedMapAreaId&&mapAreaMarkers.has(selectedMapAreaId))selectMapArea(selectedMapAreaId,false);else hideMapPanel();
  requestAnimationFrame(()=>fitPropertyMap(list));
}

function setView(view){
  state.view=view;
  $$('[data-view]').forEach(button=>{const active=button.dataset.view===view;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  $('#grid-view').hidden=view!=='grid';$('#map-view').hidden=view!=='map';
  if(view==='map')renderMap(results());
}

function clearFilters(){
  state.filters={city:[],community:[],building:[],type:[],beds:[],status:[],min:0,max:99999999};
  state.hero={location:'all',query:'',community:'all',type:'all',beds:'all',price:'all'};state.quick='all';
  $('#hero-property-search').reset();
  $$('input[type=checkbox]',filterPanel).forEach(input=>input.checked=false);
  $('#price-min').value='0';$('#price-max').value='99999999';$('#building-search').value='';
  $$('.building-options label').forEach(label=>label.hidden=false);state.page=1;render();
}

function applyHeroSearch(){
  const data=new FormData($('#hero-property-search'));
  state.hero={location:data.get('location'),query:'',community:data.get('community'),type:data.get('type'),beds:data.get('beds'),price:data.get('price')};
  state.page=1;render();$('#results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

function setIntent(intent){
  state.intent=intent;state.page=1;state.quick='all';state.hero={location:'all',query:'',community:'all',type:'all',beds:'all',price:'all'};state.filters={city:[],community:[],building:[],type:[],beds:[],status:[],min:0,max:99999999};
  $('#hero-property-search').reset();syncIntentButtons();buildBuildingFilters();$$('input[type=checkbox]',filterPanel).forEach(input=>input.checked=false);$('#price-min').value='0';$('#price-max').value='99999999';render();
  history.replaceState(null,'',`${location.pathname}?intent=${intent}#results`);
}

buildBuildingFilters();syncIntentButtons();render();

$$('[data-intent]').forEach(button=>button.addEventListener('click',()=>setIntent(button.dataset.intent)));
$('#hero-property-search').addEventListener('submit',event=>{event.preventDefault();applyHeroSearch();});
$('#sort-properties').addEventListener('change',event=>{state.sort=event.target.value;state.page=1;render();});
$('.view-switch').addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(button)setView(button.dataset.view);});
filterPanel.addEventListener('change',()=>{if(innerWidth>1023){readSidebar();render();}});
$('.apply-filters').addEventListener('click',()=>{readSidebar();render();if(filterDialog.open)filterDialog.close();});
$$('[data-clear-filters]').forEach(button=>button.addEventListener('click',clearFilters));
$('#building-search').addEventListener('input',event=>{const term=event.target.value.trim().toLowerCase();$$('.building-options label').forEach(label=>label.hidden=!label.textContent.toLowerCase().includes(term));});
pagination.addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button)return;state.page=Number(button.dataset.page);render();$('.results-toolbar').scrollIntoView({behavior:'smooth',block:'start'});});
grid.addEventListener('click',event=>{const share=event.target.closest('[data-share]');if(share){event.preventDefault();event.stopPropagation();shareProperty(share.dataset.share,share);return;}const button=event.target.closest('[data-favourite]');if(!button)return;event.preventDefault();event.stopPropagation();toggleFavourite(button.dataset.favourite);});
$('#map-view').addEventListener('mouseover',event=>{const target=event.target.closest('[data-map-listing]');if(target)focusMapListing(target.dataset.mapListing);});
$('#map-view').addEventListener('click',event=>{const share=event.target.closest('[data-share]');if(share){event.preventDefault();event.stopPropagation();shareProperty(share.dataset.share,share);return;}const favourite=event.target.closest('[data-favourite]');if(favourite){event.preventDefault();event.stopPropagation();toggleFavourite(favourite.dataset.favourite);return;}const target=event.target.closest('[data-map-listing]');if(target)focusMapListing(target.dataset.mapListing);});
$('.map-fit').addEventListener('click',()=>fitPropertyMap(results()));

const mobileMenu=$('#properties-mobile-menu');
$('.menu-toggle').addEventListener('click',()=>{mobileMenu.showModal();$('.menu-toggle').setAttribute('aria-expanded','true');});
$('.menu-close').addEventListener('click',()=>mobileMenu.close());
mobileMenu.addEventListener('close',()=>$('.menu-toggle').setAttribute('aria-expanded','false'));
$$('a',mobileMenu).forEach(link=>link.addEventListener('click',()=>mobileMenu.close()));

const openFilterDialog=()=>{
  if(!filterDialog.open)filterDialog.showModal();
};
const revealFilters=()=>openFilterDialog();
$('.mobile-filter-trigger').addEventListener('click',revealFilters);
filterDialog.addEventListener('click',event=>{if(event.target===filterDialog)filterDialog.close();});
filterDialog.addEventListener('cancel',event=>{event.preventDefault();filterDialog.close();});
filterDialog.addEventListener('submit',event=>{event.preventDefault();filterDialog.close();});
filterDialog.addEventListener('click',event=>{
  const pill=event.target.closest('.filter-pill');
  if(pill){
    const row=pill.closest('.filter-pill-row');
    if(row?.closest('[aria-labelledby="furnishing-title"]'))row.querySelectorAll('.filter-pill').forEach(item=>{item.classList.remove('is-active');item.setAttribute('aria-pressed','false');});
    pill.classList.toggle('is-active');
    pill.setAttribute('aria-pressed',String(pill.classList.contains('is-active')));
  }
  if(event.target.closest('.drawer-clear')){
    $$('.filter-pill',filterDialog).forEach(pill=>{pill.classList.remove('is-active');pill.setAttribute('aria-pressed','false');});
    const all=$('.advanced-filter-group[aria-labelledby="furnishing-title"] .filter-pill',filterDialog);all?.classList.add('is-active');all?.setAttribute('aria-pressed','true');
    $$('input',filterDialog).forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value='';});
  }
});

const header=$('.properties-header');
const syncHeader=()=>header.classList.toggle('is-glass',scrollY>24);
addEventListener('scroll',syncHeader,{passive:true});syncHeader();
