import { AcuteDiseases, ChronicDiseases } from '@/types/screening';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface AcuteDiseaseSelectorProps {
  value: AcuteDiseases;
  onChange: (value: AcuteDiseases) => void;
}

interface ChronicDiseaseSelectorProps {
  value: ChronicDiseases;
  onChange: (value: ChronicDiseases) => void;
}

const acuteQuestions = [
  { key: 'cancer' as const, label: 'Krebs', hasDetails: true, detailsKey: 'cancerType' as const, placeholder: 'Welche Art?' },
  { key: 'acuteInfection' as const, label: 'Akute Infektion', hasDetails: true, detailsKey: 'acuteInfectionDetails' as const, placeholder: 'Welche Art?' },
];

const chronicQuestions = [
  { key: 'heartFailure' as const, label: 'Herzschwäche (mit Wasser in den Beinen/Ödemen)' },
  { key: 'rheumatism' as const, label: 'Rheuma' },
  { key: 'lungDisease' as const, label: 'Chronische Lungenerkrankung' },
  { key: 'kidneyDisease' as const, label: 'Nierenerkrankung' },
  { key: 'stroke' as const, label: 'Schlaganfall' },
  { key: 'diarrhea' as const, label: 'Durchfälle' },
  { key: 'nauseaVomiting' as const, label: 'Übelkeit/Erbrechen' },
  { key: 'gastrointestinalSurgery' as const, label: 'Zustand nach Magen-/Darm-Operation' },
];

export function AcuteDiseaseSelector({ value, onChange }: AcuteDiseaseSelectorProps) {
  const updateDisease = (key: keyof AcuteDiseases, newValue: boolean | string | null) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-2">
      {acuteQuestions.map((q) => (
        <div key={q.key}>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <p className="text-sm font-medium flex-1 pr-2">{q.label}</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateDisease(q.key, true)}
                className={cn(
                  "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                  value[q.key] === true
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Ja</span>
              </button>
              <button
                onClick={() => updateDisease(q.key, false)}
                className={cn(
                  "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                  value[q.key] === false
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Nein</span>
              </button>
            </div>
          </div>
          {q.hasDetails && value[q.key] === true && (
            <Input 
              placeholder={q.placeholder} 
              value={(value[q.detailsKey!] as string) || ''} 
              onChange={(e) => updateDisease(q.detailsKey!, e.target.value)} 
              className="text-sm h-10 mt-1" 
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ChronicDiseaseSelector({ value, onChange }: ChronicDiseaseSelectorProps) {
  const updateDisease = (key: keyof ChronicDiseases, newValue: boolean | string | null) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-2">
      {chronicQuestions.map((q) => (
        <div key={q.key}>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <p className="text-sm font-medium flex-1 pr-2">{q.label}</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateDisease(q.key, true)}
                className={cn(
                  "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                  value[q.key] === true
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Ja</span>
              </button>
              <button
                onClick={() => updateDisease(q.key, false)}
                className={cn(
                  "flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all min-w-[60px]",
                  value[q.key] === false
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Nein</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Other Diseases */}
      <div className="p-2 rounded-lg border border-border">
        <span className="text-sm font-medium block mb-2">Andere Erkrankungen</span>
        <Input 
          placeholder="Falls ja, welche?" 
          value={value.otherDiseases || ''} 
          onChange={(e) => updateDisease('otherDiseases', e.target.value)} 
          className="text-sm h-10" 
        />
      </div>
    </div>
  );
}
