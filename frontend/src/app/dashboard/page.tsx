"use client";

import React from "react";
import { LayoutDashboard, BarChart3, AlertTriangle, ShieldCheck, Layers, FileCheck, Users, Activity } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Mapped Parcels", value: "2,000", change: "+12% this month", color: "emerald" },
    { label: "Verified Consistency", value: "84.2%", change: "+3.5% score avg", color: "emerald" },
    { label: "Pending Mutations", value: "142", change: "Requires Tahsildar action", color: "amber" },
    { label: "Active Court Disputes", value: "28", change: "Civil court stay orders", color: "rose" },
  ];

  const recentReviews = [
    { id: "REV-2026-001", parcel: "BV-MH-PUN-00001", status: "VERIFIED", reviewer: "S. Deshmukh (Tahsildar)", score: 95 },
    { id: "REV-2026-002", parcel: "BV-UP-LKO-00053", status: "AREA_MISMATCH", reviewer: "R. Sharma (Kanungo)", score: 65 },
    { id: "REV-2026-003", parcel: "BV-KA-BLR-00104", status: "INVALID_GEOMETRY", reviewer: "A. Rao (Surveyor)", score: 40 },
    { id: "REV-2026-004", parcel: "BV-RJ-JPR-00155", status: "MUTATION_PENDING", reviewer: "K. Singh (Patwari)", score: 75 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-emerald-400" />
            <span>Revenue Officer & Reviewer Portal</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time cadastral compliance metrics, risk detection summaries, and audit workflows across revenue jurisdictions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Analytics Engine Active
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => (
          <div key={st.label} className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">{st.label}</span>
            <div className="text-3xl font-extrabold text-white">{st.value}</div>
            <span className={`text-[11px] font-semibold block ${
              st.color === "emerald" ? "text-emerald-400" : st.color === "amber" ? "text-amber-400" : "text-rose-400"
            }`}>
              {st.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Reviews Table */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recent Verification Audit Stream</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Review ID</th>
                <th className="p-3.5">Parcel UID</th>
                <th className="p-3.5">Assigned Officer</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Evaluation Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentReviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">{r.id}</td>
                  <td className="p-3.5 font-bold text-emerald-400">{r.parcel}</td>
                  <td className="p-3.5 font-medium text-white">{r.reviewer}</td>
                  <td className="p-3.5 font-extrabold">{r.score} / 100</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      r.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {r.status}
                    </span>
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
