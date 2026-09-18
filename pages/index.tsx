import Head from "next/head";
import HomePage from "../components/HomePage";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>ADURE - Creating Value Beyond Property</title>
        <meta
          name="description"
          content="Abu Dhabi United Real Estate. End-to-end property solutions for buyers, sellers, tenants and owners across Abu Dhabi, Dubai and Al Ain."
        />
      </Head>
      <HomePage />
    </>
  );
}
