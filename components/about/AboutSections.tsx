import { useEffect, useRef } from "react";
import aboutContent from "../../data/about.json";

const content = aboutContent;

export function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-title">
      <img src={content.hero.image} alt={content.hero.alt} />
      <div className="about-hero-shade" />
      <div className="section-shell about-hero-inner">
        <span className="about-eyebrow"><b>01</b> {content.hero.eyebrow}</span>
        <h1 id="about-title">
          {content.hero.title.map((line) => <span key={line}>{line}<br /></span>)}
        </h1>
        <p>{content.hero.description}</p>
        <a className="about-scroll-link" href={content.hero.link.href}>
          {content.hero.link.label} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

export function AboutIntroductionSection() {
  return (
    <section className="about-section who-section" id={content.who.id} aria-labelledby="who-title">
      <div className="section-shell about-split">
        <div data-reveal><h2 id="who-title">{content.who.title}</h2></div>
        <div className="about-copy-stack" data-reveal>
          {content.who.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

export function AboutStorySection() {
  const storyLead = content.story.milestones[0];
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="story-section story-tilton-section" aria-labelledby="story-title">
      <StoryAnimation sectionRef={sectionRef} />
      <div className="story-tilton-shell">
        <div className="story-tilton-stage" data-reveal>
          <figure className="story-tilton-image story-tilton-image-left about-image-scale">
            <img src={storyLead.left} alt="Managed waterfront residences" />
          </figure>
          <article className="story-tilton-card">
            <span className="about-eyebrow"><b>03</b> {content.story.eyebrow}</span>
            <p className="story-tilton-year">{storyLead.year}</p>
            <h2 id="story-title">{storyLead.title}</h2>
            {storyLead.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <figure className="story-tilton-image story-tilton-image-right about-image-scale">
            <img src={storyLead.right} alt="Landscaped Abu Dhabi residential community" />
          </figure>
        </div>
        <div className="story-tilton-controls" aria-label="Timeline controls">
          <button className="story-tilton-arrow story-tilton-prev" type="button" aria-label="Previous timeline card" disabled><span aria-hidden="true">←</span></button>
          <button className="story-tilton-arrow story-tilton-next" type="button" aria-label="Next timeline card"><span aria-hidden="true">→</span></button>
        </div>
        <ol className="story-tilton-years" aria-label="ADURE timeline milestones" data-reveal>
          {content.story.milestones.map((milestone, index) => (
            <li key={milestone.year} className={index === 0 ? "is-active" : undefined}>
              <button type="button" data-story-index={index}><span>{milestone.year}</span></button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutScaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="scale-section scale-impact-section" aria-labelledby="scale-title">
      <ScaleAnimation sectionRef={sectionRef} />
      <div className="section-shell scale-impact-shell">
        <div className="scale-impact-metrics" data-reveal>
          {content.scale.metrics.map((metric) => <article key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong></article>)}
        </div>
        <div className="scale-impact-lower" data-reveal>
          <div className="scale-impact-copy">
            <h2 id="scale-title">{content.scale.title}</h2>
            <p>{content.scale.description}</p>
            <div className="scale-city-chips" aria-label="Cities of operation">
              {content.scale.cities.map((city) => <span key={city}>{city}</span>)}
            </div>
          </div>
          <figure className="scale-impact-image about-image-scale"><img src={content.scale.image} alt={content.scale.alt} /></figure>
        </div>
      </div>
    </section>
  );
}

export function AboutBusinessSection() {
  return (
    <section className="business-section" id={content.business.id} aria-labelledby="business-title">
      <div className="section-shell business-layout">
        <div data-reveal>
          <span className="about-eyebrow"><b>06</b> {content.business.eyebrow}</span>
          <h2 id="business-title">{content.business.title}</h2>
          <p>{content.business.description}</p>
        </div>
        <div className="business-grid" data-reveal>
          {content.business.items.map((item, index) => (
            <a key={item.label} href={item.href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><p>{item.description}</p></a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutVisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="vision-section vision-scroll-section" id="vision-scroll" aria-label="ADURE vision and mission">
      <VisionAnimation sectionRef={sectionRef} />
      <div className="vision-scroll-sticky">
        <div className="vision-scroll-media" aria-hidden="true">
          {content.vision.panels.map((panel, index) => <img key={panel.title} className={`vision-scroll-image${index === 0 ? " is-active" : ""}`} src={panel.image} alt="" />)}
        </div>
        <div className="vision-scroll-shade" />
        <h2 className="vision-scroll-title">{content.vision.title}</h2>
        <div className="section-shell vision-scroll-inner">
          <div className="vision-scroll-kicker" aria-hidden="true">OUR</div>
          <div className="vision-scroll-panels">
            {content.vision.panels.map((panel, index) => (
              <article key={panel.title} className={`vision-scroll-panel${index === 0 ? " is-active" : ""}`} data-vision-panel aria-hidden={index === 0 ? "false" : "true"}>
                <h2>{panel.title}</h2><p>{panel.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="values-section values-expedition-section" aria-labelledby="values-title">
      <ValuesAnimation sectionRef={sectionRef} />
      <div className="values-expedition-grid" data-reveal>
        <div className="values-expedition-intro"><span className="about-eyebrow"><b>08</b> {content.values.eyebrow}</span><h2 id="values-title">{content.values.title}</h2></div>
        <div className="values-expedition-list">
          {content.values.items.map((item, index) => <article key={item.title} className={index === 0 ? "is-active" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
        </div>
        <figure className="values-expedition-visual" aria-hidden="true">
          {content.values.items.map((item, index) => <img key={item.image} className={index === 0 ? "is-active" : undefined} src={item.image} alt="" />)}
        </figure>
      </div>
    </section>
  );
}

export function AboutLeadershipSection() {
  return (
    <>
      <section className="ceo-message-section" aria-labelledby="ceo-message-title">
        <div className="section-shell ceo-message-layout" data-reveal>
          <div className="ceo-message-copy"><span className="ceo-quote-mark" aria-hidden="true">“</span><h2 id="ceo-message-title">{content.ceo.title}</h2><p>{content.ceo.description}</p><div className="ceo-signature"><strong>{content.ceo.name}</strong><span>{content.ceo.role}</span></div></div>
        </div>
      </section>
      <section className="leadership-section team-section" aria-labelledby="leadership-title">
        <div className="section-shell team-layout" data-reveal>
          <div className="team-intro"><h2 id="leadership-title">{content.leadership.title}</h2><div className="team-controls" aria-hidden="true"><button type="button" tabIndex={-1}>←</button><button type="button" tabIndex={-1}>→</button></div></div>
          <div className="team-card-grid">
            {content.leadership.people.map((person) => <article className="team-card" key={person.name}><figure className="about-image-scale"><img src={person.image} alt={person.name} /></figure><h3>{person.name}</h3><p>{person.role}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutCustomersSection() {
  return (
    <section className="customers-bridge customers-showcase" aria-labelledby="customers-title">
      <div className="section-shell customers-showcase-layout" data-reveal>
        <div className="customers-showcase-copy"><h2 id="customers-title">{content.customers.title}</h2><p>{content.customers.description}</p><a className="customers-pill" href={content.customers.link.href}>{content.customers.link.label}</a></div>
        <div className="customers-showcase-cards" aria-label="Customer sectors">
          {content.customers.sectors.map((sector) => <article className="customers-sector-card" key={sector.title}><div className="about-image-scale"><img src={sector.image} alt={sector.alt} /></div><h3>{sector.title}</h3></article>)}
        </div>
      </div>
    </section>
  );
}

export function AboutContactSection() {
  return (
    <section className="about-cta final-v2 about-home-banner section" aria-labelledby="contact-title">
      <img src={content.cta.image} alt={content.cta.alt} width="2400" height="1600" loading="lazy" />
      <div className="section-shell" data-reveal>
        <span className="section-index">11 · Contact ADURE</span>
        <div className="final-layout"><div><h2 id="contact-title">{content.cta.title}</h2><p>{content.cta.description}</p></div><div className="final-links" aria-label="Contact actions">{content.cta.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div></div>
      </div>
    </section>
  );
}

type SectionRef = { current: HTMLElement | null };

function StoryAnimation({ sectionRef }: { sectionRef: SectionRef }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const milestones = content.story.milestones;
    const stage = section.querySelector<HTMLElement>(".story-tilton-stage");
    const previous = section.querySelector<HTMLButtonElement>(".story-tilton-prev");
    const next = section.querySelector<HTMLButtonElement>(".story-tilton-next");
    const year = section.querySelector<HTMLElement>(".story-tilton-year");
    const title = section.querySelector<HTMLElement>("#story-title");
    const card = section.querySelector<HTMLElement>(".story-tilton-card");
    const paragraphs = card
      ? Array.from(card.querySelectorAll<HTMLParagraphElement>("p:not(.story-tilton-year)"))
      : [];
    const leftImage = section.querySelector<HTMLImageElement>(".story-tilton-image-left img");
    const rightImage = section.querySelector<HTMLImageElement>(".story-tilton-image-right img");
    const railItems = Array.from(section.querySelectorAll<HTMLLIElement>(".story-tilton-years li"));
    const railButtons = Array.from(section.querySelectorAll<HTMLButtonElement>(".story-tilton-years button"));
    let activeIndex = 0;
    let locked = false;
    let paintTimer: number | undefined;
    let unlockTimer: number | undefined;

    milestones.forEach((milestone) => [milestone.left, milestone.right].forEach((src) => {
      const image = new Image();
      image.src = src;
    }));

    const paint = (index: number) => {
      const milestone = milestones[index];
      if (!milestone) return;
      if (year) year.textContent = milestone.year;
      if (title) title.textContent = milestone.title;
      milestone.body.forEach((copy, copyIndex) => {
        if (paragraphs[copyIndex]) paragraphs[copyIndex].textContent = copy;
      });
      if (leftImage) { leftImage.src = milestone.left; leftImage.alt = milestone.alt; }
      if (rightImage) { rightImage.src = milestone.right; rightImage.alt = milestone.alt; }
      railItems.forEach((item, indexAtItem) => item.classList.toggle("is-active", indexAtItem === index));
      railButtons.forEach((button, indexAtButton) => button.setAttribute("aria-current", indexAtButton === index ? "true" : "false"));
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index === milestones.length - 1;
      activeIndex = index;
    };
    const go = (index: number) => {
      if (locked || index === activeIndex || index < 0 || index >= milestones.length) return;
      locked = true;
      const direction = index > activeIndex ? "next" : "prev";
      section.classList.add(direction === "next" ? "is-moving-next" : "is-moving-prev");
      paintTimer = window.setTimeout(() => {
        paint(index);
        section.classList.remove("is-moving-next", "is-moving-prev");
        stage?.animate(
          [{ transform: `translateX(${direction === "next" ? "10vw" : "-10vw"})`, opacity: 0.62 }, { transform: "translateX(0)", opacity: 1 }],
          { duration: 620, easing: "cubic-bezier(.22,1,.36,1)" },
        );
        unlockTimer = window.setTimeout(() => { locked = false; }, 640);
      }, 360);
    };
    const onPrevious = () => go(activeIndex - 1);
    const onNext = () => go(activeIndex + 1);
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(activeIndex + 1);
      if (event.key === "ArrowLeft") go(activeIndex - 1);
    };
    const onRailClick = (event: Event) => go(Number((event.currentTarget as HTMLButtonElement).dataset.storyIndex));

    previous?.addEventListener("click", onPrevious);
    next?.addEventListener("click", onNext);
    railButtons.forEach((button) => button.addEventListener("click", onRailClick));
    section.addEventListener("keydown", onKeydown);
    paint(0);

    return () => {
      window.clearTimeout(paintTimer);
      window.clearTimeout(unlockTimer);
      previous?.removeEventListener("click", onPrevious);
      next?.removeEventListener("click", onNext);
      railButtons.forEach((button) => button.removeEventListener("click", onRailClick));
      section.removeEventListener("keydown", onKeydown);
    };
  }, [sectionRef]);

  return null;
}

function ScaleAnimation({ sectionRef }: { sectionRef: SectionRef }) {
  useEffect(() => {
    const section = sectionRef.current;
    const metrics = section ? Array.from(section.querySelectorAll<HTMLElement>(".scale-impact-metrics strong")) : [];
    const metricWrap = section?.querySelector<HTMLElement>(".scale-impact-metrics");
    if (!metrics.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = (metric: HTMLElement) => {
      if (metric.dataset.counted === "true") return;
      metric.dataset.counted = "true";
      const target = Number(metric.dataset.target ?? 0);
      const suffix = metric.dataset.suffix ?? "";
      if (reducedMotion) { metric.textContent = `${target}${suffix}`; return; }
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 1300);
        metric.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    metrics.forEach((metric) => {
      const match = (metric.textContent ?? "").trim().match(/([\d,.]+)(.*)/);
      metric.dataset.target = String(match ? Number(match[1].replace(/,/g, "")) : 0);
      metric.dataset.suffix = match?.[2] ?? "";
      metric.textContent = reducedMotion ? `${metric.dataset.target}${metric.dataset.suffix}` : `0${metric.dataset.suffix}`;
    });

    if (!metricWrap || !("IntersectionObserver" in window)) { metrics.forEach(animate); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      metrics.forEach(animate);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(metricWrap);
    return () => observer.disconnect();
  }, [sectionRef]);

  return null;
}

function VisionAnimation({ sectionRef }: { sectionRef: SectionRef }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const images = Array.from(section.querySelectorAll<HTMLElement>(".vision-scroll-image"));
    const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-vision-panel]"));
    let activeStep = -1;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(Math.max(-rect.top, 0), travel) / travel;
      const step = Math.min(panels.length - 1, Math.max(0, Math.round(progress * (panels.length - 1))));
      section.style.setProperty("--vision-progress", progress.toFixed(4));
      section.style.setProperty("--vision-image-y", `${Math.round(progress * 38)}px`);
      if (step === activeStep) return;
      activeStep = step;
      section.dataset.activeStep = String(step);
      images.forEach((image, index) => image.classList.toggle("is-active", index === step));
      panels.forEach((panel, index) => {
        const active = index === step;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
      });
    };
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); };
  }, [sectionRef]);

  return null;
}

function ValuesAnimation({ sectionRef }: { sectionRef: SectionRef }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rows = Array.from(section.querySelectorAll<HTMLElement>(".values-expedition-list article"));
    const images = Array.from(section.querySelectorAll<HTMLElement>(".values-expedition-visual img"));
    let activeIndex = -1;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(Math.max(-rect.top, 0), travel) / travel;
      const targetLine = window.innerHeight * 0.48;
      const closestIndex = rows.reduce((closest, row, index) => {
        const candidateDistance = Math.abs(row.getBoundingClientRect().top + row.offsetHeight * 0.5 - targetLine);
        const closestDistance = Math.abs(rows[closest].getBoundingClientRect().top + rows[closest].offsetHeight * 0.5 - targetLine);
        return candidateDistance < closestDistance ? index : closest;
      }, 0);
      section.style.setProperty("--values-progress", progress.toFixed(4));
      if (closestIndex === activeIndex) return;
      activeIndex = closestIndex;
      section.style.setProperty("--values-active", String(activeIndex));
      rows.forEach((row, index) => { row.classList.toggle("is-active", index === activeIndex); row.classList.toggle("is-before", index < activeIndex); row.classList.toggle("is-after", index > activeIndex); });
      images.forEach((image, index) => image.classList.toggle("is-active", index === activeIndex));
    };
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); };
  }, [sectionRef]);

  return null;
}
