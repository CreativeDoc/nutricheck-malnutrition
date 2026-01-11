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
    <div className="space-y-4">
      <p className="text-senior-lg text-muted-foreground text-center mb-6">{label}</p>
      <div className="grid grid-cols-1 gap-3">
        {frequencyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "touch-card p-5 text-center transition-all duration-200",
              value === option.value
                ? "ring-4 ring-primary bg-primary/10 border-primary"
                : "hover:bg-muted/50"
            )}
          >
            <span className="text-senior-lg font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
