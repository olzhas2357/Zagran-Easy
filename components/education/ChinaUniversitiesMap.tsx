"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type L from "leaflet";

export interface ChinaMapUniversity {
  slug: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
}

function getGoogleMapsUrl(university: ChinaMapUniversity) {
  const mapsUrl = university.googleMapsUrl.trim();
  if (/^https:\/\/(?:maps\.app\.goo\.gl|maps\.google\.[a-z.]+|(?:www\.)?google\.[a-z.]+)\//i.test(mapsUrl)) {
    return mapsUrl;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${university.name} ${university.city} China`,
  )}`;
}

function createPopup(universities: ChinaMapUniversity[]) {
  const popup = document.createElement("div");
  popup.className = "ze-china-map-popup";

  const heading = document.createElement("p");
  heading.className = "ze-china-map-popup__heading";
  heading.textContent = `${universities.length} ${universities.length === 1 ? "университет" : "университета"}`;
  popup.append(heading);

  universities.forEach((university) => {
    const item = document.createElement("div");
    item.className = "ze-china-map-popup__item";

    const name = document.createElement("a");
    name.className = "ze-china-map-popup__name";
    name.href = `/education/${encodeURIComponent(university.slug)}`;
    name.textContent = university.name;
    item.append(name);

    const city = document.createElement("span");
    city.className = "ze-china-map-popup__city";
    city.textContent = university.city;
    item.append(city);

    const mapLink = document.createElement("a");
    mapLink.className = "ze-china-map-popup__map-link";
    mapLink.href = getGoogleMapsUrl(university);
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.textContent = "Открыть в Google Maps";
    item.append(mapLink);

    popup.append(item);
  });

  return popup;
}

export function ChinaUniversitiesMap({ universities }: { universities: ChinaMapUniversity[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof L | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    void import("leaflet")
      .then(({ default: L }) => {
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        map = L.map(containerRef.current, {
          center: [35.8, 103.5],
          zoom: 4,
          minZoom: 3,
          maxZoom: 18,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);

        markersRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setMapReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Не удалось загрузить карту университетов Китая.", error);
        setMapError(true);
      });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markersRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!mapReady || !L || !map || !markers) return;

    markers.clearLayers();
    const locations = new Map<string, { position: [number, number]; universities: ChinaMapUniversity[] }>();

    universities.forEach((university) => {
      const key = `${university.latitude.toFixed(4)},${university.longitude.toFixed(4)}`;
      const location = locations.get(key) ?? {
        position: [university.latitude, university.longitude],
        universities: [],
      };
      location.universities.push(university);
      locations.set(key, location);
    });

    locations.forEach(({ position, universities: universitiesAtLocation }) => {
      const count = universitiesAtLocation.length;
      const marker = L.marker(position, {
        icon: L.divIcon({
          className: "ze-china-map-marker",
          html: `<span class="ze-china-map-marker__pin"><span class="ze-china-map-marker__count">${count}</span></span>`,
          iconSize: [38, 42],
          iconAnchor: [19, 38],
          popupAnchor: [0, -34],
        }),
        title: universitiesAtLocation.map((university) => university.name).join(", "),
        alt: `${count} ${count === 1 ? "университет" : "университета"}`,
      });
      marker.bindPopup(createPopup(universitiesAtLocation), { maxWidth: 280 });
      marker.addTo(markers);
    });

    if (locations.size > 0) {
      const bounds = L.latLngBounds([...locations.values()].map(({ position }) => position));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 5 });
    }
  }, [mapReady, universities]);

  return (
    <div className="relative">
      {!mapReady && !mapError && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#EAF2FF] text-sm font-medium text-[#526681]">
          Загружаем карту…
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#EAF2FF] px-6 text-center text-sm font-medium text-[#526681]">
          Не удалось загрузить карту. Попробуйте обновить страницу.
        </div>
      )}
      <div
        ref={containerRef}
        className="h-[360px] w-full bg-[#EAF2FF] sm:h-[480px]"
        role="region"
        aria-label={`Интерактивная карта университетов Китая, отмечено: ${universities.length}`}
      />
    </div>
  );
}
