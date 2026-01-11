import { ScreeningAnswers } from '@/types/screening';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PhysicalConditionQuestionsProps {
  answers: Pick<ScreeningAnswers, 
    'feelsWeaker' | 'muscleLoss' | 'frequentInfections' | 
    'getsOutdoors' | 'difficultyGettingUp' | 'shortnessOfBreath'
  >;
  onChange: <K extends keyof ScreeningAnswers>(key: K, value: ScreeningAnswers[K]) => void;
}

const questions = [
  { key: 'feelsWeaker' as const, label: 'Fühlen Sie sich schwächer als früher?' },
  { key: 'muscleLoss' as const, label: 'Haben Sie Muskeln abgebaut?' },
  { key: 'frequentInfections' as const, label: 'Leiden Sie häufiger an Infektionen?' },
  { key: 'getsOutdoors' as const, label: 'Sind Sie häufig an der frischen Luft?', inverted: true },
  { key: 'difficultyGettingUp' as const, label: 'Fällt es Ihnen schwerer aufzustehen und etwas zu unternehmen?' },
  { key: 'shortnessOfBreath' as const, label: 'Sind Sie kurzatmiger geworden, besonders bei Anstrengungen?' },
];

export function PhysicalConditionQuestions({ answers, onChange }: PhysicalConditionQuestionsProps) {
  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <div key={q.key} className="touch-card p-4">
          <p className="text-senior-lg mb-4">{q.label}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onChange(q.key, true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                answers[q.key] === true
                  ? q.inverted 
                    ? "bg-success/10 border-success text-success"
                    : "bg-destructive/10 border-destructive text-destructive"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <Check className="w-6 h-6" />
              <span className="text-senior-lg font-medium">Ja</span>
            </button>
            <button
              onClick={() => onChange(q.key, false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                answers[q.key] === false
                  ? q.inverted
                    ? "bg-destructive/10 border-destructive text-destructive"
                    : "bg-success/10 border-success text-success"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <X className="w-6 h-6" />
              <span className="text-senior-lg font-medium">Nein</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
