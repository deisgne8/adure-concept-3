import { getWordPressEndpoint } from "../config/endpoints";
import type {
  BuildingFilters,
  BuildingDetail,
  BuildingListResponse,
  BuildingSummary,
  PropertyFilters,
  PropertyListResponse,
  PropertyTerm,
  PropertyUnitDetail,
} from "./types";

const emptyProperties: PropertyListResponse = {
  items: [],
  pagination: { page: 1, perPage: 12, total: 0, totalPages: 0 },
  facets: { sectors: [], locations: [], unitTypes: [], buildings: [] },
  facetsBySector: {
    residential: { sectors: [], locations: [], unitTypes: [], buildings: [] },
    retail: { sectors: [], locations: [], unitTypes: [], buildings: [] },
  },
};

async function getJson<T>(endpoint: URL): Promise<T> {
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
    throw lastError instanceof Error ? lastError : new Error("WordPress request failed");
  }

  if (!response.ok) {
    const error = new Error(
      `WordPress property request failed: ${response.status}`,
    );
    Object.assign(error, { status: response.status });
    throw error;
  }

  return response.json() as Promise<T>;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function collectTerms(items: BuildingSummary[], key: "locations" | "sectors") {
  const terms = new Map<string, PropertyTerm>();
  items.forEach((item) => {
    item[key].forEach((term) => {
      terms.set(term.slug, term);
    });
  });
  return [...terms.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeBuildingList(
  response: Partial<BuildingListResponse> & {
    items?: BuildingSummary[];
    total?: number;
  },
  filters: BuildingFilters,
): BuildingListResponse {
  const allItems = response.items ?? [];
  const facets = response.facets ?? {
    locations: collectTerms(allItems, "locations"),
    sectors: collectTerms(allItems, "sectors"),
  };

  if (response.pagination) {
    return {
      items: allItems,
      pagination: response.pagination,
      facets,
    };
  }

  const location = filters.location;
  const filteredItems = location
    ? allItems.filter((item) =>
        item.locations.some((term) => term.slug === location),
      )
    : allItems;
  const page = positiveInteger(filters.page, 1);
  const perPage = positiveInteger(filters.per_page, 21);
  const total = filteredItems.length;
  const totalPages = total ? Math.ceil(total / perPage) : 0;
  const safePage = totalPages ? Math.min(page, totalPages) : 1;
  const start = (safePage - 1) * perPage;

  return {
    items: filteredItems.slice(start, start + perPage),
    pagination: {
      page: safePage,
      perPage,
      total,
      totalPages,
    },
    facets,
  };
}

export async function loadProperties(filters: PropertyFilters = {}) {
  const endpoint = getWordPressEndpoint("properties");
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      endpoint.searchParams.set(key, value);
    }
  });
  return getJson<PropertyListResponse>(endpoint);
}

export async function loadBuildings(filters: BuildingFilters = {}) {
  const endpoint = getWordPressEndpoint("buildings");
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      endpoint.searchParams.set(key, value);
    }
  });
  const response = await getJson<
    Partial<BuildingListResponse> & { items?: BuildingSummary[]; total?: number }
  >(endpoint);
  return normalizeBuildingList(response, filters);
}

export async function loadHomeProperties() {
  try {
    return await loadProperties({ per_page: "12" });
  } catch (error) {
    console.warn("WordPress properties are unavailable.", error);
    return emptyProperties;
  }
}

export function loadBuilding(slug: string) {
  const endpoint = getWordPressEndpoint("buildings");
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, "")}/${encodeURIComponent(slug)}`;
  return getJson<BuildingDetail>(endpoint);
}

export function loadUnit(slug: string) {
  const endpoint = getWordPressEndpoint("units");
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, "")}/${encodeURIComponent(slug)}`;
  return getJson<PropertyUnitDetail>(endpoint);
}

export function isNotFoundError(error: unknown) {
  return error instanceof Error && "status" in error && error.status === 404;
}
