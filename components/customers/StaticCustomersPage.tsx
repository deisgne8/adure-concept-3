import type { HomeContent } from "../../lib/home/load-home-content";
import type { CustomersContent } from "../../lib/customers/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import { aosSequenceDelay } from "../../lib/aos";
import TestimonialsCarousel from "../ui/TestimonialsCarousel";

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
            {content.hero.paragraphs.map((paragraph, index) => <p data-aos="fade-up" data-aos-delay={aosSequenceDelay(index + 1)} key={paragraph}>{paragraph}</p>)}
            <a className="customers-hero-cta" href={content.hero.cta.href} data-aos="fade-up" data-aos-delay="300">{content.hero.cta.label}<span aria-hidden="true">→</span></a>
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
                <ul className="customer-logo-grid" aria-label={`${group.title} clients`}>
                  {group.logos.map((logo, index) => (
                    <li key={logo.name} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}><img src={logo.image} alt={logo.name} loading="lazy" decoding="async" /></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <TestimonialsCarousel content={content.testimonials} id="testimonials" variant="customers" />

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
