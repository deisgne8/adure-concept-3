import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {properties,matchProperties} from '../dist/home-data.js';
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const source=readFileSync(new URL('../docs/reference-evidence/adure-v2-source.html',import.meta.url),'utf8');
const referenceHome=source.slice(source.indexOf('<section class="page active home-v2"'),source.indexOf('<section class="page" id="properties"'));
const localHome=html.slice(html.indexOf('<section class="home-v2"'),html.indexOf('</main>'));
const approvedCopy=[
  'Beyond property. Creating value.',
  'A connected approach to real estate, shaped in Abu Dhabi.',
  'One partner for every property move.',
  'Choose with clarity.',
  'Position for the right value.',
  'Connect people with place.',
  'Protect what comes next.',
  'Find a place that fits what comes next.',
  'Find the place that fits what comes next.',
  'Property management',
  'Value lies in how a property is cared for.',
  'Success proven in numbers',
  'Success proven in numbers.',
  'From places to performance',
  'From places to performance.',
  'Your 30-day transition journey',
  'Good management starts with getting the beginning right.',
  'Rooted in trust and transparency',
  'Rooted in trust and transparency.',
  'Start a conversation',
  'Every next move begins with the right partner.'
];
approvedCopy.forEach(copy=>assert.ok(localHome.includes(copy),`Approved copy missing: ${copy}`));
assert.ok(!localHome.includes('<span class="trust-logo-eyebrow">Customers</span>'),'Trust eyebrow should be removed');
assert.ok(localHome.includes('<div class="journey-heading"><h2>One partner for every property move.</h2>'),'Journeys heading does not match the requested copy');
for (const [id, heading] of Object.entries({
  management:'Value lies in how a property is cared for',
  proof:'Success proven in numbers',
  portfolio:'From places to performance',
  trust:'Rooted in trust and transparency'
})) {
  const section=localHome.match(new RegExp(`<section class="[^"]*" id="${id}">([\\s\\S]*?)<\\/section>`))?.[1];
  assert.equal(section?.match(/<h2[^>]*>([^<]*)<\/h2>/)?.[1],heading,`${id} heading`);
}
['With You Across Every Stage','A Record That Speaks For Itself','A Considered Start','Trusted Across Sectors.'].forEach(copy=>assert.ok(!localHome.includes(copy),`Superseded copy remains: ${copy}`));
const ids=[...localHome.matchAll(/<section class="[^"]* section" id="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(ids,['hero','journeys','discovery','management','proof','portfolio','transition','trust','conversation']);
assert.equal((html.match(/<select /g)||[]).length,4);
assert.equal((html.match(/<h1>/g)||[]).length,1);
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
for(const route of new Set([...referenceHome.matchAll(/data-route="([^"]+)"/g)].map(m=>m[1])))assert.ok(localHome.includes('#'+route),route+' destination retained');
console.log('PASS: revised homepage copy, section order, CTA destinations, assets, semantic heading and multi-field property matching.');
