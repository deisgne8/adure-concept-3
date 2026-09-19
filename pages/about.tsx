import Head from "next/head";
import AboutPage from "../components/AboutPage";
import aboutContent from "../data/about.json";
import { loadHomeContent } from "../lib/home/load-home-content";

export async function getStaticProps() {
  const { site } = await loadHomeContent();
  return { props: { siteContent: site } };
}

export default function AboutRoute({ siteContent }: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <>
      <Head>
        <title>{aboutContent.meta.title}</title>
        <meta name="description" content={aboutContent.meta.description} />
      </Head>
      <AboutPage siteContent={siteContent} />
    </>
  );
}
