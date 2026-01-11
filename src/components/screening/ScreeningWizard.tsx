import { useState, useEffect } from 'react';
import { ScreeningAnswers, WizardStep, initialAnswers } from '@/types/screening';
import { calculateNRSScore, calculateAge } from '@/lib/nrsCalculator';
import { QuestionLayout } from './QuestionLayout';
import { QuestionCard } from './QuestionCard';
import { NumberPicker } from './NumberPicker';
import { PortionSelector } from './PortionSelector';
import { MobilitySelector } from './MobilitySelector';
import { ResultScreen } from './ResultScreen';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface ScreeningWizardProps {
  patientCode: string;
  birthDate: string;
  onComplete: (result: ReturnType<typeof calculateNRSScore>) => void;
  onCancel: () => void;
}

export function ScreeningWizard({ 
  patientCode, 
  birthDate, 
  onComplete,
  onCancel 
}: ScreeningWizardProps) {
  const [answers, setAnswers] = useState<ScreeningAnswers>({
    ...initialAnswers,
    birthDate,
  });
  const [currentStep, setCurrentStep] = useState<WizardStep>('height');
  const [result, setResult] = useState<ReturnType<typeof calculateNRSScore> | null>(null);

  const age = calculateAge(birthDate);

  const updateAnswer = <K extends keyof ScreeningAnswers>(
    key: K, 
    value: ScreeningAnswers[K]
  ) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const getStepNumber = (): number => {
    const steps: WizardStep[] = [
      'height', 'weight', 'weightLoss', 
      answers.weightUnknown ? 'clothingLoose' : 'weightLossAmount',
      'eating', 'portionSize', 'mobility', 'swallowing', 'acuteIllness'
    ];
    return steps.indexOf(currentStep) + 1;
  };

  const totalSteps = 8;

  const goNext = (nextStep: WizardStep) => {
    setCurrentStep(nextStep);
  };

  const goBack = (prevStep: WizardStep) => {
    setCurrentStep(prevStep);
  };

  const finishScreening = () => {
    const calculatedResult = calculateNRSScore(answers, patientCode);
    setResult(calculatedResult);
    onComplete(calculatedResult);
  };

  if (result) {
    return (
      <ResultScreen
        result={result}
        onNewScreening={onCancel}
        onBackToDashboard={onCancel}
      />
    );
  }

  switch (currentStep) {
    case 'height':
      return (
        <QuestionLayout
          step={1}
          totalSteps={totalSteps}
          title="Wie groß sind Sie?"
          subtitle="Nutzen Sie die + und - Tasten"
          canGoBack={true}
          canGoNext={true}
          onBack={onCancel}
          onNext={() => goNext('weight')}
        >
          <NumberPicker
            value={answers.height || 165}
            onChange={(v) => updateAnswer('height', v)}
            min={100}
            max={220}
            step={1}
            unit="cm"
            label="Körpergröße"
          />
        </QuestionLayout>
      );

    case 'weight':
      return (
        <QuestionLayout
          step={2}
          totalSteps={totalSteps}
          title="Wie viel wiegen Sie?"
          subtitle="Schätzen Sie, wenn Sie unsicher sind"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('height')}
          onNext={() => goNext('weightLoss')}
        >
          <div className="space-y-6">
            <NumberPicker
              value={answers.weight || 70}
              onChange={(v) => {
                updateAnswer('weight', v);
                updateAnswer('weightUnknown', false);
              }}
              min={30}
              max={200}
              step={0.5}
              unit="kg"
              label="Körpergewicht"
            />
            <Button
              variant={answers.weightUnknown ? "default" : "outline"}
              onClick={() => {
                updateAnswer('weightUnknown', true);
                updateAnswer('weight', null);
              }}
              className="btn-xl w-full gap-3"
            >
              <HelpCircle className="w-6 h-6" />
              Ich weiß es nicht
            </Button>
          </div>
        </QuestionLayout>
      );

    case 'weightLoss':
      return (
        <QuestionLayout
          step={3}
          totalSteps={totalSteps}
          title="Haben Sie in den letzten 3 Monaten ungewollt abgenommen?"
          canGoBack={true}
          canGoNext={answers.hasWeightLoss !== null}
          onBack={() => goBack('weight')}
          onNext={() => {
            if (answers.hasWeightLoss && !answers.weightUnknown) {
              goNext('weightLossAmount');
            } else if (answers.weightUnknown) {
              goNext('clothingLoose');
            } else {
              goNext('eating');
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.hasWeightLoss === true}
              onClick={() => updateAnswer('hasWeightLoss', true)}
              variant="danger"
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.hasWeightLoss === false}
              onClick={() => updateAnswer('hasWeightLoss', false)}
              variant="success"
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'weightLossAmount':
      return (
        <QuestionLayout
          step={4}
          totalSteps={totalSteps}
          title="Wie viel haben Sie abgenommen?"
          subtitle="In den letzten 3 Monaten"
          canGoBack={true}
          canGoNext={answers.weightLossAmount !== null}
          onBack={() => goBack('weightLoss')}
          onNext={() => goNext('eating')}
        >
          <div className="flex flex-col gap-4">
            {(['1-3kg', '3-6kg', '>6kg'] as const).map((amount) => (
              <QuestionCard
                key={amount}
                selected={answers.weightLossAmount === amount}
                onClick={() => updateAnswer('weightLossAmount', amount)}
              >
                {amount === '1-3kg' && '1 bis 3 kg'}
                {amount === '3-6kg' && '3 bis 6 kg'}
                {amount === '>6kg' && 'Mehr als 6 kg'}
              </QuestionCard>
            ))}
          </div>
        </QuestionLayout>
      );

    case 'clothingLoose':
      return (
        <QuestionLayout
          step={4}
          totalSteps={totalSteps}
          title="Ist Ihre Kleidung oder Ihr Schmuck in letzter Zeit weiter geworden?"
          subtitle="Dies hilft uns, Gewichtsverlust einzuschätzen"
          canGoBack={true}
          canGoNext={answers.clothingLoose !== null}
          onBack={() => goBack('weightLoss')}
          onNext={() => goNext('eating')}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.clothingLoose === true}
              onClick={() => updateAnswer('clothingLoose', true)}
              variant="danger"
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.clothingLoose === false}
              onClick={() => updateAnswer('clothingLoose', false)}
              variant="success"
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'eating':
      return (
        <QuestionLayout
          step={5}
          totalSteps={totalSteps}
          title="Haben Sie in der letzten Woche weniger gegessen als üblich?"
          canGoBack={true}
          canGoNext={answers.hasReducedEating !== null}
          onBack={() => {
            if (answers.weightUnknown) {
              goBack('clothingLoose');
            } else if (answers.hasWeightLoss) {
              goBack('weightLossAmount');
            } else {
              goBack('weightLoss');
            }
          }}
          onNext={() => {
            if (answers.hasReducedEating) {
              goNext('portionSize');
            } else {
              goNext('mobility');
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.hasReducedEating === true}
              onClick={() => updateAnswer('hasReducedEating', true)}
              variant="danger"
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.hasReducedEating === false}
              onClick={() => updateAnswer('hasReducedEating', false)}
              variant="success"
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'portionSize':
      return (
        <QuestionLayout
          step={6}
          totalSteps={totalSteps}
          title="Wie viel haben Sie im Vergleich zu früher gegessen?"
          subtitle="Wählen Sie den passenden Teller"
          canGoBack={true}
          canGoNext={answers.portionSize !== null}
          onBack={() => goBack('eating')}
          onNext={() => goNext('mobility')}
        >
          <PortionSelector
            value={answers.portionSize}
            onChange={(v) => updateAnswer('portionSize', v)}
          />
        </QuestionLayout>
      );

    case 'mobility':
      return (
        <QuestionLayout
          step={7}
          totalSteps={totalSteps}
          title="Wie gut können Sie sich bewegen?"
          canGoBack={true}
          canGoNext={answers.mobilityLevel !== null}
          onBack={() => {
            if (answers.hasReducedEating) {
              goBack('portionSize');
            } else {
              goBack('eating');
            }
          }}
          onNext={() => goNext('swallowing')}
        >
          <MobilitySelector
            value={answers.mobilityLevel}
            onChange={(v) => updateAnswer('mobilityLevel', v)}
          />
        </QuestionLayout>
      );

    case 'swallowing':
      return (
        <QuestionLayout
          step={8}
          totalSteps={totalSteps}
          title="Haben Sie Schluckbeschwerden oder kauen Sie schlecht?"
          canGoBack={true}
          canGoNext={answers.hasSwallowingIssues !== null}
          onBack={() => goBack('mobility')}
          onNext={() => goNext('acuteIllness')}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.hasSwallowingIssues === true}
              onClick={() => updateAnswer('hasSwallowingIssues', true)}
              variant="danger"
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.hasSwallowingIssues === false}
              onClick={() => updateAnswer('hasSwallowingIssues', false)}
              variant="success"
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'acuteIllness':
      return (
        <QuestionLayout
          step={8}
          totalSteps={totalSteps}
          title="Wurden Sie gerade operiert oder haben eine schwere Infektion?"
          subtitle="Z.B. Lungenentzündung, große OP"
          canGoBack={true}
          canGoNext={answers.hasAcuteIllness !== null}
          isLastStep={true}
          onBack={() => goBack('swallowing')}
          onNext={finishScreening}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.hasAcuteIllness === true}
              onClick={() => updateAnswer('hasAcuteIllness', true)}
              variant="danger"
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.hasAcuteIllness === false}
              onClick={() => updateAnswer('hasAcuteIllness', false)}
              variant="success"
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    default:
      return null;
  }
}
