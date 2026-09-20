"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import Button from "../ui/Button";
import Section from "../ui/Section";

type PortfolioSectionProps = {
  content: HomeContent["portfolio"];
};

export default function PortfolioSection({ content }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState(content.filters[0]);
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const projects = useMemo(() => {
    if (activeFilter === content.filters[0]) return content.projects;
    return content.projects.filter((project) => project.type === activeFilter);
  }, [activeFilter, content.filters, content.projects]);

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeFilter]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (dragRef.current.active || document.hidden) return;
      const card = rail.querySelector<HTMLElement>(".portfolio-home-card");
      const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "0");
      const step = (card?.offsetWidth ?? rail.clientWidth) + gap;
      const end = rail.scrollWidth - rail.clientWidth - 4;
      rail.scrollTo({ left: rail.scrollLeft >= end ? 0 : rail.scrollLeft + step, behavior: "smooth" });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [projects]);

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: rail.scrollLeft };
    rail.classList.add("is-pointer-down");
    rail.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    rail.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    dragRef.current.active = false;
    rail.classList.remove("is-pointer-down");
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };

  return (
    <Section className="portfolio-v2 portfolio-explorer-home section" id={content.id} spacing={content.spacing}>
      <div className="section-shell">
        <div className="portfolio-intro">
          <h2>{content.heading}</h2>
          <div>
            <p>{content.description}</p>
            <Button href={content.button.href} variant="link">
              <span className="link-underline">{content.button.label}</span>
            </Button>
          </div>
          <div className="portfolio-type-filters" role="group" aria-label="Filter portfolio projects">
            {content.filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "is-active" : undefined}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="portfolio-home-stage">
          <div>
            <div
              className="portfolio-card-grid"
              ref={railRef}
              role="region"
              aria-label="Portfolio projects"
              tabIndex={0}
              onPointerDown={beginDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse" && dragRef.current.active) endDrag(event);
              }}
            >
              {projects.map((project) => (
                <a className="portfolio-home-card" href={`/portfolio#${project.city.toLowerCase().replaceAll(" ", "-")}`} key={project.id}>
                  <span className="portfolio-home-image"><img src={project.image} alt={project.alt} loading="lazy" /></span>
                  <span className="portfolio-home-copy">
                    <strong>{project.title}</strong>
                    <small>{project.location}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
