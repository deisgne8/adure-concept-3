"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type PortfolioProject = {
  image: string;
  title: string;
  location: string;
};

type PortfolioSwiperProps = {
  href: string;
  projects: PortfolioProject[];
};

export default function PortfolioSwiper({ href, projects }: PortfolioSwiperProps) {
  const canLoop = projects.length > 4;

  return (
    <Swiper
      className="portfolio-mosaic"
      modules={[Autoplay]}
      slidesPerView={1.12}
      spaceBetween={16}
      loop={canLoop}
      autoplay={canLoop ? { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
      breakpoints={{
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 28 },
      }}
      aria-label="Portfolio highlights"
    >
      {projects.map((project) => (
        <SwiperSlide key={project.title} className="portfolio-item-v2">
          <article className="portfolio-card">
            <a className="portfolio-card-link" href={href} aria-label={`Explore ${project.title}`}>
              <div className="portfolio-image">
                <img src={project.image} alt={`${project.title}, ${project.location}`} draggable="false" loading="lazy" />
              </div>
              <div className="portfolio-caption">
                <h3>{project.title}</h3>
              </div>
            </a>
            <div className="portfolio-card-meta">
              <span>{project.location}</span>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
