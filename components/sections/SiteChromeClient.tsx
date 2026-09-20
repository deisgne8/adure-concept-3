"use client";

import { useEffect } from "react";

type SiteChromeClientProps = { persistentGlass?: boolean };

export default function SiteChromeClient({ persistentGlass = false }: SiteChromeClientProps) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const mobileMenu = document.querySelector<HTMLDialogElement>("#mobile-menu");
    const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    const menuClose = document.querySelector<HTMLButtonElement>(".menu-close");
    const mobileNavToggles = Array.from(document.querySelectorAll<HTMLButtonElement>(".mobile-nav-toggle"));
    const dropdowns = Array.from(document.querySelectorAll<HTMLElement>(".desktop-nav .nav-dropdown"));

    const closeDropdowns = (except?: HTMLElement) => {
      dropdowns.forEach((dropdown) => {
        if (dropdown !== except) dropdown.classList.remove("is-open");
      });
    };
    const updateHeader = () => header?.classList.toggle("is-glass", persistentGlass || window.scrollY > 24);
    const openMenu = () => {
      if (mobileMenu && !mobileMenu.open) mobileMenu.showModal();
      menuToggle?.setAttribute("aria-expanded", "true");
    };
    const closeMenu = () => mobileMenu?.close();
    const restoreMenuTrigger = () => menuToggle?.setAttribute("aria-expanded", "false");
    const resetMobileNavGroups = () => {
      mobileNavToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
        document.getElementById(toggle.getAttribute("aria-controls") ?? "")?.setAttribute("hidden", "");
      });
    };
    const closeMenuFromBackdrop = (event: MouseEvent) => {
      if (event.target === mobileMenu) closeMenu();
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdowns.some((dropdown) => dropdown.contains(event.target as Node))) closeDropdowns();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const open = dropdowns.find((dropdown) => dropdown.classList.contains("is-open"));
      closeDropdowns();
      open?.querySelector<HTMLElement>(".nav-dropdown-toggle")?.focus();
    };

    const dropdownCleanups = dropdowns.map((dropdown) => {
      const open = () => { closeDropdowns(dropdown); dropdown.classList.add("is-open"); };
      const closePointer = () => dropdown.classList.remove("is-open");
      const close = (event: FocusEvent) => {
        if (!dropdown.contains(event.relatedTarget as Node | null)) dropdown.classList.remove("is-open");
      };
      dropdown.addEventListener("pointerenter", open);
      dropdown.addEventListener("pointerleave", closePointer);
      dropdown.addEventListener("focusin", open);
      dropdown.addEventListener("focusout", close);
      return () => {
        dropdown.removeEventListener("pointerenter", open);
        dropdown.removeEventListener("pointerleave", closePointer);
        dropdown.removeEventListener("focusin", open);
        dropdown.removeEventListener("focusout", close);
      };
    });
    const mobileNavCleanups = mobileNavToggles.map((toggle) => {
      const toggleSubmenu = () => {
        const submenu = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
        if (!submenu) return;
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        submenu.toggleAttribute("hidden", expanded);
      };
      toggle.addEventListener("click", toggleSubmenu);
      return () => toggle.removeEventListener("click", toggleSubmenu);
    });

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    menuToggle?.addEventListener("click", openMenu);
    menuClose?.addEventListener("click", closeMenu);
    mobileMenu?.addEventListener("click", closeMenuFromBackdrop);
    mobileMenu?.addEventListener("close", restoreMenuTrigger);
    mobileMenu?.addEventListener("close", resetMobileNavGroups);
    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    const mobileLinks = mobileMenu?.querySelectorAll("a");
    mobileLinks?.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      window.removeEventListener("scroll", updateHeader);
      menuToggle?.removeEventListener("click", openMenu);
      menuClose?.removeEventListener("click", closeMenu);
      mobileMenu?.removeEventListener("click", closeMenuFromBackdrop);
      mobileMenu?.removeEventListener("close", restoreMenuTrigger);
      mobileMenu?.removeEventListener("close", resetMobileNavGroups);
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      mobileLinks?.forEach((link) => link.removeEventListener("click", closeMenu));
      dropdownCleanups.forEach((cleanup) => cleanup());
      mobileNavCleanups.forEach((cleanup) => cleanup());
    };
  }, [persistentGlass]);

  return null;
}
