import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useBannerEntrance from "../ui/useBannerEntrance";

type InnerBannerContent = typeof import("../../data/about/inner-banner.json");
type IntroductionContent = typeof import("../../data/about/introduction.json");
type StoryContent = typeof import("../../data/about/story.json");
type GuidesContent = typeof import("../../data/about/guides.json");
type CeoContent = typeof import("../../data/about/ceo.json");
type LeadershipContent = typeof import("../../data/about/leadership.json");
type ContactContent = typeof import("../../data/about/contact.json");

export function InnerBanner({ innerBanner }: { innerBanner: InnerBannerContent }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  useBannerEntrance(bannerRef);

  return (
    <section className="about-hero" aria-labelledby="about-title">
      <img src={innerBanner.backgroundImage} alt="" style={{ objectPosition: innerBanner.backgroundPosition }} />
      <div className="about-hero-shade" />
      <div ref={bannerRef} className="section-shell about-hero-inner page-banner-enter">
        <h1 id="about-title">{innerBanner.heading.map((line) => <span key={line}>{line}<br /></span>)}</h1>
        <p>{innerBanner.description}</p>
      </div>
    </section>
  );
}

export function AboutIntroductionSection({ introduction }: { introduction: IntroductionContent }) {
  useEffect(() => {
    void import("aos").then(({ default: AOS }) => {
      AOS.init({ duration: 850, easing: "ease-out-cubic", offset: 80, once: true });
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
  return (
    <section className="story-section story-tilton-section" aria-labelledby="story-title">
      <div className="section-shell story-tilton-shell">
        <div className="story-tilton-stage" data-reveal>
          <figure className="story-tilton-image story-tilton-image-left about-image-scale"><img src={story.image} alt={story.imageAlt} /></figure>
          <article className="story-tilton-card">
            <h2 id="story-title">{story.heading}</h2>
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
        <header className="guides-head"><h2 id="guides-title">{guides.heading}</h2></header>
        <div className="guides-beliefs" aria-label="ADURE vision and mission">
          {guides.beliefs.map((belief) => <article key={belief.title}><img className="guides-belief-icon" src={belief.icon} alt="" aria-hidden="true" /><span>{belief.title}</span><p>{belief.description}</p></article>)}
        </div>
        <div className="guides-values" aria-labelledby="guides-values-title">
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
        <figure className="ceo-message-light-portrait about-image-scale"><img src={ceo.image} alt={ceo.imageAlt} /></figure>
        <div className="ceo-message-light-copy">
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
        <div className="team-intro">
          <h2 id="leadership-title">{leadership.heading}</h2><p>{leadership.description}</p>
        </div>
        <Swiper className="team-card-grid" slidesPerView={1.15} spaceBetween={0} breakpoints={{ 640: { slidesPerView: 2.2 }, 960: { slidesPerView: 4 } }}>
          {leadership.people.map((person) => <SwiperSlide className="team-card" key={person.name}><figure className="about-image-scale"><img src={person.image} alt={person.name} /></figure><h3>{person.name}</h3><p>{person.position}</p></SwiperSlide>)}
        </Swiper>
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
        <div className="final-layout">
          <div><h2 id="contact-title">{contact.title}</h2><p>{contact.description}</p></div>
          <div className="final-links" aria-label="Contact actions">{contact.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div>
        </div>
      </div>
    </section>
  );
}
