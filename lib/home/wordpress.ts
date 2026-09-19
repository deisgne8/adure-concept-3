type WordPressMedia = string | { url?: string; source_url?: string } | null;

type WordPressHeroButton = {
  label?: string;
  text?: string;
  href?: string;
  link?: string;
};

type WordPressHeroFields = {
  acf_fc_layout?: string;
  hero_heading?: string | string[];
  hero_description?: string;
  hero_video_source?: "upload" | "url";
  hero_video_upload?: WordPressMedia;
  hero_video_url?: string;
  hero_poster?: WordPressMedia;
  hero_buttons?: WordPressHeroButton[];
};

type WordPressJourneyCard = {
  image?: WordPressMedia;
  image_alt?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_href?: string;
};
type WordPressJourneysFields = {
  acf_fc_layout?: string;
  heading?: string;
  description?: string;
  pt?: string;
  pb?: string;
  cards?: WordPressJourneyCard[];
};

export type WordPressHomePage = {
  acf?: {
    home_components?: WordPressHeroFields[];
    journey_components?: WordPressJourneysFields[];
  };
};

export function getWordPressUrl() {
  return (process.env.WORDPRESS_URL ?? "https://adure.e8demo.com").replace(
    /\/$/,
    "",
  );
}

export function getHomeJourneysFields(page: WordPressHomePage | null) {
  return page?.acf?.journey_components?.find(
    (component) => component.acf_fc_layout === "journeys",
  );
}

export async function loadWordPressHomePage() {
  const response = await fetch(
    `${getWordPressUrl()}/wp-json/wp/v2/pages?slug=home&per_page=1&acf_format=standard`,
  );

  if (!response.ok) {
    throw new Error(`WordPress home request failed: ${response.status}`);
  }

  const pages = (await response.json()) as WordPressHomePage[];
  return pages[0] ?? null;
}

export function getWordPressMediaUrl(media?: WordPressMedia) {
  if (typeof media === "string") {
    return media;
  }

  return media?.url ?? media?.source_url;
}

export function getHeadingLines(heading: string | string[] | undefined) {
  if (Array.isArray(heading)) {
    return heading.filter(Boolean);
  }

  return heading?.split(/<br\s*\/?>|\r?\n/i).filter(Boolean);
}

export function getHomeHeroFields(page: WordPressHomePage | null) {
  return page?.acf?.home_components?.find(
    (component) => component.acf_fc_layout === "hero",
  );
}

export function getHeroVideoUrl(fields: WordPressHeroFields) {
  if (fields.hero_video_source === "url") {
    return fields.hero_video_url?.trim();
  }

  return getWordPressMediaUrl(fields.hero_video_upload);
}
