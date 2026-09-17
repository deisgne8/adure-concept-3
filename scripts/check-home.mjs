import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {properties,matchProperties} from '../dist/home-data.js';
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const template=readFileSync(new URL('../src/homepage.html',import.meta.url),'utf8');
const socialOrigin=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]).origin;
assert.equal(html,template.replaceAll('{{SITE_ORIGIN}}',socialOrigin),'Published homepage differs from its build source; run npm run build');
// These structures are required by the approved layouts and their animation modules.
for(const className of ['management-carousel-copy','service-rows','proof-editorial-layout','proof-statistics','portfolio-card']){
  assert.ok(html.includes(`class="${className}"`),`Approved layout missing: ${className}`);
}
assert.equal((html.match(/class="proof-statistic"/g)||[]).length,5,'Keep all five editorial statistics');
assert.ok(html.includes('assets/management-beachfront-photo.webp'),'Keep the approved management photograph');
for(const oldLayout of ['proof-collage','proof-experience','proof-carousel-head','philosophy-section']){
  assert.ok(!html.includes(oldLayout),`Retired layout returned: ${oldLayout}`);
}
assert.ok(!html.includes('class="amenity-clear"')&&!html.includes('class="text-link clear-filters"'),'Removed filter buttons must stay removed');
assert.ok(html.includes('<dd>3000+</dd>'),'Units managed must have no comma');
const source=readFileSync(new URL('../docs/reference-evidence/adure-v2-source.html',import.meta.url),'utf8');
const referenceHome=source.slice(source.indexOf('<section class="page active home-v2"'),source.indexOf('<section class="page" id="properties"'));
const localHome=html.slice(html.indexOf('<section class="home-v2"'),html.indexOf('</main>'));
const referencePortfolio=[
  ['Sunrise Residence 3','Residential · Qaryat Al Hidd, Saadiyat Island','assets/portfolio-reference/sunrise-residence-3-v2.webp'],
  ['48 Burj Gate','Retail · Sheikh Zayed Road, Dubai','assets/portfolio-reference/48-burj-gate-v2.webp'],
  ['Qaryat Al Hidd','Residential · Saadiyat Island','assets/portfolio-reference/qaryat-al-hidd-v2.webp'],
  ['Al Mushrif Villas','Residential · Al Mushrif, Abu Dhabi','assets/portfolio-reference/al-mushrif-villas-v2.webp'],
  ['Ghantoot Complex','Residential · Mohammed Bin Zayed City','assets/portfolio-reference/ghantoot-complex-v2.webp']
];
for(const [name,detail,image] of referencePortfolio){
  assert.ok(localHome.includes(`<h3>${name}</h3>`),`Portfolio name missing: ${name}`);
  assert.ok(localHome.includes(detail),`Portfolio detail missing: ${detail}`);
  assert.ok(localHome.includes(`src="${image}"`),`Portfolio image missing: ${image}`);
  assert.ok(existsSync(new URL(`../dist/${image}`,import.meta.url)),`Portfolio asset missing: ${image}`);
}
assert.equal((localHome.match(/class="portfolio-item-v2"/g)||[]).length,referencePortfolio.length,'Portfolio must contain the five approved projects');
const approvedCopy=[
  'Creating Value Beyond Property',
  'A connected approach to real estate, shaped in Abu Dhabi.',
  'One Partner for Every Property Move',
  'Choose with clarity.',
  'Position for the right value.',
  'Connect people with place.',
  'Protect what comes next.',
  'Find a Place That Fits What Comes Next',
  'Explore available properties across our locations and communities.',
  'Property management',
  'Long after a property is bought, leased or occupied,',
  'Success Proven in Numbers',
  'The strongest measure of experience is what it continues to deliver.',
  'From Places to Performance',
  'Every asset has its own character, purpose and potential.',
  'Your 30-Day Transition Journey',
  'Good management starts with getting the beginning right.',
  'Rooted in Trust and Transparency',
  'ADURE works with government, semi government and private sector organisations across the UAE.',
  'Whether you are finding a place, bringing a property to market or placing an asset under management, ADURE brings clarity to what comes next.',
  'Every Next Move Begins with the Right Partner'
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
assert.ok(localHome.includes('<span class="discovery-title-ending">What Comes Next</span>'),'Keep what comes next together');
assert.ok(localHome.includes('<div class="journey-heading"><h2>One Partner for Every Property Move</h2>'),'Journeys heading does not match the requested copy');
for (const [id, heading] of Object.entries({
  management:'Value Lies in How a Property Is Cared For',
  proof:'Success Proven in Numbers',
  portfolio:'From Places to Performance',
  trust:'Rooted in Trust and Transparency'
})) {
  const section=localHome.match(new RegExp(`<section class="[^"]*" id="${id}">([\\s\\S]*?)<\\/section>`))?.[1];
  assert.equal(section?.match(/<h2[^>]*>([^<]*)<\/h2>/)?.[1],heading,`${id} heading`);
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
for(const route of new Set([...referenceHome.matchAll(/data-route="([^"]+)"/g)].map(m=>m[1])))assert.ok(localHome.includes('#'+route),route+' destination retained');
console.log('PASS: revised homepage copy, section order, CTA destinations, assets, semantic heading and multi-field property matching.');
