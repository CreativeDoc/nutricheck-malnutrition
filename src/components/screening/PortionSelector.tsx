import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PortionSelectorProps {
  value: 100 | 75 | 50 | 25 | null;
  onChange: (value: 100 | 75 | 50 | 25) => void;
}

const portions = [
  { value: 100 as const, label: 'Voller Teller', description: 'Normale Menge' },
  { value: 75 as const, label: '3/4 Teller', description: 'Etwas weniger' },
  { value: 50 as const, label: 'Halber Teller', description: 'Die Hälfte' },
  { value: 25 as const, label: '1/4 Teller', description: 'Sehr wenig' },
];

export function PortionSelector({ value, onChange }: PortionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {portions.map((portion) => {
        const isSelected = value === portion.value;
        const fillPercentage = portion.value;

        return (
          <button
            key={portion.value}
            type="button"
            onClick={() => onChange(portion.value)}
            className={cn(
              "touch-card flex-col relative p-6",
              isSelected ? "touch-card-selected" : "touch-card-unselected"
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            {/* Plate visualization */}
            <div className="relative w-24 h-24 mb-4">
              {/* Plate outline */}
              <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/30" />
              
              {/* Filled portion */}
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-full bg-primary/70 transition-all duration-300"
                style={{ 
                  height: `${fillPercentage}%`,
                  borderBottomLeftRadius: '9999px',
                  borderBottomRightRadius: '9999px',
                  borderTopLeftRadius: fillPercentage === 100 ? '9999px' : '0',
                  borderTopRightRadius: fillPercentage === 100 ? '9999px' : '0',
                }}
              />
            </div>

            <span className="text-senior-lg font-semibold text-foreground">
              {portion.label}
            </span>
            <span className="text-senior text-muted-foreground">
              {portion.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
