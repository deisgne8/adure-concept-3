import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactLocation, ContactMapContent } from "../../lib/contact/types";

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

type LeafletWindow = Window & { L?: LeafletRuntime };

export default function ContactLocationMap({ content, locations }: { content: ContactMapContent; locations: ContactLocation[] }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [maplibreReady, setMaplibreReady] = useState(false);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reportFailure = useCallback(() => window.setTimeout(() => setFailed(true), 0), []);

  const initialise = useCallback(() => {
    const runtime = window as LeafletWindow;
    const L = runtime.L;
    if (!canvasRef.current || mapRef.current || !L || !leafletReady || !maplibreReady || !bridgeReady) return;
    try {
      const map = L.map(canvasRef.current, { zoomControl: false, scrollWheelZoom: false, minZoom: 5, maxZoom: 18 }).setView([24.66, 54.96], 7);
      mapRef.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);
      if (L.maplibreGL) {
        const basemap = L.maplibreGL({ style: "/vendor/openfreemap-positron-en.json" }).addTo(map);
        basemap.getMaplibreMap()?.on("error", reportFailure);
      } else {
        reportFailure();
      }
      const mapped = locations.filter(
        (location): location is ContactLocation & { coordinates: [number, number] } => Boolean(location.coordinates),
      );
      mapped.forEach((location) => {
        const marker = L.marker(location.coordinates, {
          icon: L.divIcon({ className: "adure-map-marker contact-office-marker", html: "<span></span>", iconSize: [32, 40], iconAnchor: [16, 40] }),
          title: location.name,
        }).addTo(map);
        marker.bindPopup(`<strong>${location.name}</strong><span>${location.address}</span><a href="${location.mapUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`);
      });
      if (mapped.length) map.fitBounds(L.latLngBounds(mapped.map((location) => location.coordinates)), { padding: [70, 70], maxZoom: 8, animate: false });
      resizeRef.current = new ResizeObserver(() => map.invalidateSize());
      resizeRef.current.observe(canvasRef.current);
    } catch {
      reportFailure();
    }
  }, [bridgeReady, leafletReady, locations, maplibreReady, reportFailure]);

  useEffect(() => { initialise(); }, [initialise]);
  useEffect(() => () => { resizeRef.current?.disconnect(); mapRef.current?.remove(); mapRef.current = null; }, []);

  return (
    <section className="contact-map contact-location-map" aria-labelledby="contact-map-title" data-aos="fade-up">
      <div className="contact-map-head"><span>{content.eyebrow}</span><h2 id="contact-map-title">{content.heading}</h2><p>{content.description}</p></div>
      <div className="contact-map-canvas"><div ref={canvasRef} id="contact-map-canvas" aria-label={content.ariaLabel} />{failed ? <div className="map-load-message" role="status">{content.failureMessage}</div> : null}</div>
      <Script src="/vendor/leaflet.js" strategy="afterInteractive" onReady={() => setLeafletReady(true)} onError={() => setFailed(true)} />
      {leafletReady ? <Script src="/vendor/maplibre-gl-5.6.2.js" strategy="afterInteractive" onReady={() => setMaplibreReady(true)} onError={() => setFailed(true)} /> : null}
      {maplibreReady ? <Script src="/vendor/leaflet-maplibre-gl-0.1.3.js" strategy="afterInteractive" onReady={() => setBridgeReady(true)} onError={() => setFailed(true)} /> : null}
    </section>
  );
}
