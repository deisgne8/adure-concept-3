import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {site, journeys, management, collections, matchCollections, portfolio, transition, clients} from '../dist/content.js';

const base = {intent:'buy',location:'any',type:'any',beds:'any',budget:'any'};
const search = changes => matchCollections({...base,...changes});
assert.equal(search({}).length,3);
assert.deepEqual(search({intent:'rent',location:'Dubai',type:'Apartment',beds:'2',budget:'under-100k'}).map(x=>x.id),['city']);
assert.equal(search({type:'Office'}).length,0);
assert.equal(search({location:'Dubai',type:'Villa'}).length,0);
assert.deepEqual(search({beds:'4-plus'}).map(x=>x.id),['space']);
assert.equal(search({location:'Al Ain',budget:'under-1m'}).length,0);
assert.equal(Object.keys(journeys).length,4);
assert.equal(management.length,3);
assert.equal(transition.length,4);
assert.equal(transition.at(-1).next,null);
assert.equal(clients.filter(x=>x.approved).length,0);
assert.equal(site.email,'Inquiries@adu-re.com');
for(const item of [...Object.values(journeys),...management,...collections,...portfolio]){
  assert.ok(item.alt?.length>10,'Meaningful alternative text');
  for(const suffix of ['.webp','-small.webp'])assert.ok(existsSync(fileURLToPath(new URL('../dist/assets/'+item.image+suffix,import.meta.url))),item.image+suffix);
}
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.equal((html.match(/<section\b/g)||[]).length,10);
assert.equal((html.match(/<h1\b/g)||[]).length,1);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,'No duplicate static IDs');
for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(match[1]),'Anchor destination '+match[1]);
for(const match of html.matchAll(/(?:src|href)="((?:assets\/|styles\.css|app\.js)[^"]*)"/g)){
  assert.ok(existsSync(new URL('../dist/'+match[1],import.meta.url)),match[1]);
}
console.log('Content checks passed: all filters, routes, data dimensions, asset references, image descriptions, ten chapters and unique IDs.');
