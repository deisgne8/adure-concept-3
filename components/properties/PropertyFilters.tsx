import { useRouter } from "next/router";
import { useState } from "react";
import type {
  PropertyFacets,
  PropertyFilters as Filters,
} from "../../lib/properties/types";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";

type PropertyFiltersProps = {
  facets: PropertyFacets;
  filters: Filters;
};

const allOption = (label: string) => ({ label, value: "all" });

export default function PropertyFilters({
  facets,
  filters,
}: PropertyFiltersProps) {
  const router = useRouter();
  const [values, setValues] = useState({
    sector: filters.sector ?? "residential",
    transaction: filters.transaction ?? "lease",
    location: filters.location ?? "all",
    building: filters.building ?? "all",
    unit_type: filters.unit_type ?? "all",
    bedrooms: filters.bedrooms ?? "all",
  });
  const activeSector = values.sector;
  const locations =
    activeSector === "retail" &&
    !facets.sectors.some((sector) => sector.slug === "retail")
      ? []
      : facets.locations;

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    const query = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value && value !== "all"),
    );
    await router.push({ pathname: "/properties", query });
  };

  return (
    <div className="catalog-search">
      <div
        className="catalog-sector-tabs"
        role="group"
        aria-label="Property sector"
      >
        {[
          { value: "residential", label: "Residential" },
          { value: "retail", label: "Retail" },
        ].map((option) => (
          <button
            aria-pressed={activeSector === option.value}
            key={option.value}
            onClick={() => update("sector", option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <form
        className="catalog-filter-grid"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <SelectField
          id="catalog-transaction"
          label="Looking to"
          name="transaction"
          onValueChange={(value) => update("transaction", value)}
          options={[
            { label: "Lease", value: "lease" },
            { label: "Buy", value: "sale" },
          ]}
          value={values.transaction}
        />
        {locations.length ? (
          <SelectField
            id="catalog-location"
            label="Location"
            name="location"
            onValueChange={(value) => update("location", value)}
            options={[
              allOption("All locations"),
              ...locations.map((term) => ({
                label: term.name,
                value: term.slug,
              })),
            ]}
            value={values.location}
          />
        ) : null}
        <SelectField
          id="catalog-building"
          label="Building"
          name="building"
          onValueChange={(value) => update("building", value)}
          options={[
            allOption("All buildings"),
            ...facets.buildings.map((term) => ({
              label: term.name,
              value: term.slug,
            })),
          ]}
          value={values.building}
        />
        <SelectField
          id="catalog-type"
          label="Unit type"
          name="unit_type"
          onValueChange={(value) => update("unit_type", value)}
          options={[
            allOption("All unit types"),
            ...facets.unitTypes.map((term) => ({
              label: term.name,
              value: term.slug,
            })),
          ]}
          value={values.unit_type}
        />
        {activeSector === "residential" ? (
          <SelectField
            id="catalog-bedrooms"
            label="Bedrooms"
            name="bedrooms"
            onValueChange={(value) => update("bedrooms", value)}
            options={[
              allOption("Any bedrooms"),
              { label: "Studio", value: "0" },
              { label: "1 bedroom", value: "1" },
              { label: "2 bedrooms", value: "2" },
              { label: "3 bedrooms", value: "3" },
              { label: "4 bedrooms", value: "4" },
            ]}
            value={values.bedrooms}
          />
        ) : null}
        <Button className="catalog-search-button" type="submit" variant="dark">
          Search properties
        </Button>
      </form>
    </div>
  );
}
