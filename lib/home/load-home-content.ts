import conversation from "../../data/home/conversation.json";
import discovery from "../../data/home/discovery.json";
import hero from "../../data/home/hero.json";
import management from "../../data/home/management.json";
import portfolio from "../../data/home/portfolio.json";
import proof from "../../data/home/proof.json";
import sell from "../../data/home/sell.json";
import site from "../../data/home/site.json";
import transition from "../../data/home/transition.json";
import trust from "../../data/home/trust.json";
import {
  getHeroVideoUrl,
  getHeadingLines,
  getHomeHeroFields,
  getHomeJourneysFields,
  getWordPressMediaUrl,
  loadWordPressHomePage,
} from "./wordpress";

const emptyJourneys = {
  id: "journeys",
  label: "Journeys",
  spacing: {},
  heading: "",
  description: "",
  cards: [] as {
    image: { src: string; alt: string };
    title: string;
    description: string;
    button: {
      text: string;
      href: string;
      variant: "link" | "primary" | "dark";
    };
  }[],
};

const localHomeContent = {
  site,
  hero,
  journeys: emptyJourneys,
  discovery,
  management,
  proof,
  portfolio,
  transition,
  sell,
  trust,
  conversation,
};

type LocalHomeContent = typeof localHomeContent;

function applyWordPressHero(
  homeContent: LocalHomeContent,
  page: Awaited<ReturnType<typeof loadWordPressHomePage>>,
) {
  const fields = getHomeHeroFields(page);

  if (!fields) {
    return homeContent;
  }

  const heading = getHeadingLines(fields.hero_heading);
  const video = getHeroVideoUrl(fields);
  const poster = getWordPressMediaUrl(fields.hero_poster);
  const buttons = fields.hero_buttons
    ?.map((button, index) => {
      const label = button.label ?? button.text;
      const href = button.href ?? button.link;

      if (!label || !href || index >= 2) {
        return null;
      }

      return { label, href };
    })
    .filter((button): button is { label: string; href: string } =>
      Boolean(button),
    );

  return {
    ...homeContent,
    hero: {
      ...homeContent.hero,
      heading: heading?.length ? heading : homeContent.hero.heading,
      description: fields.hero_description ?? homeContent.hero.description,
      media: {
        ...homeContent.hero.media,
        ...(video ? { video } : {}),
        ...(poster ? { poster } : {}),
      },
      buttons: buttons?.length ? buttons : homeContent.hero.buttons,
    },
  };
}

function applyWordPressJourneys(
  homeContent: LocalHomeContent,
  page: Awaited<ReturnType<typeof loadWordPressHomePage>>,
) {
  const fields = getHomeJourneysFields(page);
  if (!fields) return homeContent;
  const cards =
    fields.cards
      ?.map((card) => ({
        image: {
          src: getWordPressMediaUrl(card.image) ?? "",
          alt: card.image_alt ?? "",
        },
        title: card.title ?? "",
        description: card.description ?? "",
        button: {
          text: card.button_text ?? "",
          href: card.button_href ?? "",
        },
      }))
      .filter(
        (card) =>
          card.title || card.image.src || card.description || card.button.text,
      ) ?? [];
  return {
    ...homeContent,
    journeys: {
      ...emptyJourneys,
      spacing: {
        ...(fields.pt ? { pt: fields.pt } : {}),
        ...(fields.pb ? { pb: fields.pb } : {}),
      },
      heading: fields.heading ?? "",
      description: fields.description ?? "",
      cards,
    },
  };
}

export async function loadHomeContent() {
  const homeContent = localHomeContent;
  try {
    const page = await loadWordPressHomePage();
    return applyWordPressJourneys(applyWordPressHero(homeContent, page), page);
  } catch (error) {
    console.warn(
      "Using local home content because WordPress is unavailable.",
      error,
    );
    return homeContent;
  }
}

export type HomeContent = Awaited<ReturnType<typeof loadHomeContent>>;
