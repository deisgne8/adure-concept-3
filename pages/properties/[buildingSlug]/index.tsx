import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import BuildingDetailPage from "../../../components/properties/BuildingDetailPage";
import site from "../../../data/home/site.json";
import {
  isNotFoundError,
  loadBuilding,
} from "../../../lib/properties/wordpress";

export const getServerSideProps = (async ({ params, res }) => {
  const slug =
    typeof params?.buildingSlug === "string" ? params.buildingSlug : "";
  try {
    const building = await loadBuilding(slug);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return { props: { building, site } };
  } catch (error) {
    if (isNotFoundError(error)) return { notFound: true };
    throw error;
  }
}) satisfies GetServerSideProps;

export default function BuildingRoute({
  building,
  site: siteContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{building.seo.title} | ADURE</title>
        {building.seo.description ? (
          <meta name="description" content={building.seo.description} />
        ) : null}
      </Head>
      <BuildingDetailPage building={building} site={siteContent} />
    </>
  );
}
