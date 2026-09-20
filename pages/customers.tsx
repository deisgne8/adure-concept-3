import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import StaticCustomersPage from "../components/customers/StaticCustomersPage";
import content from "../data/customers/page.json";
import site from "../data/home/site.json";
import type { CustomersContent } from "../lib/customers/types";

export const getStaticProps = (async () => ({
  props: { content: content as CustomersContent, site },
})) satisfies GetStaticProps;

export default function CustomersRoute({ content: pageContent, site: siteContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{pageContent.meta.title}</title>
        <meta name="description" content={pageContent.meta.description} />
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticCustomersPage content={pageContent} site={siteContent} />
    </>
  );
}
