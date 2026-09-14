/* One muted player is shared by the opening and hero. Playback is independent
   of the application module, with a still poster when playback is unavailable. */
(() => {
  const video = document.getElementById('hero-video');
  if (!video) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = true;
  video.muted = true;
  video.defaultMuted = true;
  function update() {
    const textOnly = ['pending', 'text'].includes(root.dataset.intro);
    if (reduced.matches || document.hidden || !heroVisible || textOnly) video.pause();
    else if (video.paused) video.play().catch(() => {});
  }
  video.addEventListener('loadeddata', update);
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('pagehide', () => video.pause());
  const opening = new MutationObserver(update);
  opening.observe(root, {attributes:true, attributeFilter:['data-intro']});
  const visibility = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    update();
  });
  visibility.observe(document.getElementById('home'));
  update();
})();
