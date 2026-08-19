"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Play,
  ArrowRight,
  Map,
  Calculator,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Users,
  Layers,
  CheckCircle2,
  Building2,
  Info,
  X,
  Lock,
  Target,
  Ruler,
  Settings,
  UserCheck,
  Check,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useLanguage } from "@/context/language-context";

export default function HomePage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedParcelUid, setSelectedParcelUid] = useState("BV-000421");

  return (
    <div className={`flex flex-col min-h-screen w-full max-w-full overflow-x-hidden transition-colors duration-300 font-sans antialiased ${
      theme === "creamy"
        ? "bg-[#FAF7F2] text-slate-900"
        : theme === "dim"
        ? "bg-[#E3E8E5] text-slate-900"
        : "bg-[#070E26] text-slate-100"
    }`}>
      
      {/* SECTION 1: HERO SECTION WITH LANDSCAPE BACKGROUND */}
      <section className="relative pt-8 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Background Aerial Landscape Image */}
        <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none opacity-50 z-0">
          <img
            src="/hero_landscape_bg.jpg"
            alt="Farmland Aerial Landscape"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          <div className={`absolute inset-0 ${
            theme === "creamy"
              ? "bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent"
              : theme === "dim"
              ? "bg-gradient-to-r from-[#E3E8E5] via-[#E3E8E5]/85 to-transparent"
              : "bg-gradient-to-r from-[#070E26] via-[#070E26]/85 to-transparent"
          }`} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Hero Left Text Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0A6] text-slate-900 text-[11px] font-bold shadow-md">
                <Info className="h-3.5 w-3.5 text-slate-800" /> Prototype / Demonstration System
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium backdrop-blur-md ${
                theme === "dark" ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/80 border-slate-300 text-slate-800"
              }`}>
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Synthetic Data Only
              </span>
            </div>

            {/* Main Translated Headline */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              {t("heroTitlePre")} <br />
              <span className="text-[#F5B82E]">{t("heroTitleSpan")}</span>
            </h1>

            {/* Translated Subtitle */}
            <p className={`text-xs sm:text-sm leading-relaxed max-w-lg font-normal ${
              theme === "dark" ? "text-slate-200" : "text-slate-700"
            }`}>
              {t("heroSubtitle")}
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/explorer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F5B82E] hover:bg-[#e0a825] text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 border border-amber-500"
              >
                <MapPin className="h-4 w-4 fill-slate-950" />
                <span>{t("exploreMap")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/search"
                className={`flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white/80 border-slate-300 text-slate-900 hover:bg-white"
                }`}
              >
                <Search className="h-4 w-4 opacity-70" />
                <span>{t("searchRecords")}</span>
              </Link>

              <Link
                href="/demo-video"
                className={`flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${
                  theme === "dark"
                    ? "bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white/80 border-slate-300 text-slate-900 hover:bg-white"
                }`}
              >
                <div className="h-4 w-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                  <Play className="h-2.5 w-2.5 fill-slate-950 ml-0.5" />
                </div>
                <span>{t("watchVideo")}</span>
              </Link>
            </div>

          </div>

          {/* Hero Right Laptop Display */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg bg-[#0F172A] rounded-2xl p-2.5 border-4 border-slate-700 shadow-2xl shadow-emerald-500/10">
              
              <div className="bg-[#090D16] rounded-t-xl px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>

                <div className="flex items-center justify-between bg-slate-900 px-3 py-0.5 rounded-md text-[10px] text-slate-300 w-56 border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3 w-3 text-slate-500" />
                    <span>Search location, survey number...</span>
                  </div>
                  <X className="h-3 w-3 text-slate-500" />
                </div>

                <Layers className="h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="relative h-[290px] w-full rounded-b-xl overflow-hidden bg-slate-950 flex">
                <div className="w-8 bg-slate-900/90 border-r border-slate-800 py-3 flex flex-col items-center gap-3 text-slate-400 z-10">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                  <MapPin className="h-3.5 w-3.5 hover:text-white" />
                  <Target className="h-3.5 w-3.5 hover:text-white" />
                  <Ruler className="h-3.5 w-3.5 hover:text-white" />
                  <Settings className="h-3.5 w-3.5 hover:text-white" />
                </div>

                <img
                  src="/hero_landscape_bg.jpg"
                  alt="Satellite Aerial View"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-125"
                />

                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 450 290">
                  <polygon
                    points="200,70 320,100 290,210 170,170"
                    fill="rgba(245, 184, 46, 0.35)"
                    stroke="#F5B82E"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                  <g transform="translate(245, 130)">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill="#F5B82E"
                    />
                  </g>
                </svg>

                <div className="absolute top-3 right-3 w-52 bg-white rounded-xl p-3 shadow-2xl text-slate-900 text-xs space-y-2 border border-slate-200 z-20">
                  <div className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-1 flex justify-between items-center">
                    <span>Parcel Details</span>
                    <span className="text-[10px] text-slate-500 font-mono">BV-000421</span>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Parcel UID</span>
                      <strong className="text-slate-900">BV-000421</strong>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Location</span>
                      <span className="text-right text-slate-800 font-semibold leading-tight">
                        Green Valley,<br />Tehsil: Navapur,<br />District: Demo Nagar
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Area</span>
                      <strong className="text-slate-900">1,250 sq.m</strong>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] text-slate-400 font-semibold uppercase block">Verification Status</span>
                    <div className="flex items-center gap-1 bg-[#E6F7ED] text-[#0D8A43] font-bold px-2 py-0.5 rounded text-[10px] border border-[#B8ECD0]">
                      <CheckCircle2 className="h-3 w-3 text-[#0D8A43]" />
                      <span>DEMO RECORD FOUND</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-700">Consistency Score</span>
                    <div className="relative h-8 w-8 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center font-extrabold text-[10px] text-emerald-800 shadow-sm">
                      92<span className="text-[7px] font-normal">/100</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </section>


      {/* SECTION 2: FLOATING 6 FEATURE CARDS BAR */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-4 mb-10">
        <div className={`rounded-2xl p-4 shadow-xl border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-slate-900 ${
          theme === "creamy" ? "bg-[#F5EFEB] border-amber-200" : theme === "dim" ? "bg-[#D8E0DC] border-slate-300" : "bg-white border-slate-100"
        }`}>
          
          <Link href="/explorer" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Map className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">{t("interactiveMap")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">Explore land parcels with Google Maps</p>
            </div>
          </Link>

          <Link href="/measurements" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">{t("landMeasurement")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">Accurate area & boundary calculation</p>
            </div>
          </Link>

          <Link href="/verify" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-600">{t("recordVerification")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">Check RoR, registration & mutation records</p>
            </div>
          </Link>

          <Link href="/verify-report/BV-DEMO-2026-00001" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">{t("detailedReports")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">Download & verify demo reports</p>
            </div>
          </Link>

          <Link href="/verify" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-teal-600">{t("riskAnalysis")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">Identify inconsistencies and conflicts</p>
            </div>
          </Link>

          <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-slate-100/50 transition-all group flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">{t("roleBasedAccess")}</h4>
              <p className="text-[10px] text-slate-600 leading-tight">For public, buyers and government</p>
            </div>
          </Link>

        </div>
      </section>


      {/* SECTION 3: DEEP NAVY BLUE STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-[#05102A] border border-blue-900/50 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 flex-1 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold">5,000+</div>
                <div className="text-[11px] text-slate-400 font-medium">Demo Land Parcels</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold">12+</div>
                <div className="text-[11px] text-slate-400 font-medium">Demo Locations</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold">3,500+</div>
                <div className="text-[11px] text-slate-400 font-medium">Verification Reports</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold">1,200+</div>
                <div className="text-[11px] text-slate-400 font-medium">Active Users</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold">6</div>
                <div className="text-[11px] text-slate-400 font-medium">Integrated Datasets</div>
              </div>
            </div>
          </div>

          <Link
            href="/explorer"
            className="px-5 py-2.5 rounded-full bg-[#F5B82E] hover:bg-[#e0a825] text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105 shrink-0 flex items-center gap-2 border border-amber-500"
          >
            <span>Explore System Features</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>


      {/* SECTION 4: HOW IT WORKS SECTION */}
      <section className={`py-16 px-4 sm:px-6 transition-colors ${
        theme === "creamy" ? "bg-[#F4ECE3] text-slate-900" : theme === "dim" ? "bg-[#D0D8D4] text-slate-900" : "bg-[#F8FAFC] text-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-1.5">
            <h2 className="text-3xl font-extrabold text-slate-900">{t("howItWorks")}</h2>
            <div className="w-10 h-1 bg-[#F5B82E] mx-auto rounded-full" />
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              {t("howItWorksSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <Link href="/search" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
                <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">01</span>
                <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="h-4 w-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">{t("searchLand")}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">Find land parcels by location or survey number</p>
              </Link>

              <Link href="/explorer" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
                <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">02</span>
                <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Map className="h-4 w-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">{t("exploreAnalyze")}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">View parcel details and spatial information</p>
              </Link>

              <Link href="/verify" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
                <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">03</span>
                <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">{t("verifyRecords")}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">Run consistency checks and identify risks</p>
              </Link>

              <Link href="/demo-video" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
                <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">04</span>
                <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 fill-amber-600 ml-0.5" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">{t("getReport")}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">Open full-screen video theater page</p>
              </Link>

            </div>

            <div className="lg:col-span-3 bg-[#E6F9F0] border border-[#B2F0D2] p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-xs leading-snug">
                  {t("transparentReady")}
                </h4>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                Built today as a demo, designed for seamless government integration tomorrow.
              </p>
            </div>

          </div>

          <div className="bg-[#D7EBFF] border border-blue-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5 text-slate-900">
              <div className="h-10 w-10 rounded-xl bg-[#081638] text-white flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{t("smarterApproach")}</h3>
                <p className="text-xs text-slate-600 font-medium">Technology-driven. Transparent. People-focused.</p>
              </div>
            </div>

            <Link
              href="/verify"
              className="px-5 py-2.5 rounded-xl bg-[#081638] hover:bg-[#051028] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 border border-slate-700"
            >
              <span>{t("getStarted")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
