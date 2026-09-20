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
    let servicesCloseTimer: ReturnType<typeof setTimeout> | undefined;

    const updateHeader = () => header?.classList.toggle("is-glass", persistentGlass || window.scrollY > 24);
    const closeServices = (restoreFocus = false) => {
      servicesToggle?.setAttribute("aria-expanded", "false");
      servicesMenu?.classList.remove("is-open");
      clearTimeout(servicesCloseTimer);

      const finishClose = () => {
        if (servicesMenu && !servicesMenu.classList.contains("is-open")) servicesMenu.hidden = true;
      };

      servicesCloseTimer = setTimeout(finishClose, 180);

      if (restoreFocus) servicesToggle?.focus();
    };
    const toggleServices = () => {
      if (!servicesToggle || !servicesMenu) return;
      if (servicesMenu.classList.contains("is-open")) {
        closeServices();
        return;
      }

      clearTimeout(servicesCloseTimer);
      servicesMenu.hidden = false;
      requestAnimationFrame(() => servicesMenu.classList.add("is-open"));
      servicesToggle.setAttribute("aria-expanded", "true");
    };
    const closeServicesOnOutsideClick = (event: MouseEvent) => {
      if (!servicesMenu?.contains(event.target as Node) && !servicesToggle?.contains(event.target as Node)) {
        closeServices();
      }
    };
    const closeServicesOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && servicesMenu && !servicesMenu.hidden) closeServices(true);
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
    document.addEventListener("keydown", closeServicesOnEscape);

    const mobileLinks = mobileMenu?.querySelectorAll("a");
    mobileLinks?.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      window.removeEventListener("scroll", updateHeader);
      menuToggle?.removeEventListener("click", openMenu);
      menuClose?.removeEventListener("click", closeMenu);
      mobileMenu?.removeEventListener("close", restoreMenuTrigger);
      servicesToggle?.removeEventListener("click", toggleServices);
      document.removeEventListener("click", closeServicesOnOutsideClick);
      document.removeEventListener("keydown", closeServicesOnEscape);
      mobileLinks?.forEach((link) => link.removeEventListener("click", closeMenu));
      clearTimeout(servicesCloseTimer);
    };
  }, [persistentGlass]);

  return null;
}
