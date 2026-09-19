"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adureFinishOpening?: () => void;
    adureOpeningTimer?: number;
  }
}

type HeroClientProps = {
  hasVideo: boolean;
};

export default function HeroClient({ hasVideo }: HeroClientProps) {
  useEffect(() => {
    if (!hasVideo) return;

    const root = document.documentElement;
    if (root.dataset.heroOpeningBooted) return;
    root.dataset.heroOpeningBooted = "true";

    let shouldPlayOpening = !location.hash || location.hash === "#home";
    try {
      shouldPlayOpening =
        shouldPlayOpening &&
        sessionStorage.getItem("adure-opening-played-v2") !== "true";
      if (shouldPlayOpening) sessionStorage.setItem("adure-opening-played-v2", "true");
    } catch {
      // Browser storage is optional for the opening experience.
    }

    if (shouldPlayOpening) {
      root.dataset.opening = "pending";
      window.adureOpeningTimer = window.setTimeout(() => {
        window.adureFinishOpening?.();
      }, 10_000);
    }

    void import("../../lib/home/hero-transition.js");
    void import("../../lib/home/hero-opening.js").catch(() => {
      window.adureFinishOpening?.();
    });

    return () => window.clearTimeout(window.adureOpeningTimer);
  }, [hasVideo]);

  return null;
}
