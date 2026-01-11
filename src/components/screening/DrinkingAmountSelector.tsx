import { DrinkingAmount } from '@/types/screening';
import { cn } from '@/lib/utils';
import { GlassWater } from 'lucide-react';

interface DrinkingAmountSelectorProps {
  value: DrinkingAmount | null;
  onChange: (value: DrinkingAmount) => void;
}

const drinkingOptions: { value: DrinkingAmount; label: string; glasses: number }[] = [
  { value: '<1l', label: 'Weniger als 1 Liter', glasses: 2 },
  { value: '1.5l', label: 'Etwa 1,5 Liter', glasses: 4 },
  { value: '>1.5l', label: 'Mehr als 1,5 Liter', glasses: 6 },
];

export function DrinkingAmountSelector({ value, onChange }: DrinkingAmountSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {drinkingOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "touch-card flex items-center gap-4 p-5 transition-all duration-200",
            value === option.value
              ? "ring-4 ring-primary bg-primary/10 border-primary"
              : "hover:bg-muted/50"
          )}
        >
          <div className="flex gap-1">
            {Array.from({ length: option.glasses }).map((_, i) => (
              <GlassWater 
                key={i} 
                className={cn(
                  "w-7 h-7",
                  value === option.value ? "text-primary" : "text-muted-foreground"
                )} 
              />
            ))}
          </div>
          <span className="text-senior-lg font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
