import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import useBannerEntrance from "../ui/useBannerEntrance";
type InnerBannerContent = (typeof import("../../data/about/inner-banner.json"));
type IntroductionContent = (typeof import("../../data/about/introduction.json"));
type StoryContent = (typeof import("../../data/about/story.json"));
type ScaleContent = (typeof import("../../data/about/scale.json"));
type BusinessContent = (typeof import("../../data/about/business.json"));
type VisionContent = (typeof import("../../data/about/vision.json"));
type ValuesContent = (typeof import("../../data/about/values.json"));
type LeadershipContent = (typeof import("../../data/about/leadership.json"));
type CustomersContent = (typeof import("../../data/about/customers.json"));
type ContactContent = (typeof import("../../data/about/contact.json"));

export function InnerBanner({ innerBanner }: { innerBanner: InnerBannerContent }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  useBannerEntrance(bannerRef);
  return (
    <section className="about-hero" aria-labelledby="about-title">
      <img
        src={innerBanner.backgroundImage}
        alt=""
        style={{ objectPosition: innerBanner.backgroundPosition }}
      />
      <div className="about-hero-shade" />
      <div ref={bannerRef} className="section-shell about-hero-inner page-banner-enter">
        <h1 id="about-title">
          {innerBanner.heading.map((line) => <span key={line}>{line}<br /></span>)}
        </h1>
        <p>{innerBanner.description}</p>
      </div>
    </section>
  );
}

export function AboutIntroductionSection({ introduction }: { introduction: IntroductionContent }) {
  useEffect(() => {
    void import("aos").then(({ default: AOS }) => {
      AOS.init({
        duration: 850,
        easing: "ease-out-cubic",
        offset: 80,
        once: true,
      });
      AOS.refreshHard();
    });
  }, []);

  return (
    <section className="about-section who-section" id={introduction.id} aria-labelledby="who-title">
      <div className="section-shell about-split">
        <div data-aos="fade-right"><h2 id="who-title">{introduction.title}</h2></div>
        <div className="about-copy-stack" data-aos="fade-left">
          {introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

export function AboutStorySection({ story }: { story: StoryContent }) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section className="story-section story-tilton-section" aria-labelledby="story-title">
      <div className="story-tilton-shell story-carousel">
        <div className="story-carousel-top" aria-label="Story carousel controls">
          <button className="story-tilton-arrow story-carousel-prev" type="button" aria-label="Previous story" onClick={() => swiperRef.current?.slidePrev()}><ArrowRight aria-hidden="true" className="button-arrow" /></button>
          <div className="story-carousel-viewport">
            <Swiper
              className="story-swiper"
              modules={[Autoplay]}
              slidesPerView={1.1}
              spaceBetween={24}
              loop
              speed={800}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              onSwiper={(instance) => { swiperRef.current = instance; }}
              onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
            >
              {story.milestones.map((milestone, index) => (
                <SwiperSlide key={milestone.year}>
                  <article className="story-tilton-stage">
                    <figure className="story-tilton-image story-tilton-image-left about-image-scale"><img src={milestone.image} alt="" /></figure>
                    <div className="story-tilton-card">
                      <p className="story-tilton-year">{milestone.year}</p>
                      <h2 id={index === 0 ? "story-title" : undefined}>{milestone.heading}</h2>
                      {milestone.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <button className="story-tilton-arrow story-carousel-next" type="button" aria-label="Next story" onClick={() => swiperRef.current?.slideNext()}><ArrowRight aria-hidden="true" className="button-arrow" /></button>
        </div>
        <div className="story-carousel-bottom">
          <ol className="story-tilton-years" aria-label="Story milestones">
            {story.milestones.map((milestone, index) => (
              <li key={milestone.year} className={index === activeIndex ? "is-active" : undefined}>
                <button type="button" onClick={() => swiperRef.current?.slideToLoop(index)}>{milestone.year}</button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function AboutScaleSection({ scale }: { scale: ScaleContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="scale-section scale-impact-section" aria-labelledby="scale-title">
      <ScaleAnimation sectionRef={sectionRef} />
      <div className="section-shell scale-impact-shell">
        <div className="scale-impact-metrics" data-reveal>
          {scale.metrics.map((metric) => <article key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong></article>)}
        </div>
        <div className="scale-impact-lower" data-reveal>
          <div className="scale-impact-copy">
            <h2 id="scale-title">{scale.title}</h2>
            <p>{scale.description}</p>
            <div className="scale-city-chips" aria-label="Cities of operation">
              {scale.cities.map((city) => <span key={city}>{city}</span>)}
            </div>
          </div>
          <figure className="scale-impact-image about-image-scale"><img src={scale.image} alt={scale.alt} /></figure>
        </div>
      </div>
    </section>
  );
}

export function AboutBusinessSection({ business }: { business: BusinessContent }) {
  return (
    <section className="business-section" id={business.id} aria-labelledby="business-title">
      <div className="section-shell business-layout">
        <div data-reveal>
          <span className="about-eyebrow"><b>06</b> {business.eyebrow}</span>
          <h2 id="business-title">{business.title}</h2>
          <p>{business.description}</p>
        </div>
        <div className="business-grid" data-reveal>
          {business.items.map((item, index) => (
            <a key={item.label} href={item.href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><p>{item.description}</p></a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutVisionSection({ vision }: { vision: VisionContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="vision-section vision-scroll-section" id="vision-scroll" aria-label="ADURE vision and mission">
      <VisionAnimation sectionRef={sectionRef} />
      <div className="vision-scroll-sticky">
        <div className="vision-scroll-media" aria-hidden="true">
          {vision.panels.map((panel, index) => <img key={panel.title} className={`vision-scroll-image${index === 0 ? " is-active" : ""}`} src={panel.image} alt="" />)}
        </div>
        <div className="vision-scroll-shade" />
        <h2 className="vision-scroll-title">{vision.title}</h2>
        <div className="section-shell vision-scroll-inner">
          <div className="vision-scroll-kicker" aria-hidden="true">OUR</div>
          <div className="vision-scroll-panels">
            {vision.panels.map((panel, index) => (
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

export function AboutValuesSection({ values }: { values: ValuesContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="values-section values-expedition-section" aria-labelledby="values-title">
      <ValuesAnimation sectionRef={sectionRef} />
      <div className="values-expedition-grid" data-reveal>
        <div className="values-expedition-intro"><span className="about-eyebrow"><b>08</b> {values.eyebrow}</span><h2 id="values-title">{values.title}</h2></div>
        <div className="values-expedition-list">
          {values.items.map((item, index) => <article key={item.title} className={index === 0 ? "is-active" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
        </div>
        <figure className="values-expedition-visual" aria-hidden="true">
          {values.items.map((item, index) => <img key={item.image} className={index === 0 ? "is-active" : undefined} src={item.image} alt="" />)}
        </figure>
      </div>
    </section>
  );
}

export function AboutLeadershipSection({ leadership }: { leadership: LeadershipContent }) {
  return (
    <>
      <section className="ceo-message-section" aria-labelledby="ceo-message-title">
        <div className="section-shell ceo-message-layout" data-reveal>
          <div className="ceo-message-copy"><span className="ceo-quote-mark" aria-hidden="true">“</span><h2 id="ceo-message-title">{leadership.ceo.title}</h2><p>{leadership.ceo.description}</p><div className="ceo-signature"><strong>{leadership.ceo.name}</strong><span>{leadership.ceo.role}</span></div></div>
        </div>
      </section>
      <section className="leadership-section team-section" aria-labelledby="leadership-title">
        <div className="section-shell team-layout" data-reveal>
          <div className="team-intro"><h2 id="leadership-title">{leadership.leadership.title}</h2><div className="team-controls" aria-hidden="true"><button type="button" tabIndex={-1}>←</button><button type="button" tabIndex={-1}>→</button></div></div>
          <div className="team-card-grid">
            {leadership.leadership.people.map((person) => <article className="team-card" key={person.name}><figure className="about-image-scale"><img src={person.image} alt={person.name} /></figure><h3>{person.name}</h3><p>{person.role}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutCustomersSection({ customers }: { customers: CustomersContent }) {
  return (
    <section className="customers-bridge customers-showcase" aria-labelledby="customers-title">
      <div className="section-shell customers-showcase-layout" data-reveal>
        <div className="customers-showcase-copy"><h2 id="customers-title">{customers.title}</h2><p>{customers.description}</p><a className="customers-pill" href={customers.link.href}>{customers.link.label}</a></div>
        <div className="customers-showcase-cards" aria-label="Customer sectors">
          {customers.sectors.map((sector) => <article className="customers-sector-card" key={sector.title}><div className="about-image-scale"><img src={sector.image} alt={sector.alt} /></div><h3>{sector.title}</h3></article>)}
        </div>
      </div>
    </section>
  );
}

export function AboutContactSection({ contact }: { contact: ContactContent }) {
  return (
    <section className="about-cta final-v2 about-home-banner section" aria-labelledby="contact-title">
      <img src={contact.image} alt={contact.alt} width="2400" height="1600" loading="lazy" />
      <div className="section-shell" data-reveal>
        <span className="section-index">11 · Contact ADURE</span>
        <div className="final-layout"><div><h2 id="contact-title">{contact.title}</h2><p>{contact.description}</p></div><div className="final-links" aria-label="Contact actions">{contact.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div></div>
      </div>
    </section>
  );
}

type SectionRef = { current: HTMLElement | null };

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
