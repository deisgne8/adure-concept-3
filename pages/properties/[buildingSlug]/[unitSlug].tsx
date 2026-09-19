import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import UnitDetailPage from "../../../components/properties/UnitDetailPage";
import site from "../../../data/home/site.json";
import { isNotFoundError, loadUnit } from "../../../lib/properties/wordpress";

export const getServerSideProps = (async ({ params, res }) => {
  const slug = typeof params?.unitSlug === "string" ? params.unitSlug : "";
  try {
    const property = await loadUnit(slug);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    return { props: { property, site } };
  } catch (error) {
    if (isNotFoundError(error)) return { notFound: true };
    throw error;
  }
}) satisfies GetServerSideProps;

export default function UnitRoute({
  property,
  site: siteContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{property.title} | ADURE</title>
        {property.summary ? (
          <meta name="description" content={property.summary} />
        ) : null}
      </Head>
      <UnitDetailPage property={property} site={siteContent} />
    </>
  );
}
