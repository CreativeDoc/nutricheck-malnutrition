import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
}

export function QuestionCard({ 
  selected, 
  onClick, 
  children, 
  icon,
  className,
  variant = 'default'
}: QuestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "touch-card w-full relative",
        selected ? "touch-card-selected" : "touch-card-unselected",
        variant === 'success' && selected && "border-success bg-success-light",
        variant === 'danger' && selected && "border-danger bg-danger-light",
        className
      )}
    >
      {selected && (
        <div className={cn(
          "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center",
          variant === 'success' ? "bg-success" : variant === 'danger' ? "bg-danger" : "bg-primary"
        )}>
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
      {icon && (
        <div className="text-5xl mb-2">{icon}</div>
      )}
      <span className="text-senior-lg font-semibold text-foreground">
        {children}
      </span>
    </button>
  );
}
