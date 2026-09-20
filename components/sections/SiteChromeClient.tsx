"use client";

import { useEffect } from "react";

type SiteChromeClientProps = {
  persistentGlass?: boolean;
};

export default function SiteChromeClient({ persistentGlass = false }: SiteChromeClientProps) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const mobileMenu = document.querySelector<HTMLDialogElement>("#mobile-menu");
    const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    const menuClose = document.querySelector<HTMLButtonElement>(".menu-close");
    const servicesToggle = document.querySelector<HTMLButtonElement>("#services-toggle");
    const servicesMenu = document.querySelector<HTMLElement>("#services-menu");

    const updateHeader = () => header?.classList.toggle("is-glass", persistentGlass || window.scrollY > 24);
    const closeServices = () => {
      servicesToggle?.setAttribute("aria-expanded", "false");
      if (servicesMenu) servicesMenu.hidden = true;
    };
    const toggleServices = () => {
      const isOpen = servicesToggle?.getAttribute("aria-expanded") === "true";
      servicesToggle?.setAttribute("aria-expanded", String(!isOpen));
      if (servicesMenu) servicesMenu.hidden = isOpen;
    };
    const closeServicesOnOutsideClick = (event: MouseEvent) => {
      if (!servicesMenu?.contains(event.target as Node) && !servicesToggle?.contains(event.target as Node)) {
        closeServices();
      }
    };
    const openMenu = () => {
      mobileMenu?.showModal();
      menuToggle?.setAttribute("aria-expanded", "true");
    };
    const closeMenu = () => mobileMenu?.close();
    const restoreMenuTrigger = () => menuToggle?.setAttribute("aria-expanded", "false");

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    menuToggle?.addEventListener("click", openMenu);
    menuClose?.addEventListener("click", closeMenu);
    mobileMenu?.addEventListener("close", restoreMenuTrigger);
    servicesToggle?.addEventListener("click", toggleServices);
    document.addEventListener("click", closeServicesOnOutsideClick);

    const mobileLinks = mobileMenu?.querySelectorAll("a");
    mobileLinks?.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      window.removeEventListener("scroll", updateHeader);
      menuToggle?.removeEventListener("click", openMenu);
      menuClose?.removeEventListener("click", closeMenu);
      mobileMenu?.removeEventListener("close", restoreMenuTrigger);
      servicesToggle?.removeEventListener("click", toggleServices);
      document.removeEventListener("click", closeServicesOnOutsideClick);
      mobileLinks?.forEach((link) => link.removeEventListener("click", closeMenu));
    };
  }, [persistentGlass]);

  return null;
}
