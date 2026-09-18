import * as THREE from './vendor/three.module.min.js';

const BLUE=0x004789,CYAN=0x00b7f1;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const ease=t=>t*t*t*(t*(t*6-15)+10);
const materials=()=>({
  land:new THREE.MeshStandardMaterial({color:0xe3e8e7,roughness:1}),
  road:new THREE.MeshStandardMaterial({color:0xc6d1d3,roughness:1}),
  walk:new THREE.MeshStandardMaterial({color:0xf8faf7,roughness:1}),
  building:new THREE.MeshStandardMaterial({color:0xf3f5f0,roughness:.92}),
  roof:new THREE.MeshStandardMaterial({color:0xd5dedd,roughness:1}),
  water:new THREE.MeshStandardMaterial({color:0x6c9cb3,roughness:.65,metalness:.08}),
  park:new THREE.MeshStandardMaterial({color:0xc5d5cc,roughness:1}),
  tree:new THREE.MeshStandardMaterial({color:0x9bb4aa,roughness:1}),
});
export function createPortfolioScene({container,markers,onSelect,onFail,reducedMotion}){
  const mobile=matchMedia('(max-width:760px)').matches;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setClearColor(0xeef2f2);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.4:1.75));
  renderer.shadowMap.enabled=!mobile;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.24;
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');container.append(canvas);
  const world=new THREE.Scene();world.background=new THREE.Color(0xeef2f2);
  const camera=new THREE.OrthographicCamera(-80,80,60,-60,.1,500);
  world.add(new THREE.HemisphereLight(0xffffff,0x9eaeb6,2.7));
  const sun=new THREE.DirectionalLight(0xfffaf0,3.4);sun.position.set(-45,100,65);sun.castShadow=!mobile;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-100,right:100,top:100,bottom:-100,near:1,far:230});
  sun.shadow.bias=-.00035;sun.shadow.normalBias=.16;sun.shadow.radius=3;world.add(sun);
  let model=null,city=null,items=[],landmarks=new Map(),markerNodes=[],context=null;
  let visible=false,disposed=false,frame=0,motion=null,selected=null,emphasis=null;
  let current={target:new THREE.Vector3(0,0,0),zoom:1,angle:.55};
  let width=1,height=1,renderCount=0;
  const vector=new THREE.Vector3(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  const events=new AbortController();
  const on=(target,event,handler,options={})=>target.addEventListener(event,handler,{...options,signal:events.signal});
  const invalidate=()=>{if(!frame&&visible&&!disposed)frame=requestAnimationFrame(draw);};
  function applyCamera(){
    camera.zoom=current.zoom;
    camera.position.set(current.target.x+Math.sin(current.angle)*118,101,current.target.z+Math.cos(current.angle)*118);
    camera.lookAt(current.target);camera.updateProjectionMatrix();camera.updateMatrixWorld();
  }
  function moveTo({target,zoom,angle=current.angle},immediate=false,duration=1150){
    const to={target:new THREE.Vector3(...target),zoom:clamp(zoom,.8,2.25),angle};
    if(immediate||reducedMotion){current=to;motion=null;applyCamera();invalidate();return;}
    motion={start:performance.now(),duration,from:{target:current.target.clone(),zoom:current.zoom,angle:current.angle},to};invalidate();
  }
  function updateMarkers(){
    const placed=[];
    // Selected/focused marker wins a screen-space collision. Occluded markers are hidden.
    const ordered=[...markerNodes].sort((a,b)=>(b.item.id===selected?2:b.item.id===emphasis?1:0)-(a.item.id===selected?2:a.item.id===emphasis?1:0));
    for(const entry of ordered){
      vector.copy(entry.anchor).project(camera);
      const x=(vector.x*.5+.5)*width,y=(-vector.y*.5+.5)*height;
      let hide=vector.z<-1||vector.z>1||x<24||x>width-24||y<80||y>height-105;
      if(!hide){
        // Cast to the roof anchor: a nearer roof must not get a floating marker.
        const direction=entry.anchor.clone().sub(camera.position),distance=direction.length();
        raycaster.set(camera.position,direction.normalize());raycaster.far=distance-.8;
        const obstacles=raycaster.intersectObjects(model.children,true);
        hide=obstacles.some(hit=>hit.object.userData.propertyId!==entry.item.id&&hit.distance<distance-.8);
        if(entry.button.matches(':focus-visible'))hide=false;
      }
      if(!hide&&placed.some(p=>Math.hypot(p.x-x,p.y-y)<36))hide=true;
      entry.button.hidden=hide;
      if(!hide){placed.push({x,y});entry.button.style.transform=`translate3d(${(x-22).toFixed(1)}px,${(y-50).toFixed(1)}px,0)`;}
    }
  }
  function draw(now){
    frame=0;if(!visible||disposed)return;
    if(motion){const t=clamp((now-motion.start)/motion.duration,0,1),p=ease(t);current.target.lerpVectors(motion.from.target,motion.to.target,p);current.zoom=THREE.MathUtils.lerp(motion.from.zoom,motion.to.zoom,p);current.angle=THREE.MathUtils.lerp(motion.from.angle,motion.to.angle,p);if(t===1)motion=null;}
    applyCamera();const start=performance.now();renderer.render(world,camera);updateMarkers();
    canvas.dataset.renderCount=String(++renderCount);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.triangles=String(renderer.info.render.triangles);canvas.dataset.renderMs=(performance.now()-start).toFixed(2);canvas.dataset.animating=String(Boolean(motion));canvas.dataset.zoom=current.zoom.toFixed(3);
    if(motion)invalidate();
  }
  function releaseModel(){
    if(!model)return;
    const geometries=new Set(),mats=new Set();model.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)(Array.isArray(object.material)?object.material:[object.material]).forEach(mat=>mats.add(mat));});
    geometries.forEach(geometry=>geometry.dispose());mats.forEach(mat=>mat.dispose());world.remove(model);model=null;
  }
  function buildModel(config,records){
    releaseModel();model=new THREE.Group();world.add(model);landmarks=new Map();
    const mat=materials(),box=new THREE.BoxGeometry(1,1,1);
    let seed=config.seed;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const meshBox=(x,y,z,w,h,d,material,parent=model)=>{const mesh=new THREE.Mesh(box,material);mesh.position.set(x,y+h/2,z);mesh.scale.set(w,h,d);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
    const coast=x=>23+Math.sin(x*.046)*7+Math.cos(x*.08)*2;
    // Each scene is a standalone composition. These boundaries are designed, not surveyed.
    const boundary=[[-75,-51],[75,-51]];
    for(let x=75;x>=-75;x-=3)boundary.push([x,config.type==='garden'?49:coast(x)]);
    const landShape=new THREE.Shape();boundary.forEach(([x,z],i)=>i?landShape.lineTo(x,-z):landShape.moveTo(x,-z));landShape.closePath();
    const land=new THREE.Mesh(new THREE.ExtrudeGeometry(landShape,{depth:.75,bevelEnabled:false}),mat.land);land.rotation.x=-Math.PI/2;land.position.y=-.75;land.receiveShadow=true;model.add(land);
    const water=meshBox(0,-1.3,0,150,.3,105,config.type==='garden'?mat.land:mat.water);water.castShadow=false;
    const roads=[],walks=[],blocks=[],roofs=[],trees=[],parks=[];
    function block(x,z,w,d,h){blocks.push([x,h/2,z,w,h,d]);roofs.push([x,h+.15,z,w*.78,.3,d*.76]);if(h>10)roofs.push([x+.5,h+.8,z,.9,1.3,1.2]);}
    // A legible network of broad streets, pavements, smaller blocks and rooftop volumes.
    for(let x=-66;x<=66;x+=12){
      const depth=(config.type==='garden'?47:coast(x))-(-49);
      roads.push([x,.025,-49+depth/2,2.4,.05,depth]);walks.push([x-1.55,.1,-49+depth/2,.45,.2,depth]);walks.push([x+1.55,.1,-49+depth/2,.45,.2,depth]);
    }
    for(let z=-43;z<=17;z+=12){roads.push([0,.025,z,148,.05,2.4]);walks.push([0,.1,z-1.6,148,.2,.5]);walks.push([0,.1,z+1.6,148,.2,.5]);}
    for(let x=-60;x<=60;x+=12)for(let z=-37;z<=13;z+=12){
      if(records.some(item=>Math.abs(x-item.scenePosition[0])<12&&Math.abs(z-item.scenePosition[2])<12))continue;
      if(config.type==='canal'&&x>12&&x<24)continue;
      const park=random()<.15;
      if(park){parks.push([x,.16,z,8,.3,8]);for(let t=0;t<6;t++)trees.push([x+(random()-.5)*6,1.25,z+(random()-.5)*6,1.2,1.8,1.2]);continue;}
      const tower=config.type==='canal'&&random()>.6;
      for(let dx=-2.3;dx<=2.3;dx+=4.6)for(let dz=-2.3;dz<=2.3;dz+=4.6){
        const h=config.type==='garden'?1.5+random()*3:(tower?8:2)+random()*(tower?12:7);
        block(x+dx,z+dz,2.8+random(),2.6+random(),h);
      }
    }
    // Quay edges and a small marina introduce a calm horizontal counterpoint to the city.
    if(config.type!=='garden'){
      const points=[];for(let x=-74;x<=74;x+=2)points.push(new THREE.Vector3(x,.14,coast(x)-.8));
      const edge=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),90,.32,4,false),mat.walk);model.add(edge);
      for(let x=-35;x<15;x+=16){meshBox(x,-.45,coast(x)+5,.7,.6,11,mat.walk);meshBox(x+3,-.25,coast(x)+6,6,.25,.6,mat.walk);}
    }
    if(config.type==='canal'){
      meshBox(19,.02,-15,5,.05,68,mat.water);
      for(const z of [-31,-7,17])meshBox(19,.35,z,7,.7,3,mat.walk);
    }
    if(config.type==='garden'){
      parks.push([0,.12,33,120,.2,18]);
      for(let x=-60;x<61;x+=5)for(let z=28;z<=40;z+=5)trees.push([x,1.6,z,2,2.8,2]);
      for(let z=29;z<=41;z+=12)roads.push([0,.3,z,144,.1,1.2]);
    }
    function instance(geometry,material,list,shadow=true){
      if(!list.length)return null;const mesh=new THREE.InstancedMesh(geometry,material,list.length),dummy=new THREE.Object3D();
      list.forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=shadow;mesh.receiveShadow=true;mesh.computeBoundingSphere();model.add(mesh);return mesh;
    }
    instance(box,mat.road,roads,false);instance(box,mat.walk,walks,false);context=instance(box,mat.building,blocks);instance(box,mat.roof,roofs);instance(box,mat.park,parks,false);
    // Faceted canopy geometry keeps vegetation architectural and inexpensive.
    instance(new THREE.IcosahedronGeometry(.65,0),mat.tree,trees);
    for(const record of records){
      const [x,,z]=record.scenePosition,group=new THREE.Group();group.position.set(x,0,z);group.userData.propertyId=record.id;model.add(group);
      const blue=new THREE.MeshStandardMaterial({color:BLUE,roughness:.73,metalness:.06});
      const trim=new THREE.MeshStandardMaterial({color:0x739aaf,roughness:.8});
      meshBox(0,.05,0,11,.5,10,mat.walk,group);
      let anchorY;
      if(record.form==='terraces'){
        for(let floor=0;floor<7;floor++){
          const w=9-floor*.52,d=7.5-floor*.25;
          meshBox(floor*.18,.6+floor*1.45,0,w,1.36,d,blue,group);
          meshBox(floor*.18,1.9+floor*1.45,0,w+.45,.16,d+.45,trim,group);
        }anchorY=11.7;
      }else if(record.form==='tower'){
        meshBox(0,.55,0,9,2.2,8,blue,group);
        meshBox(-1,2.75,-.5,5.5,16,5.5,blue,group);
        meshBox(2.5,2.75,1,2.5,10,4,blue,group);
        for(let floor=1;floor<12;floor++)meshBox(-1,2.75+floor*1.32,-.5,5.65,.13,5.65,trim,group);
        meshBox(-1,18.75,-.5,4.6,.3,4.6,trim,group);anchorY=20.5;
      }else{
        meshBox(-3.4,.55,0,2.4,5.7,8.4,blue,group);meshBox(3.4,.55,0,2.4,5.7,8.4,blue,group);
        meshBox(0,.55,-3,4.5,5.7,2.4,blue,group);meshBox(0,.55,3,4.5,3.8,2.4,blue,group);
        meshBox(0,.6,0,4.5,.15,3.5,mat.park,group);
        for(let f=1;f<=3;f++){meshBox(-3.4,.55+f*1.8,0,2.6,.12,8.6,trim,group);meshBox(3.4,.55+f*1.8,0,2.6,.12,8.6,trim,group);}anchorY=8;
      }
      group.traverse(object=>{object.userData.propertyId=record.id;});
      landmarks.set(record.id,{group,material:blue,trim,anchor:new THREE.Vector3(x,anchorY,z)});
    }
  }
  function setCity(config,records){
    if(disposed)return;city=config;items=records;selected=null;emphasis=null;motion=null;
    buildModel(config,records);markers.replaceChildren();markerNodes=[];
    records.forEach((item,i)=>{
      const button=document.createElement('button');button.type='button';button.className='pm-marker';button.dataset.property=item.id;
      button.setAttribute('aria-label',`Select ${item.name}, illustrative study`);button.setAttribute('aria-pressed','false');button.setAttribute('aria-controls','pm-details');button.style.setProperty('--marker-delay',`${i*70}ms`);
      const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
      const label=document.createElement('b');label.textContent=item.name;label.setAttribute('aria-hidden','true');button.append(number,label);markers.append(button);
      markerNodes.push({button,item,anchor:landmarks.get(item.id).anchor});
    });
    current={target:new THREE.Vector3(...config.overview.target),zoom:config.overview.zoom,angle:config.angle};resize();invalidate();
  }
  function resize(){
    if(disposed)return;const rect=container.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const changed=width!==rect.width||height!==rect.height;
    width=rect.width;height=rect.height;
    if(changed)renderer.setSize(width,height,false);
    // Keep the whole model in frame at narrow widths without flattening its height.
    const aspect=width/height,halfWidth=aspect<1?87:83,halfHeight=halfWidth/aspect;
    camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfHeight;camera.bottom=-halfHeight;
    applyCamera();invalidate();
  }
  function emphasize(id,hover){
    selected=id;emphasis=hover;
    landmarks.forEach((item,key)=>{item.material.color.setHex(key===id?CYAN:key===hover?0x237aac:BLUE);item.trim.color.setHex(key===id?0x8fdaec:key===hover?0xa4c1cf:0x739aaf);});invalidate();
  }
  // Mouse drag is rotation only. Touch and wheel gestures retain normal page scrolling.
  let drag=null;
  on(canvas,'pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag={x:event.clientX,startX:event.clientX,y:event.clientY,angle:current.angle,moved:false};canvas.setPointerCapture(event.pointerId);motion=null;});
  on(canvas,'pointermove',event=>{if(!drag)return;const delta=event.clientX-drag.x;drag.moved=drag.moved||Math.abs(event.clientX-drag.startX)>4;current.angle=clamp(current.angle-delta*.006,city.angle-1.1,city.angle+1.1);drag.x=event.clientX;invalidate();});
  on(canvas,'pointerup',event=>{
    const moved=drag?.moved;drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    if(moved)return;const bounds=canvas.getBoundingClientRect();pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-((event.clientY-bounds.top)/bounds.height)*2+1);
    raycaster.setFromCamera(pointer,camera);raycaster.far=500;const hits=raycaster.intersectObjects(model.children,true);
    const hit=hits[0];if(hit?.object.userData.propertyId)onSelect(hit.object.userData.propertyId);
  });
  on(canvas,'pointercancel',()=>{drag=null;});
  on(canvas,'webglcontextlost',event=>{event.preventDefault();onFail(new Error('WebGL context lost'));});
  const observer=new ResizeObserver(resize);observer.observe(container);
  function setVisible(value){visible=value;canvas.dataset.sceneVisible=String(value);if(!value){cancelAnimationFrame(frame);frame=0;if(motion){current=motion.to;motion=null;}return;}resize();invalidate();}
  function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);events.abort();observer.disconnect();releaseModel();sun.shadow.dispose();renderer.dispose();canvas.remove();markers.replaceChildren();}
  return {
    setCity,resize,emphasize,setVisible,dispose,
    enter(immediate){if(immediate)return;current.zoom=.92;moveTo(city.overview,false,900);},
    select(item,immediate){if(!item)return;moveTo(item.cameraPreset,immediate);},
    reset(immediate){moveTo({...city.overview,angle:city.angle},immediate);},
    setReducedMotion(value){reducedMotion=value;if(value&&motion){current=motion.to;motion=null;invalidate();}},
    control(action,immediate){const destination=motion?.to||current;const next={target:destination.target.toArray(),zoom:destination.zoom,angle:destination.angle};if(action==='zoom-in')next.zoom+=.2;if(action==='zoom-out')next.zoom-=.2;if(action==='rotate-left')next.angle=clamp(next.angle-.22,city.angle-1.1,city.angle+1.1);if(action==='rotate-right')next.angle=clamp(next.angle+.22,city.angle-1.1,city.angle+1.1);moveTo(next,immediate,420);},
  };
}
