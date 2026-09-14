// RCU reference: image/fade 500ms ease; content reveal 1000ms ease-in-out.
const section = document.querySelector('#transition');
const timeline = section?.querySelector('.timeline-v2');
if (timeline) {
  const panels = [...timeline.querySelectorAll('.timeline-step')];
  const images = ['architecture-detail.webp', 'architecture-facade.webp', 'architecture-waterfront.webp', 'architecture-community.webp'];
  const stages = panels.map((panel, index) => ({
    title: panel.querySelector('h3').textContent,
    week: panel.querySelector('.week').textContent,
    image: images[index]
  }));
  const count = panels.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767.98px)');
  section.classList.add('has-transition-carousel');
  const carousel = document.createElement('div');
  carousel.className = 'transition-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', '30-day transition stages');
  timeline.before(carousel);
  carousel.append(timeline);
  panels.forEach((panel, index) => {
    panel.id = `transition-stage-${index}`;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', `${index + 1} of ${count}`);
    const inner = document.createElement('div');
    inner.className = 'transition-panel-inner';
    inner.append(...panel.childNodes);
    panel.append(inner);
  });
  const rail = document.createElement('div');
  rail.className = 'transition-image-rail';
  const track = document.createElement('div');
  track.className = 'transition-image-track';
  // Three cycles allow both directions to wrap without a visible rewind.
  for (let cycle = 0; cycle < 3; cycle++) {
    stages.forEach((stage, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'transition-image-card';
      card.dataset.position = String(cycle * count + index);
      card.setAttribute('aria-label', `Show ${stage.week}: ${stage.title}`);
      card.setAttribute('aria-controls', `transition-stage-${index}`);
      card.innerHTML = `<img src="assets/${stage.image}" alt="" draggable="false"><span class="transition-image-wash"></span><span class="transition-image-title">${stage.title}</span>`;
      track.append(card);
    });
  }
  rail.append(track);
  carousel.append(rail);
  const controls = document.createElement('div');
  controls.className = 'transition-controls';
  controls.innerHTML = `<span class="transition-pagination" aria-live="polite" aria-atomic="true"></span><button type="button" class="transition-prev" aria-label="Previous transition stage">←</button><button type="button" class="transition-next" aria-label="Next transition stage">→</button>`;
  carousel.after(controls);
  const cards = [...track.children];
  let current = 0, position = count, busy = false, settleTimer, pointer;
  function updateCards() {
    const railRect = rail.getBoundingClientRect();
    const step = railRect.width;
    cards.forEach((card, index) => {
      card.classList.toggle('is-current', index === position);
      const left = railRect.left + (index - position) * step;
      const visible = mobile.matches ? index === position : index !== position - 1 && left + step > 0 && left < document.documentElement.clientWidth;
      card.setAttribute('aria-hidden', String(!visible));
      card.tabIndex = visible && index !== position ? 0 : -1;
    });
  }
  function place(instant = false) {
    track.classList.toggle('is-instant', instant || reduced.matches);
    track.style.transform = `translate3d(${-position * rail.getBoundingClientRect().width}px,0,0)`;
    updateCards();
  }
  function render() {
    panels.forEach((panel, index) => {
      panel.classList.toggle('is-current', index === current);
      panel.setAttribute('aria-hidden', String(index !== current));
      panel.inert = index !== current;
    });
    controls.querySelector('.transition-pagination').innerHTML = `<b>${String(current + 1).padStart(2,'0')}</b><span> / ${String(count).padStart(2,'0')}</span>`;
  }
  function select(nextPosition) {
    if (busy || nextPosition === position) return;
    busy = true;
    position = nextPosition;
    current = ((position % count) + count) % count;
    render();
    place();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      position = count + current;
      place(true);
      busy = false;
    }, reduced.matches ? 0 : 500);
  }
  controls.querySelector('.transition-prev').addEventListener('click', () => select(position - 1));
  controls.querySelector('.transition-next').addEventListener('click', () => select(position + 1));
  rail.addEventListener('click', event => {
    const card = event.target.closest('[data-position]');
    if (card) select(Number(card.dataset.position));
  });
  function handleKeys(event) {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    select(position + (event.key === 'ArrowRight' ? 1 : -1));
  }
  carousel.addEventListener('keydown', handleKeys);
  controls.addEventListener('keydown', handleKeys);
  rail.addEventListener('pointerdown', event => { pointer = {x:event.clientX,y:event.clientY}; });
  rail.addEventListener('pointerup', event => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) select(position + (dx < 0 ? 1 : -1));
  });
  rail.addEventListener('pointercancel', () => { pointer = null; });
  new ResizeObserver(() => { position = count + current; place(true); }).observe(rail);
  render();
  place(true);
}
