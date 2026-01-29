import { ReactNode } from 'react';
import { PatientLanguage } from '@/types/screening';
import { TranslationContext } from '@/hooks/useTranslation';
import { translations } from '@/i18n/translations';

interface TranslationProviderProps {
  language: PatientLanguage;
  children: ReactNode;
}

export function TranslationProvider({ language, children }: TranslationProviderProps) {
  return (
    <TranslationContext.Provider value={{ language, t: translations[language] }}>
      {children}
    </TranslationContext.Provider>
  );
}
