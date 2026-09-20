import { useEffect } from "react";
import Router from "next/router";

export default function AosInitializer() {
  useEffect(() => {
    let cancelled = false;
    let refreshFrame = 0;
    let refreshAfterLayoutFrame = 0;
    let refreshAos = () => undefined;

    void import("aos").then(({ default: AOS }) => {
      if (cancelled) return;

      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        offset: 80,
        once: true,
      });

      refreshAos = () => {
        window.cancelAnimationFrame(refreshFrame);
        window.cancelAnimationFrame(refreshAfterLayoutFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          refreshAfterLayoutFrame = window.requestAnimationFrame(() => {
            AOS.refreshHard();
          });
        });
      };

      refreshAos();
      window.addEventListener("load", refreshAos);
      document.addEventListener("load", refreshAos, true);
      Router.events.on("routeChangeComplete", refreshAos);
      void document.fonts?.ready.then(refreshAos);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("load", refreshAos);
      document.removeEventListener("load", refreshAos, true);
      Router.events.off("routeChangeComplete", refreshAos);
      window.cancelAnimationFrame(refreshFrame);
      window.cancelAnimationFrame(refreshAfterLayoutFrame);
    };
  }, []);

  return null;
}
