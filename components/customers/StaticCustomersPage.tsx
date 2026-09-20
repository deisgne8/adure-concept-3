import type { HomeContent } from "../../lib/home/load-home-content";
import type { CustomersContent } from "../../lib/customers/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import CustomerAssetCarousel from "./CustomerAssetCarousel";
import CustomerCommitmentStack from "./CustomerCommitmentStack";

type Props = { content: CustomersContent; site: HomeContent["site"] };

export default function StaticCustomersPage({ content, site }: Props) {
  return (
    <div className="customers-page">
      <SiteChrome content={site} currentPath="/customers" homeHref="/" skipTargetId="customers-main" standalone />
      <main id="customers-main">
        <section className="customers-hero" aria-labelledby="customers-title">
          <img src={content.hero.image} alt={content.hero.imageAlt} fetchPriority="high" />
          <div className="customers-hero-shade" />
          <div className="section-shell customers-hero-inner">
            <h1 id="customers-title" data-aos="fade-up">
              {content.hero.headingLines.map((line, index) => <span key={line}>{index > 0 ? <br /> : null}{line}</span>)}
            </h1>
            {content.hero.paragraphs.map((paragraph, index) => <p data-aos="fade-up" data-aos-delay={100 + index * 80} key={paragraph}>{paragraph}</p>)}
            <a className="customers-hero-cta" href={content.hero.cta.href} data-aos="fade-up" data-aos-delay="260">{content.hero.cta.label}<span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="customer-groups pt_100 pb_100" aria-label="Client groups">
          <div className="section-shell customer-group-grid">
            {content.clientGroups.map((group) => (
              <article className="customer-logo-panel" id={group.id} key={group.title}>
                <div className="customer-panel-copy" data-aos="fade-up">
                  <h3>{group.title}</h3>
                  {group.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <ul className="customer-logo-grid" aria-label={`${group.title} clients`} data-aos="fade-up" data-aos-delay="100">
                  {group.logos.map((logo) => (
                    <li key={logo.name}><img src={logo.image} alt={logo.name} loading="lazy" decoding="async" /></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="customer-sectors pt_100 pb_100" aria-labelledby="sectors-title">
          <div className="section-shell customer-sectors-layout">
            <div className="customer-section-intro" data-aos="fade-right">
              <h2 id="sectors-title">{content.sectors.heading}</h2>
              <p>{content.sectors.description}</p>
            </div>
            <CustomerAssetCarousel items={content.sectors.items} />
          </div>
        </section>

        <section className="customer-commitment" aria-labelledby="commitment-title">
          <div className="section-shell commitment-layout">
            <div className="customer-section-intro" data-aos="fade-right">
              <h2 id="commitment-title">{content.commitment.heading}</h2>
              <p>{content.commitment.description}</p>
            </div>
            <CustomerCommitmentStack items={content.commitment.items} />
          </div>
        </section>

        <section className="customer-perspectives pt_100 pb_100" aria-labelledby="perspectives-title">
          <div className="section-shell perspectives-layout">
            <div className="perspectives-intro" data-aos="fade-right"><h2 id="perspectives-title">{content.testimonial.heading}</h2></div>
            <article className="perspectives-quote-card" aria-label="Client testimonial" data-aos="fade-left">
              <blockquote>{content.testimonial.quote}</blockquote>
              <p>{content.testimonial.description}</p>
              <div className="perspectives-customer-meta">
                <span className="perspectives-logo-placeholder" aria-hidden="true" />
                <div><strong>{content.testimonial.client}</strong><span>{content.testimonial.location}</span></div>
              </div>
            </article>
          </div>
        </section>

        <section className="customers-closing" aria-labelledby="closing-title">
          <img src={content.closing.image} alt={content.closing.imageAlt} loading="lazy" />
          <div className="customers-closing-shade" />
          <div className="section-shell customers-closing-card" data-aos="fade-up">
            <h2 id="closing-title">{content.closing.heading}</h2>
            <p>{content.closing.description}</p>
            <div className="customers-actions">
              {content.closing.actions.map((action) => (
                <Button className={action.variant === "default" ? "customers-secondary" : undefined} href={action.href} variant={action.variant} key={action.label}>
                  {action.label}<span aria-hidden="true">→</span>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
