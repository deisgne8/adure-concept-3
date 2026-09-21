import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListingPropertyUnit } from "./StaticPropertiesPage";

type LeafletMap = {
  fitBounds: (bounds: unknown, options: Record<string, unknown>) => void;
  invalidateSize: () => void;
  remove: () => void;
};

type LeafletRuntime = {
  control: { zoom: (options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void } };
  divIcon: (options: Record<string, unknown>) => unknown;
  latLngBounds: (coordinates: Array<[number, number]>) => unknown;
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap & { setView: (coordinates: [number, number], zoom: number) => LeafletMap };
  maplibreGL?: (options: Record<string, unknown>) => { addTo: (map: LeafletMap) => { getMaplibreMap: () => { on: (event: string, callback: () => void) => void } | undefined } };
  marker: (coordinates: [number, number], options: Record<string, unknown>) => { addTo: (map: LeafletMap) => { bindPopup: (content: string) => void } };
};

type RuntimeWindow = Window & { L?: LeafletRuntime };
const fallbackCoordinates: Record<string, [number, number]> = {
  "abu-dhabi": [24.4539, 54.3773], dubai: [25.2048, 55.2708], "al-ain": [24.2075, 55.7447],
  "hidd-al-saadiyat": [24.548, 54.452], "saadiyat-island": [24.548, 54.452],
};

function coordinatesFor(property: ListingPropertyUnit): [number, number] | null {
  const latitude = Number(property.building?.latitude);
  const longitude = Number(property.building?.longitude);
  if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude && longitude) return [latitude, longitude];
  const terms = [...property.locations, ...(property.building?.locations ?? [])];
  for (const term of terms) if (fallbackCoordinates[term.slug]) return fallbackCoordinates[term.slug];
  const locationName = terms.map((term) => term.name.toLowerCase()).join(" ");
  if (locationName.includes("dubai")) return fallbackCoordinates.dubai;
  if (locationName.includes("al ain")) return fallbackCoordinates["al-ain"];
  if (locationName.includes("saadiyat") || locationName.includes("hidd")) return fallbackCoordinates["hidd-al-saadiyat"];
  if (locationName.includes("abu dhabi")) return fallbackCoordinates["abu-dhabi"];
  return null;
}

export function hasMappableProperty(properties: ListingPropertyUnit[]) { return properties.some(coordinatesFor); }

export default function LivePropertiesMap({ active, properties }: { active: boolean; properties: ListingPropertyUnit[] }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [maplibreReady, setMaplibreReady] = useState(false);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reportFailure = useCallback(() => window.setTimeout(() => setFailed(true), 0), []);
  const points = useMemo(() => properties.map((property) => ({ property, coordinates: coordinatesFor(property) })).filter((item): item is { property: ListingPropertyUnit; coordinates: [number, number] } => Boolean(item.coordinates)), [properties]);

  useEffect(() => {
    if (!active || !leafletReady || !maplibreReady || !bridgeReady || !canvasRef.current || mapRef.current) return;
    const L = (window as RuntimeWindow).L;
    if (!L) return;
    try {
      const map = L.map(canvasRef.current, { zoomControl: false, scrollWheelZoom: true, minZoom: 5, maxZoom: 18 }).setView([24.66, 54.96], 7);
      mapRef.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);
      if (L.maplibreGL) L.maplibreGL({ style: "/vendor/openfreemap-positron-en.json" }).addTo(map).getMaplibreMap()?.on("error", reportFailure);
      else reportFailure();
      const grouped = new Map<string, typeof points>();
      points.forEach((point) => { const key = point.coordinates.join(","); grouped.set(key, [...(grouped.get(key) ?? []), point]); });
      grouped.forEach((items) => {
        const first = items[0];
        const label = items.length > 1 ? `${items.length} properties` : first.property.title;
        const marker = L.marker(first.coordinates, { icon: L.divIcon({ className: "propertyfinder-area-marker", html: `<span>${items.length > 1 ? String(items.length).padStart(2, "0") : "1"}</span>`, iconSize: [1, 1], iconAnchor: [34, 18] }), title: label }).addTo(map);
        const links = items.slice(0, 5).map(({ property }) => property.building ? `<a href="/properties/${property.building.slug}/${property.slug}">${property.title}</a>` : `<span>${property.title}</span>`).join("");
        marker.bindPopup(`<strong>${label}</strong><div class="property-map-popup-links">${links}</div>`);
      });
      if (points.length) map.fitBounds(L.latLngBounds(points.map((point) => point.coordinates)), { padding: [70, 70], maxZoom: 10, animate: false });
      resizeRef.current = new ResizeObserver(() => map.invalidateSize());
      resizeRef.current.observe(canvasRef.current);
    } catch { reportFailure(); }
    return () => { resizeRef.current?.disconnect(); mapRef.current?.remove(); mapRef.current = null; };
  }, [active, bridgeReady, leafletReady, maplibreReady, points, reportFailure]);

  return <div className="map-view property-finder-map live-properties-map" hidden={!active}><div className="map-canvas"><div ref={canvasRef} id="property-map" role="application" aria-label="Interactive property map" />{failed ? <div className="map-load-message" role="status">Map imagery is unavailable. Property locations remain available in the list view.</div> : null}</div><Script src="/vendor/leaflet.js" strategy="afterInteractive" onReady={() => setLeafletReady(true)} />{leafletReady ? <Script src="/vendor/maplibre-gl-5.6.2.js" strategy="afterInteractive" onReady={() => setMaplibreReady(true)} /> : null}{maplibreReady ? <Script src="/vendor/leaflet-maplibre-gl-0.1.3.js" strategy="afterInteractive" onReady={() => setBridgeReady(true)} /> : null}</div>;
}
