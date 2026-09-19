import { Fragment } from "react";
import Button, { type ButtonVariant } from "../ui/Button";
import Section from "../ui/Section";
import type { HomeContent } from "../../lib/home/load-home-content";

type HeroSectionProps = {
  content: HomeContent["hero"];
};

const heroButtonVariants = ["primary", "link"] satisfies ButtonVariant[];

export default function HeroSection({ content }: HeroSectionProps) {
  const heroButtons = content.buttons.slice(0, heroButtonVariants.length);

  return (
    <>
      <Section className="site-hero section" id={content.id} fullViewport>
        <video
          className="hero-video"
          id="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster={content.media.poster}
          aria-label="Hidd Al Saadiyat architectural film"
        >
          <source src={content.media.video} type="video/mp4" />
        </video>
        <div className="hero-inner">
          <div className="hero-lockup">
            <div>
              <h1 data-aos="fade-up">
                {content.heading.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </h1>
            </div>
            <div className="hero-side">
              <p data-aos="fade-up" data-aos-delay="100">
                {content.description}
              </p>
              <div className="hero-actions" data-aos="zoom-in" data-aos-delay="200">
                {heroButtons.map((button, index) => (
                  <Button
                    key={button.href}
                    className="hero-action"
                    href={button.href}
                    variant={heroButtonVariants[index]}
                  >
                    <span className="button-action-label">{button.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
