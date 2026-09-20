import { useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

type Item = { title: string; description: string };

export default function CustomerCommitmentStack({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className="commitment-grid">
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
