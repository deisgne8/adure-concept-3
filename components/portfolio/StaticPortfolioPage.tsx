import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { PortfolioContent } from "../../lib/portfolio/types";
import type {
  BuildingFilters,
  BuildingListResponse,
  BuildingSummary,
  PropertyTerm,
} from "../../lib/properties/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";

type Props = {
  buildingFilters: BuildingFilters;
  buildings: BuildingListResponse;
  content: PortfolioContent;
  site: HomeContent["site"];
};

const fallbackImage = "/assets/no-image.png";

function firstTermName(terms: PropertyTerm[], fallback: string) {
  return terms[0]?.name || fallback;
}

function activeLocationName(locations: PropertyTerm[], slug?: string) {
  if (!slug) return "All";
  return locations.find((location) => location.slug === slug)?.name ?? "Selected";
}

function portfolioPageHref(filters: BuildingFilters, page: number) {
  const query = Object.fromEntries(
    Object.entries({ location: filters.location, page: String(page) }).filter(
      ([, value]) => value && value !== "all" && value !== "1",
    ),
  );

  return { pathname: "/portfolio", query };
}

function PortfolioBuildingCard({ building }: { building: BuildingSummary }) {
  const image = building.cardImage?.card || building.cardImage?.full || fallbackImage;
  const location = firstTermName(building.locations, "Location unavailable");
  const sector = firstTermName(building.sectors, "Sector unavailable");

  return (
    <Link className="portfolio-project-card" href={`/properties/${building.slug}`}>
      <span className="portfolio-project-card-image">
        <img
          alt={building.cardImage?.alt || building.name}
          draggable="false"
          loading="lazy"
          src={image}
        />
      </span>
      <span className="portfolio-project-card-copy">
        <strong>{building.name}</strong>
        <small>
          {sector} · {location}
        </small>
      </span>
    </Link>
  );
}

function AnimatedPortfolioStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const numericMatch = value.match(/^(\d+)(.*)$/);
  const isNumeric = Boolean(numericMatch);
  const target = Number(numericMatch?.[1] ?? 0);
  const suffix = numericMatch?.[2] ?? "";
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isNumeric) return;

    let animationFrame = 0;
    let delayTimer = 0;
    const showFinalValue = () => setDisplayValue(target);
    const startAnimation = () => {
      const startedAt = performance.now();
      const duration = 1500;
      const update = (time: number) => {
        const progress = Math.min((time - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.round(target * easedProgress));
        if (progress < 1) animationFrame = requestAnimationFrame(update);
      };
      animationFrame = requestAnimationFrame(update);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animationFrame = requestAnimationFrame(showFinalValue);
      return () => cancelAnimationFrame(animationFrame);
    }

    if (!("IntersectionObserver" in window)) {
      animationFrame = requestAnimationFrame(showFinalValue);
      return () => cancelAnimationFrame(animationFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        delayTimer = window.setTimeout(startAnimation, delay);
      },
      { threshold: 0.35 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(delayTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, isNumeric, target]);

  return (
    <div ref={elementRef} aria-label={`${value} ${label}`}>
      {value ? (
        <strong aria-hidden="true">
          {isNumeric ? displayValue : value}
          {isNumeric ? suffix : ""}
        </strong>
      ) : null}
      {label ? <span aria-hidden="true">{label}</span> : null}
    </div>
  );
}

export default function StaticPortfolioPage({
  buildingFilters,
  buildings,
  content,
  site,
}: Props) {
  const activeLocation = buildingFilters.location;
  const buildingItems = buildings.items ?? [];
  const buildingLocations = buildings.facets?.locations ?? [];
  const activeLocationLabel = activeLocationName(buildingLocations, activeLocation);
  const pagination = buildings.pagination ?? {
    page: 1,
    perPage: 21,
    total: buildingItems.length,
    totalPages: buildingItems.length ? 1 : 0,
  };
  const heroHeading = useMemo(
    () => content.hero.headingLines.map((line, index) => (
      <span key={line}>{index > 0 ? <br /> : null}{line}</span>
    )),
    [content.hero.headingLines],
  );
  const hasHero = Boolean(content.hero.image || heroHeading.length || content.hero.description);
  const hasIntro = Boolean(
    content.introduction.heading ||
      content.introduction.paragraphs.length ||
      content.introduction.stats.length,
  );
  const hasExplorerHead = Boolean(
    content.explorer.heading || content.explorer.description,
  );
  const hasPrinciples = Boolean(
    content.principles.heading || content.principles.items.length,
  );
  const hasCta = Boolean(
    content.cta.image ||
      content.cta.heading ||
      content.cta.description ||
      (content.cta.buttonHref && content.cta.buttonLabel),
  );

  return (
    <div className="portfolio-page">
      <SiteChrome content={site} currentPath="/portfolio" homeHref="/" skipTargetId="portfolio-main" standalone />
      <main id="portfolio-main">
        {hasHero ? (
          <section
            className="portfolio-hero"
            aria-labelledby={heroHeading.length ? "portfolio-title" : undefined}
          >
            {content.hero.image ? (
              <img src={content.hero.image} alt={content.hero.imageAlt} fetchPriority="high" />
            ) : null}
            {content.hero.image ? <div className="portfolio-hero-shade" /> : null}
            <div className="section-shell portfolio-hero-inner">
              {heroHeading.length ? <h1 id="portfolio-title">{heroHeading}</h1> : null}
              {content.hero.description ? <p>{content.hero.description}</p> : null}
            </div>
          </section>
        ) : null}

        {hasIntro ? (
          <section
            className="portfolio-intro-section pt_100 pb_100"
            aria-labelledby={content.introduction.heading ? "portfolio-intro-title" : undefined}
          >
            <div className="section-shell portfolio-intro-grid">
              {content.introduction.heading ? (
                <h2 id="portfolio-intro-title">{content.introduction.heading}</h2>
              ) : null}
              <div>
                {content.introduction.paragraphs.length ? (
                  <div className="portfolio-intro-copy">
                    {content.introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                ) : null}
                {content.introduction.stats.length ? (
                  <div className="portfolio-stats" aria-label="Portfolio summary">
                    {content.introduction.stats.map((stat, index) => (
                      <AnimatedPortfolioStat key={`${stat.value}-${stat.label}`} value={stat.value} label={stat.label} delay={index * 100} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section
          className="portfolio-explorer-section pt_100 pb_100"
          aria-labelledby={content.explorer.heading ? "portfolio-explorer-title" : undefined}
        >
          <div className="section-shell">
            {hasExplorerHead ? (
              <div className="portfolio-section-head">
                {content.explorer.heading ? (
                  <h2 id="portfolio-explorer-title">{content.explorer.heading}</h2>
                ) : null}
                {content.explorer.description ? <p>{content.explorer.description}</p> : null}
              </div>
            ) : null}
            <div className="portfolio-city-tabs" role="tablist" aria-label="Portfolio locations">
              <Link
                aria-selected={!activeLocation}
                className={!activeLocation ? "is-active" : undefined}
                href="/portfolio"
                role="tab"
              >
                All Locations
              </Link>
              {buildingLocations.map((location) => (
                <Link
                  aria-selected={activeLocation === location.slug}
                  className={activeLocation === location.slug ? "is-active" : undefined}
                  href={{ pathname: "/portfolio", query: { location: location.slug } }}
                  key={location.slug}
                  role="tab"
                >
                  {location.name}
                </Link>
              ))}
            </div>
            <section className="portfolio-explorer" aria-label="Portfolio project explorer">
              <aside className="portfolio-project-list">
                <p>
                  {activeLocationLabel === "All"
                    ? "All buildings"
                    : `${activeLocationLabel} buildings`}
                </p>
                <div id="portfolio-projects">
                  {buildingItems.map((building) => (
                    <PortfolioBuildingCard building={building} key={building.id} />
                  ))}
                </div>
                {!buildingItems.length ? (
                  <div className="portfolio-empty-state">
                    <h3>No buildings found</h3>
                    <p>Try another location or reset the filter.</p>
                    <Button href="/portfolio" variant="primary">All Locations</Button>
                  </div>
                ) : null}
                {pagination.totalPages > 1 ? (
                  <nav className="portfolio-pagination" aria-label="Building result pages">
                    {pagination.page > 1 ? (
                      <Link href={portfolioPageHref(buildingFilters, pagination.page - 1)}>
                        Previous
                      </Link>
                    ) : null}
                    {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
                      <Link
                        aria-current={page === pagination.page ? "page" : undefined}
                        href={portfolioPageHref(buildingFilters, page)}
                        key={page}
                      >
                        {page}
                      </Link>
                    ))}
                    {pagination.page < pagination.totalPages ? (
                      <Link href={portfolioPageHref(buildingFilters, pagination.page + 1)}>
                        Next
                      </Link>
                    ) : null}
                  </nav>
                ) : null}
              </aside>
            </section>
          </div>
        </section>

        {hasPrinciples ? (
          <section
            className="portfolio-principles pt_100 pb_100"
            aria-labelledby={content.principles.heading ? "portfolio-principles-title" : undefined}
          >
            <div className="section-shell">
              {content.principles.heading ? (
                <h2 id="portfolio-principles-title">{content.principles.heading}</h2>
              ) : null}
              {content.principles.items.length ? (
                <div className="portfolio-principle-grid">
                  {content.principles.items.map((item, index) => (
                    <article
                      key={`${item.title}-${index}`}
                      style={
                        item.image
                          ? ({ "--principle-image": `url('${item.image}')` } as CSSProperties)
                          : undefined
                      }
                    >
                      {item.title || item.description ? (
                        <div>
                          {item.title ? <h3>{item.title}</h3> : null}
                          {item.description ? <p>{item.description}</p> : null}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {hasCta ? (
          <section
            className="portfolio-cta portfolio-next-step pt_100 pb_100"
            aria-labelledby={content.cta.heading ? "portfolio-cta-title" : undefined}
          >
            {content.cta.image ? <img src={content.cta.image} alt={content.cta.imageAlt} loading="lazy" /> : null}
            {content.cta.image ? <div className="portfolio-cta-shade" /> : null}
            <div className="section-shell portfolio-cta-grid">
              {content.cta.heading ? <h2 id="portfolio-cta-title">{content.cta.heading}</h2> : null}
              {content.cta.description || (content.cta.buttonHref && content.cta.buttonLabel) ? (
                <div className="portfolio-card-intro">
                  {content.cta.description ? <p>{content.cta.description}</p> : null}
                  {content.cta.buttonHref && content.cta.buttonLabel ? (
                    <Button
                      href={content.cta.buttonHref}
                      rel={content.cta.buttonTarget === "_blank" ? "noreferrer" : undefined}
                      target={content.cta.buttonTarget ?? undefined}
                      variant={content.cta.buttonVariant}
                    >
                      {content.cta.buttonLabel}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
