import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import type { HomeContent } from "../../lib/home/load-home-content";
import type { StaticCatalogContent } from "../../lib/properties/static-types";
import type { PropertyFacets, PropertyImage, PropertyListResponse, PropertyTerm } from "../../lib/properties/types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";
import PropertiesFilterDialog from "./PropertiesFilterDialog";
import { aosSequenceDelay } from "../../lib/aos";
import LivePropertiesMap, { hasMappableProperty } from "./LivePropertiesMap";

type Props = {
  content: StaticCatalogContent;
  properties: ListingPropertyListResponse;
  site: HomeContent["site"];
};

export type ListingPropertyUnit = {
  amenities: PropertyTerm[];
  annualRent: number | null;
  areaSqm: number | null;
  bathrooms: number | null;
  bedrooms: number | null;
  building: {
    cardImage: PropertyImage | null;
    id: number;
    latitude: number | string | null;
    locations: PropertyTerm[];
    longitude: number | string | null;
    name: string;
    slug: string;
  } | null;
  cardImage: PropertyImage | null;
  currency: string;
  floor: string | null;
  id: number;
  locations: PropertyTerm[];
  salePrice: number | null;
  sectors: PropertyTerm[];
  slug: string;
  status: "available";
  summary: string;
  title: string;
  transaction: "lease" | "sale" | "both";
  unitCode: string;
  unitTypes: PropertyTerm[];
};

export type ListingPropertyListResponse = Omit<PropertyListResponse, "facetsBySector" | "items"> & {
  facets: PropertyFacets;
  items: ListingPropertyUnit[];
};

const pageSize = 21;
const fallbackImage = "/assets/no-image.png";
const removedBuildingSlugs = new Set(["c4-building"]);
const disabledBuildingSlugs = new Set(["sunrise-residence-6"]);
const disabledUnitTypeSlugs = new Set(["retail"]);
const emptyFilters = {
  bedrooms: "all",
  building: "all",
  location: "all",
  price: "all",
  sector: "all",
  transaction: "lease",
  unitType: "all",
};

function uniqueTerms(terms: PropertyTerm[]) {
  return [...new Map(terms.map((term) => [term.slug, term])).values()];
}

function termNames(terms: PropertyTerm[], fallback = "Not specified") {
  const names = uniqueTerms(terms).map((term) => term.name).filter(Boolean);
  return names.length ? names.join(", ") : fallback;
}

function propertyImage(property: ListingPropertyUnit) {
  return (
    property.cardImage?.card ||
    property.cardImage?.full ||
    property.building?.cardImage?.card ||
    property.building?.cardImage?.full ||
    fallbackImage
  );
}

function formatPropertyPrice(property: ListingPropertyUnit) {
  const amount = property.transaction === "sale" ? property.salePrice : property.annualRent;
  if (amount === null) return "Price on request";
  return amount.toLocaleString("en-US");
}

function UnitPropertyCard({
  index,
  property,
}: {
  index: number;
  property: ListingPropertyUnit;
}) {
  const building = property.building;
  const locations = uniqueTerms([
    ...property.locations,
    ...(building?.locations ?? []),
  ]);
  const image = propertyImage(property);
  const href = building ? `/properties/${building.slug}/${property.slug}` : "/properties";
  const reference = `REF # ADU-${property.id}`;
  const areaSqm = property.areaSqm;
  const hasArea = typeof areaSqm === "number" && Number.isFinite(areaSqm) && areaSqm > 0;

  return (
    <article
      className="property-card"
      data-index={String(index).padStart(2, "0")}
      data-property-id={property.slug}
      style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
    >
      <Link className="property-card-link" href={href} aria-label={`View ${property.title}`} />
      <div className="property-card-media">
        <img
          src={image}
          alt={image === fallbackImage ? "ADURE placeholder" : property.cardImage?.alt || property.title}
          loading="lazy"
          decoding="async"
        />
        <span className="property-status">
          {property.status} · {property.transaction === "sale" ? "For Sale" : "For Lease"}
        </span>
      </div>
      <div className="property-card-body">
        <div className="property-location">
          <span className="location-pin-icon" aria-hidden="true" />
          <span>{termNames(locations, "Location unavailable")}</span>
        </div>
        <h3>{property.title}</h3>
        <p className="property-building">{[building?.name, property.unitCode].filter(Boolean).join(" · ")}</p>
        <div className="property-price">{formatPropertyPrice(property)}</div>
        <div className={`property-facts${hasArea ? "" : " has-two-facts"}`} aria-label="Property facts">
          <span>
            <BedDouble aria-hidden="true" />
            {property.bedrooms === null
              ? "--"
              : property.bedrooms === 0
                ? "Studio"
                : `${property.bedrooms} Bed`}
          </span>
          <span>
            <Bath aria-hidden="true" />
            {property.bathrooms === null ? "--" : `${property.bathrooms} Bath`}
          </span>
          {hasArea ? (
            <span>
              <Maximize2 aria-hidden="true" />
              {areaSqm.toLocaleString("en-US")} sqm
            </span>
          ) : null}
        </div>
        <div className="property-card-footer">
          <span>{reference}</span>
          <span className="view-property">
            <span>View property</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function StaticPropertiesPage({ content, properties, site }: Props) {
  const router = useRouter();
  const filterDialogRef = useRef<HTMLDialogElement>(null);
  const [draftFilters, setDraftFilters] = useState({ ...emptyFilters });
  const [filters, setFilters] = useState({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("title");
  const [view, setView] = useState<"grid" | "map">("grid");

  useEffect(() => {
    document.body.classList.add("properties-page");
    return () => document.body.classList.remove("properties-page");
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const intent = Array.isArray(router.query.intent)
      ? router.query.intent[0]
      : router.query.intent;
    const transaction = intent === "buy" ? "sale" : intent === "lease" ? "lease" : null;

    if (!transaction) return;

    const hasInventoryForIntent = properties.items.some(
      (property) =>
        property.transaction === transaction || property.transaction === "both",
    );

    // The current CMS payload contains lease inventory only. Keep the available
    // results visible for a buy URL until sale inventory is published.
    if (!hasInventoryForIntent) return;

    const nextFilters = { ...emptyFilters, transaction };
    const frame = window.requestAnimationFrame(() => {
      setDraftFilters(nextFilters);
      setFilters(nextFilters);
      setPage(1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [properties.items, router.isReady, router.query.intent]);

  useEffect(() => {
    const dialog = filterDialogRef.current;
    if (!dialog) return;
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", closeOnBackdrop);
    return () => dialog.removeEventListener("click", closeOnBackdrop);
  }, []);

  const labels = {
    bedrooms: content.filterLabels?.bedrooms || "Bedrooms",
    building: content.filterLabels?.building || "Building / Community",
    location: content.filterLabels?.location || "Location",
    price: content.filterLabels?.price || "Price range",
    sector: content.filterLabels?.sector || "Sector",
    transaction: content.filterLabels?.transaction || "Looking to",
    unitType: content.filterLabels?.unitType || "Property type",
  };
  const locations = properties.facets.locations ?? [];
  const sectors = properties.facets.sectors ?? [];
  const unitTypes = properties.facets.unitTypes ?? [];
  const updateDraft = (key: keyof typeof emptyFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };
  const setIntent = (intent: "buy" | "lease") => {
    updateDraft("transaction", intent === "buy" ? "sale" : "lease");
  };
  const results = useMemo(() => {
    const items = properties.items ?? [];
    return items
      .filter((property) => !removedBuildingSlugs.has(property.building?.slug ?? ""))
      .filter((property) => !disabledBuildingSlugs.has(property.building?.slug ?? ""))
      .filter((property) => !property.unitTypes.some((term) => disabledUnitTypeSlugs.has(term.slug)))
      .filter((property) => property.transaction === filters.transaction || property.transaction === "both")
      .filter((property) =>
        filters.location === "all" ||
        uniqueTerms([
          ...property.locations,
          ...(property.building?.locations ?? []),
        ]).some((term) => term.slug === filters.location),
      )
      .filter((property) => filters.building === "all" || property.building?.slug === filters.building)
      .filter((property) => filters.sector === "all" || property.sectors.some((term) => term.slug === filters.sector))
      .filter((property) => filters.unitType === "all" || property.unitTypes.some((term) => term.slug === filters.unitType))
      .filter((property) => {
        if (filters.bedrooms === "all") return true;
        if (property.bedrooms === null) return false;
        return filters.bedrooms === "4" ? property.bedrooms >= 4 : property.bedrooms === Number(filters.bedrooms);
      })
      .filter((property) => {
        const price = property.transaction === "sale" ? property.salePrice : property.annualRent;
        if (filters.price === "all" || price === null) return true;
        if (filters.price === "under-150") return price < 150000;
        if (filters.price === "150-250") return price >= 150000 && price <= 250000;
        if (filters.price === "250-plus") return price >= 250000;
        return true;
      })
      .sort((left, right) => {
        if (sort === "title") {
          return left.title.localeCompare(right.title, "en", {
            numeric: true,
            sensitivity: "base",
          });
        }
        if (sort === "newest") return right.id - left.id;
        const leftPrice = left.transaction === "sale" ? left.salePrice : left.annualRent;
        const rightPrice = right.transaction === "sale" ? right.salePrice : right.annualRent;
        if (sort === "low") return (leftPrice ?? Number.MAX_SAFE_INTEGER) - (rightPrice ?? Number.MAX_SAFE_INTEGER);
        if (sort === "high") return (rightPrice ?? 0) - (leftPrice ?? 0);
        return 0;
      });
  }, [filters, properties.items, sort]);
  const totalPages = Math.ceil(results.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const pageItems = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const submitSearch = () => {
    setFilters(draftFilters);
    setPage(1);
    document.querySelector("#results")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const clearFilters = () => {
    setDraftFilters({ ...emptyFilters });
    setFilters({ ...emptyFilters });
    setPage(1);
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector(".results-toolbar")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  const hasHeroContent =
    content.hero.eyebrow ||
    content.hero.title.length ||
    content.hero.description ||
    content.hero.locations;
  const hasOwnerCta =
    content.ownerCta.image ||
    content.ownerCta.title.length ||
    content.ownerCta.description ||
    content.ownerCta.buttons.length;

  return (
    <div className="properties-page properties-static-page">
      <SiteChrome content={site} currentPath="/properties" homeHref="/" skipTargetId="properties-main" standalone />
      <main id="properties-main">
        {hasHeroContent || content.hero.image ? (
          <section className="properties-hero" aria-labelledby={content.hero.title.length ? "properties-title" : undefined}>
            {content.hero.image ? <img src={content.hero.image} alt={content.hero.imageAlt} /> : null}
            {content.hero.image ? <div className="properties-hero-shade" /> : null}
            {hasHeroContent ? (
              <div className="section-shell properties-hero-inner">
                {content.hero.eyebrow ? <span className="properties-eyebrow" data-aos="fade-up"><b>01</b> {content.hero.eyebrow}</span> : null}
                {content.hero.title.length ? (
                  <h1 id="properties-title" data-aos="fade-up" data-aos-delay="100">
                    {content.hero.title.map((line, index) => (
                      <span key={`${line}-${index}`}>{line}{index < content.hero.title.length - 1 ? <br /> : null}</span>
                    ))}
                  </h1>
                ) : null}
                {content.hero.description ? <p data-aos="fade-up" data-aos-delay="200">{content.hero.description}</p> : null}
                {content.hero.locations ? <span className="hero-location-line" aria-hidden="true" data-aos="fade-up" data-aos-delay="300">{content.hero.locations}</span> : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="hero-search-wrap">
          <div className="section-shell">
            {content.filtersTitle ? <div className="properties-search-head" data-aos="fade-up"><h2 id="property-search-title">{content.filtersTitle}</h2></div> : null}
            <form className="hero-property-search" aria-labelledby={content.filtersTitle ? "property-search-title" : undefined} data-aos="fade-up" data-aos-delay="100" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
              <div className="hero-search-box search-box">
                <div className="intent-switch tabs" role="group" aria-label="Property intent">
                  {(["buy", "lease"] as const).map((option) => {
                    const isActive =
                      (option === "buy" && draftFilters.transaction === "sale") ||
                      (option === "lease" && draftFilters.transaction === "lease");
                    return (
                      <button
                        aria-pressed={isActive}
                        className={`tab${isActive ? " active is-active" : ""}`}
                        key={option}
                        onClick={() => setIntent(option)}
                        type="button"
                      >
                        {option === "buy" ? "Buy" : "Lease"}
                      </button>
                    );
                  })}
                </div>
                <SelectField
                  className="search-field search-location"
                  id="property-location"
                  label={labels.location}
                  name="location"
                  onValueChange={(value) => updateDraft("location", value)}
                  options={[{ label: "All locations", value: "all" }, ...locations.map((term) => ({ label: term.name, value: term.slug }))]}
                  value={draftFilters.location}
                />
                <SelectField className="search-field search-community" id="property-sector" label={labels.sector} name="sector" onValueChange={(value) => updateDraft("sector", value)} options={[{ label: "All property types", value: "all" }, ...sectors.map((term) => ({ label: term.name, value: term.slug }))]} value={draftFilters.sector} />
                <SelectField
                  className="search-field search-type"
                  id="property-type"
                  label={labels.unitType}
                  name="unitType"
                  onValueChange={(value) => updateDraft("unitType", value)}
                  options={[
                    { label: "All types", value: "all" },
                    ...unitTypes.map((term) => ({
                      disabled: disabledUnitTypeSlugs.has(term.slug),
                      label: term.name,
                      value: term.slug,
                    })),
                  ]}
                  value={draftFilters.unitType}
                />
                <SelectField
                  className="search-field search-beds"
                  id="property-bedrooms"
                  label={labels.bedrooms}
                  name="bedrooms"
                  onValueChange={(value) => updateDraft("bedrooms", value)}
                  options={[
                    { label: "Any bedrooms", value: "all" },
                    { label: "Studio", value: "0" },
                    { label: "1 bedroom", value: "1" },
                    { label: "2 bedrooms", value: "2" },
                    { label: "3 bedrooms", value: "3" },
                    { label: "4+ bedrooms", value: "4" },
                  ]}
                  value={draftFilters.bedrooms}
                />
                <SelectField
                  className="search-field search-price"
                  id="property-price"
                  label={labels.price}
                  name="price"
                  onValueChange={(value) => updateDraft("price", value)}
                  options={[
                    { label: "Any price", value: "all" },
                    { label: "Under AED 150K", value: "under-150" },
                    { label: "AED 150K-250K", value: "150-250" },
                    { label: "AED 250K+", value: "250-plus" },
                  ]}
                  value={draftFilters.price}
                />
                <div className="more-filters">
                  <button className="mobile-filter-trigger more-filters-toggle" type="button" onClick={() => filterDialogRef.current?.showModal()}>
                    <span className="more-filters-label"><span className="more-filters-symbol" aria-hidden="true" /><span>More Filters</span></span>
                    <small>Facilities &amp; Amenities</small>
                  </button>
                </div>
                <Button className="hero-search-submit search-primary" type="submit" variant="dark" aria-label="Search properties"><span className="search-submit-icon" aria-hidden="true" /></Button>
              </div>
            </form>
          </div>
        </div>

        <section className="property-results-section" id="results" aria-labelledby={content.availableTitle ? "results-title" : undefined}>
          <div className="section-shell">
            {content.availableTitle ? <h2 className="properties-results-title" id="results-title" data-aos="fade-up">{content.availableTitle}</h2> : null}
            <div className="results-toolbar" data-aos="fade-up" data-aos-delay="100">
              <div className="results-toolbar-primary"><strong aria-live="polite" aria-label={`${results.length} properties available to ${filters.transaction === "lease" ? "lease" : "buy"}.`}><span className="result-number">{String(results.length).padStart(2, "0")}</span><span className="result-copy"><b>{results.length === 1 ? "Property" : "Properties"}</b><small>Available to {filters.transaction === "lease" ? "lease" : "buy"}</small></span></strong></div>
              <div className="results-toolbar-actions">
                <div className="sort-control">
                  <span>Sort by</span>
                  <SelectField
                    className="toolbar-select sort-select-field"
                    id="property-sort"
                    label="Sort properties"
                    name="sort"
                    onValueChange={(value) => { setSort(value); setPage(1); }}
                    options={[
                      { label: "Title A-Z", value: "title" },
                      { label: "Recommended", value: "recommended" },
                      { label: "Newest", value: "newest" },
                      { label: "Price Low - High", value: "low" },
                      { label: "Price High - Low", value: "high" },
                    ]}
                    value={sort}
                  />
                </div>
                <div className="view-switch" role="group" aria-label="Results view">
                  <button className={view === "grid" ? "is-active" : ""} type="button" onClick={() => setView("grid")} aria-label="List view" aria-pressed={view === "grid"}><span className="view-icon view-icon-list" aria-hidden="true" /><span>List</span></button>
                  <button className={!hasMappableProperty(results) ? "is-disabled" : view === "map" ? "is-active" : ""} type="button" disabled={!hasMappableProperty(results)} onClick={() => setView("map")} aria-label={hasMappableProperty(results) ? "Map view" : "No mappable properties"} aria-pressed={view === "map"}><span className="view-icon view-icon-map" aria-hidden="true" /><span>Map</span></button>
                </div>
              </div>
            </div>
            <div className="results-layout" id="grid-view" hidden={view === "map"}>
              <div className="results-column">
                {pageItems.length ? <div className="property-grid" aria-live="polite">{pageItems.map((property, index) => <div className="aos-card-reveal" data-aos="fade-up" data-aos-delay={aosSequenceDelay(index)} key={property.id}><UnitPropertyCard index={(currentPage - 1) * pageSize + index + 1} property={property} /></div>)}</div> : (
                  <div className="empty-state" data-aos="fade-up"><span className="properties-eyebrow">No results</span><h3>No Properties Match This Location</h3><p>Try another location, or speak with our team and we’ll help you continue your property search.</p><div><Button type="button" variant="primary" onClick={clearFilters}>Clear filters</Button><Button href="/contact">Contact ADURE</Button></div></div>
                )}
                {totalPages > 1 ? <nav className="pagination" aria-label="Property result pages" data-aos="fade-up"><button type="button" onClick={() => changePage(Math.max(1, currentPage - 1))} aria-label="Previous page">←</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} onClick={() => changePage(number)} aria-current={number === currentPage ? "page" : undefined}>{String(number).padStart(2, "0")}</button>)}<button type="button" onClick={() => changePage(Math.min(totalPages, currentPage + 1))} aria-label="Next page">→</button></nav> : null}
              </div>
            </div>
            <LivePropertiesMap active={view === "map"} properties={results} />
          </div>
        </section>

        {hasOwnerCta ? (
          <section className="owner-cta" aria-labelledby={content.ownerCta.title.length ? "owner-title" : undefined}>
            {content.ownerCta.image ? <img src={content.ownerCta.image} alt={content.ownerCta.imageAlt} /> : null}
            {content.ownerCta.image ? <div className="owner-cta-overlay" /> : null}
            <div className="section-shell owner-cta-layout">
              <div className="owner-card-copy" data-aos="fade-right">
                {content.ownerCta.title.length ? (
                  <h2 id="owner-title">
                    {content.ownerCta.title.map((line, index) => (
                      <span key={`${line}-${index}`}>{line}{index < content.ownerCta.title.length - 1 ? <br /> : null}</span>
                    ))}
                  </h2>
                ) : null}
                {content.ownerCta.buttons.length ? (
                  <nav className="owner-actions" aria-label="Next step actions">
                    {content.ownerCta.buttons.map((button) => (
                      <Button
                        className="owner-action-link"
                        href={button.href}
                        key={`${button.href}-${button.label}`}
                        rel={button.target === "_blank" ? "noreferrer" : undefined}
                        target={button.target ?? undefined}
                        variant="link"
                        showArrow={false}
                      >
                        <span>{button.label}</span><span aria-hidden="true">→</span>
                      </Button>
                    ))}
                  </nav>
                ) : null}
              </div>
              {content.ownerCta.description ? <p className="owner-card-intro" data-aos="fade-left">{content.ownerCta.description}</p> : null}
            </div>
          </section>
        ) : null}
      </main>
      <PropertiesFilterDialog ref={filterDialogRef} resultCount={results.length} />
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
