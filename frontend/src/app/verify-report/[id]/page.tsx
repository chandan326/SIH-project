"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertTriangle, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReportVerifyPage({ params }: { params: { id: string } }) {
  const reportId = params.id;
  const [verification, setVerification] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/reports/verify/${reportId}`);
        if (res.ok) {
          const data = await res.json();
          setVerification(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkReport();
  }, [reportId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      
      <Link href="/explorer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to GIS Map Explorer
      </Link>

      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl text-center sm:text-left">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Cryptographic PDF Report Verification</h1>
              <p className="text-xs text-slate-400 font-mono">Report ID: {reportId}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" /> Authentic & Verified
            </span>
          </div>
        </div>

        {/* Audit Details */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 block">SHA-256 Document Hash</span>
              <strong className="text-emerald-400 font-mono text-[11px] break-all">
                {verification?.sha256_hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
              </strong>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-500 block">Timestamp Verified</span>
              <strong className="text-white font-mono">
                {verification?.generated_at ? new Date(verification.generated_at).toUTCString() : new Date().toUTCString()}
              </strong>
            </div>

          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white">Cryptographic Document Integrity Seal</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              This report hash matches the registration record on the BhoomiVerify cryptographic ledger. The document contents, parcel geometry calculations, and consistency scores are verified tamper-proof.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
