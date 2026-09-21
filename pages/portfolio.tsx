import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import StaticPortfolioPage from "../components/portfolio/StaticPortfolioPage";
import portfolio from "../data/portfolio/page.json";
import site from "../data/home/site.json";
import type { PortfolioContent } from "../lib/portfolio/types";
import type { BuildingListResponse } from "../lib/properties/types";
import { loadBuildings } from "../lib/properties/wordpress";

const emptyBuildings: BuildingListResponse = {
  items: [],
  pagination: { page: 1, perPage: 21, total: 0, totalPages: 0 },
  facets: { locations: [], sectors: [] },
};

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
  const content = portfolio as PortfolioContent;

  try {
    buildings = await loadBuildings(filters);
  } catch (error) {
    console.warn("WordPress buildings are unavailable.", error);
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
