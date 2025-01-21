// TranslationProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import en from "../locales/en"
import es from "../locales/es"

export type Language = "en" | "es";
type Translations = Record<Language, Record<string, string>>;
type TranslationContextType = {
  t: (key: string) => string;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
};

const translations: Translations = {
  en,
  es
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
  return context;
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const t = (key: string) => translations[currentLanguage][key] || key;

  const setLanguage = (lang: Language) => setCurrentLanguage(lang);

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}
