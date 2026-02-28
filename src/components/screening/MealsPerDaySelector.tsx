import { cn } from '@/lib/utils';
import { UtensilsCrossed } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MealsPerDaySelectorProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function MealsPerDaySelector({ value, onChange }: MealsPerDaySelectorProps) {
  const { t } = useTranslation();

  const mealOptions = [
    { value: 1, label: t.meal1 },
    { value: 2, label: t.meal2 },
    { value: 3, label: t.meal3 },
    { value: 4, label: t.meal4 },
    { value: 5, label: t.meal5plus },
  ];

  return (
    <div className="grid grid-cols-1 gap-1.5 md:gap-2">
      {mealOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-3 p-2.5 md:p-3 transition-all duration-200 rounded-xl border-2",
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
