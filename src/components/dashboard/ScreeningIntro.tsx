import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { PatientLanguage } from '@/types/screening';
import { getTranslations } from '@/hooks/useTranslation';

interface ScreeningIntroProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  language: PatientLanguage;
}

export function ScreeningIntro({ open, onOpenChange, onContinue, language }: ScreeningIntroProps) {
  const t = getTranslations(language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-senior-xl font-bold text-center">
            {t.introTitle}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-4 text-base leading-relaxed text-foreground/90 py-4">
            <p>
              <strong>{t.introText1}</strong>
            </p>
            
            <p>
              {t.introText2}
            </p>
            
            <p>
              {t.introText3}
            </p>
            
            <p>
              <strong>{t.introText4}</strong>
            </p>
            
            <p>
              {t.introText5}
            </p>
            
            <p>
              {t.introText6}
            </p>
            
            <p className="text-primary font-medium">
              {t.introText7}
            </p>
            
            <p>
              {t.introText8}
            </p>
            
            <p>
              {t.introText9}
            </p>
            
            <p>
              {t.introText10}
            </p>
            
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border/50 my-4">
              <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t.introPrivacy}
              </p>
            </div>
            
            <p className="text-center font-semibold text-primary text-lg pt-2">
              {t.introLetsGo}
            </p>
          </div>
        </ScrollArea>
        
        <div className="p-6 pt-4 border-t">
          <Button 
            onClick={onContinue}
            className="w-full btn-xl gap-2"
          >
            {t.introContinue}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
