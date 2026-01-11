import { cn } from '@/lib/utils';
import { Check, BedDouble, Home, Trees } from 'lucide-react';

interface MobilitySelectorProps {
  value: 'bedridden' | 'indoor' | 'outdoor' | null;
  onChange: (value: 'bedridden' | 'indoor' | 'outdoor') => void;
}

const mobilityOptions = [
  { 
    value: 'bedridden' as const, 
    label: 'Bettlägerig', 
    description: 'Ich liege meist im Bett',
    icon: BedDouble
  },
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
    <div className="flex flex-col gap-4">
      {mobilityOptions.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "touch-card justify-start px-6 relative",
              isSelected ? "touch-card-selected" : "touch-card-unselected"
            )}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-foreground" />
              </div>
            )}

            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mr-4",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-8 h-8" />
            </div>

            <div className="text-left">
              <span className="block text-senior-lg font-semibold text-foreground">
                {option.label}
              </span>
              <span className="block text-senior text-muted-foreground">
                {option.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
