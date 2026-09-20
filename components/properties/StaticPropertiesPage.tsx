import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeContent } from "../../lib/home/load-home-content";
import { emptyStaticFilters, filterStaticProperties } from "../../lib/properties/static-catalog";
import type { StaticCatalogContent, StaticHeroFilters, StaticProperty, StaticPropertyIntent, StaticPropertySort } from "../../lib/properties/static-types";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import Button from "../ui/Button";
import PropertiesFilterDialog from "./PropertiesFilterDialog";
import PropertiesMap from "./PropertiesMap";
import StaticPropertyCard from "./StaticPropertyCard";

type Props = { content: StaticCatalogContent; site: HomeContent["site"] };
const pageSize = 6;

export default function StaticPropertiesPage({ content, site }: Props) {
  const router = useRouter();
  const filterDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedIntent, setIntentState] = useState<StaticPropertyIntent>("buy");
  const [draftFilters, setDraftFilters] = useState<StaticHeroFilters>({ ...emptyStaticFilters });
  const [filters, setFilters] = useState<StaticHeroFilters>({ ...emptyStaticFilters });
  const [sort, setSort] = useState<StaticPropertySort>("recommended");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const intent = selectedIntent;

  useEffect(() => {
    if (!router.isReady) return;
    const queryIntent: StaticPropertyIntent = router.query.intent === "lease" ? "lease" : "buy";
    queueMicrotask(() => setIntentState(queryIntent));
  }, [router.isReady, router.query.intent]);

  useEffect(() => {
    document.body.classList.add("properties-page");
    try {
      const stored = JSON.parse(localStorage.getItem("adure-property-favourites") ?? "[]");
      if (Array.isArray(stored)) {
        const nextSaved = new Set(stored.filter((item): item is string => typeof item === "string"));
        queueMicrotask(() => setSaved(nextSaved));
      }
    } catch {
      localStorage.removeItem("adure-property-favourites");
    }
    return () => document.body.classList.remove("properties-page");
  }, []);

  useEffect(() => {
    const dialog = filterDialogRef.current;
    if (!dialog) return;
    const closeOnBackdrop = (event: MouseEvent) => { if (event.target === dialog) dialog.close(); };
    dialog.addEventListener("click", closeOnBackdrop);
    return () => dialog.removeEventListener("click", closeOnBackdrop);
  }, []);

  const results = useMemo(
    () => filterStaticProperties(content.properties, intent, filters, sort),
    [content.properties, filters, intent, sort],
  );
  const totalPages = Math.ceil(results.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const pageItems = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setIntent = (nextIntent: StaticPropertyIntent) => {
    setIntentState(nextIntent);
    setDraftFilters({ ...emptyStaticFilters });
    setFilters({ ...emptyStaticFilters });
    setPage(1);
    void router.replace({ pathname: "/properties", query: { intent: nextIntent } }, undefined, { shallow: true, scroll: false });
  };
  const updateDraft = (key: keyof StaticHeroFilters, value: string) => setDraftFilters((current) => ({ ...current, [key]: value }));
  const submitSearch = () => {
    setFilters(draftFilters);
    setPage(1);
    document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" });
  };
  const clearFilters = () => {
    setDraftFilters({ ...emptyStaticFilters });
    setFilters({ ...emptyStaticFilters });
    setPage(1);
  };
  const toggleFavourite = (id: string) => {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("adure-property-favourites", JSON.stringify([...next])); } catch { /* Storage can be unavailable. */ }
      return next;
    });
  };
  const shareProperty = async (property: StaticProperty, button?: HTMLButtonElement) => {
    const url = `${window.location.origin}/properties?intent=${property.intent}&property=${encodeURIComponent(property.id)}#results`;
    const data = { title: property.title, text: `${property.title} — ${property.building}, ${property.city}`, url };
    try {
      if (navigator.share) await navigator.share(data); else if (navigator.clipboard) await navigator.clipboard.writeText(url);
      button?.setAttribute("data-shared", "true");
      window.setTimeout(() => button?.removeAttribute("data-shared"), 1100);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) console.warn("Unable to share property", error);
    }
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector(".results-toolbar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="properties-page properties-static-page">
      <SiteChrome content={site} currentPath="/properties" homeHref="/" skipTargetId="properties-main" standalone />
      <main id="properties-main">
        <section className="properties-hero" aria-labelledby="properties-title">
          <img src={content.hero.image} alt="Waterfront residences and beach at Saadiyat Island" />
          <div className="properties-hero-shade" />
          <div className="section-shell properties-hero-inner">
            <span className="properties-eyebrow"><b>01</b> {content.hero.eyebrow}</span>
            <h1 id="properties-title">{content.hero.title[0]}<br />{content.hero.title[1]}</h1>
            <p>{content.hero.description}</p>
            <span className="hero-location-line" aria-hidden="true">{content.hero.locations}</span>
          </div>
        </section>

        <div className="hero-search-wrap">
          <div className="section-shell">
            <div className="properties-search-head"><h2 id="property-search-title">Search Available Properties</h2></div>
            <form className="hero-property-search" aria-labelledby="property-search-title" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}>
              <div className="hero-search-box search-box">
                <div className="intent-switch tabs" role="group" aria-label="Property intent">
                  {(["buy", "lease"] as const).map((option) => (
                    <button className={`tab${intent === option ? " active is-active" : ""}`} type="button" aria-pressed={intent === option} key={option} onClick={() => setIntent(option)}>
                      {option === "buy" ? "Buy" : "Lease"}
                    </button>
                  ))}
                </div>
                <label className="search-field field search-location"><span>Location</span><select value={draftFilters.location} onChange={(event) => updateDraft("location", event.target.value)}><option value="all">All locations</option><option>Abu Dhabi</option><option>Dubai</option><option>Al Ain</option></select></label>
                <label className="search-field field search-community"><span>Building / Community</span><select value={draftFilters.community} onChange={(event) => updateDraft("community", event.target.value)}><option value="all">All communities</option><option>Qaryat Al Hidd</option><option>Saadiyat Island</option><option>Al Mushrif</option><option>Sheikh Zayed Road</option><option>Al Ain</option></select></label>
                <label className="search-field field search-type"><span>Property type</span><select value={draftFilters.type} onChange={(event) => updateDraft("type", event.target.value)}><option value="all">All types</option><option>Apartment</option><option>Villa</option><option>Commercial</option></select></label>
                <label className="search-field field search-beds"><span>Bedrooms</span><select value={draftFilters.beds} onChange={(event) => updateDraft("beds", event.target.value)}><option value="all">Any bedrooms</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4+ bedrooms</option></select></label>
                <label className="search-field field search-price"><span>Price range</span><select value={draftFilters.price} onChange={(event) => updateDraft("price", event.target.value)}><option value="all">Any price</option><option value="under-150">Under AED 150K</option><option value="150-250">AED 150K–250K</option><option value="250-plus">AED 250K+</option></select></label>
                <div className="more-filters"><button className="mobile-filter-trigger more-filters-toggle" type="button" onClick={() => filterDialogRef.current?.showModal()}><span className="more-filters-label"><span className="more-filters-symbol" aria-hidden="true" /><span>More Filters</span></span><small>Facilities &amp; Amenities</small></button></div>
                <Button className="hero-search-submit search-primary" type="submit" variant="dark" aria-label="Search properties"><span className="search-submit-icon" aria-hidden="true" /></Button>
              </div>
            </form>
          </div>
        </div>

        <section className="property-results-section" id="results" aria-labelledby="results-title">
          <div className="section-shell">
            <h2 className="properties-results-title" id="results-title">Available Properties</h2>
            <div className="results-toolbar">
              <div className="results-toolbar-primary"><strong aria-live="polite" aria-label={`${results.length} properties available to ${intent}.`}><span className="result-number">{String(results.length).padStart(2, "0")}</span><span className="result-copy"><b>{results.length === 1 ? "Property" : "Properties"}</b><small>Available to {intent === "lease" ? "lease" : "buy"}</small></span></strong></div>
              <div className="results-toolbar-actions">
                <label className="toolbar-select sort-control"><span>Sort by</span><select value={sort} onChange={(event) => { setSort(event.target.value as StaticPropertySort); setPage(1); }} aria-label="Sort properties"><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="low">Price Low → High</option><option value="high">Price High → Low</option></select></label>
                <div className="view-switch" role="group" aria-label="Results view">
                  <button className={view === "grid" ? "is-active" : ""} type="button" onClick={() => setView("grid")} aria-label="List view" aria-pressed={view === "grid"}><span className="view-icon view-icon-list" aria-hidden="true" /><span>List</span></button>
                  <button className={view === "map" ? "is-active" : ""} type="button" onClick={() => setView("map")} aria-label="Map view" aria-pressed={view === "map"}><span className="view-icon view-icon-map" aria-hidden="true" /><span>Map</span></button>
                </div>
              </div>
            </div>
            <div className="results-layout" id="grid-view" hidden={view !== "grid"}>
              <div className="results-column">
                {pageItems.length ? <div className="property-grid" aria-live="polite">{pageItems.map((property, index) => <StaticPropertyCard index={(currentPage - 1) * pageSize + index + 1} key={property.id} property={property} saved={saved.has(property.id)} onFavourite={toggleFavourite} onShare={shareProperty} />)}</div> : (
                  <div className="empty-state"><span className="properties-eyebrow">No results</span><h3>No Properties Match These Filters</h3><p>Try adjusting your search, or speak with our team and we’ll help you continue your property search.</p><div><Button type="button" variant="primary" onClick={clearFilters}>Clear filters</Button><Button href="/contact">Contact ADURE</Button></div></div>
                )}
                {totalPages > 1 ? <nav className="pagination" aria-label="Property result pages"><button type="button" onClick={() => changePage(Math.max(1, currentPage - 1))} aria-label="Previous page">←</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button type="button" key={number} onClick={() => changePage(number)} aria-current={number === currentPage ? "page" : undefined}>{String(number).padStart(2, "0")}</button>)}<button type="button" onClick={() => changePage(Math.min(totalPages, currentPage + 1))} aria-label="Next page">→</button></nav> : null}
              </div>
            </div>
            <PropertiesMap active={view === "map"} properties={results} saved={saved} onFavourite={toggleFavourite} onShare={shareProperty} />
          </div>
        </section>

        <section className="owner-cta" aria-labelledby="owner-title">
          <img src={content.ownerCta.image} alt="Aerial view of the Hidd Al Saadiyat beach and waterfront" /><div className="owner-cta-overlay" />
          <div className="section-shell owner-cta-layout"><div className="owner-card-copy"><h2 id="owner-title">{content.ownerCta.title[0]}<br />{content.ownerCta.title[1]}</h2><nav className="owner-actions" aria-label="Next step actions"><Button href="/properties?intent=buy" variant="primary">Find a Property</Button><Button href="/#sell" className="owner-secondary">Sell With ADURE</Button><Button href="/#management" className="owner-secondary">Property Management</Button><Button href="/contact" className="owner-secondary">Contact ADURE</Button></nav></div><p className="owner-card-intro">{content.ownerCta.description}</p></div>
        </section>
      </main>
      <PropertiesFilterDialog ref={filterDialogRef} resultCount={results.length} />
      <SiteFooter content={site} homeHref="/" />
    </div>
  );
}
