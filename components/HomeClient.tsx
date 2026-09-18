import { useEffect } from "react";

declare global {
  interface Window {
    adureFinishOpening?: () => void;
    adureOpeningTimer?: number;
  }
}

export default function HomeClient() {
  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.nextAdureBooted) return;

    root.dataset.nextAdureBooted = "true";

    if (!location.hash || location.hash === "#home") {
      root.dataset.opening = "pending";
      window.adureOpeningTimer = window.setTimeout(() => {
        if (window.adureFinishOpening) {
          window.adureFinishOpening();
          return;
        }

        delete root.dataset.opening;
        document.querySelector("#site-intro")?.setAttribute("hidden", "");
        document.querySelectorAll("[inert]").forEach((element) => {
          (element as HTMLElement).inert = false;
        });
      }, 10_000);
    }

    void import("../lib/home/home.js")
      .then(() => import("../lib/home/hero-opening.js"))
      .catch(() => window.adureFinishOpening?.());
  }, []);

  return null;
}
