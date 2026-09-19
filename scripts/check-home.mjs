import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {properties,matchProperties} from '../dist/home-data.js';
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const template=readFileSync(new URL('../src/homepage.html',import.meta.url),'utf8');
const socialOrigin=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]).origin;
assert.equal(html,template.replaceAll('{{SITE_ORIGIN}}',socialOrigin),'Published homepage differs from its build source; run npm run build');
// These structures are required by the approved layouts and their animation modules.
for(const className of ['management-carousel-copy','service-rows','proof-editorial-layout','proof-statistics','portfolio-explorer-home','portfolio-city-tabs','portfolio-card-grid','portfolio-expanded-card']){
  assert.ok(html.includes(className),`Approved layout missing: ${className}`);
}
assert.equal((html.match(/class="proof-statistic"/g)||[]).length,5,'Keep all five editorial statistics');
assert.ok(html.includes('assets/management-beachfront-photo.webp'),'Keep the approved management photograph');
for(const oldLayout of ['proof-collage','proof-experience','proof-carousel-head','philosophy-section']){
  assert.ok(!html.includes(oldLayout),`Retired layout returned: ${oldLayout}`);
}
assert.ok(!html.includes('class="amenity-clear"')&&!html.includes('class="text-link clear-filters"'),'Removed filter buttons must stay removed');
assert.ok(html.includes('<dd>1800+</dd>'),'Units managed must match client copy');
const source=readFileSync(new URL('../docs/reference-evidence/adure-v2-source.html',import.meta.url),'utf8');
const referenceHome=source.slice(source.indexOf('<section class="page active home-v2"'),source.indexOf('<section class="page" id="properties"'));
const localHome=html.slice(html.indexOf('<section class="home-v2"'),html.indexOf('</main>'));
const portfolioScript=readFileSync(new URL('../dist/portfolio-carousel.js',import.meta.url),'utf8');
const requiredPortfolio=[
  ['Al Salam Tower','assets/portfolio-reference/48-burj-gate-v2.webp'],
  ['Hili Tower B','assets/portfolio-waterfront-tower-v2.png'],
  ['Al Manhal Tower','assets/portfolio-curved-towers-v2.png'],
  ['Jasmine Tower','assets/enhanced/proof-jasmine.webp'],
  ['Al Mushrif Compound','assets/portfolio-reference/al-mushrif-villas-v2.webp'],
  ['Sahara Complex','assets/portfolio-reference/ghantoot-complex-v2.webp'],
  ['19 Villas Compound','assets/portfolio-modern-villa-v2.png'],
  ['Al Ghadeer','assets/hidd-al-saadiyat/landscaped-community.webp'],
  ['Julphar Residence, Al Reem','assets/hidd-al-saadiyat/urban-mixed-use.webp'],
  ['Park View, Al Reem','assets/hidd-al-saadiyat/waterfront-view.webp'],
  ['Al Raha Gardens','assets/hidd-al-saadiyat/promenade-mixed-use.webp'],
  ['Hidd Saadiyat Villas','assets/portfolio-reference/qaryat-al-hidd-v2.webp'],
  ['48 Burj Gate','assets/portfolio-reference/48-burj-gate-v2.webp']
];
for(const [name,image] of requiredPortfolio){
  assert.ok(portfolioScript.includes(name),`Portfolio project missing from interactive data: ${name}`);
  assert.ok(portfolioScript.includes(image),`Portfolio image missing from interactive data: ${image}`);
  assert.ok(existsSync(new URL(`../dist/${image}`,import.meta.url)),`Portfolio asset missing: ${image}`);
}
for(const required of ['data-city="abu-dhabi"','data-city="dubai"','data-city="al-ain"','id="portfolio-expanded-card"']){
  assert.ok(localHome.includes(required),`Portfolio interaction shell missing: ${required}`);
}
const approvedCopy=[
  'Creating Value Beyond Property',
  'Buy. Sell. Lease. Manage.',
  'Discover ADURE',
  'Find a Property',
  'One Partner For Every Property Move',
  'From finding the right place to protecting its long-term value, ADURE brings every part of the real estate journey together.',
  'Find the right opportunity with clear insight and considered guidance.',
  'Bring your property to market with considered positioning and the right audience.',
  'Connect people with the right places they need.',
  'Protect long-term performance through connected long-term management.',
  'Find Your Next Address',
  'Explore available properties across our locations and communities.',
  'From Occupancy To Operations, We Manage It All',
  'Effective property management means more than looking after a building.',
  'Built Over Time, Every Day',
  'Long-term trust is earned through the performance that follows.',
  '1800+',
  'A Portfolio Built For Lasting Value',
  'From residential communities to retail assets, our portfolio reflects a long-term approach to real estate.',
  'Our 30-Day Transition Journey',
  'A smooth transition is essential to protecting day-to-day operations, tenant experience and property performance.',
  'Unlock The Next Opportunity For Your Property',
  'We position and present your property with the attention it deserves, creating the right visibility and connecting it with serious buyers.',
  'Trusted By Organisations That Expect More',
  'ADURE has built long-standing relationships across government, semi-government and the private sector - where integrity, excellence and innovation matter.',
  'We’re Here For Your Next Step',
  'Whether you are looking to buy or rent your next property, bringing one to market or placing an asset under management, our team is ready to help.'
];
const localCopy=localHome.replace(/<[^>]*>/g,'');
approvedCopy.forEach(copy=>assert.ok(localCopy.includes(copy),`Approved copy missing: ${copy}`));
assert.ok(!localHome.includes('<span class="trust-logo-eyebrow">Customers</span>'),'Trust eyebrow should be removed');
const trustMarkup=localHome.slice(localHome.indexOf('<section class="trust-v2 section" id="trust">'),localHome.indexOf('<section class="final-v2 section" id="conversation">'));
for(const [id,count] of [['government-semi-government',6],['private-sector-corporates',6]]){
  const group=trustMarkup.match(new RegExp(`<section class="client-logo-group" aria-labelledby="${id}">([\\s\\S]*?)<\\/section>`))?.[1];
  assert.ok(group,`Missing client group: ${id}`);
  assert.equal((group.match(/class="client-logo"/g)||[]).length,count*2,'Each logo has one hidden copy for a seamless loop');
  assert.equal((group.match(/class="client-logo-track"/g)||[]).length,1,'Each group has one horizontal animated track');
}
assert.ok(localHome.includes('<div class="journey-heading"><h2>One Partner For Every Property Move</h2>'),'Journeys heading does not match the client copy');
assert.ok(localHome.includes('From residential communities to retail assets, our portfolio reflects a long-term approach to real estate.'),'Portfolio intro copy missing');
for (const [id, heading] of Object.entries({
  management:'From Occupancy To Operations, We Manage It All',
  proof:'Built Over Time, Every Day',
  portfolio:'A Portfolio Built For Lasting Value',
  trust:'Trusted By Organisations That Expect More'
})) {
  const section=localHome.match(new RegExp(`<section class="[^"]*" id="${id}">([\\s\\S]*?)<\\/section>`))?.[1];
  const h2Markup=section?.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1];
  const h2Text=h2Markup?.replace(/<[^>]+>/g,'').replaceAll('&nbsp;',' ').trim();
  assert.equal(h2Text,heading,`${id} heading`);
}
['With You Across Every Stage','A Record That Speaks For Itself','A Considered Start','Trusted Across Sectors.'].forEach(copy=>assert.ok(!localHome.includes(copy),`Superseded copy remains: ${copy}`));
const ids=[...localHome.matchAll(/<section class="[^"]* section" id="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(ids,['hero','journeys','discovery','management','proof','portfolio','transition','sell','trust','conversation']);
assert.equal((html.match(/<select /g)||[]).length,5);
assert.equal((html.match(/<h1>/g)||[]).length,1);
assert.ok(localHome.includes('<h1><span>Creating Value</span> <span>Beyond Property</span></h1>'),'Hero heading does not match the requested copy');
for(const m of html.matchAll(/(?:src|href)="(assets\/[^"#]+|[a-z-]+\.(?:css|js))"/g))assert.ok(existsSync(new URL('../dist/'+m[1],import.meta.url)),m[1]);
for(const p of properties)assert.ok(existsSync(new URL('../dist/assets/'+p.image,import.meta.url)));
assert.equal(properties.length,6);
assert.deepEqual(matchProperties({intent:'buy'}).map(p=>p.id),['ADU-004']);
assert.equal(matchProperties({intent:'lease'}).length,5);
assert.equal(matchProperties({intent:'lease',location:'Al Ain'}).length,0);
assert.deepEqual(matchProperties({intent:'lease',bedrooms:'Studio',price:'Under AED 100K'}).map(p=>p.id),['ADU-006']);
assert.deepEqual(matchProperties({intent:'lease',type:'Commercial',location:'Dubai'}).map(p=>p.id),['ADU-005']);
assert.deepEqual(matchProperties({intent:'lease',bedrooms:'1–2 bedrooms',price:'AED 100K–200K'}).map(p=>p.id),['ADU-304']);
assert.equal(matchProperties({intent:'buy',type:'Villa'}).length,0);
assert.deepEqual(matchProperties({intent:'lease',amenities:['Swimming Pool','Gym']}).map(p=>p.id),['ADU-304','ADU-006']);
assert.deepEqual(matchProperties({intent:'buy',amenities:['Pet Friendly']}).map(p=>p.id),['ADU-004']);
for(const route of new Set([...referenceHome.matchAll(/data-route="([^"]+)"/g)].map(m=>m[1]))){
  const destinationRetained = route === 'about'
    ? localHome.includes('href="about.html"')
    : route === 'portfolio'
      ? localHome.includes('href="portfolio.html"')
      : localHome.includes('#'+route);
  assert.ok(destinationRetained,route+' destination retained');
}
console.log('PASS: revised homepage copy, section order, CTA destinations, assets, semantic heading and multi-field property matching.');
