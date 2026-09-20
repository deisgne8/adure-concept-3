import "./philosophy-story.js";
import "./image-parallax.js";
import { updatePropertyMap } from "./property-map.js";
import { properties, matchProperties, reference } from "./home-data.js";
const $ = (s) => document.querySelector(s);
const header = $(".site-header"),
  hero = $(".site-hero");

// Keep section introductions consistent: title first, supporting copy second.
const sectionCopyGroups = [
  ["#discovery", ".discovery-title h2", ".discovery-title p"],
  ["#proof", ".proof-statement h2", ".proof-statement p"],
  ["#portfolio", ".portfolio-intro h2", ".portfolio-intro p"],
  ["#trust", ".trust-copy h2", ".trust-copy p"],
]
  .map(([sectionSelector, titleSelector, copySelector]) => {
    const section = $(sectionSelector);
    const title = section?.querySelector(titleSelector);
    const copy = section?.querySelector(copySelector);
    return section && title && copy ? { section, title, copy } : null;
  })
  .filter(Boolean);

if ("IntersectionObserver" in window) {
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

const propertySearchForm = $("#property-search");
if (propertySearchForm) {
  const moreFiltersToggle = propertySearchForm.querySelector(".more-filters-toggle");
  const moreFiltersPanel = propertySearchForm.querySelector(".more-filters-panel");
  propertySearchForm.append(moreFiltersPanel);
  let intent = "buy";
  let favourites = [];
  try {
    favourites = JSON.parse(localStorage.getItem("adure-favourites") || "[]");
    if (!Array.isArray(favourites)) favourites = [];
  } catch {}

  const format = (property) =>
    "AED " +
    property.price.toLocaleString("en-US") +
    (property.intent === "lease" ? " / year" : "");
  const buttonArrow = '<svg aria-hidden="true" class="button-arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  const render = (items) => {
    updatePropertyMap(items);
    $("#home-properties").innerHTML = items.length
      ? items
          .map((property) =>
            [
              '<article class="property-card">',
              `<a class="property-image" href="${reference}#property-detail" aria-label="View ${property.title}">`,
              `<img src="assets/${property.image}" alt="${property.title}" width="640" height="400" loading="lazy">`,
              '<span class="tag">Available</span>',
              "</a>",
              '<div class="property-copy">',
              `<h3>${property.title}</h3>`,
              `<p class="meta">${property.place}</p>`,
              `<p class="price">${format(property)}</p>`,
              `<p class="meta">${property.facts}</p>`,
              `<p class="meta">Assigned contact · ${property.contact}</p>`,
              '<div class="property-actions">',
              `<a class="btn link button-link" href="${reference}#property-detail">View property${buttonArrow}</a>`,
              '<div class="property-utilities">',
              `<button class="utility-button" data-favourite="${property.id}" aria-label="Save ${property.title}" aria-pressed="${favourites.includes(property.id)}">${favourites.includes(property.id) ? "♥" : "♡"}</button>`,
              `<button class="utility-button" data-share="${property.id}" aria-label="Share ${property.title}">Share</button>`,
              "</div>",
              "</div>",
              "</div>",
              "</article>",
            ].join(""),
          )
          .join("")
      : '<p class="empty-results">No properties match these filters. Try another selection or <button class="text-link" id="empty-reset">clear filters</button>.</p>';
  };
  const search = () => {
    const data = new FormData(propertySearchForm);
    const filters = Object.fromEntries(data);
    filters.intent = intent;
    filters.amenities = data.getAll("amenity");
    const results = matchProperties(filters);
    render(results);
    $("#search-status").textContent = `${results.length} ${results.length === 1 ? "property" : "properties"} available to ${intent === "buy" ? "buy" : "lease"}.`;
  };
  const reset = () => {
    propertySearchForm.reset();
    render(properties.slice(0, 3));
    $("#search-status").textContent = "Filters cleared. Showing featured properties.";
  };
  let moreFiltersTimer;
  const updateAmenitySummary = () => {
    const count = propertySearchForm.querySelectorAll('input[name="amenity"]:checked').length;
    const action = moreFiltersToggle.getAttribute("aria-expanded") === "true" ? "Close additional filters" : "More filters";
    const label = count ? `${action}, ${count} selected` : action;
    moreFiltersToggle.setAttribute("aria-label", label);
    moreFiltersToggle.title = label;
  };
  const setMoreFiltersOpen = (open) => {
    clearTimeout(moreFiltersTimer);
    propertySearchForm.classList.toggle("is-more-open", open);
    moreFiltersToggle.setAttribute("aria-expanded", String(open));
    updateAmenitySummary();
    if (open) {
      moreFiltersPanel.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => moreFiltersPanel.classList.add("is-visible")));
    } else {
      moreFiltersPanel.classList.remove("is-visible");
      const finish = () => {
        if (moreFiltersToggle.getAttribute("aria-expanded") === "false") moreFiltersPanel.hidden = true;
      };
      moreFiltersTimer = setTimeout(finish, 320);
    }
  };
  render(properties.slice(0, 3));
  $("#search-status").textContent = "Featured properties";
  moreFiltersToggle.addEventListener("click", () => setMoreFiltersOpen(moreFiltersToggle.getAttribute("aria-expanded") !== "true"));
  moreFiltersPanel.addEventListener("change", updateAmenitySummary);
  propertySearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
    setMoreFiltersOpen(false);
    $("#search-status").scrollIntoView({ block: "center", behavior: "instant" });
  });
  document.querySelectorAll("[data-intent]").forEach((button) =>
    button.addEventListener("click", () => {
      intent = button.dataset.intent;
      document.querySelectorAll("[data-intent]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      search();
    }),
  );
  propertySearchForm.addEventListener("reset", () => {
    setMoreFiltersOpen(false);
    requestAnimationFrame(reset);
  });
  document.addEventListener("click", async (event) => {
    if (event.target.closest("#empty-reset")) reset();
    const save = event.target.closest("[data-favourite]");
    if (save) {
      const id = save.dataset.favourite;
      favourites = favourites.includes(id) ? favourites.filter((item) => item !== id) : [...favourites, id];
      try { localStorage.setItem("adure-favourites", JSON.stringify(favourites)); } catch {}
      save.setAttribute("aria-pressed", String(favourites.includes(id)));
      save.textContent = favourites.includes(id) ? "♥" : "♡";
    }
    const share = event.target.closest("[data-share]");
    if (share) {
      const property = properties.find((item) => item.id === share.dataset.share);
      const text = `${property.title} — ${property.place} — ${format(property)}\n${reference}#property-detail`;
      try {
        await navigator.clipboard.writeText(text);
        share.textContent = "Copied";
      } catch {
        $("#search-status").textContent = "Share this property: " + text;
      }
    }
  });
}
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
