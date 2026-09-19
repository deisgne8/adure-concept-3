import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';

const html=readFileSync(new URL('../dist/properties.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../dist/properties.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../dist/properties.js',import.meta.url),'utf8');

for(const text of ['Find the Right Place','Properties That Match Your Search','Own Property in the UAE?'])assert.ok(html.includes(text),`Missing properties-page content: ${text}`);
assert.ok(!html.includes('class="results-intro"'),'Results intro banner should be removed');
for(const id of ['hero-property-search','filter-panel','property-grid','map-view','empty-state','filter-dialog'])assert.ok(html.includes(`id="${id}"`),`Missing properties-page element: ${id}`);
for(const behaviour of ['setIntent','applyHeroSearch','clearFilters','setView','selectMapProperty','data-favourite'])assert.ok(js.includes(behaviour),`Missing properties interaction: ${behaviour}`);
for(const image of ['assets/hidd-al-saadiyat/saadiyat-aerial-beach.webp','assets/hidd-al-saadiyat/golden-waterfront.webp'])assert.ok(existsSync(new URL(`../dist/${image}`,import.meta.url)),`Missing properties image: ${image}`);
assert.ok(css.includes('@media(max-width:767.98px)'), 'Missing mobile properties layout');
assert.ok(!js.includes('is-featured'),'Property cards should share one equal visual treatment');
assert.ok(css.includes('.map-view'),'Missing map view styling');
console.log('PASS: Properties landing page structure, imagery, responsive layouts and interactions are present.');
