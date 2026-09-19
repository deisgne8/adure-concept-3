import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import "../styles/lenis.css";
import "../styles/global/common.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
