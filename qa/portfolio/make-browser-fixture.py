from pathlib import Path
root=Path(__file__).resolve().parents[2]
html=(root/'dist/index.html').read_text()
injection='''<script>
// Temporary browser QA fixture only; never included in the production homepage.
const qaMode=new URLSearchParams(location.search);
if(qaMode.has('reduce')){const original=window.matchMedia.bind(window);window.matchMedia=query=>query.includes('prefers-reduced-motion')?Object.assign(new EventTarget(),{matches:true,media:query,addListener(){},removeListener(){}}):original(query);}
if(qaMode.has('no-webgl')){const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};}
addEventListener('load',()=>{
  const panel=document.createElement('div');panel.style='position:fixed;bottom:0;left:0;z-index:999999;background:white;padding:8px;border:1px solid #004789';
  const loss=document.createElement('button');loss.textContent='QA: lose WebGL context';loss.onclick=()=>{const canvas=document.querySelector('#pm-canvas canvas');const gl=canvas?.getContext('webgl2');gl?.getExtension('WEBGL_lose_context')?.loseContext();};
  const broken=document.createElement('button');broken.textContent='QA: missing image';broken.onclick=()=>document.querySelector('#pm-detail-image').src='assets/qa-missing.webp';
  const report=document.createElement('output');report.id='qa-report';
  const measure=document.createElement('button');measure.textContent='QA: measure camera';measure.onclick=()=>{
    let prev=performance.now(),gaps=[],renders=[];const canvas=document.querySelector('#pm-canvas canvas'),start=performance.now();document.querySelector('#pm-properties button').click();
    function sample(now){gaps.push(now-prev);prev=now;renders.push(Number(canvas.dataset.renderMs));if(now-start<1600)requestAnimationFrame(sample);else {gaps.shift();report.textContent=JSON.stringify({samples:gaps.length,averageFrameInterval:gaps.reduce((a,b)=>a+b,0)/gaps.length,maxFrameInterval:Math.max(...gaps),maxRenderCPU:Math.max(...renders),renderCount:canvas.dataset.renderCount,drawCalls:canvas.dataset.drawCalls,triangles:canvas.dataset.triangles});}}
    requestAnimationFrame(sample);
  };
  panel.append(loss,broken,measure,report);document.body.append(panel);
});
</script>'''
(root/'dist/portfolio-qa.html').write_text(html.replace('<head>','<head>'+injection))
print('Temporary fixture: http://127.0.0.1:4175/portfolio-qa.html')
