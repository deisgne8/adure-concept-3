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
  const navigation = header.navigation;
  const isCurrent = (href: string) => href.split(/[?#]/)[0] === currentPath;

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
      <SiteChromeClient persistentGlass={persistentGlass} />
      <a className="skip-link" href={`#${skipTargetId}`}>
        Skip to content
      </a>
      <header className={`site-header${persistentGlass ? " is-glass" : ""}`}>
        <div className="container header-inner">
          <a href={homeHref} className="site-logo" aria-label={header.logo.ariaLabel}>
            <img src={header.logo.src} alt={header.logo.alt} width="230" height="62" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item, index) => item.items?.length ? (
              <div className="nav-dropdown" key={item.label}>
                <a
                  className="nav-dropdown-toggle"
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  aria-haspopup="true"
                  aria-controls={`nav-menu-${index}`}
                >
                  {item.label}
                </a>
                <div className="nav-dropdown-menu" id={`nav-menu-${index}`}>
                  {item.items.map((subitem) => <a key={`${item.label}-${subitem.label}`} href={subitem.href}>{subitem.label}</a>)}
                </div>
              </div>
            ) : (
              <a key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</a>
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
            <img src={header.logo.src} alt={header.logo.alt} />
          </a>
          <button className="icon-button menu-close" aria-label="Close menu">×</button>
        </div>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => item.items?.length ? (
            <details className="mobile-nav-group" key={item.label}>
              <summary>{item.label}</summary>
              {item.items.map((subitem) => <a key={`${item.label}-${subitem.label}`} href={subitem.href}>{subitem.label}</a>)}
            </details>
          ) : (
            <a key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</a>
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
