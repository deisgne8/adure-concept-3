import Link from "next/link";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { BuildingDetail } from "../../lib/properties/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import PropertyCard from "./PropertyCard";

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
            <Link href="/properties">Properties</Link>
            <h1>{building.name}</h1>
            {building.address ? <p>{building.address}</p> : null}
          </div>
        </section>
        {building.summary ||
        building.description ||
        building.features.length ||
        building.amenities.length ? (
          <section className="property-overview pt_100 pb_100">
            <div className="section-shell property-overview-grid">
              <div>
                <span className="eyebrow">Building overview</span>
                {building.summary ? <h2>{building.summary}</h2> : null}
              </div>
              <div className="property-rich-copy">
                {building.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: building.description }}
                  />
                ) : null}
                {building.features.length ? (
                  <ul>
                    {building.features.map((feature) => (
                      <li key={feature}>{feature}</li>
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
              {building.gallery.map((image) =>
                image.card ? (
                  <img
                    alt={image.alt || building.name}
                    key={image.id}
                    src={image.card}
                  />
                ) : null,
              )}
            </div>
          </section>
        ) : null}
        <section className="building-units pt_100 pb_100">
          <div className="section-shell">
            <div className="catalog-results-head">
              <h2>Available units</h2>
              <p>{building.units.length} available</p>
            </div>
            {building.units.length ? (
              <div className="catalog-grid">
                {building.units.map((unit) => (
                  <PropertyCard key={unit.id} property={unit} />
                ))}
              </div>
            ) : (
              <p>No units are currently published as available.</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}
