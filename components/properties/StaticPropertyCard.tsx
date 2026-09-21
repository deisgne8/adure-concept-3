import { ArrowRight } from "lucide-react";
import type { StaticProperty } from "../../lib/properties/static-types";
import { propertyPrice } from "../../lib/properties/static-catalog";

type StaticPropertyCardProps = {
  index?: number;
  mapCard?: boolean;
  onFavourite: (id: string) => void;
  onShare: (property: StaticProperty, button?: HTMLButtonElement) => void;
  property: StaticProperty;
  saved: boolean;
};

function HeartIcon() {
  return (
    <svg className="heart-icon" viewBox="0 0 512 512" aria-hidden="true">
      <path d="M256.001 477.407c-2.59 0-5.179-.669-7.499-2.009-2.52-1.454-62.391-36.216-123.121-88.594-35.994-31.043-64.726-61.833-85.396-91.513-26.748-38.406-40.199-75.348-39.982-109.801.254-40.09 14.613-77.792 40.435-106.162 26.258-28.848 61.3-44.734 98.673-44.734 47.897 0 91.688 26.83 116.891 69.332 25.203-42.501 68.994-69.332 116.891-69.332 35.308 0 68.995 14.334 94.859 40.362 28.384 28.563 44.511 68.921 44.247 110.724-.218 34.393-13.921 71.279-40.728 109.632-20.734 29.665-49.426 60.441-85.279 91.475-60.508 52.373-119.949 87.134-122.45 88.588-2.331 1.354-4.937 2.032-7.541 2.032z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="share-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.25 10.85 15.75 6.15M8.25 13.15l7.5 4.7" />
    </svg>
  );
}

function hasValidArea(area: number) {
  return typeof area === "number" && Number.isFinite(area) && area > 0;
}

function PropertyFacts({ property }: { property: StaticProperty }) {
  return (
    <>
      <span>
        <img
          src={`/assets/property-icons/${property.type === "Commercial" ? "area" : "bed"}.svg`}
          alt=""
          aria-hidden="true"
        />
        {property.type === "Commercial" ? "Commercial" : `${property.beds} Bed`}
      </span>
      <span>
        <img src="/assets/property-icons/bath.svg" alt="" aria-hidden="true" />
        {property.baths} Bath
      </span>
      {hasValidArea(property.area) ? (
        <span>
          <img src="/assets/property-icons/area.svg" alt="" aria-hidden="true" />
          {property.area} m²
        </span>
      ) : null}
    </>
  );
}

export default function StaticPropertyCard({
  index = 0,
  mapCard = false,
  onFavourite,
  onShare,
  property,
  saved,
}: StaticPropertyCardProps) {
  const share = (event: React.MouseEvent<HTMLButtonElement>) => {
    onShare(property, event.currentTarget);
  };
  const favourite = () => onFavourite(property.id);

  if (mapCard) {
    return (
      <article className="map-drawer-card" data-map-listing={property.id}>
        <div className="map-drawer-media">
          <img src={property.image} alt={property.title} loading="lazy" decoding="async" />
          <div className="map-drawer-actions">
            <button className="map-drawer-share" type="button" onClick={share} aria-label={`Share ${property.title}`}>
              <ShareIcon />
            </button>
            <button
              className="map-drawer-save"
              type="button"
              onClick={favourite}
              aria-label={saved ? "Remove from saved properties" : "Save property"}
              aria-pressed={saved}
            >
              <HeartIcon />
            </button>
          </div>
        </div>
        <div className="map-drawer-copy">
          <small className="map-drawer-location">
            <span className="location-pin-icon" aria-hidden="true" />
            <span>{property.community} · {property.city}</span>
          </small>
          <h3>{property.title}</h3>
          <p>{property.building} · {property.unit}</p>
          <strong>{propertyPrice(property)}</strong>
          <div className="map-drawer-facts"><PropertyFacts property={property} /></div>
        </div>
      </article>
    );
  }

  const reference = `REF # ADU-${property.id.toUpperCase().replace(/[^A-Z0-9]/g, "-")}`;
  return (
    <article
      className="property-card"
      data-property-id={property.id}
      data-index={String(index).padStart(2, "0")}
      style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
    >
      <div className="property-card-media">
        <img
          src={property.image}
          alt={`${property.title} at ${property.building}`}
          loading="lazy"
          decoding="async"
        />
        <span className="property-status">
          {property.status} · {property.intent === "lease" ? "For Lease" : "For Sale"}
        </span>
        <div className="property-media-actions">
          <button className="share-button" type="button" onClick={share} aria-label={`Share ${property.title}`}>
            <ShareIcon />
          </button>
          <button
            className="favourite-button"
            type="button"
            onClick={favourite}
            aria-label={saved ? "Remove from saved properties" : "Save property"}
            aria-pressed={saved}
          >
            <HeartIcon />
          </button>
        </div>
      </div>
      <div className="property-card-body">
        <div className="property-location">
          <span className="location-pin-icon" aria-hidden="true" />
          <span>{property.community} · {property.city}</span>
        </div>
        <h3>{property.title}</h3>
        <p className="property-building">{property.building} · {property.unit}</p>
        <div className="property-price">{propertyPrice(property)}</div>
        <div className={`property-facts${hasValidArea(property.area) ? "" : " has-two-facts"}`}><PropertyFacts property={property} /></div>
        <div className="property-card-footer">
          <span>{reference}</span>
          <span className="view-property">
            <span>View property</span>
            <ArrowRight aria-hidden="true" className="button-arrow" />
          </span>
        </div>
      </div>
    </article>
  );
}
