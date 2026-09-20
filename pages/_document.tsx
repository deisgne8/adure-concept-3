import { Head, Html, Main, NextScript } from "next/document";

const homeOpeningBoot = `(() => {
  const root = document.documentElement;
  const shouldOpen = location.pathname === "/" && (!location.hash || location.hash === "#home");
  if (!shouldOpen) return;
  root.dataset.opening = "pending";
  window.adureOpeningTimer = window.setTimeout(() => {
    if (window.adureFinishOpening) {
      window.adureFinishOpening();
      return;
    }
    delete root.dataset.opening;
    document.getElementById("site-intro")?.setAttribute("hidden", "");
  }, 10000);
})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#004789" />
        <link rel="icon" href="/assets/adure-logo.svg" />
        <script
          id="home-opening-boot"
          dangerouslySetInnerHTML={{ __html: homeOpeningBoot }}
        />
        <style>{`html[data-opening="pending"] body::before{content:"";position:fixed;inset:0;z-index:2147483647;background:#fff;pointer-events:auto}`}</style>
        <link
          rel="preload"
          href="/assets/fonts/fira-sans-400.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/source-sans-pro-400.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
