import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import StaticPropertiesPage from "../../components/properties/StaticPropertiesPage";
import catalog from "../../data/properties/catalog.json";
import site from "../../data/home/site.json";
import type { StaticCatalogContent } from "../../lib/properties/static-types";

export const getStaticProps = (async () => ({
  props: { content: catalog as StaticCatalogContent, site },
})) satisfies GetStaticProps;

export default function PropertiesRoute({
  content,
  site: siteContent,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Properties | ADURE</title>
        <meta
          name="description"
          content="Explore selected properties for sale and lease across Abu Dhabi, Dubai and Al Ain with ADURE."
        />
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticPropertiesPage content={content} site={siteContent} />
    </>
  );
}
