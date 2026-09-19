import content from "../../data/home/hero.json";

export default function HeroSection() {
  return (
    <>
      <section className="site-hero section" id={content.id}>
        <video
          className="hero-video"
          id="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="assets/hidd-al-saadiyat/hero-wave-facade.webp"
          aria-label="Hidd Al Saadiyat architectural film"
        >
          <source src="assets/hidd-al-saadiyat-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-inner">
          <div className="hero-lockup">
            <div>
              {/* prettier-ignore */}
              <h1>
                <span>Creating Value</span>{" "}
                <span>Beyond Property</span>
              </h1>
            </div>
            <div className="hero-side">
              <p>A connected approach to real estate, shaped in Abu Dhabi.</p>
              <div className="hero-actions">
                <a
                  className="btn primary"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#about"
                >
                  Explore ADURE
                </a>
                <a
                  className="btn link"
                  href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#properties"
                >
                  Find a property
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
