// Preserve the approved v2 home verbatim, replacing only presentation and controls.
import { readFileSync, writeFileSync } from 'node:fs';
const source = readFileSync(new URL('../docs/reference-evidence/adure-v2-source.html', import.meta.url), 'utf8');
let home = source.slice(source.indexOf('<section class="page active home-v2"'), source.indexOf('<section class="page" id="properties"'));
home = home.replace(/\sstyle="[^"]*"/g, '').replace('class="page active home-v2"', 'class="home-v2"').replace('assets/adure-banner-poster.jpg','assets/architecture-horizon.webp').replace('class="portfolio-mosaic"','class="portfolio-mosaic" tabindex="0" role="region" aria-label="Portfolio highlights"');
const ids = ['hero','philosophy','journeys','discovery','management','proof','portfolio','transition','trust','conversation'];
let section = 0;
home = home.replace(/<section class="(?!home-v2)([^"]+)"/g, (_, cls) => `<section class="${cls} section" id="${ids[section++]}"`);
home = home.replace('<section class="final-v2 section" id="conversation"><img src="assets/architecture-waterfront.webp"','<section class="final-v2 section" id="conversation"><img src="assets/architecture-close.webp"');
home = home.replace(
  '<div class="proof-metrics-v2">',
  '<div class="proof-experience"><div class="proof-sticky"><div class="proof-collage" aria-hidden="true"><img class="proof-tile tile-a" src="assets/architecture-community.webp" alt=""><img class="proof-tile tile-b" src="assets/architecture-curves.webp" alt=""><img class="proof-tile tile-c" src="assets/architecture-waterfront.webp" alt=""><img class="proof-tile tile-d" src="assets/architecture-city.webp" alt=""><img class="proof-tile tile-e" src="assets/architecture-terraces.webp" alt=""></div><div class="proof-focus"><img src="assets/architecture-waterfront.webp" alt="ADURE managed waterfront property"><div class="proof-carousel-head"><span>Proof in numbers</span><div><button type="button" class="proof-prev" aria-label="Previous metric">←</button><button type="button" class="proof-next" aria-label="Next metric">→</button></div></div><div class="proof-metrics-v2" tabindex="0" role="region" aria-label="ADURE performance metrics">'
).replace(
  '<span>Average vacancy</span></div></div></div></section>',
  '<span>Average vacancy</span></div></div></div></div></div></div></section>'
);
home = home.replace(
  '<div class="philosophy-lead"><h2>A Longer View.</h2><p class="lead-copy">For us, the transaction is one moment. What follows matters just as much.</p></div><div class="principles">',
  '<div class="philosophy-lead"><h2>A Longer View.</h2><p class="lead-copy">For us, the transaction is one moment. What follows matters just as much.</p></div><div class="philosophy-stage"><figure class="philosophy-visual" aria-hidden="true"><div class="philosophy-frame"><img class="is-active" data-philosophy-image="0" src="assets/architecture-curves.webp" alt=""><img data-philosophy-image="1" src="assets/architecture-facade.webp" alt=""><img data-philosophy-image="2" src="assets/architecture-waterfront.webp" alt=""><span class="draft-corner top-left"></span><span class="draft-corner top-right"></span><span class="draft-corner bottom-left"></span><span class="draft-corner bottom-right"></span><small>fig. <b data-philosophy-figure>01</b> ↓</small></div></figure><div class="principles" role="list">'
).replace(
  '<article class="principle"><span>01 · Positioning</span>',
  '<article class="principle is-active" data-philosophy-step="0" tabindex="0" role="listitem"><span>01 · Positioning</span><strong class="principle-number" aria-hidden="true">01</strong>'
).replace(
  '<article class="principle"><span>02 · Performance</span>',
  '<article class="principle" data-philosophy-step="1" tabindex="0" role="listitem"><span>02 · Performance</span><strong class="principle-number" aria-hidden="true">02</strong>'
).replace(
  '<article class="principle"><span>03 · Stewardship</span>',
  '<article class="principle" data-philosophy-step="2" tabindex="0" role="listitem"><span>03 · Stewardship</span><strong class="principle-number" aria-hidden="true">03</strong>'
).replace(
  '<p>Protecting the financial, legal and operational interests around the asset.</p></article></div></div></section>',
  '<p>Protecting the financial, legal and operational interests around the asset.</p></article></div><div class="philosophy-progress" aria-hidden="true"><span></span><i></i><i></i><i></i></div></div></div></section>'
);
home = home.replace('<div class="search-box">','<form class="search-box" id="property-search">').replace('<div class="grid-3" id="home-properties">', '<p class="search-status" id="search-status" role="status" aria-live="polite"></p><div class="grid-3" id="home-properties">');
home = home.replace('<button class="btn dark" data-route="properties">Search Properties</button></div>', '<button class="btn dark" type="submit">Search Properties</button><button class="text-link clear-filters" type="reset">Clear Filters</button></form>');
home = home.replace('<div class="tabs">','<div class="tabs" role="group" aria-label="Property intent">').replace('<button class="tab active">Buy</button>', '<button class="tab active" type="button" data-intent="buy" aria-pressed="true">Buy</button>').replace('<button class="tab">Lease</button>', '<button class="tab" type="button" data-intent="lease" aria-pressed="false">Lease</button>');
home = home.replace('<form class="search-box"', '<button class="btn filter-open" type="button" aria-haspopup="dialog">Find real estate <span aria-hidden="true">⌕</span></button><div id="filter-home"><form class="search-box"').replace('</form>', '</form></div>');
const fields = ['location','type','bedrooms','price']; let fi = 0;
home = home.replace(/<label>([^<]+)<\/label><select>/g, (_, label) => { const id=fields[fi++]; return `<label for="filter-${id}">${label}</label><select id="filter-${id}" name="${id}">`; });
// The philosophy uses the approved short copy in its own editorial template.
home = home.replace(/<section class="philosophy-section[^>]*>[\s\S]*?<\/section>/, readFileSync(new URL('../docs/philosophy-section.html',import.meta.url),'utf8').trim());
const managementIntro = '<p class="intro">Long-term performance depends on more than one service. We bring leasing, operations, facilities, financial management and legal coordination together under one connected approach.</p>';
home = home.replace(
  managementIntro,
  `${managementIntro}<button class="btn link management-main-cta" data-route="services">Explore Property Management</button>`
).replace(
  '<button class="btn primary" data-route="services">Explore Property Management</button></div></div></div></section>',
  '</div></div></div></section>'
);
const approvedCopy = [
  ['Creating Value Beyond Property','Beyond Property. Creating Value.'],
  ["We're your end-to-end partner in real estate — bringing buying, selling, leasing, and property management together around one purpose: creating lasting value.",'A connected approach to real estate, shaped in Abu Dhabi.'],
  ['With You Across Every Stage.','One partner for every property move.'],
  ["Whether you're buying, selling, leasing or placing an asset under management, we bring the right expertise together so every stage feels connected and considered.",'One partner for every property move. Real estate rarely begins and ends with one decision. ADURE brings the expertise at every stage, so each move builds naturally into the next.'],
  ['Find the right property with clear information and informed guidance.','Choose with clarity. Discover opportunities with guidance grounded in the market.'],
  ['Bring your property to market with professional advice, strong exposure and access to qualified buyers.','Position for the right value. Bring your property to market with considered positioning and the right audience.'],
  ['Find a residential or commercial property that fits what you need next.','Connect people with place. Create the right match between properties, owners and occupants.'],
  ['Bring your asset under one connected management approach, with leasing, operations, facilities, finance and legal oversight working together.','Protect what comes next. Keep assets performing through connected, long-term management.'],
  ['Find Your Next Property.','Find a place that fits what comes next.'],
  ['Explore available properties and start a buying or leasing enquiry with us.','Find the place that fits what comes next. Explore available properties across our locations and communities.'],
  ['Have a Property? Talk To ADURE','Thinking of Selling? Sell Your Property'],
  ['Your Asset, Looked After As A Whole.','Value lies in how a property is cared for'],
  ['Long-term performance depends on more than one service. We bring leasing, operations, facilities, financial management and legal coordination together under one connected approach.','Value lies in how a property is cared for. Long after a property is bought, leased or occupied, its performance depends on what happens every day. ADURE brings leasing, operations, facilities, financial oversight and legal coordination together through one accountable approach.'],
  ['From market assessment and tenant sourcing to administration, renewals and regulatory compliance.','Keeping occupancy, tenant relationships and everyday performance moving forward.'],
  ['Technical, operational and support services that keep properties safe, efficient and reliable.','Maintaining spaces with the consistency, care and attention they require.'],
  ['Structured financial oversight, reporting and legal coordination that give owners greater visibility and control.','Clear oversight, structured reporting and coordinated support around every asset.'],
  ['A Record That Speaks For Itself.','Success proven in numbers'],
  ['Experience, scale and operational performance across a connected UAE portfolio.','Success proven in numbers. The strongest measure of experience is what it continues to deliver.'],
  ['A Portfolio That Reflects Our Range.','From places to performance'],
  ['From residential communities and commercial buildings to office towers, retail, hotels, government buildings, and mixed-use developments, we bring the same focus on performance and long-term value across the portfolio.','From places to performance. Every asset has its own character, purpose and potential. Across the portfolio, ADURE brings the same long-term attention to how each place performs, evolves and serves the people around it.'],
  ['A Considered Start','Your 30-Day Transition Journey'],
  ['Our structured 30-day transition brings documentation, tenants, operations, and reporting into management step by step.','Good management starts with getting the beginning right. Over four clear stages, ADURE brings documentation, people, operations and reporting into one organised management structure, with continuity built into every step.'],
  ['Property and document review, with a full handover audit.','Understand the asset, its documentation and existing requirements.'],
  ['Asset inspection and tenant communication.','Assess the property, operations and tenant needs.'],
  ['Operational takeover and reporting setup.','Bring responsibilities, communication and reporting into alignment.'],
  ['Full management, reporting and performance monitoring.','Move into ongoing oversight with clear accountability and visibility.'],
  ['Week 4+','Week 4'],
  ['See How We Manage','Explore Property Management'],
  ["We're Here For What Comes Next",'Start a Conversation'],
  ["Whether you're buying, selling, leasing, or looking for a partner to manage your asset, start the conversation with ADURE.",'Every next move begins with the right partner. Whether you are finding a place, bringing a property to market or placing an asset under management, ADURE brings clarity to what comes next.']
];
approvedCopy.forEach(([from,to])=>{home=home.replaceAll(from,to)});
const clientLogos = [
  ['adnoc.png','ADNOC'],
  ['taqa-distribution.png','TAQA Distribution'],
  ['ministry-interior.png','Ministry of Interior'],
  ['mubadala.png','Mubadala'],
  ['abu-dhabi-police.png','Abu Dhabi Police'],
  ['total.png','Total'],
  ['schlumberger.png','Schlumberger'],
  ['samsung.png','Samsung'],
  ['british-council.png','British Council'],
  ['oxy.png','Oxy'],
  ['brighton-college.png','Brighton College Abu Dhabi'],
  ['embassy-japan.png','Embassy of Japan'],
  ['unicorp.png','Unicorp'],
  ['punj-lloyd.png','Punj Lloyd']
].map(([file,name]) => `<div class="client-logo"><img src="assets/clients/${file}" alt="${name}" loading="lazy" decoding="async"></div>`).join('');
home = home.replace(
  /<section class="trust-v2 section" id="trust">[\s\S]*?<\/section>/,
  `<section class="trust-v2 section" id="trust"><div class="section-shell"><header class="trust-logo-head"><h2 class="trust-logo-title">Rooted in trust and transparency</h2><p class="trust-logo-intro">Rooted in trust and transparency. ADURE works with government, semi-government and private-sector organisations across the UAE. Relationships of this scale are built through consistency, discretion and accountability — delivered over time.</p></header><div class="client-logo-grid">${clientLogos}</div><button class="btn link trust-logo-cta" data-route="customers">Our Customers</button></div></section>`
);
// Footer copy and link hierarchy remain the supplied v2 version.
let footer = source.slice(source.indexOf('<footer class="footer">'),source.indexOf('<div class="toast"'));
footer = footer.replace(/\sstyle="[^"]*"/g, '').replace('assets/adure-logo.png', 'assets/adure-logo-horizontal.svg');
const routeBase='https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final';
const routeLinks = html => html.replace(/<button([^>]*?) data-route="([^"]+)"([^>]*)>([\s\S]*?)<\/button>/g, (_,a,r,b,t)=>`<a${a} href="${routeBase}#${r}"${b}>${t}</a>`).replace(/<a([^>]*?) data-route="([^"]+)"([^>]*)>/g, (_,a,r,b)=>`<a${a.replace(/ href="[^"]*"/,'')} href="${r==='home'?'#home':routeBase+'#'+r}"${b}>`);
home=routeLinks(home); footer=routeLinks(footer).replace('Privacy · Terms · Accessibility · Sitemap','Privacy · Terms · Accessibility · Sitemap <span class="language-label">EN / AR</span>');
const link=(route,text)=>`<a href="${routeBase}#${route}">${text}</a>`;
const serviceLinks=[['services','Overview','All connected capabilities'],['properties','Buy','Find your next property'],['list-property','Sell','Bring a property to market'],['properties','Leasing','Explore available properties'],['services','Property Management','Protect long-term asset value']].map(([route,title,description])=>link(route,`<span>${title}</span><small>${description}</small>`)).join('');
const navigation=`${link('about','About ADURE')}<div class="nav-disclosure"><button id="services-toggle" aria-expanded="false" aria-controls="services-menu">Services <span aria-hidden="true">⌄</span></button><div id="services-menu" hidden>${serviceLinks}</div></div>${link('properties','Properties')}${link('portfolio','Portfolio')}${link('customers','Our Customers')}${link('contact','Contact')}`;
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#933637"><title>ADURE — Beyond Property. Creating Value.</title><meta name="description" content="Abu Dhabi United Real Estate. End-to-end property solutions for buyers, sellers, tenants and owners across Abu Dhabi, Dubai and Al Ain."><meta property="og:title" content="ADURE — Beyond Property. Creating Value."><meta property="og:description" content="End-to-end real estate across Abu Dhabi, Dubai and Al Ain."><link rel="icon" href="assets/adure-logo.svg"><link rel="preload" href="assets/fonts/fira-sans-400.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/fonts/source-sans-pro-400.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="design-tokens.css"><link rel="stylesheet" href="primitives.css"><link rel="stylesheet" href="home.css"><script type="module" src="home.js"></script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner"><a href="#home" class="site-logo" aria-label="ADURE home"><img src="assets/adure-logo-horizontal.svg" alt="ADURE — Abu Dhabi United Real Estate" width="230" height="62"></a><nav class="desktop-nav" aria-label="Main navigation">${navigation}</nav><a class="btn primary header-cta" href="${routeBase}#list-property">List Your Property</a><button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button></div></header><dialog class="mobile-menu" id="mobile-menu" aria-label="Main navigation"><div class="menu-top"><a href="#home" class="site-logo"><img src="assets/adure-logo-horizontal.svg" alt="ADURE home"></a><button class="icon-button menu-close" aria-label="Close menu">×</button></div><nav aria-label="Mobile navigation">${link('about','About ADURE')}<details><summary>Services</summary>${link('services','Overview')}${link('properties','Buy')}${link('list-property','Sell')}${link('properties','Leasing')}${link('services','Property Management')}</details>${link('properties','Properties')}${link('portfolio','Portfolio')}${link('customers','Our Customers')}${link('contact','Contact')}</nav><a class="btn primary" href="${routeBase}#list-property">List Your Property</a><p class="menu-contact">Abu Dhabi · Dubai · Al Ain<br><a href="tel:+97126457869">02 6457869</a></p></dialog><main id="main">${home}</main>${footer}<dialog class="filter-dialog" id="filter-dialog" aria-labelledby="filter-title"><div class="dialog-top"><h2 id="filter-title">All Filters</h2><button class="icon-button filter-close" aria-label="Close filters">×</button></div><div id="filter-slot"></div></dialog><p id="action-status" class="sr-only" role="status"></p></body></html>`;
const origin = new URL(process.env.SITE_ORIGIN || 'http://127.0.0.1:4180');
if (!['http:','https:'].includes(origin.protocol)) throw new Error('SITE_ORIGIN must use HTTP(S)');
const social = `<meta property="og:image" content="${origin.origin}/assets/adure-social-preview.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="ADURE — Beyond Property. Creating Value."><meta name="twitter:description" content="End-to-end real estate across Abu Dhabi, Dubai and Al Ain."><meta name="twitter:image" content="${origin.origin}/assets/adure-social-preview.png">`;
const opening=`<div class="site-intro" id="site-intro" hidden aria-label="Loading ADURE"><button class="intro-skip" type="button">Skip intro <span aria-hidden="true">→</span></button><div class="intro-lockup"><div class="intro-brand" aria-hidden="true"><img src="assets/adure-logo-horizontal.svg" alt=""></div><p class="intro-caption"><span>BEYOND PROPERTY… CREATING VALUE!</span></p></div></div>`;
const openingHead=`<link rel="stylesheet" href="hero-opening.css?v=opening-8"><script>if((!location.hash||location.hash==='#home')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.opening='pending';window.adureOpeningTimer=setTimeout(()=>{if(window.adureFinishOpening)window.adureFinishOpening();else{delete document.documentElement.dataset.opening;document.querySelector('#site-intro')?.setAttribute('hidden','');document.querySelectorAll('[inert]').forEach(e=>e.inert=false)}},8000)}</script><script type="module" src="hero-opening.js?v=opening-9"></script>`;
let output=html.replace('</head>',social+openingHead+'</head>').replace('<body>','<body>'+opening).replace('<img src="assets/architecture-horizon.webp" alt="Contemporary waterfront real estate in Abu Dhabi">','<video class="hero-video" id="hero-video" muted loop playsinline preload="auto" poster="assets/architecture-horizon.webp" aria-label="Hidd Al Saadiyat architectural film"><source src="assets/hidd-al-saadiyat-hero.mp4" type="video/mp4"></video>');
const sentenceCaseCopy = [
  ['BEYOND PROPERTY… CREATING VALUE!','Beyond property… creating value!'],
  ['Beyond Property. Creating Value.','Beyond property. Creating value.'],
  ['Real Estate, Connected','Real estate, connected'],
  ['Show Leasing and Operations','Show leasing and operations'],
  ['Show Facility Management','Show facility management'],
  ['Show Financial and Legal Management','Show financial and legal management'],
  ['Thinking of Selling? Sell Your Property','Thinking of selling? Sell your property'],
  ['Financial & Legal Management','Financial & legal management'],
  ['Your 30-Day Transition Journey','Your 30-day transition journey'],
  ['Explore Property Management','Explore property management'],
  ['Explore Our Portfolio','Explore our portfolio'],
  ['Trusted Relationships','Trusted relationships'],
  ['Start a Conversation','Start a conversation'],
  ['Leasing &amp; Operations','Leasing &amp; operations'],
  ['Financial &amp; Legal Management','Financial &amp; legal management'],
  ['Leasing & Operations','Leasing & operations'],
  ['Facility Management','Facility management'],
  ['The ADURE Record','The ADURE record'],
  ['Property Management','Property management'],
  ['Property Search','Property search'],
  ['Search Properties','Search properties'],
  ['View All Properties','View all properties'],
  ['Buy With ADURE','Buy with ADURE'],
  ['Sell With ADURE','Sell with ADURE'],
  ['Lease With ADURE','Lease with ADURE'],
  ['List Your Property','List your property'],
  ['Find a Property','Find a property'],
  ['Our Customers','Our customers'],
  ['Our Portfolio','Our portfolio'],
  ['Property Type','Property type'],
  ['Price Range','Price range'],
  ['Media and Gallery','Media and gallery'],
  ['All Filters','All filters']
];
sentenceCaseCopy.forEach(([from,to])=>{output=output.replaceAll(from,to)});
writeFileSync(new URL('../dist/index.html',import.meta.url),output.replace('content="#933637"','content="#004789"').replace('href="home.css"','href="home.css?v=sentence-case-1"').replace('src="home.js"','src="home.js?v=management-images-1"'));
console.log('Built ADURE v2 homepage: '+section+' sections, '+fi+' filters.');
