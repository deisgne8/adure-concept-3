export type StaticPropertyIntent = "buy" | "lease";
export type StaticPropertyStatus = "Available" | "Reserved" | "Leased";
export type StaticPropertyKind = "Apartment" | "Villa" | "Commercial";

export type StaticProperty = {
  id: string;
  intent: StaticPropertyIntent;
  title: string;
  building: string;
  unit: string;
  community: string;
  city: string;
  type: StaticPropertyKind;
  beds: number;
  baths: number;
  area: number;
  price: number;
  status: StaticPropertyStatus;
  date: number;
  image: string;
  coordinates: [number, number];
};

export type StaticCatalogContent = {
  hero: {
    eyebrow: string;
    title: string[];
    description: string;
    locations: string;
    image: string;
    imageAlt: string;
  };
  filtersTitle: string;
  filterLabels?: {
    bedrooms?: string;
    building?: string;
    location?: string;
    price?: string;
    sector?: string;
    transaction?: string;
    unitType?: string;
  };
  availableTitle: string;
  ownerCta: {
    title: string[];
    description: string;
    image: string;
    imageAlt: string;
    buttons: Array<{ href: string; label: string; target: string | null }>;
  };
  properties: StaticProperty[];
};

export type StaticHeroFilters = {
  location: string;
  community: string;
  type: string;
  beds: string;
  price: string;
};

export type StaticPropertySort = "recommended" | "newest" | "low" | "high";
