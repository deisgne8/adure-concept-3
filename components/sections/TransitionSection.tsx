"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type TransitionSectionProps = {
  content: HomeContent["transition"];
};

export default function TransitionSection({ content }: TransitionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const carousel = section.querySelector<HTMLElement>(".transition-carousel");
    const panels = gsap.utils.toArray<HTMLElement>(".timeline-step", section);
    const slides = gsap.utils.toArray<HTMLElement>(
      ".transition-visual-slide",
      section,
    );
    const buttons = gsap.utils.toArray<HTMLButtonElement>(
      ".transition-step-nav button",
      section,
    );
    const header = document.querySelector<HTMLElement>(".site-header");

    if (!carousel || !panels.length || panels.length !== slides.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");

    let activeIndex = -1;
    let pointerStart: { x: number; y: number } | null = null;
    let scrollFrame = 0;
    let scrollStep = 1;
    let headerHeight = 0;

    const setActive = (index: number, animate = true) => {
      const next = Math.max(0, Math.min(panels.length - 1, index));
      if (next === activeIndex) return;
      const previous = activeIndex;
      activeIndex = next;

      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === next;
        panel.classList.toggle("is-current", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === next;
        slide.classList.toggle("is-current", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === next;
        button.classList.toggle("is-current", active);
        if (active) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });

      gsap.killTweensOf([...slides, ...panels]);
      if (!animate || reducedMotion.matches || previous < 0) {
        gsap.set(slides, { autoAlpha: 0, scale: 1.035 });
        gsap.set(panels, { autoAlpha: 0, y: 24 });
        gsap.set(slides[next], { autoAlpha: 1, scale: 1 });
        gsap.set(panels[next], { autoAlpha: 1, y: 0 });
        return;
      }

      if (previous >= 0) {
        gsap.to(slides[previous], {
          autoAlpha: 0,
          scale: 1.035,
          duration: 0.45,
          ease: "power1.out",
        });
        gsap.to(panels[previous], {
          autoAlpha: 0,
          y: next > previous ? -20 : 20,
          duration: 0.22,
          ease: "power1.out",
        });
      }
      gsap.fromTo(
        slides[next],
        { autoAlpha: 0, scale: 1.035 },
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power1.out" },
      );
      gsap.fromTo(
        panels[next],
        { autoAlpha: 0, y: next > previous ? 24 : -24 },
        { autoAlpha: 1, y: 0, duration: 0.36, ease: "power1.out" },
      );
    };

    const navigate = (index: number, focus = false) => {
      const next = Math.max(0, Math.min(panels.length - 1, index));
      if (section.classList.contains("has-transition-scroll")) {
        const top =
          window.scrollY +
          section.getBoundingClientRect().top -
          headerHeight +
          scrollStep * (next + 0.12);
        window.scrollTo({
          top,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      } else {
        setActive(next);
      }

      if (focus) buttons[next]?.focus({ preventScroll: true });
    };

    const syncScroll = () => {
      scrollFrame = 0;
      if (!section.classList.contains("has-transition-scroll")) return;
      const distance = headerHeight - section.getBoundingClientRect().top;
      setActive(Math.floor((distance + scrollStep * 0.08) / scrollStep));
    };

    const queueScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(syncScroll);
    };

    const measure = () => {
      const enabled = desktop.matches;
      section.classList.toggle("has-transition-scroll", enabled);
      if (!enabled) {
        section.style.removeProperty("--transition-top");
        section.style.removeProperty("--transition-stage-height");
        section.style.removeProperty("--transition-scroll-distance");
        setActive(Math.max(0, activeIndex), false);
        return;
      }

      headerHeight = header?.getBoundingClientRect().height ?? 0;
      const stageHeight = Math.max(520, window.innerHeight - headerHeight);
      scrollStep = Math.max(300, stageHeight * 0.72);
      section.style.setProperty("--transition-top", `${headerHeight}px`);
      section.style.setProperty("--transition-stage-height", `${stageHeight}px`);
      section.style.setProperty(
        "--transition-scroll-distance",
        `${scrollStep * panels.length}px`,
      );
      syncScroll();
    };

    setActive(0, false);

    const buttonHandlers = buttons.map((button, index) => {
      const handler = () => navigate(index);
      button.addEventListener("click", handler);
      return () => button.removeEventListener("click", handler);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      navigate(activeIndex + (event.key === "ArrowRight" ? 1 : -1), true);
    };
    const handlePointerDown = (event: PointerEvent) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (!pointerStart) return;
      const xDistance = event.clientX - pointerStart.x;
      const yDistance = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(xDistance) > 48 && Math.abs(xDistance) > Math.abs(yDistance)) {
        navigate(activeIndex + (xDistance < 0 ? 1 : -1));
      }
    };
    const clearPointer = () => {
      pointerStart = null;
    };

    carousel.addEventListener("keydown", handleKeyDown);
    carousel.addEventListener("pointerdown", handlePointerDown);
    carousel.addEventListener("pointerup", handlePointerUp);
    carousel.addEventListener("pointercancel", clearPointer);

    const resizeObserver = header ? new ResizeObserver(measure) : null;
    if (header) resizeObserver?.observe(header);
    window.addEventListener("scroll", queueScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    desktop.addEventListener("change", measure);
    reducedMotion.addEventListener("change", measure);
    measure();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", queueScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reducedMotion.removeEventListener("change", measure);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      buttonHandlers.forEach((removeHandler) => removeHandler());
      carousel.removeEventListener("keydown", handleKeyDown);
      carousel.removeEventListener("pointerdown", handlePointerDown);
      carousel.removeEventListener("pointerup", handlePointerUp);
      carousel.removeEventListener("pointercancel", clearPointer);
      gsap.killTweensOf([...slides, ...panels]);
    };
  }, [content.stages.length]);

  return (
    <Section
      className="transition-v2 section has-transition-carousel has-transition-gsap"
      id={content.id}
      spacing={content.spacing}
      ref={sectionRef}
    >
      <div className="section-shell">
        <div
          className="transition-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="30-day transition stages"
        >
          <div className="transition-visual" aria-live="off">
            {content.stages.map((stage, index) => (
              <figure
                className={`transition-visual-slide${index === 0 ? " is-current" : ""}`}
                key={stage.title}
                role="img"
                aria-label={`${stage.week}: ${stage.title}`}
                aria-hidden={index !== 0}
              >
                {"viewBox" in stage.image ? (
                  <svg
                    viewBox={stage.image.viewBox}
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <image
                      href={stage.image.src}
                      width={stage.image.width}
                      height={stage.image.height}
                    />
                  </svg>
                ) : (
                  <img
                    src={stage.image.src}
                    alt=""
                    width={stage.image.width}
                    height={stage.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </figure>
            ))}
          </div>

          <div className="transition-content">
            <div className="transition-head">
              <h2>{content.heading}</h2>
              {content.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="timeline-v2" aria-live="polite">
              {content.stages.map((stage, index) => (
                <article
                  className={`timeline-step${index === 0 ? " is-current" : ""}`}
                  id={`transition-stage-${index}`}
                  key={stage.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${content.stages.length}`}
                  aria-hidden={index !== 0}
                >
                  <div className="transition-panel-inner">
                    <span className="week">{stage.week}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="transition-footer">
              <Button
                href={content.button.href}
                variant={content.button.variant as ButtonVariant}
              >
                {content.button.text}
              </Button>
            </div>

            <nav className="transition-step-nav" aria-label="Transition stages">
              {content.stages.map((stage, index) => (
                <button
                  className={index === 0 ? "is-current" : undefined}
                  key={stage.title}
                  type="button"
                  aria-label={`Show ${stage.week}: ${stage.title}`}
                  aria-controls={`transition-stage-${index}`}
                  aria-current={index === 0 ? "step" : undefined}
                >
                  <span>{stage.week}</span>
                  <strong>{stage.title}</strong>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </Section>
  );
}
