"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languageNames } from '@/utils/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Record<Language, string>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('festival_lang', lang);
    }
  };

  useEffect(() => {
    // Check local storage first
    const saved = localStorage.getItem('festival_lang') as Language;
    if (saved && Object.keys(languageNames).includes(saved)) {
      setLanguageState(saved);
      return;
    }

    // Detect browser language and default appropriately
    const navLang = navigator.language.toLowerCase();
    const codes: Language[] = ['hi', 'ta', 'te', 'kn', 'pa', 'ml', 'bn', 'mr', 'gu', 'ur', 'or', 'as'];
    
    for (const code of codes) {
      if (navLang.startsWith(code)) {
        setLanguageState(code);
        return;
      }
    }
    // Otherwise fallback to 'en'
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages: languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
