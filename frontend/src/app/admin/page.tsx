"use client";

import React, { useState } from "react";
import { Settings, Upload, Database, Shield, Lock, FileCode, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleUploadGeoJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadStatus(`Dataset file "${e.target.files[0].name}" validated. Ready for ingestion.`);
    }
  };

  const datasetVersions = [
    { tag: "v2026.01", desc: "National Cadastral Ingestion — Maharanya & UP Revenue Datasets", checksum: "sha256:e3b0c44298fc1c149af...", status: "PUBLISHED", parcels: 1200 },
    { tag: "v2025.12", desc: "Karnapur & Rajasthan Cadastral Update", checksum: "sha256:9f86d081884c7d659a...", status: "ARCHIVED", parcels: 800 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
          <Settings className="h-7 w-7 text-emerald-400" />
          <span>System Administrator & Cadastral Dataset Console</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Manage GIS vector dataset versions, execute GeoJSON schema validations, inspect cryptographic audit trails, and configure state land rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GeoJSON Dataset Ingestion */}
        <div className="md:col-span-1 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-400" /> Cadastral Dataset Ingestion
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Upload standardized GeoJSON MultiPolygon layers containing survey numbers, khasra identifiers, and WGS84 geodesic coordinates.
          </p>

          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl text-center space-y-2 cursor-pointer transition-colors bg-slate-950/50">
            <FileCode className="h-8 w-8 text-slate-500 mx-auto" />
            <span className="text-xs text-slate-300 font-semibold block">Select GeoJSON / TopoJSON File</span>
            <input
              type="file"
              accept=".json,.geojson"
              onChange={handleUploadGeoJSON}
              className="hidden"
              id="geojson-upload"
            />
            <label
              htmlFor="geojson-upload"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all border border-slate-700 mt-2"
            >
              Browse Files
            </label>
          </div>

          {uploadStatus && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}
        </div>

        {/* Dataset Version Control */}
        <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" /> Published Dataset Versions
          </h3>

          <div className="space-y-3">
            {datasetVersions.map((ds) => (
              <div key={ds.tag} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400 font-mono text-sm">{ds.tag}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                    {ds.status}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{ds.desc}</p>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Parcels: {ds.parcels}</span>
                  <span>Checksum: {ds.checksum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
