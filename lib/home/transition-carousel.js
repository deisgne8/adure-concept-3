const section = document.querySelector('#transition');
const shell = section?.querySelector('.section-shell');
const heading = section?.querySelector('.transition-head');
const timeline = section?.querySelector('.timeline-v2');

if (section && shell && heading && timeline) {
  const panels = [...timeline.querySelectorAll('.timeline-step')];
  const crops = ['0 0 764 507', '772 0 764 507', '0 516 764 508', '772 516 764 508'];
  const stages = panels.map((panel, index) => ({
    title: panel.querySelector('h3').textContent.trim(),
    week: panel.querySelector('.week').textContent.trim(),
    crop: crops[index]
  }));
  const count = stages.length;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  const header = document.querySelector('.site-header');

  section.classList.add('has-transition-carousel');

  const carousel = document.createElement('div');
  carousel.className = 'transition-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', '30-day transition stages');

  const visual = document.createElement('div');
  visual.className = 'transition-visual';
  const visualSlides = stages.map((stage, index) => {
    const figure = document.createElement('figure');
    figure.className = 'transition-visual-slide';
    figure.setAttribute('role', 'img');
    figure.setAttribute('aria-label', `${stage.week}: ${stage.title}`);
    figure.innerHTML = index === 2
      ? '<img src="assets/hidd-al-saadiyat/transition-takeover-pool.jpg" width="2000" height="1333" alt="" decoding="async">'
      : `
      <svg viewBox="${stage.crop}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <image href="assets/transition-stages.png" width="1536" height="1024" />
      </svg>`;
    figure.dataset.stage = String(index);
    visual.append(figure);
    return figure;
  });

  const content = document.createElement('div');
  content.className = 'transition-content';

  panels.forEach((panel, index) => {
    panel.id = `transition-stage-${index}`;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-roledescription', 'slide');
    panel.setAttribute('aria-label', `${index + 1} of ${count}`);
    const inner = document.createElement('div');
    inner.className = 'transition-panel-inner';
    inner.append(...panel.childNodes);
    panel.append(inner);
  });

  const navigation = document.createElement('nav');
  navigation.className = 'transition-step-nav';
  navigation.setAttribute('aria-label', 'Transition stages');
  const navigationButtons = stages.map((stage, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show ${stage.week}: ${stage.title}`);
    button.setAttribute('aria-controls', `transition-stage-${index}`);
    button.innerHTML = `<span>${stage.week}</span><strong>${stage.title}</strong>`;
    button.addEventListener('click', () => navigate(index));
    navigation.append(button);
    return button;
  });

  const footer = document.createElement('div');
  footer.className = 'transition-footer';
  const link = shell.querySelector(':scope > .btn');
  if (link) footer.append(link);

  content.append(heading, timeline, footer, navigation);
  carousel.append(visual, content);
  shell.append(carousel);

  let current = 0;
  let pointer = null;
  let scrollFrame = 0;
  let scrollStep = 1;
  let headerHeight = 0;

  function render() {
    panels.forEach((panel, index) => {
      const active = index === current;
      panel.classList.toggle('is-current', active);
      panel.setAttribute('aria-hidden', String(!active));
      panel.inert = !active;
    });

    visualSlides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle('is-current', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    navigationButtons.forEach((button, index) => {
      const active = index === current;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

  }

  function select(index) {
    const next = Math.max(0, Math.min(count - 1, index));
    if (next === current) return;
    current = next;
    render();
  }

  function syncScroll() {
    scrollFrame = 0;
    if (!section.classList.contains('has-transition-scroll')) return;
    const distance = headerHeight - section.getBoundingClientRect().top;
    select(Math.floor((distance + scrollStep * .08) / scrollStep));
  }

  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll);
  }

  function measure() {
    const enabled = desktop.matches;
    section.classList.toggle('has-transition-scroll', enabled);
    if (!enabled) {
      section.style.removeProperty('--transition-top');
      section.style.removeProperty('--transition-stage-height');
      section.style.removeProperty('--transition-scroll-distance');
      return;
    }
    headerHeight = header?.getBoundingClientRect().height || 0;
    const stageHeight = Math.max(520, window.innerHeight - headerHeight);
    scrollStep = Math.max(300, stageHeight * .72);
    section.style.setProperty('--transition-top', `${headerHeight}px`);
    section.style.setProperty('--transition-stage-height', `${stageHeight}px`);
    section.style.setProperty('--transition-scroll-distance', `${scrollStep * count}px`);
    syncScroll();
  }

  function navigate(index, focus = false) {
    const next = Math.max(0, Math.min(count - 1, index));
    if (section.classList.contains('has-transition-scroll')) {
      const top = scrollY + section.getBoundingClientRect().top - headerHeight + scrollStep * (next + .12);
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    } else select(next);
    if (focus) navigationButtons[next].focus({ preventScroll: true });
  }

  carousel.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    navigate(current + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  carousel.addEventListener('pointerdown', event => {
    pointer = { x: event.clientX, y: event.clientY };
  });
  carousel.addEventListener('pointerup', event => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) navigate(current + (dx < 0 ? 1 : -1));
  });
  carousel.addEventListener('pointercancel', () => { pointer = null; });

  render();
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', measure, { passive: true });
  desktop.addEventListener('change', measure);
  if (header) new ResizeObserver(measure).observe(header);
  measure();
}
