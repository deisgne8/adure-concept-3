import { getWordPressEndpoint } from "../config/endpoints";
import { getHeadingLines, getWordPressMediaUrl } from "../home/wordpress";
import type { StaticCatalogContent } from "./static-types";

type WordPressMedia =
  | string
  | {
      alt?: string;
      sizes?: { large?: string; medium_large?: string };
      source_url?: string;
      url?: string;
    }
  | false
  | null;

type WordPressLink =
  | string
  | {
      target?: string;
      title?: string;
      url?: string;
    }
  | false
  | null;

type WordPressPropertiesPage = {
  acf?: {
    properties_available_title?: string;
    properties_cta_background_image?: WordPressMedia;
    properties_cta_background_image_alt?: string;
    properties_cta_buttons?: Array<{ button?: WordPressLink }> | false;
    properties_cta_description?: string;
    properties_cta_title?: string;
    properties_filter_bedrooms_label?: string;
    properties_filter_building_label?: string;
    properties_filter_location_label?: string;
    properties_filter_price_label?: string;
    properties_filter_sector_label?: string;
    properties_filter_transaction_label?: string;
    properties_filter_unit_type_label?: string;
    properties_filters_title?: string;
    properties_intro_description?: string;
    properties_intro_eyebrow?: string;
    properties_intro_title?: string;
  };
};

function getMediaUrl(media?: WordPressMedia) {
  if (!media) {
    return undefined;
  }

  if (typeof media === "object" && media) {
    return media.sizes?.large ?? media.sizes?.medium_large ?? media.url ?? media.source_url;
  }

  return getWordPressMediaUrl(media);
}

function getMediaAlt(media?: WordPressMedia, fallback = "") {
  return typeof media === "object" && media ? media.alt || fallback : fallback;
}

function getLink(link?: WordPressLink) {
  if (!link) {
    return null;
  }

  if (typeof link === "string") {
    return null;
  }

  const href = link.url?.trim() ?? "";
  const label = link.title?.trim() ?? "";

  if (!href || !label) {
    return null;
  }

  return {
    href,
    label,
    target: link.target?.trim() || null,
  };
}

function getRows<T>(rows: T[] | false | undefined) {
  return Array.isArray(rows) ? rows : [];
}

function mergeIfPresent(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

async function loadWordPressPropertiesPage() {
  const endpoint = getWordPressEndpoint("homePages");
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, "")}/2000`;
  endpoint.searchParams.set("acf_format", "standard");

  let response: Response | undefined;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    throw lastError instanceof Error ? lastError : new Error("WordPress properties page request failed");
  }

  if (!response.ok) {
    throw new Error(`WordPress properties page request failed: ${response.status}`);
  }

  return response.json() as Promise<WordPressPropertiesPage>;
}

export async function loadPropertiesPageContent(
  fallback: StaticCatalogContent,
): Promise<StaticCatalogContent> {
  try {
    const page = await loadWordPressPropertiesPage();
    const acf = page.acf ?? {};
    const ctaImage = acf.properties_cta_background_image;
    const ctaButtons = getRows(acf.properties_cta_buttons)
      .map((row) => getLink(row.button))
      .filter((button): button is NonNullable<typeof button> => Boolean(button));

    return {
      ...fallback,
      hero: {
        ...fallback.hero,
        eyebrow: mergeIfPresent(acf.properties_intro_eyebrow, fallback.hero.eyebrow),
        title: getHeadingLines(acf.properties_intro_title) ?? fallback.hero.title,
        description: mergeIfPresent(acf.properties_intro_description, fallback.hero.description),
        imageAlt: fallback.hero.imageAlt,
      },
      filtersTitle: mergeIfPresent(acf.properties_filters_title, fallback.filtersTitle),
      filterLabels: {
        ...fallback.filterLabels,
        bedrooms: mergeIfPresent(acf.properties_filter_bedrooms_label, fallback.filterLabels?.bedrooms ?? "Bedrooms"),
        building: mergeIfPresent(acf.properties_filter_building_label, fallback.filterLabels?.building ?? "Building"),
        location: mergeIfPresent(acf.properties_filter_location_label, fallback.filterLabels?.location ?? "Location"),
        price: mergeIfPresent(acf.properties_filter_price_label, fallback.filterLabels?.price ?? "Price range"),
        sector: mergeIfPresent(acf.properties_filter_sector_label, fallback.filterLabels?.sector ?? "Sector"),
        transaction: mergeIfPresent(acf.properties_filter_transaction_label, fallback.filterLabels?.transaction ?? "Looking to"),
        unitType: mergeIfPresent(acf.properties_filter_unit_type_label, fallback.filterLabels?.unitType ?? "Property type"),
      },
      availableTitle: mergeIfPresent(acf.properties_available_title, fallback.availableTitle),
      ownerCta: {
        ...fallback.ownerCta,
        title: getHeadingLines(acf.properties_cta_title) ?? fallback.ownerCta.title,
        description: mergeIfPresent(acf.properties_cta_description, fallback.ownerCta.description),
        image: getMediaUrl(ctaImage) ?? fallback.ownerCta.image,
        imageAlt: acf.properties_cta_background_image_alt || getMediaAlt(ctaImage, fallback.ownerCta.imageAlt),
        buttons: ctaButtons.length ? ctaButtons : fallback.ownerCta.buttons,
      },
    };
  } catch (error) {
    console.warn("WordPress properties page content is unavailable.", error);
    return fallback;
  }
}
