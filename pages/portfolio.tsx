import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import StaticPortfolioPage from "../components/portfolio/StaticPortfolioPage";
import portfolio from "../data/portfolio/page.json";
import site from "../data/home/site.json";
import type { PortfolioContent } from "../lib/portfolio/types";
import { loadWordPressPortfolioContent } from "../lib/portfolio/wordpress";
import type {
  BuildingFilters,
  BuildingListResponse,
  BuildingSummary,
  PropertyTerm,
} from "../lib/properties/types";
import { loadAllBuildings } from "../lib/properties/wordpress";

const emptyBuildings: BuildingListResponse = {
  items: [],
  pagination: { page: 1, perPage: 21, total: 0, totalPages: 0 },
  facets: { locations: [], sectors: [] },
};

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function hasResidentialSector(building: BuildingSummary) {
  return building.sectors.some((sector) => sector.slug === "residential");
}

function collectBuildingTerms(
  items: BuildingSummary[],
  key: "amenities" | "locations" | "sectors",
) {
  const terms = new Map<string, PropertyTerm>();

  items.forEach((item) => {
    item[key].forEach((term) => {
      terms.set(term.slug, term);
    });
  });

  return [...terms.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function buildResidentialPortfolioList(
  buildings: BuildingListResponse,
  filters: BuildingFilters,
): BuildingListResponse {
  const residentialItems = buildings.items.filter(hasResidentialSector);
  const location = filters.location;
  const filteredItems = location
    ? residentialItems.filter((building) =>
        building.locations.some((term) => term.slug === location),
      )
    : residentialItems;
  const page = positiveInteger(filters.page, 1);
  const perPage = positiveInteger(filters.per_page, 21);
  const total = filteredItems.length;
  const totalPages = total ? Math.ceil(total / perPage) : 0;
  const safePage = totalPages ? Math.min(page, totalPages) : 1;
  const start = (safePage - 1) * perPage;

  return {
    items: filteredItems.slice(start, start + perPage),
    pagination: {
      page: safePage,
      perPage,
      total,
      totalPages,
    },
    facets: {
      amenities: collectBuildingTerms(residentialItems, "amenities"),
      locations: collectBuildingTerms(residentialItems, "locations"),
      sectors: collectBuildingTerms(residentialItems, "sectors").filter(
        (sector) => sector.slug === "residential",
      ),
      unitTypes: buildings.facets.unitTypes ?? [],
    },
  };
}

export const getServerSideProps = (async ({ query, res }) => {
  const location = readQueryValue(query.location);
  const page = readQueryValue(query.page);
  const filters = {
    ...(location && location !== "all" ? { location } : {}),
    ...(page ? { page } : {}),
    per_page: "21",
  };
  let buildings = emptyBuildings;
  let content = portfolio as PortfolioContent;

  try {
    const allBuildings = await loadAllBuildings({ per_page: "200" });
    buildings = buildResidentialPortfolioList(allBuildings, filters);
  } catch (error) {
    console.warn("WordPress buildings are unavailable.", error);
  }

  try {
    content = await loadWordPressPortfolioContent();
  } catch (error) {
    console.warn("WordPress portfolio content is unavailable.", error);
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );

  return {
    props: { buildings, buildingFilters: filters, content, site },
  };
}) satisfies GetServerSideProps;

export default function PortfolioRoute({
  buildingFilters,
  buildings,
  content,
  site: siteContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        {content.meta.description ? (
          <meta name="description" content={content.meta.description} />
        ) : null}
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticPortfolioPage
        buildingFilters={buildingFilters}
        buildings={buildings}
        content={content}
        site={siteContent}
      />
    </>
  );
}
