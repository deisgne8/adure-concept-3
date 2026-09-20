import type { HomeContent } from "../../lib/home/load-home-content";
import Button from "../ui/Button";
import SiteChromeClient from "./SiteChromeClient";

type SiteChromeProps = {
  content: HomeContent["site"];
  homeHref?: string;
  currentPath?: string;
  surface?: "overlay" | "solid";
  skipTargetId?: string;
  standalone?: boolean;
};

export default function SiteChrome({
  content,
  homeHref = content.header.logo.href,
  currentPath,
  surface = "overlay",
  skipTargetId = "main",
  standalone = false,
}: SiteChromeProps) {
  const { header } = content;
  const showIntro = !standalone;
  const persistentGlass = surface === "solid";

  return (
    <>
      {showIntro && (
        <div className="site-intro" id="site-intro" hidden aria-label={`Loading ${content.brand}`}>
          <button className="intro-skip" type="button">
            Skip intro <span aria-hidden="true">→</span>
          </button>
          <div className="intro-lockup">
            <div className="intro-brand" aria-hidden="true">
              <img src="/assets/adure-logo-horizontal.svg" alt="" />
            </div>
            <p className="intro-caption">
              <span>{content.tagline}</span>
            </p>
          </div>
        </div>
      )}
      {standalone && <SiteChromeClient persistentGlass={persistentGlass} />}
      <a className="skip-link" href={`#${skipTargetId}`}>
        Skip to content
      </a>
      <header className={`site-header${persistentGlass ? " is-glass" : ""}`}>
        <div className="container header-inner">
          <a href={homeHref} className="site-logo" aria-label={header.logo.ariaLabel}>
            <img src="/assets/adure-logo-horizontal.svg" alt={header.logo.alt} width="230" height="62" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {header.navigation.beforeServices.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.href === currentPath ? "page" : undefined}>
                {item.label}
              </a>
            ))}
            <div className="nav-disclosure">
              <button id="services-toggle" aria-expanded="false" aria-controls="services-menu">
                {header.navigation.services.label}
                <span className="services-arrow" aria-hidden="true" />
              </button>
              <div id="services-menu" hidden>
                {header.navigation.services.items.map((item) => (
                  <a key={item.label} href={item.href}>
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </a>
                ))}
              </div>
            </div>
            {header.navigation.afterServices.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.href === currentPath ? "page" : undefined}>{item.label}</a>
            ))}
          </nav>
          <Button className="header-cta" href={header.cta.href} variant="primary">
            <span className="button-action-label">{header.cta.label}</span>
          </Button>
          <button className="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog className="mobile-menu" id="mobile-menu" aria-label="Main navigation">
        <div className="menu-top">
          <a href={homeHref} className="site-logo">
            <img src="/assets/adure-logo-horizontal.svg" alt={header.logo.alt} />
          </a>
          <button className="icon-button menu-close" aria-label="Close menu">×</button>
        </div>
        <nav aria-label="Mobile navigation">
          {header.navigation.beforeServices.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
          <details>
            <summary>{header.navigation.services.label}</summary>
            {header.navigation.services.items.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </details>
          {header.navigation.afterServices.map((item) => (
            <a key={item.href} href={item.href} aria-current={item.href === currentPath ? "page" : undefined}>{item.label}</a>
          ))}
        </nav>
        <Button className="mobile-menu-cta" href={header.cta.href} variant="primary">{header.cta.label}</Button>
        <p className="menu-contact">
          {header.contact.markets}
          <br />
          <a href={header.contact.phoneHref}>{header.contact.phone}</a>
        </p>
      </dialog>
    </>
  );
}
