import { FrequencyPerWeek } from '@/types/screening';
import { cn } from '@/lib/utils';

interface FrequencySelectorProps {
  value: FrequencyPerWeek | null;
  onChange: (value: FrequencyPerWeek) => void;
  label: string;
}

const frequencyOptions: { value: FrequencyPerWeek; label: string }[] = [
  { value: '0', label: 'Nie / Selten' },
  { value: '1-2', label: '1-2 mal' },
  { value: '3-4', label: '3-4 mal' },
  { value: '5-7', label: '5-7 mal' },
  { value: 'daily', label: 'Täglich' },
];

export function FrequencySelector({ value, onChange, label }: FrequencySelectorProps) {
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
