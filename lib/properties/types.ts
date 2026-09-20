export type PropertyTerm = {
  id: number;
  name: string;
  slug: string;
};

export type PropertyImage = {
  id: number;
  alt: string;
  thumbnail: string | false;
  card: string | false;
  full: string | false;
};

export type Broker = {
  id: number;
  name: string;
  position: string | null;
  photo: PropertyImage | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  languages: string[];
  biography: string;
  license: string | null;
};

export type BuildingSummary = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  description: string;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  sectors: PropertyTerm[];
  locations: PropertyTerm[];
  amenities: PropertyTerm[];
  features: string[];
  cardImage: PropertyImage | null;
  heroImage: PropertyImage | null;
  gallery: PropertyImage[];
  seo: {
    title: string;
    description: string | null;
  };
};

export type PropertyUnit = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  unitCode: string;
  building: BuildingSummary | null;
  sectors: PropertyTerm[];
  locations: PropertyTerm[];
  unitTypes: PropertyTerm[];
  amenities: PropertyTerm[];
  transaction: "lease" | "sale" | "both";
  status: "available";
  floor: string | null;
  subtype: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  currency: string;
  annualRent: number | null;
  salePrice: number | null;
  pricePerSqm: number | null;
  cardImage: PropertyImage | null;
  primaryBroker: Broker | null;
  additionalBrokers: Broker[];
};

export type PropertyUnitDetail = PropertyUnit & {
  description: string;
  view: string | null;
  commonAreaSqm: number | null;
  netAreaSqm: number | null;
  features: {
    balcony: boolean;
    maidRoom: boolean;
    storeRoom: boolean;
    studyRoom: boolean;
  };
  facilities: string | null;
  gallery: PropertyImage[];
  floorPlan: PropertyImage | null;
  documents: { label: string; url: string }[];
};

export type PropertyFacets = {
  sectors: PropertyTerm[];
  locations: PropertyTerm[];
  unitTypes: PropertyTerm[];
  buildings: PropertyTerm[];
};

export type PropertyListResponse = {
  items: PropertyUnit[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  facets: PropertyFacets;
  facetsBySector: {
    residential: PropertyFacets;
    retail: PropertyFacets;
  };
};

export type BuildingDetail = BuildingSummary & {
  units: PropertyUnit[];
};

export type BuildingListResponse = {
  items: BuildingSummary[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  facets: {
    locations: PropertyTerm[];
    sectors: PropertyTerm[];
  };
};

export type BuildingFilters = {
  page?: string;
  per_page?: string;
  location?: string;
};

export type PropertyFilters = {
  per_page?: string;
  page?: string;
  sector?: string;
  location?: string;
  building?: string;
  unit_type?: string;
  bedrooms?: string;
  transaction?: string;
  min_price?: string;
  max_price?: string;
  min_area?: string;
  max_area?: string;
};
