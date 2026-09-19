const proofSection = document.querySelector('#proof');

if (proofSection) {
  const statistics = [...proofSection.querySelectorAll('.proof-statistic dd')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasAnimated = false;

  const counters = [
    { target: 2002, render: value => String(value) },
    { target: 1800, render: value => `${value}+` },
    { target: 200, render: value => `${value}+` },
    { target: 98, render: value => `${value}%` },
    { target: 2, render: value => `${Math.min(1, value)}–${value} <small>weeks</small>` }
  ].map((counter, index) => ({ ...counter, element: statistics[index] }));

  function animateCounter({ element, target, render }, startTime, duration) {
    if (!element) return;

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.innerHTML = render(value);

      if (progress < 1) requestAnimationFrame(tick);
      else element.innerHTML = render(target);
    };

    requestAnimationFrame(tick);
  }

  function startCounters() {
    if (hasAnimated || reducedMotion) return;
    hasAnimated = true;

    counters.forEach(counter => {
      if (!counter.element) return;
      counter.element.setAttribute('aria-label', counter.element.textContent.trim());
      counter.element.innerHTML = counter.render(0);
    });

    const startTime = performance.now();
    counters.forEach(counter => animateCounter(counter, startTime, 1500));
  }

  function startAfterIntroduction() {
    const introduction = document.querySelector('#site-intro');
    if (!introduction || introduction.hidden) {
      startCounters();
      return;
    }

    const introductionObserver = new MutationObserver(() => {
      if (!introduction.hidden) return;
      introductionObserver.disconnect();
      startCounters();
    });
    introductionObserver.observe(introduction, { attributes: true, attributeFilter: ['hidden'] });
  }

  if (!reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      startAfterIntroduction();
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });

    observer.observe(proofSection);
  }
}
