"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    gsap.registerPlugin(ScrollTrigger);

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

    let activeIndex = -1;
    let scrollAnimation: gsap.core.Timeline | null = null;
    let pointerStart: { x: number; y: number } | null = null;

    const setActive = (index: number) => {
      const next = Math.max(0, Math.min(panels.length - 1, index));
      if (next === activeIndex) return;
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
    };

    const showStaticStage = (index: number) => {
      const next = Math.max(0, Math.min(panels.length - 1, index));
      gsap.set(slides, { autoAlpha: 0, scale: 1.035 });
      gsap.set(panels, { autoAlpha: 0, y: 24 });
      gsap.set(slides[next], { autoAlpha: 1, scale: 1 });
      gsap.set(panels[next], { autoAlpha: 1, y: 0 });
      setActive(next);
    };

    const navigate = (index: number, focus = false) => {
      const next = Math.max(0, Math.min(panels.length - 1, index));
      const trigger = scrollAnimation?.scrollTrigger;

      if (trigger) {
        const progress = panels.length > 1 ? next / (panels.length - 1) : 0;
        window.scrollTo({
          top: trigger.start + (trigger.end - trigger.start) * progress,
          behavior: "smooth",
        });
      } else {
        showStaticStage(next);
      }

      if (focus) buttons[next]?.focus({ preventScroll: true });
    };

    const context = gsap.context(() => {
      showStaticStage(0);

      const media = gsap.matchMedia();
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stageDistance = () =>
            Math.max(520, window.innerHeight - (header?.offsetHeight ?? 0));

          scrollAnimation = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: () => `top top+=${header?.offsetHeight ?? 0}`,
              end: () => `+=${stageDistance() * (panels.length - 1)}`,
              pin: carousel,
              pinSpacing: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap:
                panels.length > 1
                  ? {
                      snapTo: 1 / (panels.length - 1),
                      duration: { min: 0.16, max: 0.42 },
                      delay: 0.05,
                      ease: "power1.inOut",
                    }
                  : undefined,
              onUpdate: (self) => {
                setActive(Math.round(self.progress * (panels.length - 1)));
              },
            },
          });

          scrollAnimation.to({}, { duration: panels.length - 1 });

          for (let index = 1; index < panels.length; index += 1) {
            const position = index - 0.28;
            scrollAnimation
              .to(
                slides[index - 1],
                { autoAlpha: 0, scale: 1.018, duration: 0.28 },
                position,
              )
              .fromTo(
                slides[index],
                { autoAlpha: 0, scale: 1.035 },
                { autoAlpha: 1, scale: 1, duration: 0.45 },
                position,
              )
              .to(
                panels[index - 1],
                { autoAlpha: 0, y: -20, duration: 0.22 },
                position,
              )
              .fromTo(
                panels[index],
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.36 },
                position + 0.08,
              );
          }

          return () => {
            scrollAnimation = null;
            showStaticStage(activeIndex < 0 ? 0 : activeIndex);
          };
        },
      );

      return () => media.revert();
    }, section);

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

    const resizeObserver = header
      ? new ResizeObserver(() => ScrollTrigger.refresh())
      : null;
    if (header) resizeObserver?.observe(header);

    return () => {
      resizeObserver?.disconnect();
      buttonHandlers.forEach((removeHandler) => removeHandler());
      carousel.removeEventListener("keydown", handleKeyDown);
      carousel.removeEventListener("pointerdown", handlePointerDown);
      carousel.removeEventListener("pointerup", handlePointerUp);
      carousel.removeEventListener("pointercancel", clearPointer);
      context.revert();
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
