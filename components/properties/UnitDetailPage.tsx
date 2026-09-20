import Link from "next/link";
import { Check } from "lucide-react";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { PropertyUnitDetail } from "../../lib/properties/types";
import Button from "../ui/Button";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import { formatPropertyPrice } from "./PropertyCard";
import { aosSequenceDelay } from "../../lib/aos";

type UnitDetailPageProps = {
  property: PropertyUnitDetail;
  site: HomeContent["site"];
};

export default function UnitDetailPage({
  property,
  site,
}: UnitDetailPageProps) {
  const building = property.building;
  if (!building) return null;
  const hero =
    property.gallery[0]?.full ||
    property.cardImage?.full ||
    building.heroImage?.full;
  const price = formatPropertyPrice(property);
  const features = [
    property.features.balcony && "Balcony",
    property.features.maidRoom && "Maid room",
    property.features.storeRoom && "Store room",
    property.features.studyRoom && "Study room",
  ].filter((item): item is string => Boolean(item));
  const gallery = [
    hero
      ? {
          alt: property.gallery[0]?.alt || property.title,
          id: "hero",
          src: hero,
        }
      : null,
    ...property.gallery.slice(1, 3).flatMap((image) =>
      image.full || image.card
        ? [{ alt: image.alt || property.title, id: String(image.id), src: image.full || image.card }]
        : [],
    ),
  ].filter((image): image is { alt: string; id: string; src: string } => Boolean(image));
  const propertyType = property.unitTypes[0]?.name || property.subtype || "Not specified";
  const location = [building.name, property.locations.at(-1)?.name]
    .filter(Boolean)
    .join(" · ");

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
        <section className="unit-detail-hero" aria-labelledby="unit-title">
          <div className="section-shell">
            <nav className="unit-detail-breadcrumb" aria-label="Breadcrumb" data-aos="fade-up">
              <Link href="/properties">Properties</Link>
              <span>/</span>
              <Link href={`/properties/${building.slug}`}>{building.name}</Link>
            </nav>
            <div className="unit-detail-hero-grid">
              <div data-aos="fade-right">
                <span className="unit-detail-eyebrow">
                  {property.status} for {property.transaction === "sale" ? "sale" : "lease"}
                </span>
                <h1 id="unit-title">{property.title}</h1>
                {location ? <p className="unit-detail-location">{location}</p> : null}
                {property.summary ? <p className="unit-detail-intro">{property.summary}</p> : null}
                <div className="unit-detail-actions">
                  <Button className="button-wipe" href="#unit-enquiry">
                    <span>Request viewing</span>
                  </Button>
                  <Button href="/properties" variant="link" showArrow={false}>
                    Back to properties
                  </Button>
                </div>
              </div>
              <aside className="unit-detail-price" aria-label="Property price and reference" data-aos="fade-left">
                <span>{property.transaction === "sale" ? "Sale price" : "Annual rent"}</span>
                {price ? <strong>{price}</strong> : <strong>Price on request</strong>}
                <small>Reference ADU-{property.id}</small>
              </aside>
            </div>
            {gallery.length ? (
              <div className="unit-detail-gallery" aria-label="Property image gallery">
                {gallery.map((image, index) => (
                  <figure className={index === 0 ? "unit-detail-gallery-main" : ""} key={image.id} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>
                    <img alt={image.alt} src={image.src} />
                  </figure>
                ))}
              </div>
            ) : null}
            <dl className="unit-detail-facts" aria-label="Property facts">
              <div data-aos="fade-up"><dt>Bedrooms</dt><dd>{property.bedrooms === null ? "--" : property.bedrooms === 0 ? "Studio" : property.bedrooms}</dd></div>
              <div data-aos="fade-up" data-aos-delay="100"><dt>Bathrooms</dt><dd>{property.bathrooms ?? "--"}</dd></div>
              <div data-aos="fade-up" data-aos-delay="200"><dt>Area</dt><dd>{property.areaSqm === null ? "--" : `${property.areaSqm.toLocaleString("en-US")} sqm`}</dd></div>
              <div data-aos="fade-up" data-aos-delay="300"><dt>Property type</dt><dd>{propertyType}</dd></div>
              <div data-aos="fade-up" data-aos-delay="400"><dt>Status</dt><dd>{property.status}</dd></div>
            </dl>
          </div>
        </section>
        <section className="unit-detail-overview pt_100 pb_100">
          <div className="section-shell unit-overview-grid">
            <div className="unit-main" data-aos="fade-right">
              <span className="unit-detail-eyebrow">Property overview</span>
              <h2>{property.summary || property.title}</h2>
              {property.description ? (
                <div
                  className="property-rich-copy"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              ) : null}
              {features.length || property.amenities.length ? (
                <div className="unit-features">
                  <h2>Features and amenities</h2>
                  <ul>
                    {[
                      ...features,
                      ...property.amenities.map((amenity) => amenity.name),
                    ].map((feature, index) => (
                      <li key={feature} data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)}>
                        <Check aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <aside className="unit-contact unit-detail-enquiry" id="unit-enquiry">
              <span className="eyebrow" data-aos="fade-up">Enquire about this unit</span>
              {property.primaryBroker ? (
                <div className="broker-profile" data-aos="fade-up" data-aos-delay="100">
                  {property.primaryBroker.photo?.thumbnail ? (
                    <img
                      alt={
                        property.primaryBroker.photo.alt ||
                        property.primaryBroker.name
                      }
                      src={property.primaryBroker.photo.thumbnail}
                    />
                  ) : null}
                  <div>
                    <strong>{property.primaryBroker.name}</strong>
                    {property.primaryBroker.position ? (
                      <span>{property.primaryBroker.position}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {property.primaryBroker?.phone ? (
                <Button
                  href={`tel:${property.primaryBroker.phone}`}
                  variant="primary"
                >
                  Call broker
                </Button>
              ) : null}
              {property.primaryBroker?.email ? (
                <Button
                  href={`mailto:${property.primaryBroker.email}?subject=${encodeURIComponent(property.title)}`}
                  variant="dark"
                >
                  Email broker
                </Button>
              ) : null}
              <dl data-aos="fade-up" data-aos-delay="200">
                {property.floor ? (
                  <>
                    <dt>Floor</dt>
                    <dd>{property.floor}</dd>
                  </>
                ) : null}
                {property.subtype ? (
                  <>
                    <dt>Type</dt>
                    <dd>{property.subtype}</dd>
                  </>
                ) : null}
                {property.view ? (
                  <>
                    <dt>View</dt>
                    <dd>{property.view}</dd>
                  </>
                ) : null}
                {property.netAreaSqm !== null ? (
                  <>
                    <dt>Net area</dt>
                    <dd>{property.netAreaSqm.toLocaleString("en-US")} sqm</dd>
                  </>
                ) : null}
              </dl>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
