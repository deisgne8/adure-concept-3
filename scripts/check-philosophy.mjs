import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
await mkdir('qa/philosophy',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:960}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4180/?v=elyse-philosophy#philosophy');
await page.evaluate(()=>document.fonts.ready);
async function scrollStage(index){
 await page.evaluate(index=>{const stage=document.querySelector('.philosophy-stage'),sticky=document.querySelector('.philosophy-sticky');const start=stage.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(sticky).top);scrollTo({top:start+(stage.offsetHeight-sticky.offsetHeight)*(index+.3)/3,behavior:'instant'});},index);
 await page.waitForTimeout(1350);
}
for (let index=0;index<3;index++){
 await scrollStage(index);
 assert.equal(await page.locator('.principle.is-active').getAttribute('data-philosophy-step'),String(index));
 assert.equal(await page.locator('.philosophy-image-pair.is-active').getAttribute('data-philosophy-pair'),String(index));
 assert.equal(await page.locator('#philosophy .principle p').count(),3);
 await page.screenshot({path:`qa/philosophy/desktop-${index}.png`});
}
await page.getByRole('button',{name:'Show Market clarity',exact:true}).click();
await page.waitForTimeout(1400);
assert.equal(await page.locator('.principle.is-active').getAttribute('data-philosophy-step'),'0');
for(const width of [360,390,768]){
 await page.setViewportSize({width,height:844});
 await page.locator('.philosophy-sticky').scrollIntoViewIfNeeded();
 await page.getByRole('button',{name:'Show Everyday performance',exact:true}).click();
 await page.waitForTimeout(1300);
 assert.equal(await page.locator('.principle.is-active').getAttribute('data-philosophy-step'),'1');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#philosophy').screenshot({path:`qa/philosophy/mobile-${width}.png`});
}
await page.setViewportSize({width:1440,height:960});
await page.emulateMedia({reducedMotion:'reduce'});
await page.getByRole('button',{name:'Show Long-term protection',exact:true}).click();
assert.equal(await page.locator('.principle.is-active').getAttribute('data-philosophy-step'),'2');
assert.ok(await page.locator('.philosophy-stage').evaluate(el=>el.offsetHeight<1200));
assert.deepEqual(errors,[]);
await browser.close();
console.log('PASS: all three scroll chapters, desktop navigation, touch layouts at 360/390/768px, restored short copy, reduced-motion navigation, and no browser errors.');
