import Link from "next/link";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { BuildingDetail } from "../../lib/properties/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import PropertyCard from "./PropertyCard";
import { aosSequenceDelay } from "../../lib/aos";

type BuildingDetailPageProps = {
  building: BuildingDetail;
  site: HomeContent["site"];
};

export default function BuildingDetailPage({
  building,
  site,
}: BuildingDetailPageProps) {
  const hero = building.heroImage?.full || building.cardImage?.full;
  return (
    <div className="property-page">
      <SiteChrome
        content={site}
        homeHref="/"
        currentPath="/properties"
        surface="solid"
        standalone
      />
      <main id="main">
        <section className={`property-detail-hero${hero ? " has-image" : ""}`}>
          {hero ? (
            <img alt={building.heroImage?.alt || building.name} src={hero} />
          ) : null}
          <div className="section-shell property-detail-hero-copy">
            <Link href="/properties" data-aos="fade-up">Properties</Link>
            <h1 data-aos="fade-up" data-aos-delay="100">{building.name}</h1>
            {building.address ? <p data-aos="fade-up" data-aos-delay="200">{building.address}</p> : null}
          </div>
        </section>
        {building.summary ||
        building.description ||
        building.features.length ||
        building.amenities.length ? (
          <section className="property-overview pt_100 pb_100">
            <div className="section-shell property-overview-grid">
              <div data-aos="fade-right">
                <span className="eyebrow">Building overview</span>
                {building.summary ? <h2>{building.summary}</h2> : null}
              </div>
              <div className="property-rich-copy" data-aos="fade-left">
                {building.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: building.description }}
                  />
                ) : null}
                {building.features.length ? (
                  <ul>
                    {building.features.map((feature, index) => (
                      <li key={feature} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>{feature}</li>
                    ))}
                  </ul>
                ) : null}
                {building.amenities.length ? (
                  <div className="property-tags">
                    {building.amenities.map((amenity) => (
                      <span key={amenity.id}>{amenity.name}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
        {building.gallery.length ? (
          <section className="property-gallery pb_100">
            <div className="section-shell property-gallery-grid">
              {building.gallery.map((image, index) =>
                image.card ? (
                  <img
                    alt={image.alt || building.name}
                    key={image.id}
                    src={image.card}
                    data-aos="fade-up"
                    data-aos-delay={aosSequenceDelay(index)}
                  />
                ) : null,
              )}
            </div>
          </section>
        ) : null}
        <section className="building-units pt_100 pb_100">
          <div className="section-shell">
            <div className="catalog-results-head" data-aos="fade-up">
              <h2>Available units</h2>
              <p>{building.units.length} available</p>
            </div>
            {building.units.length ? (
              <div className="catalog-grid">
                {building.units.map((unit, index) => (
                  <div className="aos-card-reveal" data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)} key={unit.id}><PropertyCard property={unit} /></div>
                ))}
              </div>
            ) : (
              <p>No units are currently published as available.</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
