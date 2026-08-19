"use client";

import React, { useState } from "react";
import { Info, X, ShieldAlert } from "lucide-react";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between z-50">
      <div className="flex items-center gap-2 max-w-6xl mx-auto text-center sm:text-left">
        <ShieldAlert className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white font-semibold">Legal Notice:</strong> Information displayed is for spatial reference and automated record consistency analysis. Legal title verification requires official revenue department certification.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 ml-2"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
