import Section from "../ui/Section";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import type { HomeContent } from "../../lib/home/load-home-content";

type DiscoverySectionProps = {
  content: HomeContent["discovery"];
};

export default function DiscoverySection({ content }: DiscoverySectionProps) {
  return (
    <>
      <Section
        className="discovery-v2 section"
        id={content.id}
        spacing={content.spacing}
      >
        <div className="section-shell">
          <div className="discovery-title">
            <h2>{content.heading}</h2>
            <p>{content.description}</p>
          </div>
          <button
            className="btn filter-open"
            type="button"
            aria-haspopup="dialog"
            data-aos="zoom-in"
          >
            {content.mobileButton} <span aria-hidden="true">⌕</span>
          </button>
          <div id="filter-home" data-aos="fade-up" data-aos-delay="100">
            <form className="search-box" id="property-search">
              <div className="tabs" role="group" aria-label="Property intent">
                <button
                  className="tab active"
                  type="button"
                  data-intent="buy"
                  aria-pressed="true"
                >
                  Buy
                </button>
                <button
                  className="tab"
                  type="button"
                  data-intent="lease"
                  aria-pressed="false"
                >
                  Lease
                </button>
              </div>
              <SelectField
                id="filter-location"
                label="Location"
                name="location"
                options={[
                  { label: "All locations", value: "All locations" },
                  { label: "Abu Dhabi", value: "Abu Dhabi" },
                  { label: "Dubai", value: "Dubai" },
                  { label: "Al Ain", value: "Al Ain" },
                ]}
              />
              <SelectField
                id="filter-type"
                label="Property type"
                name="type"
                options={[
                  { label: "All types", value: "All types" },
                  { label: "Apartment", value: "Apartment" },
                  { label: "Villa", value: "Villa" },
                  { label: "Commercial", value: "Commercial" },
                ]}
              />
              <SelectField
                id="filter-bedrooms"
                label="Bedrooms"
                name="bedrooms"
                options={[
                  { label: "Any bedrooms", value: "Any bedrooms" },
                  { label: "Studio", value: "Studio" },
                  { label: "1–2 bedrooms", value: "1–2 bedrooms" },
                  { label: "3+ bedrooms", value: "3+ bedrooms" },
                ]}
              />
              <SelectField
                id="filter-price"
                label="Price range"
                name="price"
                options={[
                  { label: "Any price", value: "Any price" },
                  { label: "Under AED 100K", value: "Under AED 100K" },
                  { label: "AED 100K–200K", value: "AED 100K–200K" },
                  { label: "AED 200K+", value: "AED 200K+" },
                ]}
              />
              <div className="more-filters">
                <button
                  className="more-filters-toggle"
                  type="button"
                  aria-expanded="false"
                  aria-controls="amenity-filters"
                >
                  <span className="more-filters-label">
                    <span
                      className="more-filters-symbol"
                      aria-hidden="true"
                    ></span>
                    <span>{content.moreFiltersLabel}</span>
                  </span>
                  <small>{content.moreFiltersDescription}</small>
                </button>
                <div className="more-filters-panel" id="amenity-filters" hidden>
                  <p>{content.moreFiltersDescription}</p>
                  <div className="amenity-grid">
                    {content.amenities.map((amenity) => <label key={amenity}><input type="checkbox" name="amenity" value={amenity} /><span>{amenity}</span></label>)}
                  </div>
                  <div className="amenity-actions">
                    <Button className="amenity-search" type="submit" variant="dark">{content.submitButton}</Button>
                  </div>
                </div>
              </div>
              <Button className="search-primary" type="submit" variant="dark">{content.submitButton}</Button>
            </form>
          </div>
          <p className="search-status" id="search-status" role="status" aria-live="polite"></p>
          <div className="grid-3" id="home-properties"></div>
          <div className="discovery-actions" data-aos="fade-up" data-aos-delay="100">
            {content.actions.map((action, index) => (
              <Button
                className={index === 0 ? "button-wipe discovery-view-all" : undefined}
                href={action.href}
                key={action.label}
                showArrow={index !== 0}
                variant={action.variant as "default" | "link"}
              >
                {index === 0 ? <span>{action.label}</span> : action.label}
              </Button>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
