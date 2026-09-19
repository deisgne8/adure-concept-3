import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import HomePage from "../components/HomePage";
import { loadHomeContent } from "../lib/home/load-home-content";

export const getStaticProps = (async () => ({
  props: {
    homeContent: await loadHomeContent(),
  },
})) satisfies GetStaticProps;

export default function IndexPage({
  homeContent,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>ADURE - Creating Value Beyond Property</title>
        <meta
          name="description"
          content="Abu Dhabi United Real Estate. End-to-end property solutions for buyers, sellers, tenants and owners across Abu Dhabi, Dubai and Al Ain."
        />
      </Head>
      <HomePage content={homeContent} />
    </>
  );
}
