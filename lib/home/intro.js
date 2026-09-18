/* Independent from app.js: a failed application module cannot strand the intro.
   No library, network dependency, artificial progress counter or stored state. */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById('site-intro');
  if (!root.dataset.intro || !intro) return;

  const controller = new AbortController();
  const animations = [];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const background = [...document.querySelectorAll('.site-header, main, .footer, .skip-link')];
  const previousInert = background.map(element => element.inert);
  const hero = document.getElementById('home');
  const video = hero.querySelector('.hero-video');
  const videoStyle = video.getAttribute('style');
  const media = intro.querySelector('.intro-media');
  const masks = [...media.querySelectorAll('.intro-mask')];
  const before = intro.querySelector('.intro-before');
  const after = intro.querySelector('.intro-after');
  let finished = false;
  let measuredViewport = null;
  const previousScrollRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';
  scrollTo({top:0,behavior:'instant'});

  function resetVideo() {
    animations.filter(animation => animation.effect?.target === video).forEach(animation => animation.cancel());
    video.classList.remove('intro-visual');
    if (videoStyle === null) video.removeAttribute('style');
    else video.setAttribute('style', videoStyle);
  }

  function finish() {
    if (finished) return;
    finished = true;
    const hadFocus = intro.contains(document.activeElement);
    clearTimeout(window.adureOpening?.timer);
    animations.forEach(animation => animation.cancel());
    resetVideo();
    controller.abort();
    delete root.dataset.intro;
    history.scrollRestoration = previousScrollRestoration;
    intro.style.removeProperty('display');
    intro.style.removeProperty('pointer-events');
    intro.style.removeProperty('background');
    background.forEach((element, index) => { element.inert = previousInert[index]; });
    if (hadFocus) document.querySelector('.brand').focus({preventScroll:true});
    delete window.adureOpening;
  }
  window.adureOpening.finish = finish;

  const listen = (target, name, callback, options = {}) => target.addEventListener(name, callback, {...options, signal:controller.signal});
  const pause = time => new Promise(resolve => setTimeout(resolve, time));
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, {fill:'both', ...options});
    animations.push(animation);
    return animation.finished.catch(() => {});
  };

  background.forEach(element => { element.inert = true; });
  listen(intro.querySelector('.intro-skip'), 'click', finish);
  listen(document, 'keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
  });
  listen(window, 'resize', () => {
    // WebViews emit a startup resize even when their dimensions did not change.
    // Only cancel a running composition for an actual viewport change.
    if (measuredViewport && (Math.abs(innerWidth - measuredViewport.width) > 2 ||
        Math.abs(innerHeight - measuredViewport.height) > 2)) finish();
  });
  listen(window, 'hashchange', finish);
  listen(window, 'scroll', () => {
    if (location.hash && location.hash !== '#home') { finish(); return; }
    // A fresh opening starts at the hero, including WebView scroll restoration.
    if (root.dataset.intro && scrollY > 0) scrollTo({top:0,behavior:'instant'});
    else if (!root.dataset.intro && scrollY > 0) finish();
  }, {passive:true});
  listen(window, 'pagehide', finish);
  listen(motion, 'change', () => { if (motion.matches) finish(); });

  async function play() {
    // A frame from the supplied video is the fallback while it buffers.
    const poster = new Image();
    poster.src = video.poster;
    await Promise.race([
      Promise.all([document.fonts.load('400 64px "Fira Sans"'), poster.decode()]).catch(() => {}),
      pause(1000)
    ]);
    if (finished) return;
    if (motion.matches) { finish(); return; }
    scrollTo({top:0,behavior:'instant'});

    root.dataset.intro = 'text';
    const lockup = intro.querySelector('.intro-lockup');
    if (lockup.scrollWidth > lockup.clientWidth) intro.classList.add('intro-stacked');
    const slot = intro.querySelector('.intro-image-slot').getBoundingClientRect();
    const viewport = intro.getBoundingClientRect();
    measuredViewport = {width:innerWidth,height:innerHeight};
    const target = hero.querySelector('.hero-sticky').getBoundingClientRect();
    const targetWidth = target.width;
    const targetHeight = target.height;
    const heroStyle = getComputedStyle(video);
    const objectPosition = heroStyle.objectPosition;
    const targetScale = Number(heroStyle.transform.match(/^matrix\(([^,]+)/)?.[1]) || 1;
    const smallScale = Math.max(slot.width / targetWidth, slot.height / targetHeight);
    const x = slot.left + (slot.width - targetWidth * smallScale) / 2;
    const y = slot.top + (slot.height - targetHeight * smallScale) / 2;
    const stacked = getComputedStyle(lockup).flexDirection === 'column';
    const beforeRect = before.getBoundingClientRect();
    const afterRect = after.getBoundingClientRect();
    const phraseGap = stacked ? afterRect.top - beforeRect.bottom : afterRect.left - beforeRect.right;
    const textGap = parseFloat(getComputedStyle(before).fontSize) * (stacked ? .14 : .24);
    const closeGap = Math.max(0, (phraseGap - textGap) / 2);
    const compactBefore = stacked ? `translate(0px, ${closeGap}px)` : `translate(${closeGap}px, 0px)`;
    const compactAfter = stacked ? `translate(0px, ${-closeGap}px)` : `translate(${-closeGap}px, 0px)`;
    const closed = {
      left:stacked ? slot.left : slot.left + slot.width / 2,
      right:stacked ? slot.right : slot.left + slot.width / 2,
      top:stacked ? slot.top + slot.height / 2 : slot.top,
      bottom:stacked ? slot.top + slot.height / 2 : slot.bottom
    };
    const fullX = targetWidth * (1 - targetScale) / 2;
    const fullY = targetHeight * (1 - targetScale) / 2;
    const lerp = (from, to, progress) => from + (to - from) * progress;
    const smooth = progress => {
      const p = Math.max(0, Math.min(1, progress));
      return p * p * (3 - 2 * p);
    };
    const move = (horizontal, vertical) => `translate3d(${horizontal}px, ${vertical}px, 0px)`;
    const maskTransforms = (box, overlap) => [
      move(0, box.top - viewport.height + overlap),
      move(0, box.bottom - overlap),
      move(box.left - viewport.width + overlap, 0),
      move(box.right - overlap, 0)
    ];

    // Keep the player in the hero's DOM for the entire sequence. Four opaque
    // shutters reveal it using compositor transforms, not a repainting clip-path.
    video.style.width = targetWidth + 'px';
    video.style.height = targetHeight + 'px';
    video.style.objectPosition = objectPosition;
    video.style.transform = `${move(x, y)} scale(${smallScale})`;
    video.classList.add('intro-visual');
    maskTransforms(closed, 1).forEach((transform, index) => { masks[index].style.transform = transform; });
    media.style.visibility = 'visible';
    intro.style.background = 'transparent';

    // Start with a complete, compact sentence: no video or reserved gap.
    // Measuring the final layout once keeps the insertion on the compositor.
    const enter = transform => [
      {opacity:0, transform:`${transform} translateY(20px)`},
      {opacity:1, transform}
    ];
    const textEntrance = {duration:650, easing:'cubic-bezier(.22,.61,.36,1)'};
    animate(before, enter(compactBefore), textEntrance);
    animate(after, enter(compactAfter), textEntrance);
    await pause(1000);
    if (finished) return;

    // Warm the decoder while the text is still alone behind closed shutters.
    root.dataset.intro = 'preparing';
    await pause(250);
    if (finished) return;

    // Match the reference's editorial beat: open the video between the words,
    // hold that completed composition, then begin a steady fullscreen move.
    // Frames are computed once; no per-frame JS, layout or video moves.
    const openingDuration = 800;
    const holdDuration = 800;
    const expansionStart = openingDuration + holdDuration;
    const expansionDuration = 1700;
    const duration = expansionStart + expansionDuration;
    const videoFrames = [], beforeFrames = [], afterFrames = [];
    const maskFrames = masks.map(() => []);
    const exitDistance = (stacked ? viewport.height : viewport.width) * .07;
    for (let index = 0; index <= 66; index++) {
      const offset = index / 66;
      const time = duration * offset;
      const opening = smooth(time / openingDuration);
      // Start enlarging at full travel speed as the text makes room. Only
      // soften the final 10%, avoiding a second ease-in that looks like a pause.
      const growth = Math.max(0, (time - expansionStart) / expansionDuration);
      const expansion = growth < .9 ? growth / .95 : 1 - (1 - growth) ** 2 / .19;
      const box = {
        left:lerp(lerp(closed.left, slot.left, opening), 0, expansion),
        right:lerp(lerp(closed.right, slot.right, opening), viewport.width, expansion),
        top:lerp(lerp(closed.top, slot.top, opening), 0, expansion),
        bottom:lerp(lerp(closed.bottom, slot.bottom, opening), viewport.height, expansion)
      };
      maskTransforms(box, 1 - expansion).forEach((transform, side) => { maskFrames[side].push({offset,transform}); });
      videoFrames.push({offset,transform:`${move(lerp(x, fullX, expansion), lerp(y, fullY, expansion))} scale(${lerp(smallScale, targetScale, expansion)})`});
      const shift = closeGap * (1 - opening) - exitDistance * expansion;
      const opacity = 1 - smooth((time - expansionStart) / 450);
      beforeFrames.push({offset,opacity,transform:stacked ? move(0, shift) : move(shift, 0)});
      afterFrames.push({offset,opacity,transform:stacked ? move(0, -shift) : move(-shift, 0)});
    }
    root.dataset.intro = 'inserting';
    const timing = {duration,easing:'linear'};
    const expansionComplete = Promise.all([
      ...masks.map((mask, index) => animate(mask, maskFrames[index], timing)),
      animate(video, videoFrames, timing),
      animate(before, beforeFrames, timing),
      animate(after, afterFrames, timing)
    ]);
    await pause(openingDuration);
    if (finished) return;
    root.dataset.intro = 'holding';
    await pause(holdDuration);
    if (finished) return;
    root.dataset.intro = 'expanding';
    await expansionComplete;
    if (finished) return;

    // The video is already in its final place: no reparent, seek or play restart.
    // Only now introduce the contrast layer and page furniture.
    resetVideo();
    root.classList.add('opening-arrived');
    delete root.dataset.intro;
    background.forEach((element, index) => { element.inert = previousInert[index]; });
    intro.style.display = 'grid';
    intro.style.pointerEvents = 'none';
    const reveal = [{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}];
    const arrival = [
      animate(intro, [{opacity:1},{opacity:0}], {duration:450}),
      animate(hero.querySelector('.hero-shade'), [{opacity:0},{opacity:1}], {duration:450}),
      animate(document.querySelector('.site-header'), reveal, {duration:650,delay:220,easing:'ease-out'}),
      animate(hero.querySelector('h1'), reveal, {duration:700,delay:130,easing:'ease-out'}),
      animate(hero.querySelector('.hero-kicker'), reveal, {duration:550,delay:330,easing:'ease-out'}),
      animate(hero.querySelector('.hero-bottom'), reveal, {duration:650,delay:440,easing:'ease-out'}),
      animate(hero.querySelector('.hero-foot'), reveal, {duration:550,delay:560,easing:'ease-out'})
    ];
    await Promise.all(arrival);
    intro.style.removeProperty('display');
    finish();
  }
  play().catch(finish);
})();
