"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "zh";

const STORAGE_KEY = "cvunicorn-language";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({
  language: "en",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch {}
    if (stored === "zh" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
  };

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function T({
  en,
  zh,
  className,
}: {
  en: string;
  zh: string;
  className?: string;
}) {
  const { language } = useLanguage();
  return <span className={className}>{language === "zh" ? zh : en}</span>;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-grid grid-cols-2 rounded-[4px] border border-[#d6d9fc] bg-white p-0.5 text-xs text-[#50617a]"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-[3px] px-2.5 py-1 transition ${
          language === "en" ? "bg-[#533afd] text-white" : "hover:bg-[#f8fafd]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("zh")}
        className={`rounded-[3px] px-2.5 py-1 transition ${
          language === "zh" ? "bg-[#533afd] text-white" : "hover:bg-[#f8fafd]"
        }`}
      >
        中
      </button>
    </div>
  );
}
