import { useEffect } from "react";
import type { RefObject } from "react";

export default function useBannerEntrance(
  bannerRef: RefObject<HTMLElement | null>,
  waitForHomeIntro = false,
) {
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    let revealTimer: number | undefined;
    const reveal = () => {
      revealTimer = window.setTimeout(() => banner.classList.add("is-banner-visible"), 120);
    };
    if (!waitForHomeIntro || document.documentElement.dataset.introAnimationComplete === "true") {
      reveal();
      return () => window.clearTimeout(revealTimer);
    }

    document.addEventListener("adure:intro-complete", reveal, { once: true });
    return () => {
      window.clearTimeout(revealTimer);
      document.removeEventListener("adure:intro-complete", reveal);
    };
  }, [bannerRef, waitForHomeIntro]);
}
