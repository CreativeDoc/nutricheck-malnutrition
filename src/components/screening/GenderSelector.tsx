import { Gender } from '@/types/screening';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface GenderSelectorProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const { t } = useTranslation();

  const genderOptions: { value: Gender; label: string; icon: React.ReactNode }[] = [
    { 
      value: 'male', 
      label: t.male,
      icon: <User className="w-12 h-12" />
    },
    { 
      value: 'female', 
      label: t.female,
      icon: <User className="w-12 h-12" />
    },
    { 
      value: 'diverse', 
      label: t.diverse,
      icon: <Users className="w-12 h-12" />
    },
  ];

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {genderOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2",
            "transition-all duration-200",
            value === option.value
              ? "ring-2 ring-primary bg-primary/10 border-primary"
              : "border-border bg-card hover:bg-muted/50"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full",
            value === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-base md:text-lg font-semibold">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
