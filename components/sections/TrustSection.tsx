import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";
import { aosSequenceDelay } from "../../lib/aos";

type TrustSectionProps = {
  content: HomeContent["trust"];
};

type TrustGroup = HomeContent["trust"]["groups"][number];

function LogoRun({ group, duplicate = false }: { group: TrustGroup; duplicate?: boolean }) {
  return (
    <div className="client-logo-run" aria-hidden={duplicate || undefined}>
      {group.clients.map((client) => (
        <div
          className="client-logo"
          key={`${group.id}-${client.name}-${duplicate ? "duplicate" : "primary"}`}
          aria-hidden={duplicate || undefined}
        >
          <img
            src={client.logo}
            alt={duplicate ? "" : client.name}
            loading="eager"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

export default function TrustSection({ content }: TrustSectionProps) {
  return (
    <Section
      className="trust-v2 section"
      id={content.id}
      spacing={content.spacing}
    >
      <header className="trust-logo-head">
        <h2 className="trust-logo-title" data-aos="fade-up">{content.heading}</h2>
        <p className="trust-logo-intro" data-aos="fade-up" data-aos-delay="100">{content.description}</p>
      </header>

      <div className="client-logo-groups">
        {content.groups.map((group, index) => (
          <section
            className="client-logo-group"
            aria-labelledby={group.id}
            key={group.id}
            data-aos="fade-up"
            data-aos-delay={aosSequenceDelay(index)}
          >
            <h3 id={group.id}>{group.heading}</h3>
            <div className={`client-logo-viewport${group.reverse ? " reverse" : ""}`}>
              <div className="client-logo-track">
                <LogoRun group={group} />
                <LogoRun group={group} duplicate />
              </div>
            </div>
          </section>
        ))}
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <Button
          className="trust-logo-cta"
          href={content.button.href}
          variant={content.button.variant as ButtonVariant}
        >
          {content.button.text}
        </Button>
      </div>
    </Section>
  );
}
