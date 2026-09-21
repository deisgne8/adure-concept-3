"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import Button from "../ui/Button";
import Section from "../ui/Section";

type PortfolioSectionProps = {
  content: HomeContent["portfolio"];
};

export default function PortfolioSection({ content }: PortfolioSectionProps) {
  const [activeCity, setActiveCity] = useState(content.cities[0]);
  const [activeProjectId, setActiveProjectId] = useState(content.projects[0]?.id ?? "");
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const pausedRef = useRef(false);
  const projects = useMemo(() => {
    return content.projects.filter((project) => project.city === activeCity);
  }, [activeCity, content.projects]);
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeCity]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (dragRef.current.active || pausedRef.current || document.hidden) return;
      const card = rail.querySelector<HTMLElement>(".portfolio-home-card");
      const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "0");
      const step = (card?.offsetWidth ?? rail.clientWidth) + gap;
      const end = rail.scrollWidth - rail.clientWidth - 4;
      rail.scrollTo({ left: rail.scrollLeft >= end ? 0 : rail.scrollLeft + step, behavior: "smooth" });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [projects]);

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, moved: false, startX: event.clientX, scrollLeft: rail.scrollLeft };
    rail.classList.add("is-pointer-down");
    rail.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 5) dragRef.current.moved = true;
    rail.scrollLeft = dragRef.current.scrollLeft - delta;
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    dragRef.current.active = false;
    rail.classList.remove("is-pointer-down");
    if ("pointerId" in event && rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };

  return (
    <Section className="portfolio-v2 portfolio-explorer-home section" id={content.id} spacing={content.spacing}>
      <div className="section-shell">
        <div className="portfolio-intro">
          <h2 data-aos="fade-right">{content.heading}</h2>
          <div data-aos="fade-left" data-aos-delay="100">
            <p>{content.description}</p>
            <Button href={content.button.href} variant="link">
              {content.button.label}
            </Button>
          </div>
        </div>
        <div className="portfolio-city-tabs" role="tablist" aria-label="Portfolio locations" data-aos="fade-up" data-aos-delay="200">
          {content.cities.map((city) => (
            <button key={city} className={activeCity === city ? "is-active" : undefined} type="button" role="tab" aria-selected={activeCity === city} aria-controls="portfolio-card-grid" onClick={() => { setActiveCity(city); setActiveProjectId(content.projects.find((project) => project.city === city)?.id ?? ""); }}>{city}</button>
          ))}
        </div>
        <div className="portfolio-home-stage" data-aos="fade-up" data-aos-delay="100">
          <div>
            <p className="portfolio-city-kicker">{activeCity.toUpperCase()}</p>
            <div
              className="portfolio-card-grid"
              id="portfolio-card-grid"
              ref={railRef}
              role="tabpanel"
              aria-label={`${activeCity} portfolio projects`}
              tabIndex={0}
              onPointerDown={beginDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onMouseEnter={() => { pausedRef.current = true; }}
              onMouseLeave={(event) => {
                pausedRef.current = false;
                if (dragRef.current.active) endDrag(event);
              }}
              onFocus={() => { pausedRef.current = true; }}
              onBlur={() => { pausedRef.current = false; }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse" && dragRef.current.active) endDrag(event);
              }}
            >
              {projects.map((project) => (
                <button
                  className={`portfolio-home-card${project.id === activeProject?.id ? " is-active" : ""}`}
                  type="button"
                  aria-pressed={project.id === activeProject?.id}
                  key={project.id}
                  onClick={() => {
                    if (!dragRef.current.moved) setActiveProjectId(project.id);
                    dragRef.current.moved = false;
                  }}
                >
                  <span className="portfolio-home-image"><img src={project.image} alt={project.alt} loading="lazy" /></span>
                  <span className="portfolio-home-copy">
                    <strong>{project.title}</strong>
                    <small>{project.type} · {project.location}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {activeProject ? (
            <article className="portfolio-expanded-card" aria-live="polite">
              <div className="portfolio-expanded-image"><img src={activeProject.image} alt={activeProject.alt} /></div>
              <div className="portfolio-expanded-copy">
                <span className="portfolio-expanded-city">{activeProject.city}</span>
                <h3>{activeProject.title}</h3>
                <span className="portfolio-expanded-rule" aria-hidden="true" />
                <p>{activeProject.description}</p>
                <form className="portfolio-enquiry-form" action={content.enquiry.action} method="post" encType="text/plain">
                  <h4>{content.enquiry.heading}</h4>
                  <label><span>Name</span><input name="name" type="text" placeholder="Name" autoComplete="name" required /></label>
                  <label><span>Email</span><input name="email" type="email" placeholder="Email" autoComplete="email" required /></label>
                  <label><span>Phone</span><input name="phone" type="tel" placeholder="Phone" autoComplete="tel" required /></label>
                  <input name="project" type="hidden" value={activeProject.title} />
                  <Button type="submit" variant="primary">{content.enquiry.submitLabel}</Button>
                </form>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
