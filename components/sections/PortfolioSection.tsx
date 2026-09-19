import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type PortfolioSectionProps = {
  content: HomeContent["portfolio"];
};

export default function PortfolioSection({ content }: PortfolioSectionProps) {
  return (
    <>
      <Section
        className="portfolio-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <div className="section-shell">
          <div className="portfolio-intro">
            <h2>From Places to Performance</h2>
            <div>
              <p>
                Every asset has its own character, purpose and potential. Across
                the portfolio, ADURE brings the same lasting attention to how
                each place performs, evolves and serves the people around it.
              </p>
              <a
                className="btn link"
                href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
              >
                Explore our portfolio
              </a>
            </div>
          </div>
          <div className="portfolio-toolbar">
            <div
              className="portfolio-filters"
              role="group"
              aria-label="Filter portfolio projects"
            >
              <button
                className="is-active"
                type="button"
                data-filter="all"
                aria-pressed="true"
              >
                All
              </button>
              <button
                type="button"
                data-filter="residential"
                aria-pressed="false"
              >
                Residential
              </button>
              <button type="button" data-filter="retail" aria-pressed="false">
                Retail
              </button>
            </div>
          </div>
          <div
            className="portfolio-mosaic"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Portfolio highlights — drag or use arrow keys"
          >
            <article className="portfolio-item-v2" data-type="residential">
              <div className="portfolio-card">
                <a
                  className="portfolio-card-link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
                  aria-label="Explore Sunrise Residence 3"
                >
                  <div className="portfolio-image">
                    <img
                      src="assets/portfolio-reference/sunrise-residence-3-v2.webp"
                      alt="Sunrise Residence 3 at Qaryat Al Hidd, Saadiyat Island"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <div className="portfolio-caption">
                    <h3>Sunrise Residence 3</h3>
                  </div>
                </a>
                <div className="portfolio-card-meta">
                  <span>Residential · Qaryat Al Hidd, Saadiyat Island</span>
                </div>
              </div>
            </article>
            <article className="portfolio-item-v2" data-type="retail">
              <div className="portfolio-card">
                <a
                  className="portfolio-card-link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
                  aria-label="Explore 48 Burj Gate"
                >
                  <div className="portfolio-image">
                    <img
                      src="assets/portfolio-reference/48-burj-gate-v2.webp"
                      alt="48 Burj Gate on Sheikh Zayed Road in Dubai"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <div className="portfolio-caption">
                    <h3>48 Burj Gate</h3>
                  </div>
                </a>
                <div className="portfolio-card-meta">
                  <span>Retail · Sheikh Zayed Road, Dubai</span>
                </div>
              </div>
            </article>
            <article className="portfolio-item-v2" data-type="residential">
              <div className="portfolio-card">
                <a
                  className="portfolio-card-link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
                  aria-label="Explore Qaryat Al Hidd"
                >
                  <div className="portfolio-image">
                    <img
                      src="assets/portfolio-reference/qaryat-al-hidd-v2.webp"
                      alt="Qaryat Al Hidd waterfront community on Saadiyat Island"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <div className="portfolio-caption">
                    <h3>Qaryat Al Hidd</h3>
                  </div>
                </a>
                <div className="portfolio-card-meta">
                  <span>Residential · Saadiyat Island</span>
                </div>
              </div>
            </article>
            <article className="portfolio-item-v2" data-type="residential">
              <div className="portfolio-card">
                <a
                  className="portfolio-card-link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
                  aria-label="Explore Al Mushrif Villas"
                >
                  <div className="portfolio-image">
                    <img
                      src="assets/portfolio-reference/al-mushrif-villas-v2.webp"
                      alt="Al Mushrif Villas in Abu Dhabi"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <div className="portfolio-caption">
                    <h3>Al Mushrif Villas</h3>
                  </div>
                </a>
                <div className="portfolio-card-meta">
                  <span>Residential · Al Mushrif, Abu Dhabi</span>
                </div>
              </div>
            </article>
            <article className="portfolio-item-v2" data-type="residential">
              <div className="portfolio-card">
                <a
                  className="portfolio-card-link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#portfolio"
                  aria-label="Explore Ghantoot Complex"
                >
                  <div className="portfolio-image">
                    <img
                      src="assets/portfolio-reference/ghantoot-complex-v2.webp"
                      alt="Ghantoot Complex residential community in Abu Dhabi"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                  <div className="portfolio-caption">
                    <h3>Ghantoot Complex</h3>
                  </div>
                </a>
                <div className="portfolio-card-meta">
                  <span>Residential · Mohammed Bin Zayed City</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </Section>
    </>
  );
}
