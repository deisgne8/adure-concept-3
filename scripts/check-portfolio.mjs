import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {cities,approvedProperties,demoProperties,modelReference,propertiesForCity} from '../dist/portfolio-data.js';
assert.equal(new Set(demoProperties.map(p=>p.id)).size,demoProperties.length,'Stable IDs must be unique');
assert.equal(approvedProperties.length,0,'No property identities are currently approved');
assert.equal(modelReference.geographicOrigin,null,'Illustrative models must not claim a georeference');
for(const city of cities){
  assert.ok(propertiesForCity(city.id).length,'Each demonstration city has selectable studies');
  for(const item of propertiesForCity(city.id)){
    assert.equal(item.dataStatus,'demo');
    assert.equal(item.latitude,null);assert.equal(item.longitude,null);
    assert.equal(item.detailUrl,null,'Do not publish unapproved property links');
    assert.ok(existsSync(new URL('../dist/'+item.image,import.meta.url)),item.image);
    assert.ok(item.alt.length>15);
    assert.equal(item.modelNodeId,item.id);
    assert.deepEqual(item.cameraPreset.target,item.scenePosition,'Selection frames its own model location');
    assert.ok(item.scenePosition.every(Number.isFinite));
  }
}
console.log('Portfolio checks passed: independent city records, stable model IDs, valid photography, camera alignment, and explicit demo/approval boundaries.');
