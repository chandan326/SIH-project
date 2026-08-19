"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "dark" | "creamy" | "dim";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("bhoomiverify_theme") as ThemeMode;
    if (saved && ["dark", "creamy", "dim"].includes(saved)) {
      setTheme(saved);
    }
  }, []);

  const handleSetTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("bhoomiverify_theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden transition-colors duration-300 ${
        theme === "creamy"
          ? "bg-[#FAF7F2] text-slate-900"
          : theme === "dim"
          ? "bg-[#E3E8E5] text-slate-900"
          : "bg-[#070E26] text-slate-100"
      }`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
