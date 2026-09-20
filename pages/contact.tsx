import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import StaticContactPage from "../components/contact/StaticContactPage";
import content from "../data/contact/page.json";
import site from "../data/home/site.json";
import type { ContactContent } from "../lib/contact/types";

export const getStaticProps = (async () => ({
  props: { content: content as ContactContent, site },
})) satisfies GetStaticProps;

export default function ContactRoute({ content: pageContent, site: siteContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{pageContent.meta.title}</title>
        <meta name="description" content={pageContent.meta.description} />
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticContactPage content={pageContent} site={siteContent} />
    </>
  );
}
