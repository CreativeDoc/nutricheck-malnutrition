import { AcuteDiseases, ChronicDiseases } from '@/types/screening';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AcuteDiseaseSelectorProps {
  value: AcuteDiseases;
  onChange: (value: AcuteDiseases) => void;
}

interface ChronicDiseaseSelectorProps {
  value: ChronicDiseases;
  onChange: (value: ChronicDiseases) => void;
}

export function AcuteDiseaseSelector({ value, onChange }: AcuteDiseaseSelectorProps) {
  const { t } = useTranslation();

  const acuteQuestions = [
    { key: 'cancer' as const, label: t.cancer, hasDetails: true, detailsKey: 'cancerType' as const, placeholder: t.cancerTypePlaceholder },
    { key: 'acuteInfection' as const, label: t.acuteInfection, hasDetails: true, detailsKey: 'acuteInfectionDetails' as const, placeholder: t.infectionTypePlaceholder },
  ];

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
                <span className="text-sm font-medium">{t.yes}</span>
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
                <span className="text-sm font-medium">{t.no}</span>
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
  const { t } = useTranslation();

  const chronicQuestions = [
    { key: 'heartFailure' as const, label: t.heartFailure },
    { key: 'rheumatism' as const, label: t.rheumatism },
    { key: 'lungDisease' as const, label: t.lungDisease },
    { key: 'kidneyDisease' as const, label: t.kidneyDisease },
    { key: 'stroke' as const, label: t.stroke },
    { key: 'diarrhea' as const, label: t.diarrhea },
    { key: 'nauseaVomiting' as const, label: t.nauseaVomiting },
    { key: 'gastrointestinalSurgery' as const, label: t.gastrointestinalSurgery },
  ];

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
                <span className="text-sm font-medium">{t.yes}</span>
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
                <span className="text-sm font-medium">{t.no}</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Other Diseases */}
      <div className="p-2 rounded-lg border border-border">
        <span className="text-sm font-medium block mb-2">{t.otherDiseases}</span>
        <Input 
          placeholder={t.otherDiseasesPlaceholder} 
          value={value.otherDiseases || ''} 
          onChange={(e) => updateDisease('otherDiseases', e.target.value)} 
          className="text-sm h-10" 
        />
      </div>
    </div>
  );
}
