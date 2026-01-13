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
    <div className={cn("h-screen max-h-screen flex flex-col bg-background overflow-hidden", className)}>
      {/* Header with Progress */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2">
        <WizardProgress currentStep={step} totalSteps={totalSteps} />
      </header>

      {/* Question Content */}
      <main className="flex-1 flex flex-col px-4 py-3 max-w-2xl mx-auto w-full min-h-0">
        <div className="text-center mb-3 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto overflow-x-visible px-1 -mx-1">
          <div className="py-1">
            {children}
          </div>
        </div>

        <div className="flex-shrink-0 pt-2">
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
