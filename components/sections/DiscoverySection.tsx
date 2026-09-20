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
            <h2>Find Your Next Address</h2>
            <p>
              Explore available properties across our locations and communities.
            </p>
          </div>
          <button
            className="btn filter-open"
            type="button"
            aria-haspopup="dialog"
          >
            Find real estate <span aria-hidden="true">⌕</span>
          </button>
          <div id="filter-home">
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
                    <span>More Filters</span>
                  </span>
                  <small>Facilities &amp; Amenities</small>
                </button>
                <div className="more-filters-panel" id="amenity-filters" hidden>
                  <p>Facilities &amp; amenities</p>
                  <div className="amenity-grid">
                    <label><input type="checkbox" name="amenity" value="Parking" /><span>Parking</span></label>
                    <label><input type="checkbox" name="amenity" value="Balcony" /><span>Balcony</span></label>
                    <label><input type="checkbox" name="amenity" value="Swimming Pool" /><span>Swimming Pool</span></label>
                    <label><input type="checkbox" name="amenity" value="Gym" /><span>Gym</span></label>
                    <label><input type="checkbox" name="amenity" value="24/7 Security" /><span>24/7 Security</span></label>
                    <label><input type="checkbox" name="amenity" value="Pet Friendly" /><span>Pet Friendly</span></label>
                  </div>
                  <div className="amenity-actions">
                    <button className="btn dark amenity-search" type="submit">Search properties</button>
                  </div>
                </div>
              </div>
              <button className="btn dark search-primary" type="submit">Search properties</button>
            </form>
          </div>
          <p className="search-status" id="search-status" role="status" aria-live="polite"></p>
          <div className="grid-3" id="home-properties"></div>
          <div className="discovery-actions">
            <Button
              className="button-wipe discovery-view-all"
              href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#properties"
              showArrow={false}
              variant="default"
            >
              <span>View all properties</span>
            </Button>
            <Button href="https://deisgne8.github.io/adure-wireframe-v2.0/dist/index.html?v=7e31062-final#list-property" variant="link">Thinking of selling? Sell your property</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
