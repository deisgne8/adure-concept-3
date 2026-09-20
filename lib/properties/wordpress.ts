import { getWordPressEndpoint } from "../config/endpoints";
import type {
  BuildingDetail,
  PropertyFilters,
  PropertyListResponse,
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
  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const error = new Error(
      `WordPress property request failed: ${response.status}`,
    );
    Object.assign(error, { status: response.status });
    throw error;
  }

  return response.json() as Promise<T>;
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
