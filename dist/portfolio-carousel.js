function initHomepagePortfolio(){
const portfolioRoot=document.querySelector('#portfolio.portfolio-explorer-home');
if(portfolioRoot&&portfolioRoot.dataset.portfolioReady!=='true'){
  portfolioRoot.dataset.portfolioReady='true';
  const projects={
    'abu-dhabi':[
      {id:'al-salam-tower',title:'Al Salam Tower',city:'Abu Dhabi',type:'Commercial',location:'Abu Dhabi',image:'assets/portfolio-reference/48-burj-gate-v2.webp',alt:'Al Salam Tower high-rise facade against a blue sky',description:'A concise two- to three-line introduction for Al Salam Tower will appear here once ADURE confirms the final project description.'},
      {id:'hili-tower-b',title:'Hili Tower B',city:'Abu Dhabi',type:'Commercial',location:'Abu Dhabi',image:'assets/portfolio-waterfront-tower-v2.png',alt:'Contemporary waterfront tower facade',description:'A concise two- to three-line introduction for Hili Tower B will appear here once ADURE confirms the final project description.'},
      {id:'al-manhal-tower',title:'Al Manhal Tower',city:'Abu Dhabi',type:'Commercial',location:'Abu Dhabi',image:'assets/portfolio-curved-towers-v2.png',alt:'Curved residential tower facade',description:'A concise two- to three-line introduction for Al Manhal Tower will appear here once ADURE confirms the final project description.'},
      {id:'jasmine-tower',title:'Jasmine Tower',city:'Abu Dhabi',type:'Commercial',location:'Abu Dhabi',image:'assets/enhanced/proof-jasmine.webp',alt:'Jasmine Tower facade',description:'A concise two- to three-line introduction for Jasmine Tower will appear here once ADURE confirms the final project description.'},
      {id:'al-mushrif-compound',title:'Al Mushrif Compound',city:'Abu Dhabi',type:'Residential',location:'Al Mushrif, Abu Dhabi',image:'assets/portfolio-reference/al-mushrif-villas-v2.webp',alt:'Al Mushrif residential villas framed by palms',description:'A concise two- to three-line introduction for Al Mushrif Compound will appear here once ADURE confirms the final project description.'},
      {id:'sahara-complex',title:'Sahara Complex',city:'Abu Dhabi',type:'Residential',location:'Abu Dhabi',image:'assets/portfolio-reference/ghantoot-complex-v2.webp',alt:'Residential complex with landscaped streets',description:'A concise two- to three-line introduction for Sahara Complex will appear here once ADURE confirms the final project description.'},
      {id:'19-villas-compound',title:'19 Villas Compound',city:'Abu Dhabi',type:'Residential',location:'Abu Dhabi',image:'assets/portfolio-modern-villa-v2.png',alt:'Modern villa exterior',description:'A concise two- to three-line introduction for 19 Villas Compound will appear here once ADURE confirms the final project description.'},
      {id:'al-ghadeer',title:'Al Ghadeer',city:'Abu Dhabi',type:'Residential',location:'Abu Dhabi',image:'assets/hidd-al-saadiyat/landscaped-community.webp',alt:'Landscaped residential community',description:'A concise two- to three-line introduction for Al Ghadeer will appear here once ADURE confirms the final project description.'},
      {id:'julphar-residence-al-reem',title:'Julphar Residence, Al Reem',city:'Abu Dhabi',type:'Residential',location:'Al Reem Island, Abu Dhabi',image:'assets/hidd-al-saadiyat/urban-mixed-use.webp',alt:'Urban mixed-use residential property',description:'A concise two- to three-line introduction for Julphar Residence, Al Reem will appear here once ADURE confirms the final project description.'},
      {id:'park-view-al-reem',title:'Park View, Al Reem',city:'Abu Dhabi',type:'Residential',location:'Al Reem Island, Abu Dhabi',image:'assets/hidd-al-saadiyat/waterfront-view.webp',alt:'Waterfront residential view',description:'A concise two- to three-line introduction for Park View, Al Reem will appear here once ADURE confirms the final project description.'},
      {id:'al-raha-gardens',title:'Al Raha Gardens',city:'Abu Dhabi',type:'Residential',location:'Al Raha, Abu Dhabi',image:'assets/hidd-al-saadiyat/promenade-mixed-use.webp',alt:'Promenade residential community',description:'A concise two- to three-line introduction for Al Raha Gardens will appear here once ADURE confirms the final project description.'},
      {id:'hidd-saadiyat-villas',title:'Hidd Saadiyat Villas',city:'Abu Dhabi',type:'Residential',location:'Saadiyat Island',image:'assets/portfolio-reference/qaryat-al-hidd-v2.webp',alt:'Hidd Saadiyat waterfront community',description:'A concise two- to three-line introduction for Hidd Saadiyat Villas will appear here once ADURE confirms the final project description.'}
    ],
    dubai:[
      {id:'48-burj-gate',title:'48 Burj Gate',city:'Dubai',type:'Retail',location:'Sheikh Zayed Road, Dubai',image:'assets/portfolio-reference/48-burj-gate-v2.webp',alt:'48 Burj Gate on Sheikh Zayed Road in Dubai',description:'A concise two- to three-line introduction for 48 Burj Gate will appear here once ADURE confirms the final project description.'},
      {id:'dubai-commercial-building',title:'Dubai Commercial Building',city:'Dubai',type:'Commercial',location:'Dubai',image:'assets/portfolio-waterfront-tower-v2.png',alt:'Dubai commercial tower facade',description:'A concise two- to three-line introduction for this Dubai property will appear here once ADURE confirms the final project description.'}
    ],
    'al-ain':[
      {id:'al-ain-residential',title:'Al Ain Residential Community',city:'Al Ain',type:'Residential',location:'Al Ain',image:'assets/portfolio-reference/ghantoot-complex-v2.webp',alt:'Residential community buildings in the UAE',description:'A concise two- to three-line introduction for this Al Ain property will appear here once ADURE confirms the final project description.'},
      {id:'al-ain-villas',title:'Al Ain Villas',city:'Al Ain',type:'Residential',location:'Al Ain',image:'assets/portfolio-modern-villa-v2.png',alt:'Modern villa exterior in a landscaped setting',description:'A concise two- to three-line introduction for Al Ain Villas will appear here once ADURE confirms the final project description.'}
    ]
  };
  const labels={'abu-dhabi':'ABU DHABI BUILDINGS',dubai:'DUBAI BUILDINGS','al-ain':'AL AIN BUILDINGS'};
  const tabs=[...portfolioRoot.querySelectorAll('.portfolio-city-tabs button')];
  const grid=portfolioRoot.querySelector('#portfolio-card-grid');
  const detail=portfolioRoot.querySelector('#portfolio-expanded-card');
  const kicker=portfolioRoot.querySelector('#portfolio-city-kicker');
  const allProjects=Object.values(projects).flat();
  const filterHost=document.createElement('div');
  filterHost.className='portfolio-type-filters';
  filterHost.setAttribute('role','group');
  filterHost.setAttribute('aria-label','Filter portfolio by property type');
  filterHost.innerHTML=`
    <button class="is-active" type="button" data-portfolio-filter="all" aria-pressed="true">All</button>
    <button type="button" data-portfolio-filter="Residential" aria-pressed="false">Residential</button>
    <button type="button" data-portfolio-filter="Retail" aria-pressed="false">Retail</button>`;
  portfolioRoot.querySelector('.portfolio-intro')?.append(filterHost);
  let activeCity='all';
  let activeFilter='all';
  let visibleProjects=allProjects;
  let activeProject=visibleProjects[0];
  const filteredProjects=()=>activeFilter==='all'?allProjects:allProjects.filter(project=>project.type===activeFilter);
  const renderCards=()=>{
    visibleProjects=filteredProjects();
    if(!visibleProjects.some(project=>project.id===activeProject?.id))activeProject=visibleProjects[0];
    grid.innerHTML=visibleProjects.map(project=>`
      <button class="portfolio-home-card${project.id===activeProject?.id?' is-active':''}" type="button" data-project="${project.id}" aria-pressed="${project.id===activeProject?.id}">
        <span class="portfolio-home-image"><img src="${project.image}" alt="${project.alt}" loading="lazy" draggable="false"></span>
        <span class="portfolio-home-copy"><strong>${project.title}</strong><small>${project.type} · ${project.location}</small></span>
      </button>`).join('');
    grid.scrollTo({left:0,behavior:'instant'});
  };
  const renderDetail=()=>{
    if(!activeProject){detail.innerHTML='';return;}
    detail.innerHTML=`
      <div class="portfolio-expanded-image"><img src="${activeProject.image}" alt="${activeProject.alt}"></div>
      <div class="portfolio-expanded-copy">
        <span class="portfolio-expanded-city">${activeProject.city}</span>
        <h3>${activeProject.title}</h3>
        <span class="portfolio-expanded-rule" aria-hidden="true"></span>
        <p>${activeProject.description}</p>
        <form class="portfolio-enquiry-form" action="mailto:info@adure.ae" method="post" enctype="text/plain">
          <h4>Contact ADURE</h4>
          <label><span>Name</span><input name="name" type="text" placeholder="Name" autocomplete="name" required></label>
          <label><span>Email</span><input name="email" type="email" placeholder="Email" autocomplete="email" required></label>
          <label><span>Phone</span><input name="phone" type="tel" placeholder="Phone" autocomplete="tel" required></label>
          <input type="hidden" name="project" value="${activeProject.title}">
          <button class="btn primary" type="submit">Send Enquiry</button>
        </form>
      </div>`;
  };
  const selectProject=id=>{
    const project=visibleProjects.find(item=>item.id===id);
    if(!project)return;
    activeProject=project;
    renderCards();
    renderDetail();
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      detail.animate([{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,easing:'cubic-bezier(.22,.61,.36,1)'});
    }
  };
  const setFilter=filter=>{
    activeFilter=filter;
    filterHost.querySelectorAll('button').forEach(button=>{
      const active=button.dataset.portfolioFilter===filter;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    renderCards();
    renderDetail();
  };
  const selectCity=city=>{
    activeCity=city;
    activeProject=(city==='all'?allProjects:projects[city])[0];
    if(kicker)kicker.textContent=city==='all'?'PORTFOLIO':labels[city];
    grid.setAttribute('aria-labelledby',city==='all'?'portfolio':'portfolio-city-'+city);
    tabs.forEach(tab=>{
      const active=tab.dataset.city===city;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
    });
    renderCards();
    renderDetail();
  };
  filterHost.addEventListener('click',event=>{
    const button=event.target.closest('[data-portfolio-filter]');
    if(button)setFilter(button.dataset.portfolioFilter);
  });
  tabs.forEach(tab=>tab.addEventListener('click',()=>selectCity(tab.dataset.city)));
  grid.addEventListener('click',event=>{
    if(grid.classList.contains('is-dragging'))return;
    const card=event.target.closest('[data-project]');
    if(card)selectProject(card.dataset.project);
  });

  let autoTimer;
  const nextScroll=()=>{
    if(!grid.scrollWidth||grid.scrollWidth<=grid.clientWidth+4)return;
    const card=grid.querySelector('.portfolio-home-card');
    const gap=Number.parseFloat(getComputedStyle(grid).columnGap)||0;
    const step=(card?.getBoundingClientRect().width||grid.clientWidth*.25)+gap;
    const max=grid.scrollWidth-grid.clientWidth;
    const next=grid.scrollLeft+step>=max-2?0:grid.scrollLeft+step;
    grid.scrollTo({left:next,behavior:'smooth'});
  };
  const startAuto=()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    clearInterval(autoTimer);
    autoTimer=setInterval(nextScroll,3200);
  };
  const stopAuto=()=>clearInterval(autoTimer);
  let dragging=false,startX=0,startLeft=0,dragMoved=false;
  grid.addEventListener('pointerdown',event=>{
    dragging=true;dragMoved=false;startX=event.clientX;startLeft=grid.scrollLeft;stopAuto();
    grid.classList.add('is-pointer-down');
    grid.setPointerCapture?.(event.pointerId);
  });
  grid.addEventListener('pointermove',event=>{
    if(!dragging)return;
    const delta=event.clientX-startX;
    if(Math.abs(delta)>5)dragMoved=true;
    grid.scrollLeft=startLeft-delta;
  });
  const endDrag=()=>{
    if(!dragging)return;
    dragging=false;
    grid.classList.remove('is-pointer-down');
    if(dragMoved){grid.classList.add('is-dragging');setTimeout(()=>grid.classList.remove('is-dragging'),0);}
    startAuto();
  };
  grid.addEventListener('pointerup',endDrag);
  grid.addEventListener('pointercancel',endDrag);
  grid.addEventListener('pointerleave',endDrag);
  grid.addEventListener('mouseenter',stopAuto);
  grid.addEventListener('mouseleave',startAuto);
  grid.addEventListener('focusin',stopAuto);
  grid.addEventListener('focusout',startAuto);
  document.addEventListener('visibilitychange',()=>document.hidden?stopAuto():startAuto());
  selectCity(activeCity);
  startAuto();
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initHomepagePortfolio,{once:true});
else initHomepagePortfolio();
