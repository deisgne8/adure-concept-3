"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "../ui/Section";
import Button, { type ButtonVariant } from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type ManagementSectionProps = {
  content: HomeContent["management"];
};

export default function ManagementSection({ content }: ManagementSectionProps) {
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    const root = layout?.closest<HTMLElement>("#management");

    if (!layout || !root) return;

    const compact = window.matchMedia("(max-width: 800px)").matches;

    if (compact) {
      root.classList.add("is-scene-expanded");
      root.style.setProperty("--management-scene-width", "100%");
      root.style.setProperty("--management-scene-height", "100%");
      root.style.setProperty("--management-scene-y", "0px");
      root.style.setProperty("--management-scene-radius", "0px");
      root.style.setProperty("--management-scene-border", "0px");

      return () => root.classList.remove("is-scene-expanded");
    }

    gsap.registerPlugin(ScrollTrigger);

    const track = root.querySelector<HTMLElement>(".management-stack-track");
    const header = document.querySelector<HTMLElement>(".site-header");
    const sceneImage = root.querySelector<HTMLElement>(
      ".management-visual-v2 img",
    );
    const copy = gsap.utils.toArray<HTMLElement>(
      ".management-context-copy > h2, .management-context-copy > .intro, .management-context-copy > .management-main-cta",
      root,
    );
    const cards = gsap.utils.toArray<HTMLElement>(".service-row", root);

    if (!track || !copy.length || !cards.length) return;

    const updateMeasurements = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const stageHeight = Math.max(1, window.innerHeight - headerHeight);
      root.style.setProperty("--management-top", `${headerHeight}px`);
      root.style.setProperty(
        "--management-stage-height",
        `${stageHeight}px`,
      );
      root.style.setProperty(
        "--management-card-offset",
        `${stageHeight * 2.09}px`,
      );
      root.style.setProperty(
        "--management-image-y",
        `${stageHeight * 0.045}px`,
      );
      ScrollTrigger.refresh();
    };

    const context = gsap.context(() => {
      gsap.set(copy, { autoAlpha: 0, y: 28 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: track,
            start: "top bottom",
            end: "top top",
            scrub: 0.7,
          },
        })
        .to(
          root,
          {
            "--management-scene-width": "100%",
            "--management-scene-height": "100%",
            "--management-scene-y": "0px",
            "--management-scene-radius": "0px",
            "--management-scene-border": "0px",
            duration: 1,
            ease: "none",
          },
          0,
        )
        .to(copy, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.25 }, 0.72);

      if (sceneImage) {
        gsap.to(root, {
          "--management-image-y": "0px",
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
          },
        });
      }

      cards.forEach((card, index) => {
        const image = card.querySelector<HTMLElement>(".service-card-media img");

        if (image) {
          gsap.to(image, {
            "--service-image-scale": 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 22%",
              scrub: 0.65,
            },
          });
        }

        const nextCard = cards[index + 1];
        if (!nextCard) return;

        gsap.to(card, {
          "--service-scale": 0.9,
          "--service-overlay-opacity": 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "top 22%",
            scrub: 0.65,
          },
        });
      });
    }, layout);

    const observer = header ? new ResizeObserver(updateMeasurements) : null;
    if (header) observer?.observe(header);
    window.addEventListener("resize", updateMeasurements, { passive: true });
    updateMeasurements();

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateMeasurements);
      context.revert();
    };
  }, [content.cards.length]);

  return (
    <Section
      className="management-v2 section has-management-stack has-scroll-entrance"
      id={content.id}
      spacing={content.spacing}
    >
      <div className="section-shell">
        <div className="management-layout-v2" ref={layoutRef}>
          <div
            className="management-stack-track"
            style={{
              "--management-stack-length": `${content.cards.length * 70 + 28}svh`,
            } as CSSProperties}
          >
            <div className="management-stack-sticky">
              <figure className="management-visual-v2">
                <img
                  src={content.image.src}
                  alt={content.image.alt}
                  width="1600"
                  height="1066"
                />
                <figcaption>
                  One connected approach across every part of the asset.
                </figcaption>
              </figure>
              <div className="management-context-copy">
                <h2 className="management-context">{content.heading}</h2>
                <p className="intro management-context">{content.description}</p>
                <Button
                  className="management-main-cta"
                  href={content.button.href}
                  variant={content.button.variant as ButtonVariant}
                >
                  {content.button.text}
                </Button>
              </div>
            </div>
            <div className="management-carousel-copy">
              <div className="service-rows">
                {content.cards.map((card, index) => (
                  <article
                    className="service-row"
                    key={card.title}
                    style={{ "--service-index": index } as CSSProperties}
                  >
                    <div>
                      <h3>{card.title}</h3>
                      <div className="service-card-media">
                        <img
                          src={card.image.src}
                          alt={card.image.alt}
                          width="900"
                          height="560"
                          loading="lazy"
                        />
                      </div>
                      <p>{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
