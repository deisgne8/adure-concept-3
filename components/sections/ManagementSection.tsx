"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type ManagementSectionProps = { content: HomeContent["management"] };

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function ManagementSection({ content }: ManagementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023.98px)");
    const sync = () => setIsCompact(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    const track = root?.querySelector<HTMLElement>(".management-stack-track");
    const title = root?.querySelector<HTMLElement>(".management-context-copy > h2");
    const intro = root?.querySelector<HTMLElement>(".management-context-copy > .intro");
    const cta = root?.querySelector<HTMLElement>(".management-context-copy > .management-main-cta");
    const slides = root ? Array.from(root.querySelectorAll<HTMLElement>(".service-row")) : [];
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!root || !track || !title || !intro || !slides.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 1023.98px)");
    let frame = 0;
    let entranceFrame = 0;
    let entranceTarget = 0;
    let entrancePosition: number | null = null;
    let entranceTime = 0;
    let headerHeight = 0;
    let stageHeight = 1;

    const applyEntrance = (progress: number) => {
      const value = clamp(progress);
      root.style.setProperty("--management-scene-width", `${68 + value * 32}%`);
      root.style.setProperty("--management-scene-height", `${74 + value * 26}%`);
      root.style.setProperty("--management-scene-y", `${((1 - value) * stageHeight * 0.03).toFixed(2)}px`);
      root.style.setProperty("--management-scene-radius", `${(1 - value) * 30}px`);
      root.style.setProperty("--management-scene-border", `${(1 - value) * 8}px`);
      const showCopy = value >= 0.9999;
      root.classList.toggle("is-scene-expanded", showCopy);
      [title, intro, cta].forEach((item) => {
        if (item) item.inert = !showCopy;
      });
    };

    const renderEntrance = (now: number) => {
      const elapsed = entranceTime ? Math.min(64, now - entranceTime) : 1000 / 60;
      entranceTime = now;
      entrancePosition ??= entranceTarget;
      entrancePosition += (entranceTarget - entrancePosition) * (1 - Math.pow(0.9, elapsed / (1000 / 60)));
      if (Math.abs(entranceTarget - entrancePosition) < 0.0001) entrancePosition = entranceTarget;
      applyEntrance(entrancePosition);
      if (entrancePosition !== entranceTarget) entranceFrame = window.requestAnimationFrame(renderEntrance);
      else {
        entranceFrame = 0;
        entranceTime = 0;
      }
    };

    const updateEntrance = (progress: number) => {
      entranceTarget = progress;
      if (entrancePosition === null || reduced.matches) {
        entrancePosition = progress;
        applyEntrance(progress);
      } else if (!entranceFrame) {
        entranceTime = 0;
        entranceFrame = window.requestAnimationFrame(renderEntrance);
      }
    };

    const sync = () => {
      frame = 0;
      const trackRect = track.getBoundingClientRect();
      const introProgress = reduced.matches
        ? 1
        : compact.matches
          ? clamp((window.innerHeight - trackRect.top) / (stageHeight * 0.95))
          : clamp((window.innerHeight - trackRect.top) / stageHeight);
      updateEntrance(introProgress);

      if (compact.matches || reduced.matches) {
        root.style.setProperty("--management-image-y", "0px");
        slides.forEach((slide) => {
          slide.style.removeProperty("--service-scale");
          slide.style.removeProperty("--service-overlay-opacity");
          slide.style.removeProperty("--service-image-scale");
          slide.classList.remove("is-current", "is-past");
        });
        return;
      }

      const travel = Math.max(1, trackRect.height - stageHeight);
      const progress = clamp((headerHeight - trackRect.top) / travel);
      root.style.setProperty("--management-image-y", `${Math.round((1 - progress) * stageHeight * 0.045)}px`);

      const cardTop = headerHeight + Math.max(32, Math.min(stageHeight * 0.07, 72));
      let active = 0;
      slides.forEach((slide, index) => {
        if (slide.getBoundingClientRect().top <= cardTop + 1) active = index;
      });
      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const entering = clamp((stageHeight - rect.top) / Math.max(1, stageHeight - cardTop));
        const nextTop = slides[index + 1]?.getBoundingClientRect().top;
        const stacked = nextTop === undefined ? 0 : clamp((stageHeight - nextTop) / Math.max(1, stageHeight - cardTop));
        slide.style.setProperty("--service-scale", (1 - stacked * 0.1).toFixed(4));
        slide.style.setProperty("--service-overlay-opacity", (stacked * 0.18).toFixed(4));
        slide.style.setProperty("--service-image-scale", (1.3 - entering * 0.3).toFixed(4));
        slide.classList.toggle("is-current", index === active);
        slide.classList.toggle("is-past", index < active);
      });
    };

    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    const measure = () => {
      headerHeight = header?.getBoundingClientRect().height ?? 0;
      stageHeight = Math.max(1, window.innerHeight - headerHeight);
      const entranceDistance = reduced.matches || compact.matches ? 0 : stageHeight * 1.25;
      root.style.setProperty("--management-top", `${headerHeight}px`);
      root.style.setProperty("--management-stage-height", `${stageHeight}px`);
      root.style.setProperty("--management-card-offset", `${stageHeight * 0.84 + entranceDistance}px`);
      root.style.setProperty("--management-title-height", `${title.getBoundingClientRect().height}px`);
      root.style.setProperty("--management-intro-height", `${intro.getBoundingClientRect().height}px`);
      sync();
    };

    const resizeObserver = header ? new ResizeObserver(measure) : null;
    if (header) resizeObserver?.observe(header);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    reduced.addEventListener("change", measure);
    compact.addEventListener("change", measure);
    void document.fonts?.ready.then(measure);
    measure();

    return () => {
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(entranceFrame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
      compact.removeEventListener("change", measure);
    };
  }, [content.cards.length, isCompact]);

  const renderServiceCard = (card: HomeContent["management"]["cards"][number]) => (
    <div>
      <h3>{card.title}</h3>
      <div className="service-card-media">
        <img src={card.image.src} alt={card.image.alt} width="900" height="560" loading="lazy" decoding="async" />
      </div>
      <p>{card.description}</p>
    </div>
  );

  const compactServiceRail = (
    <div className="management-compact-services">
      <Swiper className="service-rows management-service-swiper" slidesPerView="auto" spaceBetween={16} aria-label="Property management services">
        {content.cards.map((card, index) => (
          <SwiperSlide className="service-row" style={{ "--service-index": index } as CSSProperties} key={card.title}>
            {renderServiceCard(card)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <Section className="management-v2 section has-management-stack has-scroll-entrance" id={content.id} spacing={content.spacing} ref={sectionRef}>
      <div className="section-shell">
        <div className="management-layout-v2">
          <div className="management-stack-track">
            <div className="management-stack-sticky">
              <div className="management-context-copy">
                <h2 className="management-context" aria-label={content.heading}>
                  <span className="management-title-lead">From Occupancy To Operations, </span>
                  <span className="management-title-main">We Manage It All</span>
                </h2>
                <p className="intro management-context">{content.description}</p>
                <Button className="management-main-cta" href={content.button.href} variant={content.button.variant as ButtonVariant}>
                  {content.button.text}
                </Button>
                {isCompact ? compactServiceRail : null}
              </div>
              <figure className="management-visual-v2">
                <img src={content.image.src} alt={content.image.alt} width="1600" height="1066" />
                <figcaption>One connected approach across every part of the asset.</figcaption>
              </figure>
            </div>
            <div className="management-carousel-copy">
              {!isCompact ? (
                <div className="service-rows">
                  {content.cards.map((card, index) => (
                    <article className={`service-row${index === 0 ? " is-current" : ""}`} style={{ "--service-index": index } as CSSProperties} key={card.title}>
                      {renderServiceCard(card)}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
