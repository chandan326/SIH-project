"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  MapPin,
  Maximize2,
  Scale,
  Layers,
  Globe,
} from "lucide-react";

interface ParcelDetailDrawerProps {
  parcel: any;
  onClose: () => void;
}

export function ParcelDetailDrawer({ parcel, onClose }: ParcelDetailDrawerProps) {
  const [downloading, setDownloading] = useState(false);

  const score = parcel.consistency_score ?? 85;
  const status = parcel.verification_status || "VERIFIED";

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (s >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reports/pdf/${parcel.parcel_uid}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Verification_Report_${parcel.parcel_uid}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setDownloading(false);
    }
  };

  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${parcel.centroid_lat},${parcel.centroid_lng}`;

  return (
    <div className="fixed top-[80px] bottom-0 right-0 z-40 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-200 overflow-hidden animate-in slide-in-from-right">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">{parcel.parcel_uid}</h3>
            <p className="text-[11px] text-slate-400">{parcel.village}, {parcel.tehsil}, {parcel.district}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Direct Google Maps Action Button */}
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg transition-all border border-amber-400"
        >
          <Globe className="h-4 w-4 fill-slate-950" />
          <span>Open Pin Coordinates on Google Maps ↗</span>
        </a>

        {/* Verification Score Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Title Consistency Score</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getScoreColor(score)}`}>
              {score} / 100
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Evaluation Status: <strong className="text-white">{status}</strong></span>
          </div>
        </div>

        {/* Spatial Measurement Details */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-emerald-400" /> Geodesic Spatial Measurements
          </h4>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Calculated GIS Area</span>
              <strong className="text-white text-xs">{parcel.area_sq_m?.toFixed(2)} m²</strong>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Perimeter</span>
              <strong className="text-white text-xs">{parcel.perimeter_m?.toFixed(2)} m</strong>
            </div>
          </div>

          {/* Regional Land Unit Breakdown */}
          {parcel.area_conversions?.regional_units && (
            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
              <span className="text-slate-400 font-semibold block">Regional Units ({parcel.state}):</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(parcel.area_conversions.regional_units).map(([unit, val]: any) => (
                  <span key={unit} className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 border border-slate-800">
                    <strong className="text-emerald-400">{val}</strong> {unit.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Attributes */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <h4 className="font-bold text-white text-xs">Revenue Identifiers</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-300">
            <div><span className="text-slate-500">State:</span> {parcel.state}</div>
            <div><span className="text-slate-500">District:</span> {parcel.district}</div>
            <div><span className="text-slate-500">Tehsil:</span> {parcel.tehsil}</div>
            <div><span className="text-slate-500">Village:</span> {parcel.village}</div>
            <div><span className="text-slate-500">Survey No:</span> <strong className="text-white">{parcel.survey_number || "N/A"}</strong></div>
            <div><span className="text-slate-500">Khasra No:</span> <strong className="text-white">{parcel.khasra_number || "N/A"}</strong></div>
            <div><span className="text-slate-500">Khata No:</span> {parcel.khata_number || "N/A"}</div>
            <div><span className="text-slate-500">Land Use:</span> {parcel.land_use}</div>
          </div>
        </div>

        {/* Findings & Risk Discrepancies */}
        {parcel.findings && parcel.findings.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Discrepancy Findings ({parcel.findings.length})
            </h4>
            <div className="space-y-2">
              {parcel.findings.map((f: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-400">{f.code}</span>
                    <span className="text-rose-400 font-mono">{f.score_impact} pts</span>
                  </div>
                  <p className="text-slate-300">{f.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Download PDF Action Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span>{downloading ? "Generating PDF Audit Report..." : "Download Cryptographic PDF Report"}</span>
        </button>
      </div>

    </div>
  );
}
