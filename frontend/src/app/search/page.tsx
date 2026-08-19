"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, FileText, ChevronRight, ShieldCheck, MapPin, Download } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [landUseFilter, setLandUseFilter] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/v1/parcels?limit=50`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (stateFilter) url += `&state=${encodeURIComponent(stateFilter)}`;
      if (landUseFilter) url += `&land_use=${encodeURIComponent(landUseFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setParcels(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
          <Search className="h-7 w-7 text-emerald-400" />
          <span>National Land Record Search Portal</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Search land parcel boundaries by Survey Number, Khasra Number, Plot Number, Khata Number, Village name, or Parcel UID across state revenue datasets.
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="md:col-span-2 space-y-1">
            <label className="text-slate-400 text-xs font-semibold">Search Identifier Keyword</label>
            <div className="flex gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <Search className="h-4 w-4 text-slate-500 my-auto" />
              <input
                type="text"
                placeholder="Enter Survey No, Khasra No, Village or Parcel UID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-transparent text-white text-xs focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-xs font-semibold">State Jurisdiction</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">All States</option>
              <option value="Maharanya">Maharanya (Pune)</option>
              <option value="Uttar Pradesh Demo">Uttar Pradesh (Lucknow)</option>
              <option value="Karnapur">Karnapur (Bengaluru)</option>
              <option value="Rajasthan Demo">Rajasthan (Jaipur)</option>
            </select>
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? "Searching Records..." : "Search Land Records"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">
            Search Results <span className="text-emerald-400 text-xs font-semibold ml-2">({parcels.length} Records Found)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Parcel UID</th>
                <th className="p-3.5">State / District</th>
                <th className="p-3.5">Tehsil / Village</th>
                <th className="p-3.5">Survey / Khasra No</th>
                <th className="p-3.5">Area (m²)</th>
                <th className="p-3.5">Shape Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {parcels.map((p) => (
                <tr key={p.parcel_uid} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3.5 font-bold text-emerald-400">{p.parcel_uid}</td>
                  <td className="p-3.5">{p.state} <br /><span className="text-slate-500 text-[10px]">{p.district}</span></td>
                  <td className="p-3.5">{p.tehsil} <br /><span className="text-slate-500 text-[10px]">{p.village}</span></td>
                  <td className="p-3.5 font-semibold text-white">
                    Survey: {p.survey_number || "N/A"} <br />
                    <span className="text-slate-400 text-[10px]">Khasra: {p.khasra_number || "N/A"}</span>
                  </td>
                  <td className="p-3.5 font-mono">{p.area_sq_m?.toFixed(1)} m²</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.is_geometry_valid
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}>
                      {p.is_geometry_valid ? "VALID SHAPE" : "DISCREPANCY"}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/explorer?uid=${p.parcel_uid}`}
                      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-all text-[11px]"
                    >
                      <span>Map View</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
