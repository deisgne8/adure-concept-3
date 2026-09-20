import type { ButtonVariant } from "../../components/ui/Button";

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
  clientGroups: Array<{ title: string; paragraphs: string[]; logos: CustomerLogo[] }>;
  sectors: { heading: string; description: string; items: CustomerSector[] };
  commitment: { heading: string; description: string; items: Array<{ title: string; description: string }> };
  testimonial: { heading: string; quote: string; description: string; client: string; location: string };
  closing: {
    heading: string;
    description: string;
    image: string;
    imageAlt: string;
    actions: Array<{ label: string; href: string; variant: ButtonVariant }>;
  };
};
