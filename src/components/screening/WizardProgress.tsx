import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function WizardProgress({ currentStep, totalSteps, className }: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-2 text-senior text-muted-foreground">
        <span>Schritt {currentStep} von {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="wizard-progress">
        <div 
          className="wizard-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
