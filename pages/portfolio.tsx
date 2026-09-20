import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import StaticPortfolioPage from "../components/portfolio/StaticPortfolioPage";
import portfolio from "../data/portfolio/page.json";
import site from "../data/home/site.json";
import type { PortfolioContent } from "../lib/portfolio/types";

export const getStaticProps = (async () => ({
  props: { content: portfolio as PortfolioContent, site },
})) satisfies GetStaticProps;

export default function PortfolioRoute({ content, site: siteContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{content.meta.title}</title>
        <meta name="description" content={content.meta.description} />
        <meta name="theme-color" content="#004789" />
      </Head>
      <StaticPortfolioPage content={content} site={siteContent} />
    </>
  );
}
