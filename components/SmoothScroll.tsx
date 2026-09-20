import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      prevent: (node) => node.id === "property-map-canvas",
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
