import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
        <h1 id="about-title" data-aos="fade-up">{innerBanner.heading.map((line) => <span key={line}>{line}<br /></span>)}</h1>
        <p data-aos="fade-up" data-aos-delay="120">{innerBanner.description}</p>
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
        <div className="story-tilton-stage" data-reveal>
          <figure ref={imageFrameRef} className="story-tilton-image story-tilton-image-left about-image-scale" data-aos="fade-right"><img ref={imageRef} className="story-parallax-image" src={story.image} alt={story.imageAlt} /></figure>
          <article className="story-tilton-card" data-aos="fade-left">
            <h2 id="story-title" className="type-guides-heading">{story.heading}</h2>
            {story.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        </div>
      </div>
    </section>
  );
}

export function AboutGuidesSection({ guides }: { guides: GuidesContent }) {
  return (
    <section className="guides-section" aria-labelledby="guides-title">
      <div className="section-shell guides-shell" data-reveal>
        <header className="guides-head" data-aos="fade-up"><h2 id="guides-title" className="type-guides-heading">{guides.heading}</h2></header>
        <div className="guides-beliefs" aria-label="ADURE vision and mission">
          {guides.beliefs.map((belief, index) => <article data-aos="fade-up" data-aos-delay={index * 100} key={belief.title}><img className="guides-belief-icon" src={belief.icon} alt="" aria-hidden="true" /><span>{belief.title}</span><p>{belief.description}</p></article>)}
        </div>
        <div className="guides-values" aria-labelledby="guides-values-title" data-aos="fade-up">
          <span className="guides-values-kicker" id="guides-values-title">{guides.values.heading}</span>
          <div className="guides-values-grid">
            {guides.values.items.map((value) => (
              <article key={value.heading}>
                <span className="value-icon" aria-hidden="true"><svg><use href={`/assets/about-value-icons.svg#${value.icon}`} /></svg></span>
                <div><h3>{value.heading}</h3><p>{value.description}</p></div>
              </article>
            ))}
          </div>
          <figure className="guides-values-image about-image-scale"><img src={guides.values.image} alt={guides.values.imageAlt} /></figure>
        </div>
      </div>
    </section>
  );
}

export function AboutCeoMessageSection({ ceo }: { ceo: CeoContent }) {
  return (
    <section className="ceo-message-section ceo-message-light" aria-label="Chief executive message">
      <div className="section-shell ceo-message-light-layout" data-reveal>
        <figure className="ceo-message-light-portrait about-image-scale" data-aos="fade-right"><img src={ceo.image} alt={ceo.imageAlt} /></figure>
        <div className="ceo-message-light-copy" data-aos="fade-left">
          {ceo.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="ceo-signature"><strong>{ceo.name}</strong><span>{ceo.position}</span></p>
        </div>
      </div>
    </section>
  );
}

export function AboutLeadershipSection({ leadership }: { leadership: LeadershipContent }) {
  return (
    <section className="leadership-section team-section" aria-labelledby="leadership-title">
      <div className="section-shell team-layout" data-reveal>
        <div className="team-intro" data-aos="fade-up">
          <h2 id="leadership-title">{leadership.heading}</h2><p>{leadership.description}</p>
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper className="team-card-grid" slidesPerView={1.15} spaceBetween={0} breakpoints={{ 640: { slidesPerView: 2.2 }, 960: { slidesPerView: 4 } }}>
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
      <div className="section-shell" data-reveal>
        <span className="section-index">{contact.index}</span>
        <div className="final-layout" data-aos="fade-up">
          <div><h2 id="contact-title">{contact.title}</h2><p>{contact.description}</p></div>
          <div className="final-links" aria-label="Contact actions">{contact.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div>
        </div>
      </div>
    </section>
  );
}
