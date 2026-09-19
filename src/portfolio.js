const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));
const header=$('.site-header');
const mobileMenu=$('#portfolio-mobile-menu');
const menuToggle=$('.menu-toggle');
function updateHeader(){header?.classList.toggle('is-glass',scrollY>24)}
updateHeader();
addEventListener('scroll',updateHeader,{passive:true});
menuToggle?.addEventListener('click',()=>{mobileMenu?.showModal();menuToggle.setAttribute('aria-expanded','true')});
$('.menu-close')?.addEventListener('click',()=>mobileMenu?.close());
mobileMenu?.addEventListener('close',()=>menuToggle?.setAttribute('aria-expanded','false'));

const portfolioImages={
  tower:'assets/portfolio-reference/48-burj-gate-v2.webp',
  curved:'assets/portfolio-reference/qaryat-al-hidd-v2.webp',
  villas:'assets/portfolio-reference/al-mushrif-villas-v2.webp',
  compound:'assets/portfolio-reference/ghantoot-complex-v2.webp',
  residence:'assets/portfolio-reference/sunrise-residence-3-v2.webp',
  waterfront:'assets/hidd-al-saadiyat/waterfront-view.webp',
  community:'assets/hidd-al-saadiyat/landscaped-community.webp',
  promenade:'assets/hidd-al-saadiyat/promenade-mixed-use.webp',
  urban:'assets/hidd-al-saadiyat/urban-mixed-use.webp',
  villa:'assets/portfolio-modern-villa-v2.png',
  towerAlt:'assets/portfolio-waterfront-tower-v2.png',
  jasmine:'assets/enhanced/proof-jasmine.webp'
};
const projectsByCity={
  'Abu Dhabi':[
    {name:'Al Salam Tower',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.tower},
    {name:'Hili Tower B',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.towerAlt},
    {name:'Al Manhal Tower',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.curved},
    {name:'Jasmine Tower',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.jasmine},
    {name:'Al Mushrif Compound',type:'Residential',location:'Al Mushrif, Abu Dhabi',image:portfolioImages.villas},
    {name:'Sahara Complex',type:'Residential',location:'Abu Dhabi',image:portfolioImages.compound},
    {name:'19 Villas Compound',type:'Residential',location:'Abu Dhabi',image:portfolioImages.villa},
    {name:'Al Ghadeer',type:'Residential',location:'Abu Dhabi',image:portfolioImages.community},
    {name:'Julphar Residence, Al Reem',type:'Residential',location:'Al Reem, Abu Dhabi',image:portfolioImages.urban},
    {name:'Park View, Al Reem',type:'Residential',location:'Al Reem, Abu Dhabi',image:portfolioImages.waterfront},
    {name:'Al Raha Gardens',type:'Residential',location:'Al Raha, Abu Dhabi',image:portfolioImages.promenade},
    {name:'Hidd Saadiyat Villas',type:'Residential',location:'Saadiyat Island',image:portfolioImages.curved},
    {name:'Electra Tower',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.towerAlt},
    {name:'C1 Building',type:'Commercial',location:'Abu Dhabi',image:portfolioImages.tower},
    {name:'Jubail Villa',type:'Residential',location:'Abu Dhabi',image:portfolioImages.villa},
    {name:'Al Raha',type:'Residential',location:'Abu Dhabi',image:portfolioImages.waterfront}
  ],
  'Dubai':[
    {name:'48 Burj Gate',type:'Retail',location:'Sheikh Zayed Road, Dubai',image:portfolioImages.tower},
    {name:'Park Square',type:'Commercial',location:'Dubai',image:portfolioImages.promenade},
    {name:'Park View',type:'Residential',location:'Dubai',image:portfolioImages.curved},
    {name:'Sheikha Maitha',type:'Residential',location:'Dubai',image:portfolioImages.villas}
  ],
  'Al Ain':[
    {name:'Sheikh Saeed Bin Zayed',type:'Residential',location:'Al Ain',image:portfolioImages.compound},
    {name:'Sheikh Nahayan Bin Zayed',type:'Residential',location:'Al Ain',image:portfolioImages.community},
    {name:'Sheikha Maitha Bint Zayed',type:'Residential',location:'Al Ain',image:portfolioImages.villas},
    {name:'Sheikha Sheikha Bin Zayed',type:'Residential',location:'Al Ain',image:portfolioImages.villa},
    {name:'Sheikh Diab Bin Zayed',type:'Residential',location:'Al Ain',image:portfolioImages.waterfront},
    {name:'Aisha Ali Saif Al Darma',type:'Residential',location:'Al Ain',image:portfolioImages.promenade},
    {name:'Aisha – Al Jimi Complex',type:'Residential',location:'Al Jimi, Al Ain',image:portfolioImages.urban}
  ],
  'Hidd Al Saadiyat':[
    {name:'Sunset Residence 1–4',type:'Residential',location:'Hidd Al Saadiyat',image:'assets/hidd-al-saadiyat/saadiyat-beach.webp'},
    {name:'Garden Residence 5–6',type:'Residential',location:'Hidd Al Saadiyat',image:'assets/hidd-al-saadiyat/golden-waterfront.webp'},
    {name:'Sunrise Residence 1–6',type:'Residential',location:'Hidd Al Saadiyat',image:portfolioImages.residence}
  ]
};
const descriptions={
  '48 Burj Gate':'A Dubai address on Sheikh Zayed Road, supported through structured property oversight and the service standards expected from an ADURE-managed asset.',
  'Al Mushrif Compound':'A residential compound in Abu Dhabi where day-to-day operations, tenant support and facility coordination come together through one accountable team.',
  'Sunrise Residence 1–6':'A Hidd Al Saadiyat residential collection shaped around waterfront living, community experience and long-term asset care.',
  'Al Salam Tower':'A managed Abu Dhabi asset supported by ADURE’s connected approach to operations, leasing, facility management and long-term performance.',
  'Hidd Saadiyat Villas':'A villa community within Hidd Al Saadiyat, supported by coordinated operations and a clear focus on resident experience.',
  'Al Raha Gardens':'A residential community where ADURE’s management approach supports comfort, continuity and reliable everyday service.'
};
let activeCity='Abu Dhabi';
let activeIndex=0;
const listLabel=$('#portfolio-list-label');
const projectsEl=$('#portfolio-projects');
const cityName=$('#portfolio-city-name');
const projectName=$('#portfolio-project-name');
const projectCopy=$('#portfolio-project-copy');
const projectImage=$('#portfolio-image');
const explorer=$('.portfolio-explorer');
const expandedClose=$('.portfolio-expanded-close');
function fallbackDescription(project,city){
  return `${project.name} is part of ADURE’s managed portfolio in ${city}, supported by connected expertise across leasing, operations, facility management and owner reporting.`;
}
function projectCard(project,index){
  const active=index===activeIndex;
  return `<button type="button" class="portfolio-project-card ${active?'is-active':''}" data-index="${index}" aria-pressed="${active?'true':'false'}">
    <span class="portfolio-project-card-image"><img src="${project.image}" alt="${project.name}" loading="lazy" draggable="false"></span>
    <span class="portfolio-project-card-copy"><strong>${project.name}</strong><small>${project.type} · ${project.location}</small></span>
  </button>`;
}
function drawPortfolio(){
  const projects=projectsByCity[activeCity] || [];
  const selected=projects[activeIndex] || projects[0];
  if(!selected)return;
  listLabel.textContent=`${activeCity} buildings`;
  projectsEl.innerHTML=projects.map(projectCard).join('');
  if(cityName) cityName.textContent=activeCity;
  projectName.textContent=selected.name;
  projectCopy.textContent=descriptions[selected.name] || fallbackDescription(selected,activeCity);
  projectImage.src=selected.image;
  projectImage.alt=selected.name;
  $$('button',projectsEl).forEach(button=>{
    button.addEventListener('click',event=>{
      activeIndex=Number(button.dataset.index);
      const shouldExpand=Boolean(event.target.closest('.portfolio-project-card-image'));
      drawPortfolio();
      if(shouldExpand)openPortfolioExpanded();
    });
  });
}

function openPortfolioExpanded(){
  explorer?.classList.add('is-expanded');
  explorer?.setAttribute('aria-expanded','true');
  projectImage?.closest('.portfolio-project-image')?.setAttribute('tabindex','-1');
  explorer?.scrollIntoView({behavior:'smooth',block:'center'});
}
function closePortfolioExpanded(){
  explorer?.classList.remove('is-expanded');
  explorer?.setAttribute('aria-expanded','false');
}
expandedClose?.addEventListener('click',closePortfolioExpanded);
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&explorer?.classList.contains('is-expanded'))closePortfolioExpanded();
});

$$('.portfolio-city-tabs button').forEach(button=>button.addEventListener('click',()=>{
  activeCity=button.dataset.city;
  activeIndex=0;
  closePortfolioExpanded();
  $$('.portfolio-city-tabs button').forEach(item=>{
    const isActive=item===button;
    item.classList.toggle('is-active',isActive);
    item.setAttribute('aria-selected',isActive?'true':'false');
  });
  drawPortfolio();
}));
drawPortfolio();
