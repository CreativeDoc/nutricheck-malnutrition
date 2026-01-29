import { FrequencyPerWeek } from '@/types/screening';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface FrequencySelectorProps {
  value: FrequencyPerWeek | null;
  onChange: (value: FrequencyPerWeek) => void;
  label: string;
}

export function FrequencySelector({ value, onChange, label }: FrequencySelectorProps) {
  const { t } = useTranslation();

  const frequencyOptions: { value: FrequencyPerWeek; label: string }[] = [
    { value: '0', label: t.frequencyNever },
    { value: '1-2', label: t.frequency1to2 },
    { value: '3-4', label: t.frequency3to4 },
    { value: '5-7', label: t.frequency5to7 },
    { value: 'daily', label: t.frequencyDaily },
  ];

  return (
    <div className="space-y-2">
      <p className="text-base text-muted-foreground text-center mb-3">{label}</p>
      <div className="grid grid-cols-1 gap-2">
        {frequencyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-3 text-center transition-all duration-200 rounded-xl border-2",
              value === option.value
                ? "ring-2 ring-primary bg-primary/10 border-primary"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <span className="text-base font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
