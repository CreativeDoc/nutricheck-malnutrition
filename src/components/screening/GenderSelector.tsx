import { Gender } from '@/types/screening';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

interface GenderSelectorProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
}

const genderOptions: { value: Gender; label: string; icon: React.ReactNode }[] = [
  { 
    value: 'male', 
    label: 'Männlich',
    icon: <User className="w-12 h-12" />
  },
  { 
    value: 'female', 
    label: 'Weiblich',
    icon: <User className="w-12 h-12" />
  },
  { 
    value: 'diverse', 
    label: 'Divers',
    icon: <Users className="w-12 h-12" />
  },
];

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {genderOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "touch-card flex items-center gap-6 p-6",
            "transition-all duration-200",
            value === option.value
              ? "ring-4 ring-primary bg-primary/10 border-primary"
              : "hover:bg-muted/50"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-20 h-20 rounded-full",
            value === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {option.icon}
          </div>
          <span className="text-senior-xl font-semibold">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
