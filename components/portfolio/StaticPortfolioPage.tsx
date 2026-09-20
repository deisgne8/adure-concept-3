import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { PortfolioContent, PortfolioProject } from "../../lib/portfolio/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import PortfolioProjectModal from "./PortfolioProjectModal";

type Props = { content: PortfolioContent; site: HomeContent["site"] };

const cityAnchor = (city: string) => `portfolio-city-${city.toLowerCase().replaceAll(" ", "-")}`;

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
      <strong aria-hidden="true">{displayValue}{suffix}</strong>
      <span aria-hidden="true">{label}</span>
    </div>
  );
}

export default function StaticPortfolioPage({ content, site }: Props) {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const activeCity = content.explorer.projectsByCity[activeCityIndex] ?? content.explorer.projectsByCity[0];
  const closeModal = useCallback(() => setSelectedProject(null), []);
  const heroHeading = useMemo(
    () => content.hero.headingLines.map((line, index) => (
      <span key={line}>{index > 0 ? <br /> : null}{line}</span>
    )),
    [content.hero.headingLines],
  );

  useEffect(() => {
    const selectHashCity = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const index = content.explorer.projectsByCity.findIndex((group) => cityAnchor(group.city) === hash);
      if (index < 0) return;
      setActiveCityIndex(index);
      setSelectedProject(null);
      window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
    };
    selectHashCity();
    window.addEventListener("hashchange", selectHashCity);
    return () => window.removeEventListener("hashchange", selectHashCity);
  }, [content.explorer.projectsByCity]);

  return (
    <div className="portfolio-page">
      <SiteChrome content={site} currentPath="/portfolio" homeHref="/" skipTargetId="portfolio-main" standalone />
      <main id="portfolio-main">
        <section className="portfolio-hero" aria-labelledby="portfolio-title">
          <img src={content.hero.image} alt={content.hero.imageAlt} fetchPriority="high" />
          <div className="portfolio-hero-shade" />
          <div className="section-shell portfolio-hero-inner">
            <h1 id="portfolio-title">{heroHeading}</h1>
            <p>{content.hero.description}</p>
          </div>
        </section>

        <section className="portfolio-intro-section pt_100 pb_100" aria-labelledby="portfolio-intro-title">
          <div className="section-shell portfolio-intro-grid">
            <h2 id="portfolio-intro-title">{content.introduction.heading}</h2>
            <div>
              <div className="portfolio-intro-copy">
                {content.introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="portfolio-stats" aria-label="Portfolio summary">
                {content.introduction.stats.map((stat, index) => (
                  <AnimatedPortfolioStat key={stat.label} value={stat.value} label={stat.label} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="portfolio-explorer-section pt_100 pb_100" aria-labelledby="portfolio-explorer-title">
          <div className="section-shell">
            <div className="portfolio-section-head">
              <h2 id="portfolio-explorer-title">{content.explorer.heading}</h2>
              <p>{content.explorer.description}</p>
            </div>
            <div className="portfolio-city-tabs" role="tablist" aria-label="Portfolio locations">
              {content.explorer.projectsByCity.map((group, index) => {
                const active = index === activeCityIndex;
                return (
                  <button
                    id={cityAnchor(group.city)}
                    className={active ? "is-active" : undefined}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    key={group.city}
                    onClick={() => { setActiveCityIndex(index); setSelectedProject(null); }}
                  >
                    {group.city}
                  </button>
                );
              })}
            </div>
            <section className="portfolio-explorer" aria-label="Portfolio project explorer">
              <aside className="portfolio-project-list">
                <p>{activeCity.city} buildings</p>
                <div id="portfolio-projects">
                  {activeCity.projects.map((project) => (
                    <button
                      type="button"
                      className="portfolio-project-card"
                      key={`${activeCity.city}-${project.name}`}
                      onClick={() => setSelectedProject(project)}
                      aria-haspopup="dialog"
                    >
                      <span className="portfolio-project-card-image">
                        <img src={project.image} alt={project.name} loading="lazy" draggable="false" />
                      </span>
                      <span className="portfolio-project-card-copy">
                        <strong>{project.name}</strong>
                        <small>{project.type} · {project.location}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            </section>
          </div>
        </section>

        <section className="portfolio-principles pt_100 pb_100" aria-labelledby="portfolio-principles-title">
          <div className="section-shell">
            <h2 id="portfolio-principles-title">{content.principles.heading}</h2>
            <div className="portfolio-principle-grid">
              {content.principles.items.map((item) => (
                <article key={item.title} style={{ "--principle-image": `url('${item.image}')` } as CSSProperties}>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio-cta portfolio-next-step pt_100 pb_100" aria-labelledby="portfolio-cta-title">
          <img src={content.cta.image} alt={content.cta.imageAlt} loading="lazy" />
          <div className="portfolio-cta-shade" />
          <div className="section-shell portfolio-cta-grid">
            <h2 id="portfolio-cta-title">{content.cta.heading}</h2>
            <div className="portfolio-card-intro">
              <p>{content.cta.description}</p>
              <Button href={content.cta.buttonHref} variant={content.cta.buttonVariant}>{content.cta.buttonLabel}</Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={site} homeHref="/" />
      <PortfolioProjectModal city={activeCity.city} project={selectedProject} onClose={closeModal} />
    </div>
  );
}
