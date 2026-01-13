import { cn } from '@/lib/utils';
import { UtensilsCrossed } from 'lucide-react';

interface MealsPerDaySelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

const mealOptions = [
  { value: 1, label: '1 Mahlzeit' },
  { value: 2, label: '2 Mahlzeiten' },
  { value: 3, label: '3 Mahlzeiten' },
  { value: 4, label: '4 Mahlzeiten' },
  { value: 5, label: '5+ Mahlzeiten' },
];

export function MealsPerDaySelector({ value, onChange }: MealsPerDaySelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {mealOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-3 p-3 transition-all duration-200 rounded-xl border-2",
            value === option.value
              ? "ring-2 ring-primary bg-primary/10 border-primary"
              : "border-border bg-card hover:bg-muted/50"
          )}
        >
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(option.value, 5) }).map((_, i) => (
              <UtensilsCrossed 
                key={i} 
                className={cn(
                  "w-5 h-5",
                  value === option.value ? "text-primary" : "text-muted-foreground"
                )} 
              />
            ))}
          </div>
          <span className="text-base font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
