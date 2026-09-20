import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

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
        <h2 className="trust-logo-title">{content.heading}</h2>
        <p className="trust-logo-intro">{content.description}</p>
      </header>

      <div className="client-logo-groups">
        {content.groups.map((group) => (
          <section
            className="client-logo-group"
            aria-labelledby={group.id}
            key={group.id}
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

      <Button
        className="trust-logo-cta"
        href={content.button.href}
        variant={content.button.variant as ButtonVariant}
      >
        {content.button.text}
      </Button>
    </Section>
  );
}
