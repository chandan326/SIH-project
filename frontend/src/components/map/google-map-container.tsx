"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Layers,
  MapPin,
  Compass,
  Eye,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Globe,
} from "lucide-react";

interface Parcel {
  parcel_uid: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  survey_number?: string;
  khasra_number?: string;
  centroid_lat: number;
  centroid_lng: number;
  geometry_geojson: any;
  area_sq_m: number;
  is_geometry_valid: boolean;
  consistency_score?: number;
}

interface MapContainerProps {
  parcels: Parcel[];
  selectedParcelUid?: string | null;
  onSelectParcel: (parcel: Parcel) => void;
  onFilterChange?: (filters: any) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

// Preset Indian Regional Jurisdictions
const REGIONAL_CENTERS = [
  { name: "Pune (MH)", lat: 18.5789, lng: 73.9785, zoom: 15 },
  { name: "Lucknow (UP)", lat: 26.9850, lng: 80.9520, zoom: 15 },
  { name: "Bengaluru (KA)", lat: 13.2500, lng: 77.7100, zoom: 15 },
  { name: "Jaipur (RJ)", lat: 26.7800, lng: 75.8200, zoom: 15 },
];

export function GoogleMapContainer({ parcels, selectedParcelUid, onSelectParcel }: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [tileMode, setTileMode] = useState<"google" | "satellite" | "esri_clarity" | "dark" | "osm">("google");
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [scenarioFilter, setScenarioFilter] = useState<string>("ALL");
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamically load Leaflet script & CSS if not present
  useEffect(() => {
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.L) {
          setIsLeafletReady(true);
          clearInterval(interval);
        }
      }, 100);
    }
  }, []);

  // Toggle Full View / Fullscreen specifically for the map section
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  // Filter parcels
  const filteredParcels = parcels.filter((p) => {
    if (scenarioFilter === "ALL") return true;
    if (scenarioFilter === "INVALID" && !p.is_geometry_valid) return true;
    if (scenarioFilter === "LARGE" && p.area_sq_m > 25000) return true;
    if (scenarioFilter === "SMALL" && p.area_sq_m <= 25000) return true;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [18.5789, 73.9785],
        zoom: 15,
        zoomControl: false,
      });

      const layerGroup = window.L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;
      updateTileLayer(tileMode);
    }
  }, [isLeafletReady]);

  // Helper to switch map tiles
  const updateTileLayer = (mode: string) => {
    if (!mapInstanceRef.current || !window.L) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = "";
    let attrib = "";

    switch (mode) {
      case "google":
        url = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
        attrib = "&copy; Google Maps Hybrid Satellite & Imagery";
        break;
      case "satellite":
        url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attrib = "Tiles &copy; Esri &mdash; World Imagery Satellite";
        break;
      case "esri_clarity":
        url = "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        attrib = "Tiles &copy; Esri Clarity High-Res Satellite";
        break;
      case "dark":
        url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        attrib = "&copy; OpenStreetMap &copy; CARTO";
        break;
      case "osm":
      default:
        url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        attrib = "&copy; OpenStreetMap contributors";
        break;
    }

    const newLayer = window.L.tileLayer(url, {
      maxZoom: 20,
      attribution: attrib,
    });
    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  };

  useEffect(() => {
    updateTileLayer(tileMode);
  }, [tileMode]);

  // Fly to City
  const flyToCity = (city: typeof REGIONAL_CENTERS[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], city.zoom, { duration: 1.5 });
    }
  };

  // Render Parcel Polygons on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !window.L) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (!showBoundaries || filteredParcels.length === 0) return;

    const bounds = window.L.latLngBounds([]);

    filteredParcels.forEach((parcel) => {
      const geojson = parcel.geometry_geojson;
      if (!geojson) return;

      const isSelected = parcel.parcel_uid === selectedParcelUid;
      const isValid = parcel.is_geometry_valid;

      const borderColor = isSelected
        ? "#3B82F6"
        : !isValid
        ? "#EF4444"
        : "#10B981";

      const fillColor = isSelected
        ? "#3B82F6"
        : !isValid
        ? "#EF4444"
        : "#059669";

      const polygonLayer = window.L.geoJSON(geojson, {
        style: {
          color: borderColor,
          weight: isSelected ? 4 : 2.5,
          opacity: 0.95,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.55 : 0.35,
          dashArray: isValid ? "" : "6, 6",
        },
      });

      const areaSqM = parcel.area_sq_m || 0;
      const bigha = (areaSqM / 2500).toFixed(2);
      const acres = (areaSqM / 4046.86).toFixed(2);
      const googleUrl = `https://www.google.com/maps/search/?api=1&query=${parcel.centroid_lat},${parcel.centroid_lng}`;

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; color: #1e293b; padding: 4px; min-width: 190px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #059669; font-size: 13px;">${parcel.parcel_uid}</strong>
            <span style="font-size: 10px; background: #e2e8f0; padding: 2px 6px; borderRadius: 4px; font-weight: 600;">
              ${parcel.village}
            </span>
          </div>
          <div style="font-size: 11px; line-height: 1.5; color: #334155; margin-bottom: 8px;">
            <div><b>Survey No:</b> ${parcel.survey_number || "N/A"}</div>
            <div><b>Khasra No:</b> ${parcel.khasra_number || "N/A"}</div>
            <div><b>Calculated Area:</b> ${areaSqM.toFixed(1)} m²</div>
            <div><b>Approx Units:</b> ${bigha} Bigha / ${acres} Acre</div>
            <div><b>Geometry Status:</b> <span style="color: ${isValid ? "#059669" : "#dc2626"}; font-weight: 600;">${isValid ? "Valid Shape" : "Discrepancy Detected"}</span></div>
          </div>
          <button
            onclick="window.open('${googleUrl}', '_blank')"
            style="display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%; text-align: center; background: #2563eb; color: #ffffff; border: none; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;"
          >
            🗺️ Open Pin in Google Maps ↗
          </button>
        </div>
      `;

      polygonLayer.bindPopup(popupHtml);

      polygonLayer.bindTooltip(
        `<span style="font-size: 11px; font-weight: 600; color: #10B981;">${parcel.parcel_uid} (${parcel.survey_number || parcel.khasra_number})</span>`,
        { permanent: false, direction: "top", offset: [0, -10] }
      );

      polygonLayer.on("click", () => {
        onSelectParcel(parcel);
      });

      layerGroup.addLayer(polygonLayer);

      if (parcel.centroid_lat && parcel.centroid_lng) {
        bounds.extend([parcel.centroid_lat, parcel.centroid_lng]);
      }
    });

    if (selectedParcelUid) {
      const selected = filteredParcels.find((p) => p.parcel_uid === selectedParcelUid);
      if (selected && selected.centroid_lat && selected.centroid_lng) {
        mapInstanceRef.current.flyTo([selected.centroid_lat, selected.centroid_lng], 16, { duration: 1.2 });
      }
    }
  }, [filteredParcels, selectedParcelUid, showBoundaries]);

  // Open Google Maps for current center
  const openCurrentCenterOnGoogleMaps = () => {
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter();
      window.open(`https://www.google.com/maps/@${center.lat},${center.lng},16z`, "_blank");
    }
  };

  return (
    <div className={`transition-all duration-300 ${
      isFullscreen
        ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none bg-slate-950 flex flex-col"
        : "relative w-full h-full min-h-[550px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col z-10"
    }`}>
      
      {/* Top Floating Control Panel - Priority Z-20 (Under Z-2000 Navbar dropdowns) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-2xl text-xs text-white">
        
        {/* Left Status & Title */}
        <div className="flex items-center gap-2 font-semibold">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-bold hidden sm:inline">Live GIS Cadastral Map</span>
        </div>

        {/* Quick Fly-To Regional Centers */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-400 hidden md:inline">Region:</span>
          {REGIONAL_CENTERS.map((c) => (
            <button
              key={c.name}
              onClick={() => flyToCity(c)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded text-[11px] font-medium text-slate-200 hover:text-white transition-all border border-slate-700 flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Map Tile & Control Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Map Tile Mode Selectors */}
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setTileMode("google")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                tileMode === "google" ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
              }`}
            >
              🌐 Google Map
            </button>
            <button
              onClick={() => setTileMode("satellite")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                tileMode === "satellite" ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              🛰️ Esri Satellite
            </button>
            <button
              onClick={() => setTileMode("dark")}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                tileMode === "dark" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              🌃 Dark GIS
            </button>
          </div>

          {/* Direct Google Maps External Tab Launcher */}
          <button
            onClick={openCurrentCenterOnGoogleMaps}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/80 text-amber-300 flex items-center gap-1 transition-all shadow-md"
            title="Open direct Google Maps in new tab"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span>Open Google Maps ↗</span>
          </button>

          {/* Boundaries Toggle */}
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
              showBoundaries
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Boundaries ({filteredParcels.length})</span>
          </button>

          {/* Full View / Fullscreen Map Button */}
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white flex items-center gap-1 transition-all shadow-md"
            title={isFullscreen ? "Exit Full View" : "Full View Map"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-rose-400" /> : <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isFullscreen ? "Exit Full View" : "Full View"}</span>
          </button>

        </div>

      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-[10]" />

      {/* Custom Navigation Zoom Controls */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-1">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-t-lg border border-slate-700 shadow-xl transition-all"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="bg-slate-900/90 hover:bg-slate-800 text-white p-2 rounded-b-lg border border-slate-700 border-t-0 shadow-xl transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* High-Contrast Legend */}
      <div className="absolute bottom-6 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-800 shadow-2xl text-xs text-slate-200 space-y-1.5">
        <div className="font-bold text-white mb-1.5 flex items-center justify-between gap-3">
          <span>Cadastral Layer Legend</span>
          <span className="text-[10px] text-slate-400 font-normal">WGS84 Geodesic</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-emerald-500/40 border-2 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-medium">Verified Parcel</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-red-500/40 border-2 border-red-500 border-dashed shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="font-medium">Discrepancy / Invalid Geometry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-blue-500/50 border-2 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="font-medium">Active Selection</span>
        </div>
      </div>

    </div>
  );
}
