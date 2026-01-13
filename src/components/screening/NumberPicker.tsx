import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit: string;
  label: string;
}

export function NumberPicker({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unit,
  label,
}: NumberPickerProps) {
  const decrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(Math.round(newValue * 10) / 10);
  };

  const increase = () => {
    const newValue = Math.min(max, value + step);
    onChange(Math.round(newValue * 10) / 10);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-base text-muted-foreground">{label}</span>
      
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
            "bg-muted hover:bg-muted/80 text-foreground",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Verringern"
        >
          <Minus className="w-6 h-6" />
        </button>

        <div className="flex items-baseline gap-1 min-w-[100px] justify-center">
          <span className="text-4xl font-bold text-foreground tabular-nums">
            {value.toFixed(step < 1 ? 1 : 0)}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Erhöhen"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Quick adjust buttons */}
      <div className="flex gap-2">
        {[-10, -5, 5, 10].map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => {
              const newValue = Math.min(max, Math.max(min, value + delta));
              onChange(Math.round(newValue * 10) / 10);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium",
              "bg-card border border-border",
              "hover:border-primary hover:bg-accent transition-colors"
            )}
          >
            {delta > 0 ? '+' : ''}{delta}
          </button>
        ))}
      </div>
    </div>
  );
}
