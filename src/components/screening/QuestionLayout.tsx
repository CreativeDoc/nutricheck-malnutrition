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
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {/* Header with Progress */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <WizardProgress currentStep={step} totalSteps={totalSteps} />
      </header>

      {/* Question Content */}
      <main className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-senior-2xl font-bold text-foreground mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-senior-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>

        <WizardNavigation
          onBack={onBack}
          onNext={onNext}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLastStep={isLastStep}
          nextLabel={nextLabel}
        />
      </main>
    </div>
  );
}
