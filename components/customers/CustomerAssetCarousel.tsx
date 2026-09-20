import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomerSector } from "../../lib/customers/types";

type Props = { items: CustomerSector[] };

export default function CustomerAssetCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const pointerStart = useRef<number | null>(null);
  const pointerCurrent = useRef(0);

  const select = useCallback((index: number) => {
    setActiveIndex((index + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const syncOffset = () => setOffset(cardRefs.current[activeIndex]?.offsetLeft ?? 0);
    const frame = requestAnimationFrame(syncOffset);
    window.addEventListener("resize", syncOffset, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncOffset);
    };
  }, [activeIndex]);

  return (
    <div className="asset-carousel" aria-label="Asset types supported by ADURE">
      <div className="asset-carousel-viewport">
        <div
          className="asset-carousel-track"
          style={{ transform: `translateX(-${offset}px)` }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") select(activeIndex - 1);
            if (event.key === "ArrowRight") select(activeIndex + 1);
          }}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
            pointerCurrent.current = event.clientX;
            event.currentTarget.setPointerCapture?.(event.pointerId);
          }}
          onPointerMove={(event) => { if (pointerStart.current !== null) pointerCurrent.current = event.clientX; }}
          onPointerUp={() => {
            if (pointerStart.current !== null && Math.abs(pointerCurrent.current - pointerStart.current) > 48) {
              select(activeIndex + (pointerCurrent.current < pointerStart.current ? 1 : -1));
            }
            pointerStart.current = null;
          }}
        >
          {items.map((item, index) => {
            const active = index === activeIndex;
            return (
              <article
                className={`asset-story-card asset-story-card-feature${active ? " is-active" : ""}`}
                key={item.title}
                ref={(element) => { cardRefs.current[index] = element; }}
                tabIndex={0}
                aria-current={active ? "true" : undefined}
                onClick={() => select(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(index);
                  }
                }}
              >
                <div className="asset-story-feature-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <figure className="asset-story-feature-image">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" draggable="false" />
                </figure>
                <div className="asset-story-teaser" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="asset-carousel-controls" aria-label="Asset carousel controls">
        <button className="asset-carousel-arrow" type="button" onClick={() => select(activeIndex - 1)} aria-label="Previous asset type">←</button>
        <div className="asset-carousel-dots" aria-label="Select asset type">
          {items.map((item, index) => (
            <button
              className={`asset-carousel-dot${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={item.title}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => select(index)}
            />
          ))}
        </div>
        <button className="asset-carousel-arrow" type="button" onClick={() => select(activeIndex + 1)} aria-label="Next asset type">→</button>
      </div>
    </div>
  );
}
