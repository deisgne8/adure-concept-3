import type { AppProps } from "next/app";
import AosInitializer from "../components/ui/AosInitializer";
import "aos/dist/aos.css";
import "swiper/css";
import "../styles/tailwind.css";
import "../styles/lenis.css";
import "../styles/global/common.css";
import "../styles/components/StaticPortfolioPage.css";
import "../styles/components/StaticCustomersPage.css";
import "../styles/components/StaticContactPage.css";
import "../styles/components/SharedSiteChrome.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AosInitializer />
      <Component {...pageProps} />
    </>
  );
}
