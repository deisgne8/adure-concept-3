import { getWordPressUrl } from "../home/wordpress";
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

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getWordPressUrl()}${path}`, {
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
  const search = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, value);
  });
  const suffix = search.size ? `?${search.toString()}` : "";
  return getJson<PropertyListResponse>(`/wp-json/adure/v1/properties${suffix}`);
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
  return getJson<BuildingDetail>(
    `/wp-json/adure/v1/buildings/${encodeURIComponent(slug)}`,
  );
}

export function loadUnit(slug: string) {
  return getJson<PropertyUnitDetail>(
    `/wp-json/adure/v1/units/${encodeURIComponent(slug)}`,
  );
}

export function isNotFoundError(error: unknown) {
  return error instanceof Error && "status" in error && error.status === 404;
}
