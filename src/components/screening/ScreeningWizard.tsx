import { useState } from 'react';
import { ScreeningAnswers, WizardStep, initialAnswers } from '@/types/screening';
import { calculateNRSScore, calculateAge } from '@/lib/nrsCalculator';
import { QuestionLayout } from './QuestionLayout';
import { QuestionCard } from './QuestionCard';
import { NumberPicker } from './NumberPicker';
import { PortionSelector } from './PortionSelector';

import { GenderSelector } from './GenderSelector';
import { FrequencySelector } from './FrequencySelector';
import { MealsPerDaySelector } from './MealsPerDaySelector';
import { DrinkingAmountSelector } from './DrinkingAmountSelector';
import { AcuteDiseaseSelector, ChronicDiseaseSelector } from './DiseaseSelector';
import { PhysicalConditionQuestions } from './PhysicalConditionQuestions';
import { ResultScreen } from './ResultScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [currentStep, setCurrentStep] = useState<WizardStep>('gender');
  const [result, setResult] = useState<ReturnType<typeof calculateNRSScore> | null>(null);

  const age = calculateAge(birthDate);

  const updateAnswer = <K extends keyof ScreeningAnswers>(
    key: K, 
    value: ScreeningAnswers[K]
  ) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const totalSteps = 23; // Updated for new steps

  const getStepNumber = (): number => {
    const stepOrder: WizardStep[] = [
      'gender', 'height', 'weight', 'normalWeight', 'weightLoss',
      'mealsPerDay', 'portionSize', 'appetiteByOthers',
      'fruitPerWeek', 'vegetablesPerWeek', 'sweetPreference', 'meatPerWeek', 'carbsPerWeek',
      'acuteDiseases', 'chronicDiseases', 'physicalCondition', 'drinkingAmount', 'swallowing',
      'medication', 'supplements', 'nutritionTherapy', 'infusions', 'nutritionCounseling'
    ];
    const index = stepOrder.indexOf(currentStep);
    return index >= 0 ? index + 1 : 1;
  };

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

  // Check if all physical condition questions are answered
  const physicalConditionComplete = 
    answers.feelsWeaker !== null &&
    answers.muscleLoss !== null &&
    answers.frequentInfections !== null &&
    answers.difficultyGettingUp !== null &&
    answers.shortnessOfBreath !== null;

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
    case 'gender':
      return (
        <QuestionLayout
          step={1}
          totalSteps={totalSteps}
          title="Welches Geschlecht haben Sie?"
          canGoBack={true}
          canGoNext={answers.gender !== null}
          onBack={onCancel}
          onNext={() => goNext('height')}
        >
          <GenderSelector
            value={answers.gender}
            onChange={(v) => updateAnswer('gender', v)}
          />
        </QuestionLayout>
      );

    case 'height':
      return (
        <QuestionLayout
          step={2}
          totalSteps={totalSteps}
          title="Wie groß sind Sie?"
          subtitle="Nutzen Sie die + und - Tasten"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('gender')}
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
          step={3}
          totalSteps={totalSteps}
          title="Wie viel wiegen Sie aktuell?"
          subtitle="Schätzen Sie, wenn Sie unsicher sind"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('height')}
          onNext={() => goNext('normalWeight')}
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
              label="Aktuelles Körpergewicht"
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

    case 'normalWeight':
      return (
        <QuestionLayout
          step={4}
          totalSteps={totalSteps}
          title="Wie ist Ihr Normalgewicht?"
          subtitle="Das Gewicht, bei dem Sie sich normalerweise wohlfühlen"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('weight')}
          onNext={() => goNext('weightLoss')}
        >
          <NumberPicker
            value={answers.normalWeight || answers.weight || 70}
            onChange={(v) => updateAnswer('normalWeight', v)}
            min={30}
            max={200}
            step={0.5}
            unit="kg"
            label="Normalgewicht"
          />
        </QuestionLayout>
      );

    case 'weightLoss':
      return (
        <QuestionLayout
          step={5}
          totalSteps={totalSteps}
          title="Haben Sie in den letzten 3 Monaten ungewollt abgenommen?"
          canGoBack={true}
          canGoNext={answers.hasWeightLoss !== null}
          onBack={() => goBack('normalWeight')}
          onNext={() => {
            if (answers.hasWeightLoss && !answers.weightUnknown) {
              goNext('weightLossAmount');
            } else if (answers.weightUnknown) {
              goNext('clothingLoose');
            } else {
              goNext('mealsPerDay');
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.hasWeightLoss === true}
              onClick={() => updateAnswer('hasWeightLoss', true)}
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.hasWeightLoss === false}
              onClick={() => updateAnswer('hasWeightLoss', false)}
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'weightLossAmount':
      return (
        <QuestionLayout
          step={6}
          totalSteps={totalSteps}
          title="Wie viel haben Sie abgenommen?"
          subtitle="In den letzten 3 Monaten"
          canGoBack={true}
          canGoNext={answers.weightLossAmount !== null}
          onBack={() => goBack('weightLoss')}
          onNext={() => goNext('mealsPerDay')}
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
          step={6}
          totalSteps={totalSteps}
          title="Ist Ihre Kleidung oder Ihr Schmuck in letzter Zeit weiter geworden?"
          subtitle="Dies hilft uns, Gewichtsverlust einzuschätzen"
          canGoBack={true}
          canGoNext={answers.clothingLoose !== null}
          onBack={() => goBack('weightLoss')}
          onNext={() => goNext('mealsPerDay')}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.clothingLoose === true}
              onClick={() => updateAnswer('clothingLoose', true)}
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.clothingLoose === false}
              onClick={() => updateAnswer('clothingLoose', false)}
            >
              Nein
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'mealsPerDay':
      return (
        <QuestionLayout
          step={7}
          totalSteps={totalSteps}
          title="Wie viele Mahlzeiten nehmen Sie am Tag zu sich?"
          canGoBack={true}
          canGoNext={answers.mealsPerDay !== null}
          onBack={() => {
            if (answers.weightUnknown) {
              goBack('clothingLoose');
            } else if (answers.hasWeightLoss) {
              goBack('weightLossAmount');
            } else {
              goBack('weightLoss');
            }
          }}
          onNext={() => goNext('portionSize')}
        >
          <MealsPerDaySelector
            value={answers.mealsPerDay}
            onChange={(v) => updateAnswer('mealsPerDay', v)}
          />
        </QuestionLayout>
      );

    case 'portionSize':
      return (
        <QuestionLayout
          step={8}
          totalSteps={totalSteps}
          title="Wie groß sind Ihre aktuellen Portionen?"
          subtitle="Wählen Sie den passenden Teller"
          canGoBack={true}
          canGoNext={answers.portionSize !== null}
          onBack={() => goBack('mealsPerDay')}
          onNext={() => goNext('appetiteByOthers')}
        >
          <PortionSelector
            value={answers.portionSize}
            onChange={(v) => updateAnswer('portionSize', v)}
          />
        </QuestionLayout>
      );

    case 'appetiteByOthers':
      return (
        <QuestionLayout
          step={9}
          totalSteps={totalSteps}
          title="Wie beurteilen Angehörige oder Freunde Ihren Appetit?"
          canGoBack={true}
          canGoNext={answers.appetiteByOthers !== null}
          onBack={() => goBack('portionSize')}
          onNext={() => goNext('fruitPerWeek')}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.appetiteByOthers === 'normal'}
              onClick={() => updateAnswer('appetiteByOthers', 'normal')}
            >
              Normal
            </QuestionCard>
            <QuestionCard
              selected={answers.appetiteByOthers === 'limited'}
              onClick={() => updateAnswer('appetiteByOthers', 'limited')}
            >
              Eingeschränkt
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'fruitPerWeek':
      return (
        <QuestionLayout
          step={10}
          totalSteps={totalSteps}
          title="Wie oft essen Sie Obst in der Woche?"
          canGoBack={true}
          canGoNext={answers.fruitPerWeek !== null}
          onBack={() => goBack('appetiteByOthers')}
          onNext={() => goNext('vegetablesPerWeek')}
        >
          <FrequencySelector
            value={answers.fruitPerWeek}
            onChange={(v) => updateAnswer('fruitPerWeek', v)}
            label="Anzahl pro Woche"
          />
        </QuestionLayout>
      );

    case 'vegetablesPerWeek':
      return (
        <QuestionLayout
          step={11}
          totalSteps={totalSteps}
          title="Wie oft essen Sie Gemüse in der Woche?"
          canGoBack={true}
          canGoNext={answers.vegetablesPerWeek !== null}
          onBack={() => goBack('fruitPerWeek')}
          onNext={() => goNext('sweetPreference')}
        >
          <FrequencySelector
            value={answers.vegetablesPerWeek}
            onChange={(v) => updateAnswer('vegetablesPerWeek', v)}
            label="Anzahl pro Woche"
          />
        </QuestionLayout>
      );

    case 'sweetPreference':
      return (
        <QuestionLayout
          step={12}
          totalSteps={totalSteps}
          title="Wie gern essen Sie Süßigkeiten?"
          canGoBack={true}
          canGoNext={answers.sweetPreference !== null}
          onBack={() => goBack('vegetablesPerWeek')}
          onNext={() => goNext('meatPerWeek')}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.sweetPreference === 'like'}
              onClick={() => updateAnswer('sweetPreference', 'like')}
            >
              Gern
            </QuestionCard>
            <QuestionCard
              selected={answers.sweetPreference === 'dislike'}
              onClick={() => updateAnswer('sweetPreference', 'dislike')}
            >
              Nicht so gern
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'meatPerWeek':
      return (
        <QuestionLayout
          step={13}
          totalSteps={totalSteps}
          title="Wie oft essen Sie Fleisch oder Wurstwaren in der Woche?"
          canGoBack={true}
          canGoNext={answers.meatPerWeek !== null}
          onBack={() => goBack('sweetPreference')}
          onNext={() => goNext('carbsPerWeek')}
        >
          <FrequencySelector
            value={answers.meatPerWeek}
            onChange={(v) => updateAnswer('meatPerWeek', v)}
            label="Anzahl pro Woche"
          />
        </QuestionLayout>
      );

    case 'carbsPerWeek':
      return (
        <QuestionLayout
          step={14}
          totalSteps={totalSteps}
          title="Wie oft essen Sie Kohlenhydrate?"
          subtitle="Kartoffeln, Reis, Nudeln, Hülsenfrüchte"
          canGoBack={true}
          canGoNext={answers.carbsPerWeek !== null}
          onBack={() => goBack('meatPerWeek')}
          onNext={() => goNext('acuteDiseases')}
        >
          <FrequencySelector
            value={answers.carbsPerWeek}
            onChange={(v) => updateAnswer('carbsPerWeek', v)}
            label="Anzahl pro Woche"
          />
        </QuestionLayout>
      );

    case 'acuteDiseases':
      return (
        <QuestionLayout
          step={15}
          totalSteps={totalSteps}
          title="Aktuelle Erkrankungen"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('carbsPerWeek')}
          onNext={() => goNext('chronicDiseases')}
        >
          <AcuteDiseaseSelector
            value={answers.acuteDiseases}
            onChange={(v) => updateAnswer('acuteDiseases', v)}
          />
        </QuestionLayout>
      );

    case 'chronicDiseases':
      return (
        <QuestionLayout
          step={16}
          totalSteps={totalSteps}
          title="Chronische Erkrankungen"
          canGoBack={true}
          canGoNext={true}
          onBack={() => goBack('acuteDiseases')}
          onNext={() => goNext('physicalCondition')}
        >
          <ChronicDiseaseSelector
            value={answers.chronicDiseases}
            onChange={(v) => updateAnswer('chronicDiseases', v)}
          />
        </QuestionLayout>
      );

    case 'physicalCondition':
      return (
        <QuestionLayout
          step={17}
          totalSteps={totalSteps}
          title="Ihr körperliches Befinden"
          canGoBack={true}
          canGoNext={physicalConditionComplete}
          onBack={() => goBack('chronicDiseases')}
          onNext={() => goNext('drinkingAmount')}
        >
          <PhysicalConditionQuestions
            answers={answers}
            onChange={updateAnswer}
          />
        </QuestionLayout>
      );

    case 'drinkingAmount':
      return (
        <QuestionLayout
          step={18}
          totalSteps={totalSteps}
          title="Wie viel trinken Sie am Tag?"
          canGoBack={true}
          canGoNext={answers.drinkingAmount !== null}
          onBack={() => goBack('physicalCondition')}
          onNext={() => goNext('swallowing')}
        >
          <DrinkingAmountSelector
            value={answers.drinkingAmount}
            onChange={(v) => updateAnswer('drinkingAmount', v)}
          />
        </QuestionLayout>
      );

    case 'swallowing':
      return (
        <QuestionLayout
          step={19}
          totalSteps={totalSteps}
          title="Haben Sie Schluckbeschwerden?"
          subtitle="z.B. bei Entzündungen, durch Strahlentherapie, nach Operationen"
          canGoBack={true}
          canGoNext={answers.hasSwallowingIssues !== null}
          onBack={() => goBack('drinkingAmount')}
          onNext={() => goNext('medication')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.hasSwallowingIssues === true}
                onClick={() => updateAnswer('hasSwallowingIssues', true)}
              >
                Ja
              </QuestionCard>
              <QuestionCard
                selected={answers.hasSwallowingIssues === false}
                onClick={() => updateAnswer('hasSwallowingIssues', false)}
              >
                Nein
              </QuestionCard>
            </div>
            {answers.hasSwallowingIssues && (
              <Input
                placeholder="Welche Art von Beschwerden?"
                value={answers.swallowingDetails || ''}
                onChange={(e) => updateAnswer('swallowingDetails', e.target.value)}
                className="text-senior-base h-14"
              />
            )}
          </div>
        </QuestionLayout>
      );

    case 'medication':
      return (
        <QuestionLayout
          step={20}
          totalSteps={totalSteps}
          title="Nehmen Sie regelmäßig Medikamente ein?"
          canGoBack={true}
          canGoNext={answers.takesMedication !== null}
          onBack={() => goBack('swallowing')}
          onNext={() => goNext('supplements')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.takesMedication === true}
                onClick={() => updateAnswer('takesMedication', true)}
              >
                Ja
              </QuestionCard>
              <QuestionCard
                selected={answers.takesMedication === false}
                onClick={() => updateAnswer('takesMedication', false)}
              >
                Nein
              </QuestionCard>
            </div>
            {answers.takesMedication && (
              <Textarea
                placeholder="Welche Medikamente nehmen Sie ein?"
                value={answers.medicationDetails || ''}
                onChange={(e) => updateAnswer('medicationDetails', e.target.value)}
                className="text-senior-base min-h-[100px]"
              />
            )}
          </div>
        </QuestionLayout>
      );

    case 'supplements':
      return (
        <QuestionLayout
          step={21}
          totalSteps={totalSteps}
          title="Haben Sie Erfahrungen mit Nahrungsergänzungsmitteln?"
          canGoBack={true}
          canGoNext={answers.hasSupplementExperience !== null}
          onBack={() => goBack('medication')}
          onNext={() => goNext('nutritionTherapy')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.hasSupplementExperience === true}
                onClick={() => updateAnswer('hasSupplementExperience', true)}
              >
                Ja
              </QuestionCard>
              <QuestionCard
                selected={answers.hasSupplementExperience === false}
                onClick={() => updateAnswer('hasSupplementExperience', false)}
              >
                Nein
              </QuestionCard>
            </div>
            {answers.hasSupplementExperience && (
              <Textarea
                placeholder="Welche Nahrungsergänzungsmittel haben Sie verwendet?"
                value={answers.supplementDetails || ''}
                onChange={(e) => updateAnswer('supplementDetails', e.target.value)}
                className="text-senior-base min-h-[100px]"
              />
            )}
          </div>
        </QuestionLayout>
      );

    case 'nutritionTherapy':
      return (
        <QuestionLayout
          step={22}
          totalSteps={totalSteps}
          title="Hatten Sie schon mal eine Ernährungstherapie?"
          subtitle="z.B. verschreibungspflichtige Produkte wie Fresubin"
          canGoBack={true}
          canGoNext={answers.hadNutritionTherapy !== null}
          onBack={() => goBack('supplements')}
          onNext={() => goNext('infusions')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.hadNutritionTherapy === true}
                onClick={() => updateAnswer('hadNutritionTherapy', true)}
              >
                Ja
              </QuestionCard>
              <QuestionCard
                selected={answers.hadNutritionTherapy === false}
                onClick={() => updateAnswer('hadNutritionTherapy', false)}
              >
                Nein
              </QuestionCard>
            </div>
            {answers.hadNutritionTherapy && (
              <Textarea
                placeholder="Welche Produkte oder Therapien?"
                value={answers.nutritionTherapyDetails || ''}
                onChange={(e) => updateAnswer('nutritionTherapyDetails', e.target.value)}
                className="text-senior-base min-h-[100px]"
              />
            )}
          </div>
        </QuestionLayout>
      );

    case 'infusions':
      return (
        <QuestionLayout
          step={23}
          totalSteps={totalSteps}
          title="Hatten Sie schon mal Infusionen mit Nährstoffen erhalten?"
          canGoBack={true}
          canGoNext={answers.hadNutrientInfusions !== null}
          onBack={() => goBack('nutritionTherapy')}
          onNext={() => goNext('nutritionCounseling')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.hadNutrientInfusions === true}
                onClick={() => updateAnswer('hadNutrientInfusions', true)}
              >
                Ja
              </QuestionCard>
              <QuestionCard
                selected={answers.hadNutrientInfusions === false}
                onClick={() => updateAnswer('hadNutrientInfusions', false)}
              >
                Nein
              </QuestionCard>
            </div>
            {answers.hadNutrientInfusions && (
              <Textarea
                placeholder="Welche Infusionen und wie oft?"
                value={answers.infusionDetails || ''}
                onChange={(e) => updateAnswer('infusionDetails', e.target.value)}
                className="text-senior-base min-h-[100px]"
              />
            )}
          </div>
        </QuestionLayout>
      );

    case 'nutritionCounseling':
      return (
        <QuestionLayout
          step={24}
          totalSteps={totalSteps}
          title="Wünschen Sie eine Ernährungsberatung / Ernährungstherapie?"
          canGoBack={true}
          canGoNext={answers.wantsNutritionCounseling !== null}
          isLastStep={true}
          onBack={() => goBack('infusions')}
          onNext={finishScreening}
        >
          <div className="grid grid-cols-2 gap-4">
            <QuestionCard
              selected={answers.wantsNutritionCounseling === true}
              onClick={() => updateAnswer('wantsNutritionCounseling', true)}
            >
              Ja
            </QuestionCard>
            <QuestionCard
              selected={answers.wantsNutritionCounseling === false}
              onClick={() => updateAnswer('wantsNutritionCounseling', false)}
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
