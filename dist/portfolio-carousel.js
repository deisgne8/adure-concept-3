import './vendor/smooothy-0.0.35.min.js';

const rail = document.querySelector('#portfolio .portfolio-mosaic');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const cards = [...rail.children];
const portfolioMedia = [
  ['assets/portfolio-waterfront-tower-v2.png', 'Waterfront residential tower in Abu Dhabi'],
  ['assets/portfolio-modern-villa-v2.png', 'Contemporary villa with landscaped pool'],
  ['assets/portfolio-waterfront-plaza-v2.png', 'Waterfront mixed-use plaza at sunset'],
  ['assets/portfolio-garden-community-v2.png', 'Landscaped residential community'],
  ['assets/portfolio-curved-towers-v2.png', 'Curved mixed-use towers in Abu Dhabi']
];

cards.forEach((card, index) => {
  const image = card.querySelector('img');
  const media = portfolioMedia[index];
  if (!image || !media) return;
  image.src = media[0];
  image.alt = media[1];
});
const layers = cards.map(card => ({
  inner: card.querySelector('.portfolio-card'),
  image: card.querySelector('img')
}));

// Same Smooothy settings and center-distance movement as RIO's featured projects.
const carousel = new window.Smooothy(rail, {
  infinite: false,
  snap: true,
  scrollInput: false,
  bounceLimit: 0,
  setOffset: ({wrapperWidth}) => wrapperWidth,
  onResize(instance) {
    instance.target = Math.max(instance.maxScroll, Math.min(0, instance.target));
    instance.current = Math.max(instance.maxScroll, Math.min(0, instance.current));
  },
  onUpdate() {
    const rect = rail.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const distance = Math.max(-1, Math.min(1,
        (box.left + box.width / 2 - center) / (rect.width / 2)));
      layers[index].inner.style.transform = motion.matches ? 'none'
        : `translate3d(0, ${20 * Math.abs(distance) - 10}%, 0)`;
      layers[index].image.style.transform = motion.matches ? 'none'
        : `translate3d(${-10 * distance}%, 0, 0)`;
    });
  }
});
rail.classList.add('is-carousel');

let frame = 0;
let visible = false;
function tick() {
  if (!visible || document.hidden) { frame = 0; return; }
  if (motion.matches) carousel.current = carousel.target;
  carousel.update();
  frame = requestAnimationFrame(tick);
}
function resume() {
  if (visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
}
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  resume();
}).observe(rail);
document.addEventListener('visibilitychange', resume);

rail.addEventListener('wheel', event => {
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
  event.preventDefault();
  carousel.target = Math.max(carousel.maxScroll,
    Math.min(0, carousel.target - event.deltaX * .005));
}, {passive:false});

window.addEventListener('keydown', event => {
  if (!visible || event.altKey || event.metaKey || event.ctrlKey ||
      event.target.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
  const bounds = rail.getBoundingClientRect();
  if (bounds.bottom < 100 || bounds.top > innerHeight * .85) return;
  if (event.key === 'ArrowLeft') carousel.goToPrev();
  else if (event.key === 'ArrowRight') carousel.goToNext();
  else if (rail.contains(event.target) && event.key === 'Home') carousel.target = 0;
  else if (rail.contains(event.target) && event.key === 'End') carousel.target = carousel.maxScroll;
  else return;
  event.preventDefault();
});

// Keep links usable with a keyboard; distinguish a short click from a drag.
let gesture = null;
rail.addEventListener('pointerdown', event => {
  gesture = {x:event.clientX, y:event.clientY, at:performance.now(), moved:false};
});
window.addEventListener('pointermove', event => {
  if (gesture && (Math.abs(event.clientX - gesture.x) > 5 ||
      Math.abs(event.clientY - gesture.y) > 5)) gesture.moved = true;
});
rail.addEventListener('click', event => {
  if (event.detail && gesture && (gesture.moved || performance.now() - gesture.at >= 200)) {
    event.preventDefault();
    event.stopPropagation();
  }
  gesture = null;
}, true);
rail.addEventListener('pointercancel', () => { gesture = null; });
rail.addEventListener('focusin', event => {
  const card = event.target.closest('.portfolio-item-v2');
  if (!card) return;
  const box = card.getBoundingClientRect(), viewport = rail.getBoundingClientRect();
  if (box.left < viewport.left - 1 || box.right > viewport.right + 1) {
    carousel.target = Math.max(carousel.maxScroll, Math.min(0, -cards.indexOf(card)));
  }
});

motion.addEventListener('change', () => carousel.update());
