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
    <div className="flex gap-3">
      {canGoBack && onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 gap-2 h-12 text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück
        </Button>
      )}

      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            "flex-1 gap-2 h-12 text-base",
            isLastStep && "bg-success hover:bg-success/90"
          )}
        >
          {nextLabel || (isLastStep ? 'Ergebnis anzeigen' : 'Weiter')}
          {isLastStep ? (
            <Check className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </Button>
      )}
    </div>
  );
}
