import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface ScreeningIntroProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ScreeningIntro({ open, onOpenChange, onContinue }: ScreeningIntroProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-senior-xl font-bold text-center">
            Einleitung
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-4 text-base leading-relaxed text-foreground/90 py-4">
            <p>
              <strong>Mangelernährung bei Menschen ist nicht selten.</strong>
            </p>
            
            <p>
              Die Ursachen sind vielfältig, dazu gehören unter anderem konsumierende Erkrankungen wie Krebs, Rheuma, chronische Lungenerkrankungen, schwere Herzinsuffizienz und viele andere.
            </p>
            
            <p>
              Auch nach schweren Erkrankungen, Unfällen, Operationen und im Alter kann es zu Mangelernährungszuständen kommen.
            </p>
            
            <p>
              <strong>Appetitlosigkeit ist ein Leitsymptom der Mangelernährung.</strong>
            </p>
            
            <p>
              Folge davon sind nicht nur teilweise beträchtlicher Gewichtsverlust, sondern auch häufig Kraftverlust durch Muskelabbau, Immobilität, Konzentrationsschwäche, Schwindel, Antriebslosigkeit, verringerte Infektabwehr, erhöhte Infektionsgefahr und schlechtere Verträglichkeit von Therapien (z.B. Chemotherapie, Antibiotikatherapie).
            </p>
            
            <p>
              Auch ungesunde Diäten (z.B. Nulldiät, streng vegane Kost etc.) können zu Mangelzuständen von Vitaminen, Eiweiß und Spurenelementen führen.
            </p>
            
            <p className="text-primary font-medium">
              Jeder Mangelernährungszustand kann behandelt bzw. ausgeglichen werden.
            </p>
            
            <p>
              Voraussetzung dafür ist die Erfassung des aktuellen Ernährungszustandes.
            </p>
            
            <p>
              Häufig wird heute in der medizinischen Einrichtung der Ernährungszustand wenig beachtet und daher ein Mangel nicht erkannt und folglich auch nicht behandelt.
            </p>
            
            <p>
              Aus diesem Grunde wurde der folgende Fragebogen von Ernährungsmedizinern, Diätassistentinnen, Krankenschwestern und Pharmazeuten entwickelt.
            </p>
            
            <p>
              Nachdem Sie ihn ausgefüllt haben, wird er von Spezialisten ausgewertet und Ihr Ergebnis und die daraus resultierenden Therapievorschläge schnellstmöglich übermittelt.
            </p>
            
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border/50 my-4">
              <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Alle Daten werden verschlüsselt und können nur in Ihrer Praxis von Ihrem vertrauten Arzt/Ärztin oder medizinischem Fachpersonal Ihnen zugeordnet werden. Niemand außerhalb der medizinischen Einrichtung kann die Daten Ihnen zuordnen.
              </p>
            </div>
            
            <p className="text-center font-semibold text-primary text-lg pt-2">
              Und nun kann es losgehen:
            </p>
          </div>
        </ScrollArea>
        
        <div className="p-6 pt-4 border-t">
          <Button 
            onClick={onContinue}
            className="w-full btn-xl gap-2"
          >
            Weiter zur Patientenerfassung
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
