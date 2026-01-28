import { ScreeningAnswers } from '@/types/screening';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PhysicalConditionQuestionsProps {
  answers: Pick<ScreeningAnswers, 
    'feelsWeaker' | 'muscleLoss' | 'frequentInfections' | 
    'difficultyGettingUp' | 'shortnessOfBreath'
  >;
  onChange: <K extends keyof ScreeningAnswers>(key: K, value: ScreeningAnswers[K]) => void;
}

const questions = [
  { key: 'feelsWeaker' as const, label: 'Fühlen Sie sich schwächer als früher?' },
  { key: 'muscleLoss' as const, label: 'Haben Sie Muskeln abgebaut?' },
  { key: 'frequentInfections' as const, label: 'Leiden Sie häufiger an Infektionen?' },
  { key: 'difficultyGettingUp' as const, label: 'Fällt es Ihnen schwerer aufzustehen und etwas zu unternehmen?' },
  { key: 'shortnessOfBreath' as const, label: 'Sind Sie kurzatmiger geworden, besonders bei Anstrengungen?' },
];

export function PhysicalConditionQuestions({ answers, onChange }: PhysicalConditionQuestionsProps) {
  return (
    <div className="space-y-2">
      {questions.map((q) => (
        <div key={q.key} className="flex items-center justify-between p-2 rounded-lg border border-border">
          <p className="text-sm font-medium flex-1 pr-2">{q.label}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onChange(q.key, true)}
              className={cn(
                "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                answers[q.key] === true
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Ja</span>
            </button>
            <button
              onClick={() => onChange(q.key, false)}
              className={cn(
                "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                answers[q.key] === false
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Nein</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
