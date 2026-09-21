import type { ButtonVariant } from "../../components/ui/Button";
import type { TestimonialsContent } from "../testimonials/types";

export type CustomerLogo = { name: string; image: string };
export type CustomerSector = { title: string; description: string; image: string; imageAlt: string };

export type CustomersContent = {
  meta: { title: string; description: string };
  hero: {
    headingLines: string[];
    paragraphs: string[];
    image: string;
    imageAlt: string;
    cta: { label: string; href: string };
  };
  clientGroups: Array<{ id: string; title: string; paragraphs: string[]; logos: CustomerLogo[] }>;
  testimonials: TestimonialsContent;
  closing: {
    heading: string;
    description: string;
    image: string;
    imageAlt: string;
    actions: Array<{ label: string; href: string; variant: ButtonVariant }>;
  };
};
