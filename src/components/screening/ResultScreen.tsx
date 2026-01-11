import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScreeningResult } from '@/types/screening';
import { generateReportText } from '@/lib/nrsCalculator';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check,
  Home,
  Utensils,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ResultScreenProps {
  result: ScreeningResult;
  onNewScreening: () => void;
  onBackToDashboard: () => void;
}

export function ResultScreen({ result, onNewScreening, onBackToDashboard }: ResultScreenProps) {
  const [showTherapy, setShowTherapy] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyReport = async () => {
    const reportText = generateReportText(result);
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast({
      title: "Kopiert!",
      description: "Der Bericht wurde in die Zwischenablage kopiert.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Traffic Light Result */}
        <div className={cn(
          "text-center p-8 rounded-3xl mb-8 animate-scale-in",
          result.isAtRisk 
            ? "bg-danger-light border-2 border-danger" 
            : "bg-success-light border-2 border-success"
        )}>
          <div className={cn(
            "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
            result.isAtRisk ? "bg-danger" : "bg-success"
          )}>
            {result.isAtRisk ? (
              <AlertTriangle className="w-12 h-12 text-danger-foreground" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-success-foreground" />
            )}
          </div>

          <h1 className={cn(
            "text-senior-2xl font-bold mb-3",
            result.isAtRisk ? "text-danger" : "text-success"
          )}>
            {result.isAtRisk 
              ? "Risiko für Mangelernährung" 
              : "Kein erhöhtes Risiko"}
          </h1>

          <p className="text-senior-lg text-muted-foreground">
            NRS-2002 Score: <strong>{result.totalScore}</strong> Punkte
            {result.isAtRisk && " (≥3 = Risiko)"}
          </p>
        </div>

        {/* At Risk Actions */}
        {result.isAtRisk && !showTherapy && (
          <div className="space-y-4 mb-8 animate-scale-in">
            <p className="text-senior-lg text-center text-foreground mb-6">
              Es besteht ein erhöhtes Risiko für Mangelernährung.
            </p>

            <Button
              onClick={() => setShowTherapy(true)}
              className="btn-xxl w-full bg-primary hover:bg-primary-light gap-4"
            >
              <Utensils className="w-7 h-7" />
              Ernährungstherapie anzeigen
            </Button>
          </div>
        )}

        {/* Therapy Recommendations */}
        {showTherapy && result.recommendations && (
          <div className="space-y-6 mb-8 animate-scale-in">
            <h2 className="text-senior-xl font-bold text-foreground text-center">
              Therapie-Empfehlung
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
                <Flame className="w-10 h-10 mx-auto mb-3 text-warning" />
                <p className="text-senior text-muted-foreground mb-1">Energie</p>
                <p className="text-senior-2xl font-bold text-foreground">
                  {result.recommendations.energy}
                </p>
                <p className="text-senior text-muted-foreground">kcal/Tag</p>
              </div>

              <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
                <Utensils className="w-10 h-10 mx-auto mb-3 text-primary" />
                <p className="text-senior text-muted-foreground mb-1">Protein</p>
                <p className="text-senior-2xl font-bold text-foreground">
                  {result.recommendations.protein}
                </p>
                <p className="text-senior text-muted-foreground">g/Tag</p>
              </div>
            </div>

            <Button
              onClick={copyReport}
              variant="outline"
              className="btn-xl w-full gap-3"
            >
              {copied ? (
                <>
                  <Check className="w-6 h-6" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  Bericht kopieren
                </>
              )}
            </Button>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-senior-lg font-semibold text-foreground mb-4">
            Score-Aufschlüsselung
          </h3>
          <div className="space-y-3">
            {[
              { label: 'BMI-Score', value: result.scores.bmiScore, detail: `BMI: ${result.scores.bmi.toFixed(1)}` },
              { label: 'Gewichtsverlust', value: result.scores.weightLossScore },
              { label: 'Nahrungszufuhr', value: result.scores.nutritionScore },
              { label: 'Erkrankungen', value: result.scores.diseaseScore },
              { label: 'Alters-Bonus (≥70)', value: result.scores.ageBonus },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-senior text-muted-foreground">
                  {item.label}
                  {item.detail && (
                    <span className="text-sm ml-2">({item.detail})</span>
                  )}
                </span>
                <span className={cn(
                  "text-senior font-semibold px-3 py-1 rounded-full",
                  item.value > 0 ? "bg-warning-light text-warning" : "bg-muted text-muted-foreground"
                )}>
                  {item.value}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
              <span className="text-senior-lg font-bold text-foreground">Gesamt</span>
              <span className={cn(
                "text-senior-lg font-bold px-4 py-1 rounded-full",
                result.isAtRisk 
                  ? "bg-danger-light text-danger" 
                  : "bg-success-light text-success"
              )}>
                {result.totalScore}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-auto">
          <Button
            onClick={onBackToDashboard}
            variant="outline"
            className="btn-xl flex-1 gap-3"
          >
            <Home className="w-6 h-6" />
            Dashboard
          </Button>
          <Button
            onClick={onNewScreening}
            className="btn-xl flex-1 gap-3"
          >
            Neues Screening
          </Button>
        </div>
      </main>
    </div>
  );
}
