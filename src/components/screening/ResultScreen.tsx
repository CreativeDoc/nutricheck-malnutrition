import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScreeningResult } from '@/types/screening';
import { generateReportText } from '@/lib/nrsCalculator';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreeningEmail } from '@/hooks/useScreeningEmail';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  Home,
  Utensils,
  Flame,
  MessageCircle,
  Mail,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ResultScreenProps {
  result: ScreeningResult;
  onNewScreening: () => void;
  onBackToDashboard: () => void;
  onUpdateCounselingChoice?: (wantsCounseling: boolean) => void;
}

export function ResultScreen({ result, onNewScreening, onBackToDashboard, onUpdateCounselingChoice }: ResultScreenProps) {
  const { t } = useTranslation();
  const { practice } = useAuthContext();
  const [copied, setCopied] = useState(false);
  const [counselingChoice, setCounselingChoice] = useState<boolean | null>(
    result.answers.wantsNutritionCounseling
  );
  const [emailSent, setEmailSent] = useState(false);
  const { sendScreeningEmail, isLoading: isEmailSending } = useScreeningEmail();
  const autoEmailSentRef = useRef(false);

  const getPracticeEmail = () => practice?.email || '';

  const doSendEmail = async () => {
    const practiceEmail = getPracticeEmail();
    if (!practiceEmail) {
      toast({
        title: 'Keine Praxis-Email hinterlegt',
        description: 'Hinweis: Keine Praxis-Email hinterlegt. Gehen Sie in die Einstellungen.',
        variant: 'destructive',
      });
      return;
    }

    const reportText = generateReportText(result);
    const success = await sendScreeningEmail({
      patient_code: result.patientCode,
      patient_birth_date: result.answers.birthDate,
      total_score: result.totalScore,
      malnutrition_level: result.malnutritionLevel,
      report_text: reportText,
      wants_counseling: counselingChoice === true,
      practice_email: practiceEmail,
      cc_email: 'markus.blanke@2docs.eu',
      scores: result.scores,
      recommendations: result.recommendations,
      answers: result.answers as unknown as Record<string, unknown>,
    });

    if (success) {
      setEmailSent(true);
      toast({
        title: 'Email gesendet',
        description: `Screening-Ergebnis wurde per Email an ${practiceEmail} gesendet`,
      });
    } else {
      toast({
        title: 'Fehler beim Email-Versand',
        description: 'Email konnte nicht gesendet werden. Bitte kopieren Sie den Bericht manuell.',
        variant: 'destructive',
      });
    }
  };

  const copyReport = async () => {
    const reportText = generateReportText(result);
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast({
      title: t.copied,
      description: t.copied,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCounselingChoice = (choice: boolean) => {
    setCounselingChoice(choice);
    onUpdateCounselingChoice?.(choice);
  };

  // Auto-send email when patient wants counseling
  useEffect(() => {
    if (counselingChoice === true && !autoEmailSentRef.current && !emailSent) {
      autoEmailSentRef.current = true;
      doSendEmail();
    }
  }, [counselingChoice]);

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
        return t.severeMalnutrition;
      case 'mild':
        return t.mildMalnutrition;
      default:
        return t.noMalnutrition;
    }
  };

  const getLevelDescription = () => {
    if (result.malnutritionLevel === 'none') {
      return t.noMalnutritionExplanation;
    }
    return t.malnutritionExplanation;
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
            {t.scoreLabel} <strong>{result.totalScore}</strong> {t.totalScore === 'Gesamt' ? 'Punkte' : 'points'}
            {result.malnutritionLevel === 'mild' && ` ${t.scoreMild}`}
            {result.malnutritionLevel === 'severe' && ` ${t.scoreSevere}`}
          </p>
        </div>

        {/* Counseling Question */}
        {result.isAtRisk && (
          <div className="space-y-4 mb-8 animate-scale-in">
            <div className="bg-card border-2 border-border rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-senior-lg font-semibold text-foreground mb-2">
                    {t.counselingQuestion}
                  </h2>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleCounselingChoice(true)}
                  variant={counselingChoice === true ? "default" : "outline"}
                  className={cn(
                    "btn-xl flex-1",
                    counselingChoice === true && "bg-primary hover:bg-primary/90"
                  )}
                >
                  {t.yes}
                </Button>
                <Button
                  onClick={() => handleCounselingChoice(false)}
                  variant={counselingChoice === false ? "default" : "outline"}
                  className={cn(
                    "btn-xl flex-1",
                    counselingChoice === false && "bg-muted-foreground hover:bg-muted-foreground/90"
                  )}
                >
                  {t.no}
                </Button>
              </div>

              {counselingChoice === true && (
                <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 animate-scale-in">
                  <p className="text-senior text-foreground">
                    <strong>{t.counselingThankYou.split('!')[0]}!</strong> {t.counselingThankYou.split('!')[1]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Copy Report Button */}
        {result.isAtRisk && (
          <div className="mb-8 animate-scale-in">
            <Button
              onClick={copyReport}
              variant="outline"
              className="btn-xl w-full gap-3"
            >
              {copied ? (
                <>
                  <Check className="w-6 h-6" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  {t.copyReport}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Send Email Button */}
        <div className="mb-8 animate-scale-in">
          <Button
            onClick={doSendEmail}
            disabled={isEmailSending || emailSent}
            variant="outline"
            className="btn-xl w-full gap-3"
          >
            {isEmailSending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Wird gesendet...
              </>
            ) : emailSent ? (
              <>
                <Check className="w-6 h-6" />
                Email gesendet
              </>
            ) : (
              <>
                <Mail className="w-6 h-6" />
                Ergebnis per Email senden
              </>
            )}
          </Button>
        </div>

        {/* Score Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-senior-lg font-semibold text-foreground mb-4">
            {t.scoreBreakdown}
          </h3>
          <div className="space-y-3">
            {/* BMI - larger display */}
            <div className="flex justify-between items-center bg-muted/30 rounded-xl p-4 mb-2">
              <span className="text-senior-lg font-medium text-foreground">
                {t.bmiLabel}
              </span>
              <span className="text-senior-xl font-bold text-primary">
                {result.scores.bmi.toFixed(1)}
              </span>
            </div>

            {[
              { label: t.weightLossScore, value: result.scores.weightLossScore },
              { label: t.nutritionScore, value: result.scores.nutritionScore },
              { label: t.diseaseScore, value: result.scores.diseaseScore },
              { label: t.physicalConditionScore, value: result.scores.physicalConditionScore },
              { label: t.swallowingScore, value: result.scores.swallowingScore },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-senior text-muted-foreground">
                  {item.label}
                </span>
                <span className={cn(
                  "text-senior font-semibold px-3 py-1 rounded-full",
                  item.value > 0 ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
                )}>
                  {item.value}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
              <span className="text-senior-lg font-bold text-foreground">{t.totalScore}</span>
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
            {t.dashboard}
          </Button>
          <Button
            onClick={onNewScreening}
            className="btn-xl flex-1 gap-3"
          >
            {t.newScreening}
          </Button>
        </div>
      </main>
    </div>
  );
}
