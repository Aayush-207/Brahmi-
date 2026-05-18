"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "hi" | "en" | "kn" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("hi");
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  // Load translations and restore language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    setMounted(true);
  }, []);

  // Load translations when language changes
  useEffect(() => {
    if (mounted) {
      const loadTranslations = async () => {
        try {
          let response = await fetch(`/locales/${language}.json`);
          if (!response.ok && language === "kn") {
            response = await fetch("/locales/en.json");
          }
          const data = await response.json();
          setTranslations(data);
          localStorage.setItem("language", language);
        } catch (error) {
          console.error("Failed to load translations:", error);
        }
      };
      loadTranslations();
    }
  }, [language, mounted]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
