"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ChevronDown,
  Globe,
  User,
  X,
  Lock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Sun,
  Moon,
  Book,
  Palette,
  Check,
  FileText,
  Bell,
  Search,
  Calendar,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useLanguage, SupportedLanguage } from "@/context/language-context";

// Sample Land Revenue Notices
const OFFICIAL_NOTICES = [
  {
    id: "NTC-2026-001",
    title: "Public Notice: Cadastral Survey & Polygon Boundary Re-verification",
    department: "Department of Land Revenue & Settlement",
    date: "12 Aug 2026",
    urgency: "HIGH",
    category: "Survey Update",
    summary: "Re-mapping of agricultural and commercial plot boundaries under Pune Sub-Division Tehsil. Landowners requested to verify survey coordinates.",
  },
  {
    id: "NTC-2026-002",
    title: "Notification: Online RoR Record & Mutation Synchronization Drive",
    department: "State Land Records Directorate",
    date: "10 Aug 2026",
    urgency: "NORMAL",
    category: "Mutation Audit",
    summary: "Mandatory digital audit of Record of Rights (Khata 7/12 & Khasra) across Lucknow Tehsil. Verified entries assigned SHA-256 digital hashes.",
  },
  {
    id: "NTC-2026-003",
    title: "Advisory: Encumbrance & Mortgage Verification Guidelines for Investors",
    department: "Registration & Stamp Revenue Dept.",
    date: "05 Aug 2026",
    urgency: "IMPORTANT",
    category: "Public Advisory",
    summary: "Buyers advised to perform cryptographic title due diligence using BhoomiVerify portal before initiating property sale deed registration.",
  },
];

const ALL_INDIAN_LANGUAGES: SupportedLanguage[] = [
  "English",
  "हिन्दी (Hindi)",
  "मराठी (Marathi)",
  "ಕನ್ನಡ (Kannada)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "ગુજરાતી (Gujarati)",
  "বাংলা (Bengali)",
  "മലയാളം (Malayalam)",
  "ਪੰਜਾਬੀ (Punjabi)",
  "ଓଡ଼ିଆ (Odia)",
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [helpOpen, setHelpOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("PUBLIC");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [noticeSearch, setNoticeSearch] = useState("");

  const helpRef = useRef<HTMLDivElement>(null);

  // Click-Outside Listener for Help Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      setLoginModalOpen(false);
    }, 1200);
  };

  const selectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setShowLanguageList(false);
    setHelpOpen(false);
  };

  return (
    <>
      {/* Header Container */}
      <header className={`sticky top-0 z-[2000] w-full border-b transition-colors shadow-2xl backdrop-blur-md ${
        theme === "creamy"
          ? "bg-[#FAF7F2]/95 border-amber-200/80 text-slate-900"
          : theme === "dim"
          ? "bg-[#E3E8E5]/95 border-slate-300 text-slate-900"
          : "bg-[#0B132B]/95 border-slate-800 text-white"
      }`}>
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-3 sm:px-6 gap-2">
          
          {/* Logo Title */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all shrink-0">
              <div className="h-full w-full bg-[#0B132B] rounded-[14px] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <span className={`font-extrabold text-xl sm:text-2xl tracking-tight leading-none ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Bhoomi<span className="text-emerald-500">Verify</span>
            </span>
          </Link>

          {/* Desktop Navigation (Land button removed as requested) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 sm:gap-3 text-xs font-semibold flex-1 px-2">
            
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                pathname === "/"
                  ? "border-amber-400 bg-amber-400/10 text-amber-500 font-extrabold shadow-sm"
                  : theme === "dark"
                  ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-slate-200 hover:text-white"
                  : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-800"
              }`}
            >
              {t("home")}
            </Link>

            {/* Notice Button with Blinking Red Light Indicator */}
            <button
              onClick={() => setNoticeModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                noticeModalOpen
                  ? "border-rose-500 bg-rose-500/10 text-rose-500 font-extrabold"
                  : theme === "dark"
                  ? "border-slate-700/80 hover:border-rose-400 bg-slate-900/60 text-slate-200 hover:text-white"
                  : "border-slate-300 hover:border-rose-500 bg-white/80 text-slate-800"
              }`}
            >
              <Bell className="h-3.5 w-3.5 text-rose-500 animate-bounce" />
              <span className="font-bold">{t("notice")}</span>

              {/* Blinking Red Light Beacon */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </button>

            <Link
              href="/measurements"
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                pathname === "/measurements"
                  ? "border-amber-400 bg-amber-400/10 text-amber-500 font-extrabold shadow-sm"
                  : theme === "dark"
                  ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-slate-200 hover:text-white"
                  : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-800"
              }`}
            >
              {t("measurements")}
            </Link>

            <Link
              href="/verify"
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                pathname === "/verify"
                  ? "border-amber-400 bg-amber-400/10 text-amber-500 font-extrabold shadow-sm"
                  : theme === "dark"
                  ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-slate-200 hover:text-white"
                  : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-800"
              }`}
            >
              {t("verification")}
            </Link>

            <Link
              href="/explorer"
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                pathname === "/explorer"
                  ? "border-amber-400 bg-amber-400/10 text-amber-500 font-extrabold shadow-sm"
                  : theme === "dark"
                  ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-slate-200 hover:text-white"
                  : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-800"
              }`}
            >
              {t("resources")}
            </Link>

            {/* Help Dropdown Container (Now includes Language Selector) */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => setHelpOpen(!helpOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                  helpOpen
                    ? "border-amber-400 bg-amber-400/10 text-amber-500 font-extrabold"
                    : theme === "dark"
                    ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-slate-200 hover:text-white"
                    : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-800"
                }`}
              >
                <span>{t("help")}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>

              {/* Help & Language & Theme Dropdown Menu */}
              {helpOpen && (
                <div className={`absolute top-full right-0 mt-2 w-72 border rounded-2xl shadow-2xl p-3 text-xs space-y-3 z-[3000] animate-in fade-in ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-emerald-500" /> Platform Guidance & Help
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/verify-report/BV-DEMO-2026-00001"
                      onClick={() => setHelpOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-colors font-semibold"
                    >
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span>View Verification Reports</span>
                    </Link>

                    <Link
                      href="/verify"
                      onClick={() => setHelpOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors font-semibold"
                    >
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                      <span>How Title Verification Works</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setHelpOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-amber-500/10 hover:text-amber-400 transition-colors font-semibold"
                    >
                      <Book className="h-4 w-4 text-amber-400" />
                      <span>Reviewer & Governance Portal</span>
                    </Link>
                  </div>

                  {/* 🌐 Language Selector moved inside Help Section */}
                  <div className="pt-2 border-t border-slate-800/40 space-y-1.5">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-emerald-400" /> Indian State Languages
                      </span>
                      <span className="text-[10px] text-emerald-400 font-extrabold">{language.split(" ")[0]}</span>
                    </div>

                    <button
                      onClick={() => setShowLanguageList(!showLanguageList)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> {language}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageList ? "rotate-180" : ""}`} />
                    </button>

                    {/* Sub-list of 11 Indian Languages */}
                    {showLanguageList && (
                      <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 border border-slate-800 rounded-xl p-1 bg-slate-950/80">
                        {ALL_INDIAN_LANGUAGES.map((lang) => {
                          const isSelected = language === lang;
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                selectLanguage(lang);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-semibold text-xs transition-colors ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                                  : "hover:bg-slate-800 text-slate-300"
                              }`}
                            >
                              <span>{lang}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Theme Switcher Options */}
                  <div className="pt-2 border-t border-slate-800/40 space-y-1">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 px-1 py-1 flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-amber-400" /> Color Theme Options
                    </div>

                    <button
                      onClick={() => { setTheme("dark"); setHelpOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        theme === "dark" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-indigo-400" /> Dark Mode
                      </span>
                      {theme === "dark" && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => { setTheme("creamy"); setHelpOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        theme === "creamy" ? "bg-amber-500/20 text-amber-700 font-bold" : "hover:bg-amber-100/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-500" /> Creamy White
                      </span>
                      {theme === "creamy" && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => { setTheme("dim"); setHelpOpen(false); }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        theme === "dim" ? "bg-teal-500/20 text-teal-700 font-bold" : "hover:bg-slate-200/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-teal-600" /> Study Dim Light
                      </span>
                      {theme === "dim" && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Login Bordered Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                theme === "dark"
                  ? "border-slate-700/80 hover:border-slate-400 bg-slate-900/60 text-white"
                  : "border-slate-300 hover:border-slate-500 bg-white/80 text-slate-900"
              }`}
            >
              {t("login")}
            </button>

            {/* Get Started Bordered Pill Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-500/80 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <User className="h-3.5 w-3.5 fill-slate-950" />
              <span>{t("getStarted")}</span>
            </button>

          </div>

        </div>
      </header>

      {/* Official Land Revenue Notice Board Modal */}
      {noticeModalOpen && (
        <div
          className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setNoticeModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNoticeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Bell className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Official Land Revenue Notice Board
                  </h3>
                  <p className="text-xs text-slate-400">Public notifications, survey updates, and land administration circulars.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <Search className="h-4 w-4 text-slate-500 ml-1" />
              <input
                type="text"
                placeholder="Filter notices by keyword, survey, or category..."
                value={noticeSearch}
                onChange={(e) => setNoticeSearch(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {OFFICIAL_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-white leading-snug">{notice.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-rose-500/20 text-rose-400 border-rose-500/40 shrink-0">
                      {notice.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{notice.summary}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="font-medium">{notice.department}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" /> {notice.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">
                Official Land Revenue System Notifications
              </span>
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Close Notice Board
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RBAC Login Modal */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLoginModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Sign In to BhoomiVerify</h3>
              <p className="text-xs text-slate-400">Select your access role to proceed into the system.</p>
            </div>

            {loginSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Authenticated successfully as {selectedRole}!</span>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Select Access Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="PUBLIC">Public Citizen Access</option>
                    <option value="BUYER">Prospective Buyer / Investor</option>
                    <option value="REVIEWER">Revenue Reviewer (Tahsildar / Kanungo)</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Email Address</label>
                  <input
                    type="email"
                    defaultValue="user@bhoomiverify.gov.in"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
                >
                  Authorize Sign In
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
