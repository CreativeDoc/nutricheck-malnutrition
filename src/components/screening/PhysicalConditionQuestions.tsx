import { ScreeningAnswers } from '@/types/screening';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PhysicalConditionQuestionsProps {
  answers: Pick<ScreeningAnswers, 
    'feelsWeaker' | 'muscleLoss' | 'frequentInfections' | 
    'difficultyGettingUp' | 'shortnessOfBreath'
  >;
  onChange: <K extends keyof ScreeningAnswers>(key: K, value: ScreeningAnswers[K]) => void;
}

export function PhysicalConditionQuestions({ answers, onChange }: PhysicalConditionQuestionsProps) {
  const { t } = useTranslation();

  const questions = [
    { key: 'feelsWeaker' as const, label: t.feelsWeaker },
    { key: 'muscleLoss' as const, label: t.muscleLoss },
    { key: 'frequentInfections' as const, label: t.frequentInfections },
    { key: 'difficultyGettingUp' as const, label: t.difficultyGettingUp },
    { key: 'shortnessOfBreath' as const, label: t.shortnessOfBreath },
  ];

  return (
    <div className="space-y-1.5 md:space-y-2">
      {questions.map((q) => (
        <div key={q.key} className="flex items-center justify-between p-1.5 md:p-2 rounded-lg border border-border">
          <p className="text-sm font-medium flex-1 pr-2">{q.label}</p>
          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={() => onChange(q.key, true)}
              className={cn(
                "flex items-center justify-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border-2 transition-all min-w-[56px] md:min-w-[60px]",
                answers[q.key] === true
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{t.yes}</span>
            </button>
            <button
              onClick={() => onChange(q.key, false)}
              className={cn(
                "flex items-center justify-center gap-1 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border-2 transition-all min-w-[56px] md:min-w-[60px]",
                answers[q.key] === false
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">{t.no}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
