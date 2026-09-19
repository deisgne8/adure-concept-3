import Link from "next/link";
import type {
  PropertyFilters,
  PropertyListResponse,
} from "../../lib/properties/types";
import type { HomeContent } from "../../lib/home/load-home-content";
import SiteChrome from "../sections/SiteChrome";
import SiteFooter from "../sections/SiteFooter";
import PropertyCard from "./PropertyCard";
import PropertyFiltersForm from "./PropertyFilters";

type PropertyCatalogPageProps = {
  content: PropertyListResponse;
  filters: PropertyFilters;
  site: HomeContent["site"];
};

export default function PropertyCatalogPage({
  content,
  filters,
  site,
}: PropertyCatalogPageProps) {
  return (
    <div className="property-page">
      <SiteChrome
        content={site}
        homeHref="/"
        currentPath="/properties"
        standalone
      />
      <main id="main">
        <section className="catalog-intro pt_100 pb_50">
          <div className="section-shell catalog-intro-grid">
            <div>
              <span className="eyebrow">Properties</span>
              <h1>Find the space for what comes next</h1>
            </div>
            <p>
              Explore available residential and retail units across ADURE
              communities and buildings.
            </p>
          </div>
        </section>
        <section className="catalog-results pb_100">
          <div className="section-shell">
            <PropertyFiltersForm facets={content.facets} filters={filters} />
            <div className="catalog-results-head">
              <p>
                {content.pagination.total} available{" "}
                {content.pagination.total === 1 ? "property" : "properties"}
              </p>
            </div>
            {content.items.length ? (
              <div className="catalog-grid">
                {content.items.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <h2>No matching properties</h2>
                <p>Try another sector, location or unit type.</p>
                <Link className="btn primary" href="/properties">
                  Clear filters
                </Link>
              </div>
            )}
            {content.pagination.totalPages > 1 ? (
              <nav
                className="catalog-pagination"
                aria-label="Property results pages"
              >
                {Array.from(
                  { length: content.pagination.totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Link
                    aria-current={
                      page === content.pagination.page ? "page" : undefined
                    }
                    href={{
                      pathname: "/properties",
                      query: { ...filters, page: String(page) },
                    }}
                    key={page}
                  >
                    {page}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}
