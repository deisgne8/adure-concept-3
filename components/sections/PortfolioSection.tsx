"use client";

import { useMemo, useState } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import Button from "../ui/Button";
import Section from "../ui/Section";
import PortfolioSwiper from "./PortfolioSwiper";

type PortfolioSectionProps = {
  content: HomeContent["portfolio"];
};

export default function PortfolioSection({ content }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const projects = useMemo(() => {
    if (activeFilter === "residential") return content.residential;
    if (activeFilter === "retail") return content.retail;
    return [...content.retail, ...content.residential];
  }, [activeFilter, content.residential, content.retail]);

  return (
    <Section className="portfolio-v2 section" id={content.id} spacing={content.spacing}>
      <div className="section-shell">
        <div className="portfolio-intro">
          <h2>{content.heading}</h2>
          <div>
            <p>{content.description}</p>
            <Button href={content.button.href} variant="link">
              <span className="link-underline">{content.button.label}</span>
            </Button>
          </div>
        </div>
        <div className="portfolio-toolbar" data-aos="fade-up">
          <div className="portfolio-filters" role="group" aria-label="Filter portfolio projects">
            {[
              ["all", "All"],
              ["residential", "Residential"],
              ["retail", "Retail"],
            ].map(([filter, label]) => (
              <button
                key={filter}
                className={activeFilter === filter ? "is-active" : undefined}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <PortfolioSwiper key={activeFilter} projects={projects} href={content.button.href} />
      </div>
    </Section>
  );
}
