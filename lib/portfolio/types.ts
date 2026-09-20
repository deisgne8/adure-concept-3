import type { ButtonVariant } from "../../components/ui/Button";

export type PortfolioProject = {
  name: string;
  type: string;
  location: string;
  image: string;
  description?: string;
};

export type PortfolioCity = {
  city: string;
  projects: PortfolioProject[];
};

export type PortfolioContent = {
  meta: { title: string; description: string };
  hero: { headingLines: string[]; description: string; image: string; imageAlt: string };
  introduction: {
    heading: string;
    paragraphs: string[];
    stats: Array<{ value: string; label: string }>;
  };
  explorer: { heading: string; description: string; projectsByCity: PortfolioCity[] };
  principles: {
    heading: string;
    items: Array<{ title: string; description: string; image: string }>;
  };
  cta: {
    heading: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    buttonVariant: ButtonVariant;
    image: string;
    imageAlt: string;
  };
};
