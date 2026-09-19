import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import PropertyCatalogPage from "../../components/properties/PropertyCatalogPage";
import site from "../../data/home/site.json";
import type { PropertyFilters } from "../../lib/properties/types";
import { loadProperties } from "../../lib/properties/wordpress";

const filterKeys: (keyof PropertyFilters)[] = [
  "page",
  "sector",
  "location",
  "building",
  "unit_type",
  "bedrooms",
  "transaction",
  "min_price",
  "max_price",
  "min_area",
  "max_area",
];

export const getServerSideProps = (async ({ query, res }) => {
  const filters: PropertyFilters = {};
  filterKeys.forEach((key) => {
    const value = query[key];
    if (typeof value === "string") filters[key] = value;
  });
  filters.sector ??= "residential";
  filters.transaction ??= "lease";
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
  return { props: { content: await loadProperties(filters), filters, site } };
}) satisfies GetServerSideProps;

export default function PropertiesRoute({
  content,
  filters,
  site: siteContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Properties | ADURE</title>
        <meta
          name="description"
          content="Explore available residential and retail properties from ADURE."
        />
      </Head>
      <PropertyCatalogPage
        content={content}
        filters={filters}
        site={siteContent}
      />
    </>
  );
}
