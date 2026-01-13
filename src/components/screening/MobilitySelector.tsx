import { cn } from '@/lib/utils';
import { Check, Home, Trees } from 'lucide-react';

interface MobilitySelectorProps {
  value: 'indoor' | 'outdoor' | null;
  onChange: (value: 'indoor' | 'outdoor') => void;
}

const mobilityOptions = [
  { 
    value: 'indoor' as const, 
    label: 'Im Haus mobil', 
    description: 'Ich bewege mich zuhause',
    icon: Home
  },
  { 
    value: 'outdoor' as const, 
    label: 'Gehe auch raus', 
    description: 'Ich gehe auch nach draußen',
    icon: Trees
  },
];

export function MobilitySelector({ value, onChange }: MobilitySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {mobilityOptions.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center px-4 py-3 rounded-xl border-2 relative transition-all",
              isSelected 
                ? "ring-2 ring-primary border-primary bg-primary/10" 
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}

            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mr-3",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="text-left">
              <span className="block text-base font-semibold text-foreground">
                {option.label}
              </span>
              <span className="block text-sm text-muted-foreground">
                {option.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
