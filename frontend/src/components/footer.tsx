"use client";

import React from "react";
import Link from "next/link";
import { Layers, Shield, FileText, CheckCircle2, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-base">Bhoomi<span className="text-emerald-400">Verify</span></span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Mapping Land. Connecting Records. Improving Transparency. National Land Parcel Intelligence & Geodesic Record Verification System.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Platform Services</h4>
          <ul className="space-y-1.5">
            <li><Link href="/explorer" className="hover:text-emerald-400 transition-colors">GIS Map Explorer</Link></li>
            <li><Link href="/search" className="hover:text-emerald-400 transition-colors">Land Record Search</Link></li>
            <li><Link href="/measurements" className="hover:text-emerald-400 transition-colors">Geodesic Unit Converter</Link></li>
            <li><Link href="/verify" className="hover:text-emerald-400 transition-colors">Title Due Diligence</Link></li>
          </ul>
        </div>

        {/* Portals */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">Governance Portals</h4>
          <ul className="space-y-1.5">
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Reviewer Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-emerald-400 transition-colors">Dataset Console</Link></li>
            <li><Link href="/verify-report/BV-DEMO-2026-00001" className="hover:text-emerald-400 transition-colors">Cryptographic PDF Report Audit</Link></li>
          </ul>
        </div>

        {/* Security & Disclaimer */}
        <div className="space-y-2 text-[11px] text-slate-400">
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-400" /> Security & Integrity
          </h4>
          <p>
            All verification reports feature cryptographic SHA-256 digital hashes to ensure tamper-proof document auditing across land revenue datasets.
          </p>
          <div className="pt-2 border-t border-slate-800 text-slate-400">
            &copy; {new Date().getFullYear()} BhoomiVerify System. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
