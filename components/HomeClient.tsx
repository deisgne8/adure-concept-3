import { useEffect } from "react";

export default function HomeClient() {
  useEffect(() => {
    const root = document.documentElement;

    void import("aos").then(({ default: AOS }) => {
      const initialiseAos = () => {
        AOS.init({
          duration: 650,
          easing: "ease-out-cubic",
          offset: 0,
          once: true,
        });
        AOS.refreshHard();
      };

      document.addEventListener("adure:intro-complete", initialiseAos, {
        once: true,
      });

      if (root.dataset.introAnimationComplete === "true") initialiseAos();
    });

    if (root.dataset.nextAdureBooted) return;
    root.dataset.nextAdureBooted = "true";
    void import("../lib/home/home.js");
  }, []);

  return null;
}
