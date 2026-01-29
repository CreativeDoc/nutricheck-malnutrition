import { createContext, useContext } from 'react';
import { PatientLanguage } from '@/types/screening';
import { translations, Translations } from '@/i18n/translations';

interface TranslationContextType {
  language: PatientLanguage;
  t: Translations;
}

export const TranslationContext = createContext<TranslationContextType>({
  language: 'de',
  t: translations.de,
});

export function useTranslation() {
  const context = useContext(TranslationContext);
  return context;
}

export function getTranslations(language: PatientLanguage): Translations {
  return translations[language];
}
