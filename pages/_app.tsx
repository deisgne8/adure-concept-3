import type { AppProps } from "next/app";
import "aos/dist/aos.css";
import "swiper/css";
import "../styles/tailwind.css";
import "../styles/lenis.css";
import "../styles/global/common.css";
import "../styles/components/StaticPortfolioPage.css";
import "../styles/components/StaticCustomersPage.css";
import "../styles/components/StaticContactPage.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
