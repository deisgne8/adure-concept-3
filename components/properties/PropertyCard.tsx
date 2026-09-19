import Link from "next/link";
import { ArrowRight, Bath, BedDouble, Maximize2 } from "lucide-react";
import type { PropertyUnit } from "../../lib/properties/types";

type PropertyCardProps = {
  property: PropertyUnit;
};

export function formatPropertyPrice(property: PropertyUnit) {
  const amount =
    property.transaction === "sale" ? property.salePrice : property.annualRent;
  if (amount === null) return null;
  const suffix = property.transaction === "lease" ? " / year" : "";
  return `${property.currency} ${amount.toLocaleString("en-US")}${suffix}`;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const building = property.building;
  if (!building) return null;
  const href = `/properties/${building.slug}/${property.slug}`;
  const price = formatPropertyPrice(property);

  return (
    <article className="catalog-card">
      {property.cardImage?.card ? (
        <Link className="catalog-card-media" href={href}>
          <img
            alt={property.cardImage.alt || property.title}
            height="540"
            src={property.cardImage.card}
            width="720"
          />
        </Link>
      ) : null}
      <div className="catalog-card-copy">
        <div className="catalog-card-meta">
          <span>{property.sectors[0]?.name}</span>
          <span>
            {property.transaction === "both"
              ? "Sale or lease"
              : property.transaction}
          </span>
        </div>
        <h2>
          <Link href={href}>{property.title}</Link>
        </h2>
        <p className="catalog-card-place">
          {[building.name, property.locations.at(-1)?.name]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="catalog-card-facts" aria-label="Property facts">
          {property.bedrooms !== null ? (
            <span>
              <BedDouble aria-hidden="true" />{" "}
              {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} beds`}
            </span>
          ) : null}
          {property.bathrooms !== null ? (
            <span>
              <Bath aria-hidden="true" /> {property.bathrooms} baths
            </span>
          ) : null}
          {property.areaSqm !== null ? (
            <span>
              <Maximize2 aria-hidden="true" />{" "}
              {property.areaSqm.toLocaleString("en-US")} sqm
            </span>
          ) : null}
        </div>
        <div className="catalog-card-footer">
          {price ? <strong>{price}</strong> : <span />}
          <Link aria-label={`View ${property.title}`} href={href}>
            View unit <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
