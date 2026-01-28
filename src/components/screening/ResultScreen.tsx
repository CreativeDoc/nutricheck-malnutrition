import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScreeningResult } from '@/types/screening';
import { generateReportText } from '@/lib/nrsCalculator';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
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

  const getLevelStyles = () => {
    switch (result.malnutritionLevel) {
      case 'severe':
        return {
          bg: 'bg-destructive/10 border-destructive',
          iconBg: 'bg-destructive',
          text: 'text-destructive',
          icon: AlertOctagon,
        };
      case 'mild':
        return {
          bg: 'bg-warning/10 border-warning',
          iconBg: 'bg-warning',
          text: 'text-warning',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-success/10 border-success',
          iconBg: 'bg-success',
          text: 'text-success',
          icon: CheckCircle2,
        };
    }
  };

  const getLevelTitle = () => {
    switch (result.malnutritionLevel) {
      case 'severe':
        return 'Schwerer Mangelernährungszustand';
      case 'mild':
        return 'Leichter Mangelernährungszustand';
      default:
        return 'Kein Mangelernährungszustand';
    }
  };

  const getLevelDescription = () => {
    if (result.malnutritionLevel === 'none') {
      return 'Es besteht kein erhöhtes Risiko für Mangelernährung.';
    }
    return 'Bei Ihnen besteht ein Mangelernährungszustand, der therapiert werden kann und sollte.';
  };

  const styles = getLevelStyles();
  const IconComponent = styles.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Traffic Light Result */}
        <div className={cn(
          "text-center p-8 rounded-3xl mb-8 animate-scale-in border-2",
          styles.bg
        )}>
          <div className={cn(
            "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
            styles.iconBg
          )}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>

          <h1 className={cn(
            "text-senior-2xl font-bold mb-3",
            styles.text
          )}>
            {getLevelTitle()}
          </h1>

          <p className="text-senior-lg text-muted-foreground mb-4">
            {getLevelDescription()}
          </p>

          <p className="text-senior text-muted-foreground">
            Score: <strong>{result.totalScore}</strong> Punkte
            {result.malnutritionLevel === 'mild' && " (≥3 = leicht)"}
            {result.malnutritionLevel === 'severe' && " (≥5 = schwer)"}
          </p>
        </div>

        {/* At Risk Actions */}
        {result.isAtRisk && !showTherapy && (
          <div className="space-y-4 mb-8 animate-scale-in">
            <Button
              onClick={() => setShowTherapy(true)}
              className="btn-xxl w-full bg-primary hover:bg-primary/90 gap-4"
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

        {/* Counseling Request */}
        {result.answers.wantsNutritionCounseling && (
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6 mb-8 text-center">
            <p className="text-senior-lg font-medium text-primary">
              ✓ Patient wünscht Ernährungsberatung / Ernährungstherapie
            </p>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-senior-lg font-semibold text-foreground mb-4">
            Score-Aufschlüsselung
          </h3>
          <div className="space-y-3">
            {[
              { label: 'BMI', value: null, detail: `${result.scores.bmi.toFixed(1)} (nicht im Score)` },
              { label: 'Gewichtsverlust', value: result.scores.weightLossScore },
              { label: 'Nahrungszufuhr', value: result.scores.nutritionScore },
              { label: 'Erkrankungen', value: result.scores.diseaseScore },
              { label: 'Körperliches Befinden', value: result.scores.physicalConditionScore },
              { label: 'Schluckbeschwerden', value: result.scores.swallowingScore },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-senior text-muted-foreground">
                  {item.label}
                  {item.detail && (
                    <span className="text-sm ml-2">({item.detail})</span>
                  )}
                </span>
                {item.value !== null && (
                  <span className={cn(
                    "text-senior font-semibold px-3 py-1 rounded-full",
                    item.value > 0 ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
                  )}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
              <span className="text-senior-lg font-bold text-foreground">Gesamt</span>
              <span className={cn(
                "text-senior-lg font-bold px-4 py-1 rounded-full",
                result.malnutritionLevel === 'severe' 
                  ? "bg-destructive/20 text-destructive"
                  : result.malnutritionLevel === 'mild'
                    ? "bg-warning/20 text-warning"
                    : "bg-success/20 text-success"
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
