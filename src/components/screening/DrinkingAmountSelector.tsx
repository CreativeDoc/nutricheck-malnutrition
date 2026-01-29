import { DrinkingAmount } from '@/types/screening';
import { cn } from '@/lib/utils';
import { GlassWater } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DrinkingAmountSelectorProps {
  value: DrinkingAmount | null;
  onChange: (value: DrinkingAmount) => void;
}

export function DrinkingAmountSelector({ value, onChange }: DrinkingAmountSelectorProps) {
  const { t } = useTranslation();

  const drinkingOptions: { value: DrinkingAmount; label: string; glasses: number }[] = [
    { value: '<1l', label: t.drinkingLess1, glasses: 2 },
    { value: '1.5l', label: t.drinking1point5, glasses: 4 },
    { value: '>1.5l', label: t.drinkingMore1point5, glasses: 6 },
  ];

  return (
    <div className="flex flex-col gap-2">
      {drinkingOptions.map((option) => (
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
            {Array.from({ length: option.glasses }).map((_, i) => (
              <GlassWater 
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
