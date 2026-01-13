import { CurrentDiseases } from '@/types/screening';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface DiseaseSelectorProps {
  value: CurrentDiseases;
  onChange: (value: CurrentDiseases) => void;
}

const diseaseQuestions = [
  { key: 'cancer' as const, label: 'Krebs', hasDetails: true, detailsKey: 'cancerType' as const, placeholder: 'Welche Art?' },
  { key: 'pneumonia' as const, label: 'Lungenentzündung' },
  { key: 'heartFailure' as const, label: 'Schwere Herzinsuffizienz' },
  { key: 'stroke' as const, label: 'Schlaganfall' },
  { key: 'digestiveIssues' as const, label: 'Verdauungsprobleme', hasDetails: true, detailsKey: 'digestiveDetails' as const, placeholder: 'Welche Beschwerden?' },
];

export function DiseaseSelector({ value, onChange }: DiseaseSelectorProps) {
  const updateDisease = (key: keyof CurrentDiseases, newValue: boolean | string | null) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-2">
      {diseaseQuestions.map((q) => (
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
