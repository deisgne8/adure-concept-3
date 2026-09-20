import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type ManagementSectionProps = { content: HomeContent["management"] };

export default function ManagementSection({ content }: ManagementSectionProps) {
  return (
    <Section className="management-v2 section" id={content.id} spacing={content.spacing}>
      <div className="section-shell">
        <div className="management-layout-v2">
          <figure className="management-visual-v2" data-aos="fade-up">
            <img src={content.image.src} alt={content.image.alt} width="1600" height="1066" />
            <figcaption>One connected approach across every part of the asset.</figcaption>
          </figure>
          <div className="management-copy-v2">
            <h2 className="management-context" data-aos="fade-up">{content.heading}</h2>
            <p className="intro management-context" data-aos="fade-up" data-aos-delay="80">{content.description}</p>
            <div className="management-carousel-copy">
              <div className="service-rows">
                {content.cards.map((card, index) => (
                  <article className="service-row is-active" data-aos="fade-up" data-aos-delay={index * 90} key={card.title}>
                    <div><h3>{card.title}</h3><p>{card.description}</p></div>
                  </article>
                ))}
              </div>
            </div>
            <Button className="management-main-cta" href={content.button.href} variant={content.button.variant as ButtonVariant}>
              {content.button.text}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
