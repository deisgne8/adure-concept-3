import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#004789" />
        <link rel="icon" href="/assets/adure-logo.svg" />
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
