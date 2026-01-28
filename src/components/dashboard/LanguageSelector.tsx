import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PatientLanguage } from '@/types/screening';
import { Globe, ArrowRight } from 'lucide-react';

interface LanguageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (language: PatientLanguage) => void;
}

const languages: { value: PatientLanguage; label: string; flag: string }[] = [
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export function LanguageSelector({ open, onOpenChange, onSelect }: LanguageSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-senior-xl">
            Sprache wählen
          </DialogTitle>
          <DialogDescription className="text-senior">
            In welcher Sprache soll das Screening durchgeführt werden?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {languages.map((lang) => (
            <Button
              key={lang.value}
              variant="outline"
              onClick={() => onSelect(lang.value)}
              className="w-full h-16 text-senior-lg justify-between px-6 hover:bg-accent hover:border-primary"
            >
              <span className="flex items-center gap-4">
                <span className="text-2xl">{lang.flag}</span>
                {lang.label}
              </span>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
