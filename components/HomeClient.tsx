import { useEffect } from "react";

export default function HomeClient() {
  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.nextAdureBooted) return;
    root.dataset.nextAdureBooted = "true";
    void import("../lib/home/home.js");
  }, []);

  return null;
}
