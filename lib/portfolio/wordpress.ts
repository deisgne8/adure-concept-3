import type { ButtonVariant } from "../../components/ui/Button";
import { getWordPressEndpoint } from "../config/endpoints";
import { getHeadingLines, getWordPressMediaUrl } from "../home/wordpress";
import type { PortfolioContent } from "./types";

type WordPressMedia =
  | string
  | {
      alt?: string;
      sizes?: { large?: string; medium_large?: string };
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

type WordPressPortfolioPage = {
  acf?: {
    portfolio_cta_button?: WordPressLink;
    portfolio_cta_button_label?: string;
    portfolio_cta_button_link?: WordPressLink;
    portfolio_cta_description?: string;
    portfolio_cta_heading?: string;
    portfolio_cta_image?: WordPressMedia;
    portfolio_cta_image_alt?: string;
    portfolio_cta_link?: WordPressLink;
    portfolio_explorer_description?: string;
    portfolio_explorer_heading?: string;
    portfolio_hero_description?: string;
    portfolio_hero_image?: WordPressMedia;
    portfolio_hero_image_alt?: string;
    portfolio_hero_title?: string;
    portfolio_intro_copy?: { text?: string }[] | false;
    portfolio_intro_heading?: string;
    portfolio_principles?:
      | {
          description?: string;
          image?: WordPressMedia;
          image_alt?: string;
          title?: string;
        }[]
      | false;
    portfolio_principles_heading?: string;
    portfolio_stats?:
      | {
          label?: string;
          suffix?: string;
          value?: string;
        }[]
      | false;
  };
  title?: { rendered?: string };
};

function getMediaUrl(media?: WordPressMedia) {
  if (!media) {
    return undefined;
  }

  if (typeof media === "object" && media) {
    return media.sizes?.large ?? media.sizes?.medium_large ?? media.url;
  }

  return getWordPressMediaUrl(media);
}

function getMediaAlt(media?: WordPressMedia, fallback = "") {
  return typeof media === "object" && media ? media.alt || fallback : fallback;
}

function getRows<T>(rows: T[] | false | undefined) {
  return Array.isArray(rows) ? rows : [];
}

function getLink(link?: WordPressLink, fallbackLabel = "") {
  if (!link) {
    return { href: "", label: "", target: null };
  }

  if (typeof link === "string") {
    return { href: link.trim(), label: fallbackLabel.trim(), target: null };
  }

  return {
    href: link.url?.trim() ?? "",
    label: link.title?.trim() || fallbackLabel.trim(),
    target: link.target?.trim() || null,
  };
}

export async function loadWordPressPortfolioContent() {
  const endpoint = getWordPressEndpoint("homePages");
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, "")}/1991`;
  endpoint.searchParams.set("acf_format", "standard");

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`WordPress portfolio request failed: ${response.status}`);
  }

  const page = (await response.json()) as WordPressPortfolioPage;
  const acf = page.acf ?? {};
  const heroImage = acf.portfolio_hero_image;
  const ctaImage = acf.portfolio_cta_image;
  const ctaButton = getLink(
    acf.portfolio_cta_button ?? acf.portfolio_cta_button_link ?? acf.portfolio_cta_link,
    acf.portfolio_cta_button_label ?? "",
  );

  return {
    meta: {
      title: page.title?.rendered
        ? `${page.title.rendered.replace(/<[^>]*>/g, "")} | ADURE`
        : "Portfolio | ADURE",
      description: acf.portfolio_hero_description ?? "",
    },
    hero: {
      headingLines: getHeadingLines(acf.portfolio_hero_title) ?? [],
      description: acf.portfolio_hero_description ?? "",
      image: getMediaUrl(heroImage) ?? "",
      imageAlt: acf.portfolio_hero_image_alt || getMediaAlt(heroImage),
    },
    introduction: {
      heading: acf.portfolio_intro_heading ?? "",
      paragraphs: getRows(acf.portfolio_intro_copy)
        .map((row) => row.text?.trim() ?? "")
        .filter(Boolean),
      stats: getRows(acf.portfolio_stats)
        .map((stat) => ({
          value: `${stat.value ?? ""}${stat.suffix ?? ""}`,
          label: stat.label ?? "",
        }))
        .filter((stat) => stat.value || stat.label),
    },
    explorer: {
      heading: acf.portfolio_explorer_heading ?? "",
      description: acf.portfolio_explorer_description ?? "",
      projectsByCity: [],
    },
    principles: {
      heading: acf.portfolio_principles_heading ?? "",
      items: getRows(acf.portfolio_principles)
        .map((item) => ({
          title: item.title ?? "",
          description: item.description ?? "",
          image: getMediaUrl(item.image) ?? "",
          imageAlt: item.image_alt || getMediaAlt(item.image),
        }))
        .filter((item) => item.title || item.description || item.image),
    },
    cta: {
      heading: acf.portfolio_cta_heading ?? "",
      description: acf.portfolio_cta_description ?? "",
      buttonLabel: ctaButton.label,
      buttonHref: ctaButton.href,
      buttonTarget: ctaButton.target,
      buttonVariant: "primary" as ButtonVariant,
      image: getMediaUrl(ctaImage) ?? "",
      imageAlt: acf.portfolio_cta_image_alt || getMediaAlt(ctaImage),
    },
  } satisfies PortfolioContent;
}
