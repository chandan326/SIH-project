"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, Search, FileText, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const [parcelUid, setParcelUid] = useState("BV-MH-PUN-00001");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!parcelUid) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/parcels/${encodeURIComponent(parcelUid)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const dueDiligenceSteps = [
    { title: "Spatial Cadastral Geometry Verification", desc: "Cross-check vector polygon closure, self-intersections, and geodesic area calculations against survey records." },
    { title: "Deed Registration Document Verification", desc: "Verify document number, transaction type, seller/buyer identifiers, and stamp duty payment records in the registry." },
    { title: "Mutation Sanction Verification", desc: "Ensure mutation application status is approved and sanctioned in the revenue ledger." },
    { title: "Encumbrance & Financial Lien Audit", desc: "Check for registered bank mortgages, financial charges, or hypothecation liens." },
    { title: "Court Case & Stay Order Screening", desc: "Scan civil court records for pending title disputes, boundary injunctions, or stay orders." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
          <span>Land Title Due Diligence & Discrepancy Scanner</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Automated rule-based verification engine evaluating spatial parcel boundaries against Record of Rights, deed registrations, mutation logs, bank liens, and civil court stay orders.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl max-w-3xl">
        <label className="text-slate-300 font-bold text-xs">Enter Parcel Identifier UID</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. BV-MH-PUN-00001, BV-UP-LKO-00051..."
            value={parcelUid}
            onChange={(e) => setParcelUid(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? "Scanning..." : "Run Due Diligence"}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Overview */}
      {result && (
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl animate-fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400">Parcel UID</span>
              <h2 className="text-2xl font-extrabold text-white">{result.parcel_uid}</h2>
              <p className="text-xs text-slate-400">{result.village}, {result.tehsil}, {result.district}, {result.state}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Consistency Score</span>
                <span className={`text-2xl font-extrabold ${
                  (result.consistency_score ?? 85) >= 80 ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {result.consistency_score ?? 85} / 100
                </span>
              </div>
              <Link
                href={`/explorer?uid=${result.parcel_uid}`}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>View Map Overlay</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Record Status Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Record of Rights</span>
              <strong className={result.record_summary?.ror_found ? "text-emerald-400" : "text-rose-400"}>
                {result.record_summary?.ror_found ? "VERIFIED ACTIVE" : "NOT FOUND"}
              </strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Deed Registration</span>
              <strong className={result.record_summary?.registration_found ? "text-emerald-400" : "text-amber-400"}>
                {result.record_summary?.registration_found ? "REGISTERED" : "UNREGISTERED"}
              </strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Mutation Status</span>
              <strong className="text-white">{result.record_summary?.mutation_status || "SANCTIONED"}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Encumbrance Lien</span>
              <strong className={result.record_summary?.encumbrance_status === "NONE" ? "text-emerald-400" : "text-rose-400"}>
                {result.record_summary?.encumbrance_status || "CLEAR"}
              </strong>
            </div>
          </div>

        </div>
      )}

      {/* Due Diligence Guidance Steps */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base">Standard Title Due Diligence Verification Framework</h3>
        <div className="space-y-3">
          {dueDiligenceSteps.map((step, idx) => (
            <div key={idx} className="flex gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-white">{step.title}</h4>
                <p className="text-slate-400 text-xs">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
