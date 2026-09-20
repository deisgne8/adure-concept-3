import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { CustomerSector } from "../../lib/customers/types";

type Props = { items: CustomerSector[] };

export default function CustomerAssetCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const canLoop = items.length > 1;

  useEffect(() => {
    const frame = requestAnimationFrame(() => swiperRef.current?.update());
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

  return (
    <div className="asset-carousel" aria-label="Asset types supported by ADURE">
      <Swiper
        className="asset-carousel-viewport"
        slidesPerView="auto"
        spaceBetween={16}
        loop={canLoop}
        watchOverflow
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          requestAnimationFrame(() => swiper.update());
        }}
      >
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <SwiperSlide className={`asset-story-card-feature${active ? " is-active" : ""}`} key={item.title}>
              <article
                tabIndex={0}
                aria-current={active ? "true" : undefined}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    swiperRef.current?.slideToLoop(index);
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
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="asset-carousel-controls" aria-label="Asset carousel controls">
        <button className="asset-carousel-arrow" type="button" onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous asset type">←</button>
        <div className="asset-carousel-dots" aria-label="Select asset type">
          {items.map((item, index) => (
            <button
              className={`asset-carousel-dot${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={item.title}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => swiperRef.current?.slideToLoop(index)}
            />
          ))}
        </div>
        <button className="asset-carousel-arrow" type="button" onClick={() => swiperRef.current?.slideNext()} aria-label="Next asset type">→</button>
      </div>
    </div>
  );
}
