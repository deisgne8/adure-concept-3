import type {
  StaticHeroFilters,
  StaticProperty,
  StaticPropertyIntent,
  StaticPropertySort,
} from "./static-types";

export const emptyStaticFilters: StaticHeroFilters = {
  location: "all",
  community: "all",
  type: "all",
  beds: "all",
  price: "all",
};

export function filterStaticProperties(
  properties: StaticProperty[],
  intent: StaticPropertyIntent,
  filters: StaticHeroFilters,
  sort: StaticPropertySort,
) {
  return properties
    .filter((property) => property.intent === intent)
    .filter(
      (property) =>
        filters.location === "all" || property.city === filters.location,
    )
    .filter(
      (property) =>
        filters.community === "all" ||
        property.community === filters.community,
    )
    .filter(
      (property) => filters.type === "all" || property.type === filters.type,
    )
    .filter((property) => {
      if (filters.beds === "all") return true;
      return filters.beds === "4"
        ? property.beds >= 4
        : property.beds === Number(filters.beds);
    })
    .filter((property) => {
      if (filters.price === "under-150") return property.price < 150000;
      if (filters.price === "150-250") {
        return property.price >= 150000 && property.price <= 250000;
      }
      if (filters.price === "250-plus") return property.price >= 250000;
      return true;
    })
    .sort((left, right) => {
      if (sort === "low") return left.price - right.price;
      if (sort === "high") return right.price - left.price;
      return right.date - left.date;
    });
}

export function propertyPrice(property: StaticProperty) {
  const price = new Intl.NumberFormat("en-AE").format(property.price);
  return `AED ${price}${property.intent === "lease" ? " / year" : ""}`;
}

export function compactPropertyPrice(property: StaticProperty) {
  if (property.price >= 1_000_000) {
    const amount = property.price / 1_000_000;
    return `AED ${amount.toFixed(property.price % 1_000_000 ? 1 : 0)}M`;
  }
  return `AED ${Math.round(property.price / 1_000)}K`;
}
