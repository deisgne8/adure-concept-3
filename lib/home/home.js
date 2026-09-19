import "./portfolio-carousel.js";
import "./transition-carousel.js";
import "./philosophy-story.js";
import "./management-carousel.js?v=title-case-1";
import "./proof-counter.js";
import "./image-parallax.js";
const $ = (s) => document.querySelector(s);
function removeHyperlinks(root = document) {
  const links = [];
  if (root.matches?.("a[href]")) links.push(root);
  root.querySelectorAll?.("a[href]").forEach((link) => links.push(link));
  links.forEach((link) => {
    if (
      link.matches(
        "#journeys .journey-card .btn, #discovery .discovery-actions .btn, #discovery .property-actions .btn",
      )
    )
      return;
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
}
removeHyperlinks();
new MutationObserver((records) =>
  records.forEach((record) =>
    record.addedNodes.forEach((node) => {
      if (node.nodeType === 1) removeHyperlinks(node);
    }),
  ),
).observe(document.body, { childList: true, subtree: true });
const menu = $("#mobile-menu");
const header = $(".site-header"),
  hero = $(".site-hero");

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Keep section introductions consistent: title first, supporting copy second.
const sectionCopyGroups = [
  ["#discovery", ".discovery-title h2", ".discovery-title p"],
  ["#proof", ".proof-statement h2", ".proof-statement p"],
  ["#portfolio", ".portfolio-intro h2", ".portfolio-intro p"],
  ["#transition", ".transition-head h2", ".transition-head p"],
  ["#trust", ".trust-copy h2", ".trust-copy p"],
]
  .map(([sectionSelector, titleSelector, copySelector]) => {
    const section = $(sectionSelector);
    const title = section?.querySelector(titleSelector);
    const copy = section?.querySelector(copySelector);
    return section && title && copy ? { section, title, copy } : null;
  })
  .filter(Boolean);

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const sectionCopyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-copy-visible");
        sectionCopyObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
  );

  sectionCopyGroups.forEach(({ section, title, copy }) => {
    section.classList.add("section-copy-reveal-ready");
    title.classList.add("section-copy-title");
    copy.classList.add("section-copy-intro");
    sectionCopyObserver.observe(section);
  });
}

// Let the conversation landscape establish first, then bring in the panel and its content.
const conversationSection = $("#conversation");
if (
  conversationSection &&
  !reducedMotion.matches &&
  "IntersectionObserver" in window
) {
  conversationSection.classList.add("conversation-reveal-ready");
  const conversationObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      conversationSection.classList.add("is-conversation-visible");
      conversationObserver.disconnect();
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );
  conversationObserver.observe(conversationSection);
}

// Reveal the trust introduction and client marks as one paced sequence.
const trustSection = $("#trust");
if (
  trustSection &&
  !reducedMotion.matches &&
  "IntersectionObserver" in window
) {
  trustSection.classList.add("trust-reveal-ready");
  const trustObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      trustSection.classList.add("is-trust-visible");
      trustObserver.disconnect();
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  trustObserver.observe(trustSection);
}
let previousHeaderScrollY = window.scrollY;
let headerScrollFrame = 0;
function updateHeader() {
  if (!header) return;
  const currentScrollY = window.scrollY;
  const scrollDistance = currentScrollY - previousHeaderScrollY;

  header.classList.toggle(
    "is-glass",
    currentScrollY > Math.max(24, (hero?.offsetHeight ?? innerHeight) * 0.08),
  );

  if (currentScrollY <= 0 || scrollDistance < -4) {
    header.classList.remove("is-scroll-hidden");
  } else if (scrollDistance > 4 && currentScrollY > header.offsetHeight) {
    header.classList.add("is-scroll-hidden");
  }

  previousHeaderScrollY = currentScrollY;
}
function queueHeaderUpdate() {
  if (headerScrollFrame) return;

  headerScrollFrame = requestAnimationFrame(() => {
    headerScrollFrame = 0;
    updateHeader();
  });
}
updateHeader();
addEventListener("scroll", queueHeaderUpdate, { passive: true });
$(".menu-toggle").addEventListener("click", () => {
  menu.showModal();
  $(".menu-toggle").setAttribute("aria-expanded", "true");
});
$(".menu-close").addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").focus();
});
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => menu.close()));
const services = $("#services-toggle"),
  servicesMenu = $("#services-menu");
let servicesCloseTimer;
function closeServices(focus = false) {
  services.setAttribute("aria-expanded", "false");
  servicesMenu.classList.remove("is-open");
  clearTimeout(servicesCloseTimer);
  servicesCloseTimer = setTimeout(() => {
    if (!servicesMenu.classList.contains("is-open")) servicesMenu.hidden = true;
  }, 180);
  if (focus) services.focus();
}
services.addEventListener("click", () => {
  if (servicesMenu.classList.contains("is-open")) {
    closeServices();
    return;
  }

  clearTimeout(servicesCloseTimer);
  servicesMenu.hidden = false;
  requestAnimationFrame(() => servicesMenu.classList.add("is-open"));
  services.setAttribute("aria-expanded", "true");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-disclosure")) closeServices();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!servicesMenu.hidden) closeServices(true);
  }
});
// Preserve meaningful image crop and avoid an unnecessary intro or scroll animation.
document.querySelectorAll("main img:not(.site-hero img)").forEach((img) => {
  img.loading = "lazy";
  img.decoding = "async";
});

// Prepare a property enquiry in the visitor's email app without storing form data.
const sellForm = document.querySelector("[data-sell-form]");
if (sellForm)
  sellForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!sellForm.reportValidity()) return;
    const details = new FormData(sellForm);
    const subject = "Sell with ADURE — property enquiry";
    const body = [
      `Property location: ${details.get("location")}`,
      `Property type: ${details.get("type")}`,
      `Name: ${details.get("name")}`,
      `Phone: ${details.get("phone")}`,
      `Email: ${details.get("email")}`,
    ].join("\n");
    location.href = `mailto:Inquiries@adu-re.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
