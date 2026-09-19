"use client";

import { useMemo, useState } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import PropertyCard from "../properties/PropertyCard";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import Section from "../ui/Section";

type DiscoverySectionProps = { content: HomeContent["discovery"] };

export default function DiscoverySection({ content }: DiscoverySectionProps) {
  const [sector, setSector] = useState("residential");
  const [transaction, setTransaction] = useState("lease");
  const [location, setLocation] = useState("all");
  const [unitType, setUnitType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const properties = content.properties;
  const facets = properties.facetsBySector[sector as "residential" | "retail"];
  const visibleProperties = useMemo(
    () =>
      properties.items
        .filter((property) =>
          property.sectors.some((item) => item.slug === sector),
        )
        .filter(
          (property) =>
            transaction === property.transaction ||
            property.transaction === "both",
        )
        .filter(
          (property) =>
            location === "all" ||
            property.locations.some((item) => item.slug === location),
        )
        .filter(
          (property) =>
            unitType === "all" ||
            property.unitTypes.some((item) => item.slug === unitType),
        )
        .filter(
          (property) =>
            bedrooms === "all" || property.bedrooms === Number(bedrooms),
        )
        .slice(0, 3),
    [bedrooms, location, properties.items, sector, transaction, unitType],
  );

  const searchHref = useMemo(() => {
    const params = new URLSearchParams({ sector, transaction });
    if (location !== "all") params.set("location", location);
    if (unitType !== "all") params.set("unit_type", unitType);
    if (bedrooms !== "all") params.set("bedrooms", bedrooms);
    return `/properties?${params.toString()}`;
  }, [bedrooms, location, sector, transaction, unitType]);

  return (
    <Section
      className="discovery-v2 section"
      id={content.id}
      spacing={content.spacing}
    >
      <div className="section-shell">
        <div className="discovery-title">
          <h2>
            Find a Place That Fits{" "}
            <span className="discovery-title-ending">What Comes Next</span>
          </h2>
          <p>
            Explore available properties across our locations and communities.
          </p>
        </div>
        <div className="tabs" role="group" aria-label="Property sector">
          {[
            { value: "residential", label: "Residential" },
            { value: "retail", label: "Retail" },
          ].map((option) => (
            <button
              aria-pressed={sector === option.value}
              className={`tab${sector === option.value ? " active" : ""}`}
              key={option.value}
              onClick={() => setSector(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <form
          className="search-box cms-property-search"
          action="/properties"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.assign(searchHref);
          }}
        >
          <input name="sector" type="hidden" value={sector} />
          <SelectField
            id="home-transaction"
            label="Looking to"
            name="transaction"
            onValueChange={setTransaction}
            options={[
              { label: "Lease", value: "lease" },
              { label: "Buy", value: "sale" },
            ]}
            value={transaction}
          />
          {facets.locations.length ? (
            <SelectField
              id="home-location"
              label="Location"
              name="location"
              onValueChange={setLocation}
              options={[
                { label: "All locations", value: "all" },
                ...facets.locations.map((term) => ({
                  label: term.name,
                  value: term.slug,
                })),
              ]}
              value={location}
            />
          ) : null}
          <SelectField
            id="home-unit-type"
            label="Unit type"
            name="unit_type"
            onValueChange={setUnitType}
            options={[
              { label: "All unit types", value: "all" },
              ...facets.unitTypes.map((term) => ({
                label: term.name,
                value: term.slug,
              })),
            ]}
            value={unitType}
          />
          {sector === "residential" ? (
            <SelectField
              id="home-bedrooms"
              label="Bedrooms"
              name="bedrooms"
              onValueChange={setBedrooms}
              options={[
                { label: "Any bedrooms", value: "all" },
                { label: "Studio", value: "0" },
                { label: "1 bedroom", value: "1" },
                { label: "2 bedrooms", value: "2" },
                { label: "3 bedrooms", value: "3" },
                { label: "4 bedrooms", value: "4" },
              ]}
              value={bedrooms}
            />
          ) : null}
          <Button className="search-primary" type="submit" variant="dark">
            Search properties
          </Button>
        </form>
        <div className="property-view-toolbar">
          <p className="search-status">
            {visibleProperties.length
              ? "Featured available properties"
              : "No matching properties are currently available."}
          </p>
        </div>
        {visibleProperties.length ? (
          <div className="catalog-grid home-catalog-grid">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : null}
        <div className="discovery-actions">
          <Button
            className="discovery-view-all"
            href={searchHref}
            showArrow={false}
            variant="link"
          >
            <span className="link-underline">View all properties</span>
          </Button>
          <Button
            className="discovery-sell-link link-underline-before"
            href="/#sell"
            variant="link"
          >
            Thinking of selling? Sell your property
          </Button>
        </div>
      </div>
    </Section>
  );
}
