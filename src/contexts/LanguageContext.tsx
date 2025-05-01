
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en-US" | "pt-BR";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = "en-US";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || defaultLanguage;
  });

  // Load translations
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      const enTranslations = (await import("../translations/en-US.json")).default;
      const ptTranslations = (await import("../translations/pt-BR.json")).default;
      
      setTranslations({
        "en-US": enTranslations,
        "pt-BR": ptTranslations
      });
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    // Save the language preference to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return key;
    return translations[language][key] || translations["en-US"][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
