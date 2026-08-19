"use client";

import React, { useState, useEffect } from "react";
import { GoogleMapContainer } from "@/components/map/google-map-container";
import { ParcelDetailDrawer } from "@/components/parcel/parcel-detail-drawer";
import { Search, Filter, RefreshCw, Layers, MapPin } from "lucide-react";

export default function ExplorerPage() {
  const [parcels, setParcels] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [landUseFilter, setLandUseFilter] = useState("");

  const fetchParcels = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/v1/parcels?limit=200`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (stateFilter) url += `&state=${encodeURIComponent(stateFilter)}`;
      if (landUseFilter) url += `&land_use=${encodeURIComponent(landUseFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setParcels(data);
      }
    } catch (e) {
      console.warn("Using active land parcels fallback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [stateFilter, landUseFilter]);

  const handleSelectParcel = async (parcel: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/parcels/${parcel.parcel_uid}`);
      if (res.ok) {
        const fullDetail = await res.json();
        setSelectedParcel(fullDetail);
      } else {
        setSelectedParcel(parcel);
      }
    } catch (e) {
      setSelectedParcel(parcel);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col">
      
      {/* Top Banner Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2 font-bold">
          <MapPin className="h-4 w-4 text-emerald-400" />
          <span>National Cadastral Map Explorer & Geographic Intelligence</span>
        </div>
        <div className="text-slate-400 hidden sm:block">
          Showing <strong className="text-emerald-400">{parcels.length}</strong> Registered Parcels
        </div>
      </div>

      {/* Main Map & Filter Area Container (Comfortable Height for full page visibility) */}
      <div className="flex flex-col md:flex-row w-full h-[650px] lg:h-[720px] relative">
        
        {/* Search Sidebar */}
        <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-4 text-xs overflow-y-auto shrink-0 z-20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-emerald-400" /> Spatial Search Filters
            </h3>
            <button onClick={fetchParcels} className="text-slate-400 hover:text-white p-1" title="Refresh parcels">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Search Keyword</label>
            <div className="flex gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <Search className="h-4 w-4 text-slate-500 my-auto" />
              <input
                type="text"
                placeholder="Survey No, Khasra, Village..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchParcels()}
                className="bg-transparent text-white focus:outline-none w-full"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">State Revenue Jurisdiction</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            >
              <option value="">All State Jurisdictions</option>
              <option value="Maharanya">Maharanya (Pune Region)</option>
              <option value="Uttar Pradesh Demo">Uttar Pradesh (Lucknow Region)</option>
              <option value="Karnapur">Karnapur (Bengaluru Region)</option>
              <option value="Rajasthan Demo">Rajasthan (Jaipur Region)</option>
            </select>
          </div>

          {/* Land Use Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Land Classification</label>
            <select
              value={landUseFilter}
              onChange={(e) => setLandUseFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            >
              <option value="">All Classifications</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Parcel Quick List */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span>Mapped Parcels</span>
              <span className="text-emerald-400 font-bold">{parcels.length}</span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {parcels.map((p) => (
                <button
                  key={p.parcel_uid}
                  onClick={() => handleSelectParcel(p)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    selectedParcel?.parcel_uid === p.parcel_uid
                      ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-emerald-400">{p.parcel_uid}</span>
                    <span className="text-[10px] text-slate-400">{p.village}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>Survey: {p.survey_number || "N/A"}</span>
                    <span>{p.area_sq_m?.toFixed(0)} m²</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Interactive Map View */}
        <main className="flex-1 relative h-full">
          <GoogleMapContainer
            parcels={parcels}
            selectedParcelUid={selectedParcel?.parcel_uid}
            onSelectParcel={handleSelectParcel}
          />
        </main>

        {/* Selected Parcel Drawer */}
        {selectedParcel && (
          <ParcelDetailDrawer
            parcel={selectedParcel}
            onClose={() => setSelectedParcel(null)}
          />
        )}

      </div>

    </div>
  );
}
