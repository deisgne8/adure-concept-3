import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

type Item = { title: string; description: string };

export default function CustomerCommitmentStack({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const section = grid?.closest<HTMLElement>(".customer-commitment");
    if (!grid || !section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth < 981) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setActiveIndex(Math.round(progress * (items.length - 1)));
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [items.length]);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className={`commitment-grid${activeIndex === 0 ? " is-start" : ""}`} ref={gridRef}>
      {items.map((item, index) => {
        const active = index === activeIndex;
        return (
          <article
            className={active ? "is-active" : index < activeIndex ? "is-before" : "is-after"}
            key={item.title}
            role="button"
            tabIndex={0}
            aria-expanded={active}
            style={{ "--stack-offset": index } as CSSProperties}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}
