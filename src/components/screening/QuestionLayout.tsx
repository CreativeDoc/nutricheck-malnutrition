import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { cn } from '@/lib/utils';

interface QuestionLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
  className?: string;
}

export function QuestionLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  nextLabel,
  className,
}: QuestionLayoutProps) {
  return (
    <div
      className={cn("flex flex-col bg-background overflow-hidden", className)}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Header with Progress — always visible */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 pt-12 pb-2">
        <WizardProgress currentStep={step} totalSteps={totalSteps} />
      </header>

      {/* Question Content */}
      <main className="flex-1 flex flex-col px-4 py-2 md:py-3 lg:py-4 max-w-2xl mx-auto w-full min-h-0">
        <div className="text-center mb-2 md:mb-3 flex-shrink-0">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-0.5 md:mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable content area — only this scrolls if needed */}
        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto overflow-x-visible px-1 -mx-1">
          <div className="py-1">
            {children}
          </div>
        </div>

        {/* Navigation — always visible */}
        <div className="flex-shrink-0 pt-2 pb-1">
          <WizardNavigation
            onBack={onBack}
            onNext={onNext}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
            nextLabel={nextLabel}
          />
        </div>
      </main>
    </div>
  );
}
