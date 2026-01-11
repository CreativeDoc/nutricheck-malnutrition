import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
}

export function WizardNavigation({
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  nextLabel,
}: WizardNavigationProps) {
  return (
    <div className="flex gap-4 mt-8">
      {canGoBack && onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="btn-xl flex-1 gap-3"
        >
          <ArrowLeft className="w-6 h-6" />
          Zurück
        </Button>
      )}

      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            "btn-xl flex-1 gap-3",
            isLastStep && "bg-success hover:bg-success/90"
          )}
        >
          {nextLabel || (isLastStep ? 'Ergebnis anzeigen' : 'Weiter')}
          {isLastStep ? (
            <Check className="w-6 h-6" />
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </Button>
      )}
    </div>
  );
}
