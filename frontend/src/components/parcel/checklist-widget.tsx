"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ChecklistProps {
  parcel: any;
}

export function ChecklistWidget({ parcel }: ChecklistProps) {
  if (!parcel) return null;

  const summary = parcel.record_summary || {};
  const spatial = parcel.spatial_analysis || {};

  const items = [
    {
      title: "Survey & Khasra Identifier Available",
      status: parcel.survey_number && parcel.khasra_number ? "PASS" : "FAIL",
      details: `Survey: ${parcel.survey_number || "N/A"}, Khasra: ${parcel.khasra_number || "N/A"}`,
    },
    {
      title: "Record of Rights (RoR) Found",
      status: summary.ror_found ? "PASS" : "FAIL",
      details: summary.ror_found ? "RoR Jamabandi record exists in demo registry." : "Missing RoR record in demo database.",
    },
    {
      title: "Deed Registration Record Found",
      status: summary.registration_found ? "PASS" : "FAIL",
      details: summary.registration_found ? "Registration deed record confirmed in demo data." : "No deed registration found.",
    },
    {
      title: "Recorded Area vs Spatial Area Consistency",
      status: (spatial.area_difference_percent || 0) <= 5.0 ? "PASS" : "WARNING",
      details: `Discrepancy: ${spatial.area_difference_percent?.toFixed(1) || 0}%`,
    },
    {
      title: "Mutation Status Completed",
      status: summary.mutation_status === "COMPLETED" ? "PASS" : "WARNING",
      details: `Current Status: ${summary.mutation_status}`,
    },
    {
      title: "No Active Encumbrance / Mortgage",
      status: summary.encumbrance_status === "NONE" ? "PASS" : "FAIL",
      details: summary.encumbrance_status === "NONE" ? "No bank encumbrance recorded." : "Active mortgage / lien found.",
    },
    {
      title: "No Court Case / Stay Order Litigation",
      status: summary.dispute_status === "NONE" ? "PASS" : "FAIL",
      details: summary.dispute_status === "NONE" ? "No active litigation found." : "Active court stay order found.",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-white text-base">Buyer Due Diligence Checklist</h3>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
          INFORMATIONAL DEMO
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-200">{item.title}</p>
              <p className="text-slate-400">{item.details}</p>
            </div>

            {item.status === "PASS" && (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> PASS
              </span>
            )}
            {item.status === "WARNING" && (
              <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold shrink-0">
                <AlertCircle className="h-3.5 w-3.5" /> WARN
              </span>
            )}
            {item.status === "FAIL" && (
              <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold shrink-0">
                <XCircle className="h-3.5 w-3.5" /> FAIL
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800 text-center">
        &quot;This checklist is informational for prototype evaluation and does not constitute legal due diligence.&quot;
      </p>
    </div>
  );
}
