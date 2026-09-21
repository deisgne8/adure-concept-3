import { useEffect, useRef } from "react";
import type { PortfolioProject } from "../../lib/portfolio/types";
import Button from "../ui/Button";

type Props = {
  city: string;
  project: PortfolioProject | null;
  onClose: () => void;
};

export default function PortfolioProjectModal({ city, project, onClose }: Props) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!project) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !cardRef.current) return;
      const focusable = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    html.classList.add("portfolio-popup-open");
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => cardRef.current?.focus({ preventScroll: true }));
    return () => {
      html.classList.remove("portfolio-popup-open");
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose, project]);

  if (!project) return null;
  const description = project.description ?? `${project.name} is part of ADURE’s managed portfolio in ${city}, supported by connected expertise across leasing, operations, facility management and owner reporting.`;

  return (
    <div className="portfolio-popup is-open" role="dialog" aria-modal="true" aria-labelledby="portfolio-popup-title">
      <button className="portfolio-popup-backdrop" type="button" onClick={onClose} aria-label="Close project details" />
      <article className="portfolio-popup-card" ref={cardRef} tabIndex={-1}>
        <div className="portfolio-popup-copy">
          <button className="portfolio-popup-close" type="button" onClick={onClose} aria-label="Close project details">×</button>
          <h3 id="portfolio-popup-title">{project.name}</h3>
          <span className="portfolio-detail-line" aria-hidden="true" />
          <p>{description}</p>
          <div className="portfolio-detail-actions">
            <div className="portfolio-contact-block" aria-label="Abu Dhabi Office contact details">
              <h4>Abu Dhabi Office</h4>
              <p>Abu Dhabi,<br />United Arab Emirates</p>
              <p><a href="tel:+971505321440">+971 50 532 1440</a></p>
              <p><a href="mailto:abudhabileasing@adu-re.com">abudhabileasing@adu-re.com</a></p>
            </div>
            <div className="portfolio-action-buttons">
              <Button href="/properties" variant="primary">Explore properties</Button>
              <Button className="portfolio-contact-button" href="/contact">Contact ADURE</Button>
            </div>
          </div>
        </div>
        <figure className="portfolio-popup-image">
          <img src={project.image} alt={project.name} draggable="false" />
        </figure>
      </article>
    </div>
  );
}
