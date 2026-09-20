"use client";

import { useEffect, useRef, useState } from "react";
import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type ProofSectionProps = {
  content: HomeContent["proof"];
};

export default function ProofSection({ content }: ProofSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(() =>
    content.metrics.map(() => 0),
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let hasAnimated = false;
    let introObserver: MutationObserver | null = null;
    const targets = content.metrics.map((metric) => metric.title);

    const startCounters = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValues(targets);
        return;
      }
      setValues(targets.map(() => 0));

      const startTime = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValues(targets.map((target) => Math.round(target * eased)));

        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const startAfterIntroduction = () => {
      const introduction = document.querySelector<HTMLElement>("#site-intro");

      if (!introduction || introduction.hidden) {
        startCounters();
        return;
      }

      introObserver = new MutationObserver(() => {
        if (!introduction.hidden) return;
        introObserver?.disconnect();
        introObserver = null;
        startCounters();
      });
      introObserver.observe(introduction, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    };

    let scrollFrame = 0;
    let hasReachedProof = false;

    const checkProofPosition = () => {
      scrollFrame = 0;
      if (hasReachedProof) return;

      const bounds = section.getBoundingClientRect();
      const visibleHeight = Math.min(bounds.bottom, window.innerHeight) -
        Math.max(bounds.top, 0);
      const requiredVisibleHeight = Math.min(
        bounds.height * 0.5,
        window.innerHeight * 0.5,
      );

      if (visibleHeight < requiredVisibleHeight) return;
      hasReachedProof = true;
      window.removeEventListener("scroll", queuePositionCheck);
      window.removeEventListener("resize", queuePositionCheck);
      startAfterIntroduction();
    };

    const queuePositionCheck = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(checkProofPosition);
    };

    window.addEventListener("scroll", queuePositionCheck, { passive: true });
    window.addEventListener("resize", queuePositionCheck);
    queuePositionCheck();

    return () => {
      window.removeEventListener("scroll", queuePositionCheck);
      window.removeEventListener("resize", queuePositionCheck);
      introObserver?.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
    };
  }, [content.metrics]);

  return (
    <Section
      className="proof-v2 section"
      id={content.id}
      spacing={content.spacing}
    >
      <div className="section-shell" ref={sectionRef}>
        <div className="proof-editorial-layout">
          <div className="proof-statement" data-aos="fade-right">
            <h2>{content.heading}</h2>
            <p>{content.description}</p>
            <a className="proof-about" href={content.link.href}>
              <span aria-hidden="true">↗</span>{content.link.label}
            </a>
          </div>
          <dl className="proof-statistics" aria-label="ADURE in numbers" data-aos="fade-left">
            {content.metrics.map((metric, index) => (
              <div className="proof-statistic" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  <span className="proof-value">
                    {metric.range ? (
                      <>
                        {Math.min(1, values[index])}–{values[index]}{" "}
                        <small>{metric.suffix}</small>
                      </>
                    ) : (
                      `${values[index]}${metric.suffix ?? ""}`
                    )}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
