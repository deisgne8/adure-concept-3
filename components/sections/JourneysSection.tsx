import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";
import { aosSequenceDelay } from "../../lib/aos";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type JourneysSectionProps = {
  content: HomeContent["journeys"];
};

type JourneyCardData = HomeContent["journeys"]["cards"][number];

function JourneyCard({ card }: { card: JourneyCardData }) {
  return (
    <article className="journey-card">
      {card.image.src && (
        <div className="journey-media">
          <img src={card.image.src} alt={card.image.alt} />
        </div>
      )}
      <div className="journey-content">
        <h3>{card.title}</h3>
        <div className="journey-details">
          <div className="journey-details-inner">
            <p>{card.description}</p>
            {card.button.text && card.button.href && (
              <Button href={card.button.href} variant={card.button.variant as ButtonVariant}>
                {card.button.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function JourneyGrid({ cards }: { cards: JourneyCardData[] }) {
  return (
    <div className="journey-grid">
      {cards.map((card, index) => (
        <div
          className="journey-card-reveal"
          data-aos="fade-up"
          data-aos-delay={aosSequenceDelay(index)}
          data-aos-offset="120"
          key={card.title}
        >
          <JourneyCard card={card} />
        </div>
      ))}
    </div>
  );
}

function JourneySwiper({ cards }: { cards: JourneyCardData[] }) {
  return (
    <Swiper
      autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
      className="journey-swiper"
      modules={[Autoplay]}
      slidesPerView="auto"
      spaceBetween={16}
    >
      {cards.map((card, index) => (
        <SwiperSlide
          className="journey-card-reveal"
          data-aos="fade-up"
          data-aos-delay={aosSequenceDelay(index)}
          data-aos-offset="120"
          key={card.title}
        >
          <JourneyCard card={card} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function JourneysSection({ content }: JourneysSectionProps) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023.98px)");
    const updateViewport = () => setIsCompact(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (!content.heading && !content.description && content.cards.length === 0)
    return null;

  return (
    <>
      <Section
        className="journey-section section"
        id={content.id}
        spacing={content.spacing}
      >
        <div className="section-shell">
          <div className="journey-heading">
            {content.heading && (
              <h2 data-aos="fade-up" data-aos-offset="120">
                {content.heading}
              </h2>
            )}
            {content.description && (
              <p data-aos="fade-up" data-aos-delay="100" data-aos-offset="120">
                {content.description}
              </p>
            )}
          </div>
          {isCompact ? <JourneySwiper cards={content.cards} /> : <JourneyGrid cards={content.cards} />}
        </div>
      </Section>
    </>
  );
}
