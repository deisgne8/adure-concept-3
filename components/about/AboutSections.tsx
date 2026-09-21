import { useEffect, useRef, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { aosSequenceDelay } from "../../lib/aos";

type InnerBannerContent = typeof import("../../data/about/inner-banner.json");
type IntroductionContent = typeof import("../../data/about/introduction.json");
type StoryContent = typeof import("../../data/about/story.json");
type GuidesContent = typeof import("../../data/about/guides.json");
type CeoContent = typeof import("../../data/about/ceo.json");
type LeadershipContent = typeof import("../../data/about/leadership.json");
type ContactContent = typeof import("../../data/about/contact.json");

export function InnerBanner({ innerBanner }: { innerBanner: InnerBannerContent }) {
  return (
    <section className="about-hero" aria-labelledby="about-title">
      <img src={innerBanner.backgroundImage} alt="" style={{ objectPosition: innerBanner.backgroundPosition }} />
      <div className="about-hero-shade" />
      <div className="section-shell about-hero-inner">
        <span className="about-eyebrow" data-aos="fade-up"><b>{innerBanner.eyebrow.slice(0, 2)}</b>{innerBanner.eyebrow.slice(2)}</span>
        <h1 id="about-title" data-aos="fade-up">{innerBanner.heading.map((line) => <span key={line}>{line}<br /></span>)}</h1>
        <p data-aos="fade-up" data-aos-delay="100">{innerBanner.description}</p>
        <a className="about-scroll-link" href={innerBanner.scrollAction.href} data-aos="fade-up" data-aos-delay="200">
          {innerBanner.scrollAction.label} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

export function AboutIntroductionSection({ introduction }: { introduction: IntroductionContent }) {
  return (
    <section className="about-section who-section" id={introduction.id} aria-labelledby="who-title">
      <div className="section-shell about-split">
        <div data-aos="fade-right"><h2 id="who-title" className="type-guides-heading">{introduction.title}</h2></div>
        <div className="about-copy-stack" data-aos="fade-left">
          {introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

export function AboutStorySection({ story }: { story: StoryContent }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageFrameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const frame = imageFrameRef.current;

    if (!image || !frame) return undefined;

    let frameId = 0;
    let isInView = frame.getBoundingClientRect().bottom > 0 && frame.getBoundingClientRect().top < window.innerHeight;

    const updateParallax = () => {
      frameId = 0;
      if (!isInView) return;

      const bounds = frame.getBoundingClientRect();
      const frameCenter = bounds.top + bounds.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const travelRange = (window.innerHeight + bounds.height) / 2;
      const progress = Math.max(-1, Math.min(1, (viewportCenter - frameCenter) / travelRange));
      const offset = progress * 42;
      image.style.setProperty("--story-parallax-offset", `${offset}px`);
    };

    const requestUpdate = () => {
      if (isInView && !frameId) frameId = window.requestAnimationFrame(updateParallax);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      if (isInView) requestUpdate();
    }, { rootMargin: "15% 0px" });

    observer.observe(frame);
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      image.style.removeProperty("--story-parallax-offset");
    };
  }, []);

  return (
    <section className="story-section story-tilton-section" aria-labelledby="story-title">
      <div className="section-shell story-tilton-shell">
        <div className="story-tilton-stage">
          <figure ref={imageFrameRef} className="story-tilton-image story-tilton-image-left about-image-scale"><img ref={imageRef} className="story-parallax-image" src={story.image} alt={story.imageAlt} /></figure>
          <article className="story-tilton-card" data-aos="fade-left">
            <span className="about-eyebrow">{story.eyebrow}</span>
            <p className="story-tilton-year">{story.year}</p>
            <h2 id="story-title" className="type-guides-heading">{story.heading}</h2>
            {story.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        </div>
      </div>
    </section>
  );
}

export function AboutGuidesSection({ guides }: { guides: GuidesContent }) {
  const valuesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = valuesRef.current;
    const track = container?.querySelector<HTMLElement>(".guides-values-grid");
    const cards = track ? Array.from(track.querySelectorAll<HTMLElement>("article")) : [];
    if (!container || !track || cards.length < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = 0;
    let paused = false;

    const maxIndex = () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || track.clientWidth;
      const visible = Math.max(1, Math.floor(track.clientWidth / cardWidth));
      return Math.max(0, cards.length - visible);
    };
    const setIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
      const maximum = maxIndex();
      activeIndex = index > maximum ? 0 : Math.max(0, index);
      const target = cards[activeIndex];
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior });
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === activeIndex));
    };
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    const resize = () => setIndex(activeIndex, "auto");

    setIndex(0, "auto");
    const timer = reducedMotion ? undefined : window.setInterval(() => {
      if (!paused && !document.hidden) setIndex(activeIndex + 1);
    }, 3200);
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("focusin", pause);
    container.addEventListener("focusout", resume);
    container.addEventListener("pointerdown", pause);
    container.addEventListener("pointerup", resume);
    container.addEventListener("pointercancel", resume);
    window.addEventListener("resize", resize);

    return () => {
      if (timer) window.clearInterval(timer);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("focusin", pause);
      container.removeEventListener("focusout", resume);
      container.removeEventListener("pointerdown", pause);
      container.removeEventListener("pointerup", resume);
      container.removeEventListener("pointercancel", resume);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="guides-section" aria-labelledby="guides-title">
      <div className="section-shell guides-shell">
        <header className="guides-head" data-aos="fade-up"><span className="about-eyebrow">{guides.eyebrow}</span><h2 id="guides-title" className="type-guides-heading">{guides.heading}</h2></header>
        <div className="guides-beliefs" aria-label="ADURE vision and mission">
          {guides.beliefs.map((belief, index) => <article data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)} key={belief.title}><img className="guides-belief-icon" src={belief.icon} alt="" aria-hidden="true" /><span>{belief.title}</span><p>{belief.description}</p></article>)}
        </div>
        <div ref={valuesRef} className="guides-values" aria-labelledby="guides-values-title">
          <span className="guides-values-kicker" id="guides-values-title">{guides.values.heading}</span>
          <div className="guides-values-grid">
            {guides.values.items.map((value, index) => (
              <div className="aos-card-reveal" key={value.heading} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>
              <article className={index === 0 ? "is-featured" : undefined}>
                <span className="value-icon" aria-hidden="true"><svg><use href={`/assets/about-value-icons.svg#${value.icon}`} /></svg></span>
                <figure className="guides-value-image about-image-scale"><img src={value.image} alt={value.imageAlt} loading="lazy" /></figure>
                <div><h3>{value.heading}</h3><p>{value.description}</p></div>
              </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutCeoMessageSection({ ceo }: { ceo: CeoContent }) {
  return (
    <section
      className="ceo-message-section ceo-message-light"
      aria-labelledby="ceo-message-title"
      style={{ "--ceo-message-background": `url("${ceo.backgroundImage}")` } as CSSProperties}
    >
      <div className="section-shell ceo-message-light-layout">
        <figure className="ceo-message-light-portrait about-image-scale" data-aos="fade-right"><img src={ceo.image} alt={ceo.imageAlt} /></figure>
        <div className="ceo-message-light-copy" data-aos="fade-left">
          <h2 id="ceo-message-title">{ceo.heading}</h2>
          {ceo.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="ceo-signature"><strong>{ceo.name}</strong><span>{ceo.position}</span></p>
        </div>
      </div>
    </section>
  );
}

export function AboutLeadershipSection({ leadership }: { leadership: LeadershipContent }) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="leadership-section team-section" aria-labelledby="leadership-title">
      <div className="section-shell team-layout">
        <div className="team-intro" data-aos="fade-up">
          <h2 id="leadership-title">{leadership.heading}</h2><p>{leadership.description}</p>
          <div className="team-controls" aria-label="Leadership carousel controls">
            <button className="team-prev" type="button" aria-label={leadership.controls.previous} onClick={() => swiperRef.current?.slidePrev()}>←</button>
            <button className="team-next" type="button" aria-label={leadership.controls.next} onClick={() => swiperRef.current?.slideNext()}>→</button>
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            className="team-card-grid"
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{
              1024: { spaceBetween: 20 },
              1440: { spaceBetween: 21 },
              1600: { spaceBetween: 22 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              requestAnimationFrame(() => swiper.update());
            }}
          >
            {leadership.people.map((person) => <SwiperSlide className="team-card" key={person.name}><figure className="about-image-scale"><img src={person.image} alt={person.name} /></figure><h3>{person.name}</h3><p>{person.position}</p></SwiperSlide>)}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export function AboutContactSection({ contact }: { contact: ContactContent }) {
  return (
    <section className="about-cta final-v2 about-home-banner section" aria-labelledby="contact-title">
      <img src={contact.image} alt={contact.alt} loading="lazy" />
      <div className="section-shell">
        <span className="section-index">{contact.index}</span>
        <div className="final-layout" data-aos="fade-up">
          <div><h2 id="contact-title">{contact.title}</h2><p>{contact.description}</p></div>
          <div className="final-links" aria-label="Contact actions">{contact.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div>
        </div>
      </div>
    </section>
  );
}
