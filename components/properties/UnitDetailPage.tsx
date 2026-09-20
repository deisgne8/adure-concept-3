import Link from "next/link";
import { Bath, BedDouble, Check, Maximize2 } from "lucide-react";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { PropertyUnitDetail } from "../../lib/properties/types";
import Button from "../ui/Button";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import { formatPropertyPrice } from "./PropertyCard";

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
        <section className={`unit-hero${hero ? " has-image" : ""}`}>
          {hero ? (
            <img alt={property.gallery[0]?.alt || property.title} src={hero} />
          ) : null}
          <div className="section-shell unit-hero-copy">
            <div className="unit-breadcrumb">
              <Link href="/properties">Properties</Link>
              <span>/</span>
              <Link href={`/properties/${building.slug}`}>{building.name}</Link>
            </div>
            <div className="unit-heading">
              <div>
                <span className="eyebrow">
                  {property.sectors[0]?.name} · Unit {property.unitCode}
                </span>
                <h1>{property.title}</h1>
              </div>
              {price ? <strong>{price}</strong> : null}
            </div>
          </div>
        </section>
        <section className="unit-overview pt_100 pb_100">
          <div className="section-shell unit-overview-grid">
            <div className="unit-main">
              <div className="unit-facts">
                {property.bedrooms !== null ? (
                  <span>
                    <BedDouble aria-hidden="true" />
                    <strong>
                      {property.bedrooms === 0 ? "Studio" : property.bedrooms}
                    </strong>
                    <small>
                      {property.bedrooms === 0 ? "Residence" : "Bedrooms"}
                    </small>
                  </span>
                ) : null}
                {property.bathrooms !== null ? (
                  <span>
                    <Bath aria-hidden="true" />
                    <strong>{property.bathrooms}</strong>
                    <small>Bathrooms</small>
                  </span>
                ) : null}
                {property.areaSqm !== null ? (
                  <span>
                    <Maximize2 aria-hidden="true" />
                    <strong>{property.areaSqm.toLocaleString("en-US")}</strong>
                    <small>Square metres</small>
                  </span>
                ) : null}
              </div>
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
                    ].map((feature) => (
                      <li key={feature}>
                        <Check aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {property.gallery.length > 1 ? (
                <div className="property-gallery-grid">
                  {property.gallery
                    .slice(1)
                    .map((image) =>
                      image.card ? (
                        <img
                          alt={image.alt || property.title}
                          key={image.id}
                          src={image.card}
                        />
                      ) : null,
                    )}
                </div>
              ) : null}
            </div>
            <aside className="unit-contact">
              <span className="eyebrow">Enquire about this unit</span>
              {property.primaryBroker ? (
                <div className="broker-profile">
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
              <dl>
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
      <SiteFooter homeHref="/" />
    </div>
  );
}
