import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type JourneysSectionProps = {
  content: HomeContent["journeys"];
};

export default function JourneysSection({ content }: JourneysSectionProps) {
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
          <div className="journey-grid">
            {content.cards.map((card, index) => (
              <article
                className="journey-card"
                data-aos="fade-up"
                data-aos-delay={200 + index * 140}
                data-aos-offset="120"
                key={card.title}
              >
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
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
