import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { compactPropertyPrice } from "../../lib/properties/static-catalog";
import type { StaticProperty } from "../../lib/properties/static-types";
import StaticPropertyCard from "./StaticPropertyCard";

type PropertiesMapProps = {
  active: boolean;
  onFavourite: (id: string) => void;
  onShare: (property: StaticProperty, button?: HTMLButtonElement) => void;
  properties: StaticProperty[];
  saved: Set<string>;
};

type LeafletLayer = { clearLayers: () => void };
type LeafletMarker = {
  addTo: (layer: LeafletLayer) => LeafletMarker;
  getElement: () => HTMLElement | null;
  on: (event: string, callback: () => void) => LeafletMarker;
  setZIndexOffset: (offset: number) => void;
};
type LeafletMap = {
  fitBounds: (bounds: unknown, options: Record<string, unknown>) => void;
  flyTo: (coords: [number, number], zoom: number, options: Record<string, unknown>) => void;
  invalidateSize: () => void;
  on: (event: string, callback: (event: { originalEvent?: Event }) => void) => void;
  remove: () => void;
  setView: (coords: [number, number], zoom: number) => LeafletMap;
};
type LeafletApi = {
  control: { zoom: (options: Record<string, unknown>) => { addTo: (map: LeafletMap) => void } };
  divIcon: (options: Record<string, unknown>) => unknown;
  latLngBounds: (coordinates: [number, number][]) => unknown;
  layerGroup: () => LeafletLayer & { addTo: (map: LeafletMap) => LeafletLayer };
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  maplibreGL?: (options: Record<string, unknown>) => {
    addTo: (map: LeafletMap) => { getMaplibreMap: () => { on: (event: string, callback: () => void) => void } };
  };
  marker: (coords: [number, number], options: Record<string, unknown>) => LeafletMarker;
};

const areas = [
  { id: "dubai", name: "Dubai", coordinates: [25.198, 55.274] as [number, number], match: (property: StaticProperty) => property.city === "Dubai" },
  { id: "qaryat", name: "Qaryat Al Hidd", coordinates: [24.548, 54.452] as [number, number], match: (property: StaticProperty) => property.community === "Qaryat Al Hidd" },
  { id: "saadiyat", name: "Saadiyat Island", coordinates: [24.555, 54.461] as [number, number], match: (property: StaticProperty) => property.community === "Saadiyat Island" },
  { id: "mushrif", name: "Al Mushrif", coordinates: [24.444, 54.386] as [number, number], match: (property: StaticProperty) => property.community === "Al Mushrif" },
  { id: "abu-dhabi", name: "Abu Dhabi", coordinates: [24.4539, 54.3773] as [number, number], match: (property: StaticProperty) => property.city === "Abu Dhabi" && !["Qaryat Al Hidd", "Saadiyat Island", "Al Mushrif"].includes(property.community) },
  { id: "al-ain", name: "Al Ain", coordinates: [24.207, 55.744] as [number, number], match: (property: StaticProperty) => property.city === "Al Ain" },
];

function getLeaflet() {
  return (window as typeof window & { L?: LeafletApi }).L;
}

export default function PropertiesMap({
  active,
  onFavourite,
  onShare,
  properties,
  saved,
}: PropertiesMapProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletLayer | null>(null);
  const markerRef = useRef(new Map<string, LeafletMarker>());
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapLibreReady, setMapLibreReady] = useState(false);
  const [pluginReady, setPluginReady] = useState(false);
  const [basemapFailed, setBasemapFailed] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const activeAreas = useMemo(
    () => areas.map((area) => ({ ...area, items: properties.filter(area.match) })).filter((area) => area.items.length),
    [properties],
  );
  const selected = activeAreas.find((area) => area.id === selectedArea) ?? null;

  const fitMap = () => {
    const leaflet = getLeaflet();
    const map = mapRef.current;
    if (!leaflet || !map || !activeAreas.length) return;
    map.invalidateSize();
    map.fitBounds(leaflet.latLngBounds(activeAreas.map((area) => area.coordinates)), {
      paddingTopLeft: [80, 90],
      paddingBottomRight: [selected ? 460 : 120, 90],
      maxZoom: 7,
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  };

  useEffect(() => {
    if (!active || !leafletReady || !canvasRef.current || mapRef.current) return;
    const leaflet = getLeaflet();
    if (!leaflet) return;
    const map = leaflet.map(canvasRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      minZoom: 5,
      maxZoom: 18,
    }).setView([24.5, 54.9], 7);
    leaflet.control.zoom({ position: "bottomright" }).addTo(map);
    layerRef.current = leaflet.layerGroup().addTo(map);
    map.on("click", (event) => {
      const target = event.originalEvent?.target as Element | null;
      if (!target?.closest?.(".leaflet-marker-icon")) setSelectedArea(null);
    });
    mapRef.current = map;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(canvasRef.current);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [active, leafletReady]);

  useEffect(() => {
    if (!active || !pluginReady || !mapRef.current) return;
    const leaflet = getLeaflet();
    if (!leaflet?.maplibreGL) {
      queueMicrotask(() => setBasemapFailed(true));
      return;
    }
    try {
      const layer = leaflet.maplibreGL({
        style: "/vendor/openfreemap-positron-en.json",
        attributionControl: {
          customAttribution: '<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> · OpenStreetMap',
        },
      }).addTo(mapRef.current);
      const mapLibreMap = layer.getMaplibreMap();
      mapLibreMap.on("error", () => setBasemapFailed(true));
      mapLibreMap.on("idle", () => setBasemapFailed(false));
    } catch {
      queueMicrotask(() => setBasemapFailed(true));
    }
  }, [active, pluginReady]);

  useEffect(() => {
    const leaflet = getLeaflet();
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!active || !leaflet || !layer || !map) return;
    layer.clearLayers();
    markerRef.current.clear();
    activeAreas.forEach((area) => {
      const label = area.items.length > 1 ? `${String(area.items.length).padStart(2, "0")} units` : compactPropertyPrice(area.items[0]);
      const marker = leaflet.marker(area.coordinates, {
        icon: leaflet.divIcon({
          className: "propertyfinder-area-marker",
          html: `<span>${label}</span>`,
          iconSize: [1, 1],
          iconAnchor: [42, 18],
        }),
        title: area.name,
        alt: `Show properties in ${area.name}`,
        keyboard: true,
        bubblingMouseEvents: false,
      }).addTo(layer).on("click", () => {
        setSelectedArea(area.id);
        map.flyTo(area.coordinates, area.id === "qaryat" || area.id === "saadiyat" ? 11 : 10, {
          animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          duration: 0.75,
        });
      });
      marker.getElement()?.setAttribute("aria-label", `Show properties in ${area.name}`);
      markerRef.current.set(area.id, marker);
    });
    requestAnimationFrame(fitMap);
  // fitMap intentionally derives from the current result set.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, activeAreas]);

  useEffect(() => {
    markerRef.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle("is-selected", id === selectedArea);
      marker.setZIndexOffset(id === selectedArea ? 1000 : 0);
    });
  }, [selectedArea]);

  return (
    <>
      <Script src="/vendor/leaflet.js" strategy="afterInteractive" onReady={() => setLeafletReady(true)} />
      {leafletReady ? <Script src="/vendor/maplibre-gl-5.6.2.js" strategy="afterInteractive" onReady={() => setMapLibreReady(true)} /> : null}
      {mapLibreReady ? <Script src="/vendor/leaflet-maplibre-gl-0.1.3.js" strategy="afterInteractive" onReady={() => setPluginReady(true)} /> : null}
      <div className="map-view property-finder-map" id="map-view" hidden={!active}>
        <div className="map-canvas">
          <div ref={canvasRef} id="property-map" role="application" aria-label="Interactive property map" />
          <div className="map-load-message" role="status" hidden={!basemapFailed}>
            Map imagery is unavailable. You can still explore properties using the location list.
          </div>
          <button className="map-fit" type="button" aria-label="Show all property locations" onClick={fitMap}>
            ⌖ <span>Show all</span>
          </button>
          <p className="map-note">Approximate locations shown</p>
        </div>
        <aside className="map-results" aria-label="Selected map listings" hidden={!selected}>
          {selected ? (
            <>
              <div className="map-results-head">
                <strong data-count={String(selected.items.length).padStart(2, "0")}>{selected.items.length} properties</strong>
                <span>{selected.name} · {selected.items.length} {selected.items.length === 1 ? "listing" : "listings"}</span>
              </div>
              <div>
                {selected.items.map((property) => (
                  <StaticPropertyCard
                    key={property.id}
                    mapCard
                    property={property}
                    saved={saved.has(property.id)}
                    onFavourite={onFavourite}
                    onShare={onShare}
                  />
                ))}
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </>
  );
}
