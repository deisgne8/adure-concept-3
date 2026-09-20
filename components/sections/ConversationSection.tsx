import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";
import { aosSequenceDelay } from "../../lib/aos";

type ConversationSectionProps = {
  content: HomeContent["conversation"];
};

export default function ConversationSection({
  content,
}: ConversationSectionProps) {
  return (
    <>
      <Section
        className="final-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <img
          src={content.image.src}
          alt={content.image.alt}
          width={content.image.width}
          height={content.image.height}
          loading="lazy"
        />
        <div className="section-shell" data-aos="fade-up">
          <div className="final-layout">
            <div>
              <h2>{content.heading}</h2>
              <p>{content.description}</p>
            </div>
            <div className="final-links">
              {content.links.map((link, index) => (
                <a href={link.href} key={link.text} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
