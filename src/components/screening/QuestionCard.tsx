import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
  size?: 'default' | 'medium' | 'compact';
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
        "w-full relative rounded-xl border-2 transition-all duration-200 flex items-center justify-center",
        size === 'default' && "min-h-[60px] p-3",
        size === 'medium' && "min-h-[52px] p-2.5",
        size === 'compact' && "min-h-[44px] p-2",
        selected 
          ? "ring-2 ring-primary border-primary bg-primary/10" 
          : "border-border bg-card hover:bg-muted/50",
        variant === 'success' && selected && "ring-success border-success bg-success/10",
        variant === 'danger' && selected && "ring-danger border-danger bg-danger/10",
        className
      )}
    >
      {selected && (
        <div className={cn(
          "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
          variant === 'success' ? "bg-success" : variant === 'danger' ? "bg-danger" : "bg-primary"
        )}>
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {icon && (
        <div className={cn("mr-2", size === 'compact' ? "text-xl" : "text-2xl")}>{icon}</div>
      )}
      <span className={cn(
        "font-semibold text-foreground",
        size === 'compact' ? "text-base" : "text-lg"
      )}>
        {children}
      </span>
    </button>
  );
}
