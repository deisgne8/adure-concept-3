import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import type { TestimonialsContent } from "../../lib/testimonials/types";

type Props = { content: TestimonialsContent; id?: string; variant: "home" | "customers" };

export default function TestimonialsCarousel({ content, id = "client-testimonials", variant }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const select = (index: number) => setActiveIndex((index + content.items.length) % content.items.length);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") select(activeIndex - 1);
    if (event.key === "ArrowRight") select(activeIndex + 1);
  };
  const onTouchStart = (event: TouchEvent<HTMLElement>) => { touchStart.current = event.touches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(distance) > 45) select(activeIndex + (distance < 0 ? 1 : -1));
    touchStart.current = null;
  };

  const prefix = variant === "home" ? "home-testimonials" : "perspectives";
  return <section className={variant === "home" ? "home-testimonials section" : "customer-perspectives testimonials-section"} id={id} aria-labelledby={`${id}-title`}>
    <div className={`section-shell ${prefix}-layout`} tabIndex={0} onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={`${prefix}-intro`} data-aos="fade-up"><h2 id={`${id}-title`}>{content.heading.split(" Clients ").map((part, index) => <span key={part}>{index ? <>Clients {part}</> : part}</span>)}</h2><p>{content.description}</p></div>
      <div className={`${prefix}-stage`} aria-live="polite" data-aos="fade-up" data-aos-delay="100">
        <span className={`${prefix}-quote-mark`} aria-hidden="true">“</span>
        <div className={`${prefix}-slides`}>{content.items.map((item, index) => <article className={`${variant === "home" ? "home-testimonial" : "perspectives-testimonial"}${index === activeIndex ? " is-active" : ""}`} aria-hidden={index !== activeIndex} key={item.name}><blockquote>{item.quote}</blockquote><div className={variant === "home" ? "home-testimonial-meta" : "perspectives-customer-meta"}><strong>{item.name}</strong></div></article>)}</div>
        <div className={`${prefix}-controls`} aria-label="Testimonials controls"><button className={`${prefix}-arrow`} type="button" onClick={() => select(activeIndex - 1)} aria-label="Previous testimonial">←</button><button className={`${prefix}-arrow is-primary`} type="button" onClick={() => select(activeIndex + 1)} aria-label="Next testimonial">→</button></div>
        <div className={`${prefix}-thumbs`} aria-label={variant === "home" ? "Current testimonial" : "Choose testimonial"}>{content.items.map((item, index) => <button className={`${prefix}-thumb${index === activeIndex ? " is-active" : ""}`} type="button" onClick={() => select(index)} aria-label={`Show testimonial from ${item.name}`} aria-current={index === activeIndex} key={item.name}><img className="testimonial-avatar-image" src={item.avatar} alt="" aria-hidden="true" /></button>)}</div>
      </div>
    </div>
  </section>;
}
