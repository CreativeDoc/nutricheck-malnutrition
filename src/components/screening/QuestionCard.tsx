import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
  size?: 'default' | 'medium';
}

export function QuestionCard({ 
  selected, 
  onClick, 
  children, 
  icon,
  className,
  variant = 'default',
  size = 'default'
}: QuestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "touch-card w-full relative",
        size === 'medium' && "min-h-[72px] p-4",
        selected ? "touch-card-selected" : "touch-card-unselected",
        variant === 'success' && selected && "border-success bg-success-light",
        variant === 'danger' && selected && "border-danger bg-danger-light",
        className
      )}
    >
      {selected && (
        <div className={cn(
          "absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center",
          size === 'default' && "top-4 right-4 w-8 h-8",
          variant === 'success' ? "bg-success" : variant === 'danger' ? "bg-danger" : "bg-primary"
        )}>
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
      {icon && (
        <div className={cn("mb-2", size === 'default' ? "text-5xl" : "text-3xl")}>{icon}</div>
      )}
      <span className={cn(
        "font-semibold text-foreground",
        size === 'default' ? "text-senior-lg" : "text-senior-base"
      )}>
        {children}
      </span>
    </button>
  );
}
