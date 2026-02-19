import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, getTranslation, TranslationKey } from '@/locales';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Browser language detection
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';

  const browserLang = navigator.language || navigator.languages?.[0] || 'es';
  return browserLang.startsWith('en') ? 'en' : 'es';
};

// Local storage key
const LANGUAGE_STORAGE_KEY = 'thalassa_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'es' || saved === 'en') {
        return saved as Language;
      }
    }
    // Fallback to browser language
    return getBrowserLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Update HTML lang attribute for accessibility and SEO
      document.documentElement.lang = lang;
    }
  };

  // Update HTML lang attribute on mount and language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Translation function using the getTranslation helper
  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook for components that need translation
export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};