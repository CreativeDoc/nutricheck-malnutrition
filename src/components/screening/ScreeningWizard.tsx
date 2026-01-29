import { useState } from 'react';
import { ScreeningAnswers, WizardStep, initialAnswers, PatientLanguage } from '@/types/screening';
import { calculateNRSScore, calculateAge } from '@/lib/nrsCalculator';
import { QuestionLayout } from './QuestionLayout';
import { QuestionCard } from './QuestionCard';
import { NumberPicker } from './NumberPicker';
import { PortionSelector } from './PortionSelector';
import { TranslationProvider } from './TranslationProvider';
import { useTranslation } from '@/hooks/useTranslation';

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
  language?: PatientLanguage;
  onComplete: (result: ReturnType<typeof calculateNRSScore>) => void;
  onCancel: () => void;
}

function ScreeningWizardContent({ 
  patientCode, 
  birthDate, 
  onComplete,
  onCancel 
}: Omit<ScreeningWizardProps, 'language'>) {
  const { t } = useTranslation();
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

  const totalSteps = 22;

  const getStepNumber = (): number => {
    const stepOrder: WizardStep[] = [
      'gender', 'height', 'weight', 'normalWeight', 'weightLoss',
      'mealsPerDay', 'portionSize', 'appetiteByOthers',
      'fruitPerWeek', 'vegetablesPerWeek', 'sweetPreference', 'meatPerWeek', 'carbsPerWeek',
      'acuteDiseases', 'chronicDiseases', 'physicalCondition', 'drinkingAmount', 'swallowing',
      'medication', 'supplements', 'nutritionTherapy', 'infusions'
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

  const handleCounselingChoiceUpdate = (wantsCounseling: boolean) => {
    setAnswers(prev => ({ ...prev, wantsNutritionCounseling: wantsCounseling }));
    if (result) {
      const updatedResult = {
        ...result,
        answers: { ...result.answers, wantsNutritionCounseling: wantsCounseling }
      };
      setResult(updatedResult);
      onComplete(updatedResult);
    }
  };

  if (result) {
    return (
      <ResultScreen
        result={result}
        onNewScreening={onCancel}
        onBackToDashboard={onCancel}
        onUpdateCounselingChoice={handleCounselingChoiceUpdate}
      />
    );
  }

  switch (currentStep) {
    case 'gender':
      return (
        <QuestionLayout
          step={1}
          totalSteps={totalSteps}
          title={t.genderQuestion}
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
          title={t.heightQuestion}
          subtitle={t.heightSubtitle}
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
            unit={t.heightUnit}
            label={t.heightLabel}
          />
        </QuestionLayout>
      );

    case 'weight':
      return (
        <QuestionLayout
          step={3}
          totalSteps={totalSteps}
          title={t.weightQuestion}
          subtitle={t.weightSubtitle}
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
              unit={t.weightUnit}
              label={t.weightLabel}
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
              {t.weightUnknown}
            </Button>
          </div>
        </QuestionLayout>
      );

    case 'normalWeight':
      return (
        <QuestionLayout
          step={4}
          totalSteps={totalSteps}
          title={t.normalWeightQuestion}
          subtitle={t.normalWeightSubtitle}
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
            unit={t.weightUnit}
            label={t.normalWeightLabel}
          />
        </QuestionLayout>
      );

    case 'weightLoss':
      return (
        <QuestionLayout
          step={5}
          totalSteps={totalSteps}
          title={t.weightLossQuestion}
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
              {t.yes}
            </QuestionCard>
            <QuestionCard
              selected={answers.hasWeightLoss === false}
              onClick={() => updateAnswer('hasWeightLoss', false)}
            >
              {t.no}
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'weightLossAmount':
      return (
        <QuestionLayout
          step={6}
          totalSteps={totalSteps}
          title={t.weightLossAmountQuestion}
          subtitle={t.weightLossAmountSubtitle}
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
                {amount === '1-3kg' && t.weightLoss1to3}
                {amount === '3-6kg' && t.weightLoss3to6}
                {amount === '>6kg' && t.weightLossOver6}
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
          title={t.clothingLooseQuestion}
          subtitle={t.clothingLooseSubtitle}
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
              {t.yes}
            </QuestionCard>
            <QuestionCard
              selected={answers.clothingLoose === false}
              onClick={() => updateAnswer('clothingLoose', false)}
            >
              {t.no}
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'mealsPerDay':
      return (
        <QuestionLayout
          step={7}
          totalSteps={totalSteps}
          title={t.mealsPerDayQuestion}
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
          title={t.portionSizeQuestion}
          subtitle={t.portionSizeSubtitle}
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
          title={t.appetiteQuestion}
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
              {t.appetiteNormal}
            </QuestionCard>
            <QuestionCard
              selected={answers.appetiteByOthers === 'limited'}
              onClick={() => updateAnswer('appetiteByOthers', 'limited')}
            >
              {t.appetiteLimited}
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'fruitPerWeek':
      return (
        <QuestionLayout
          step={10}
          totalSteps={totalSteps}
          title={t.fruitQuestion}
          canGoBack={true}
          canGoNext={answers.fruitPerWeek !== null}
          onBack={() => goBack('appetiteByOthers')}
          onNext={() => goNext('vegetablesPerWeek')}
        >
          <FrequencySelector
            value={answers.fruitPerWeek}
            onChange={(v) => updateAnswer('fruitPerWeek', v)}
            label={t.frequencyLabel}
          />
        </QuestionLayout>
      );

    case 'vegetablesPerWeek':
      return (
        <QuestionLayout
          step={11}
          totalSteps={totalSteps}
          title={t.vegetablesQuestion}
          canGoBack={true}
          canGoNext={answers.vegetablesPerWeek !== null}
          onBack={() => goBack('fruitPerWeek')}
          onNext={() => goNext('sweetPreference')}
        >
          <FrequencySelector
            value={answers.vegetablesPerWeek}
            onChange={(v) => updateAnswer('vegetablesPerWeek', v)}
            label={t.frequencyLabel}
          />
        </QuestionLayout>
      );

    case 'sweetPreference':
      return (
        <QuestionLayout
          step={12}
          totalSteps={totalSteps}
          title={t.sweetQuestion}
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
              {t.sweetLike}
            </QuestionCard>
            <QuestionCard
              selected={answers.sweetPreference === 'dislike'}
              onClick={() => updateAnswer('sweetPreference', 'dislike')}
            >
              {t.sweetDislike}
            </QuestionCard>
          </div>
        </QuestionLayout>
      );

    case 'meatPerWeek':
      return (
        <QuestionLayout
          step={13}
          totalSteps={totalSteps}
          title={t.meatQuestion}
          canGoBack={true}
          canGoNext={answers.meatPerWeek !== null}
          onBack={() => goBack('sweetPreference')}
          onNext={() => goNext('carbsPerWeek')}
        >
          <FrequencySelector
            value={answers.meatPerWeek}
            onChange={(v) => updateAnswer('meatPerWeek', v)}
            label={t.frequencyLabel}
          />
        </QuestionLayout>
      );

    case 'carbsPerWeek':
      return (
        <QuestionLayout
          step={14}
          totalSteps={totalSteps}
          title={t.carbsQuestion}
          subtitle={t.carbsSubtitle}
          canGoBack={true}
          canGoNext={answers.carbsPerWeek !== null}
          onBack={() => goBack('meatPerWeek')}
          onNext={() => goNext('acuteDiseases')}
        >
          <FrequencySelector
            value={answers.carbsPerWeek}
            onChange={(v) => updateAnswer('carbsPerWeek', v)}
            label={t.frequencyLabel}
          />
        </QuestionLayout>
      );

    case 'acuteDiseases':
      return (
        <QuestionLayout
          step={15}
          totalSteps={totalSteps}
          title={t.acuteDiseasesTitle}
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
          title={t.chronicDiseasesTitle}
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
          title={t.physicalConditionTitle}
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
          title={t.drinkingQuestion}
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
          title={t.swallowingQuestion}
          subtitle={t.swallowingSubtitle}
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
                {t.yes}
              </QuestionCard>
              <QuestionCard
                selected={answers.hasSwallowingIssues === false}
                onClick={() => updateAnswer('hasSwallowingIssues', false)}
              >
                {t.no}
              </QuestionCard>
            </div>
            {answers.hasSwallowingIssues && (
              <Input
                placeholder={t.swallowingDetailsPlaceholder}
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
          title={t.medicationQuestion}
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
                {t.yes}
              </QuestionCard>
              <QuestionCard
                selected={answers.takesMedication === false}
                onClick={() => updateAnswer('takesMedication', false)}
              >
                {t.no}
              </QuestionCard>
            </div>
            {answers.takesMedication && (
              <Textarea
                placeholder={t.medicationPlaceholder}
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
          title={t.supplementsQuestion}
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
                {t.yes}
              </QuestionCard>
              <QuestionCard
                selected={answers.hasSupplementExperience === false}
                onClick={() => updateAnswer('hasSupplementExperience', false)}
              >
                {t.no}
              </QuestionCard>
            </div>
            {answers.hasSupplementExperience && (
              <Textarea
                placeholder={t.supplementsPlaceholder}
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
          title={t.nutritionTherapyQuestion}
          subtitle={t.nutritionTherapySubtitle}
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
                {t.yes}
              </QuestionCard>
              <QuestionCard
                selected={answers.hadNutritionTherapy === false}
                onClick={() => updateAnswer('hadNutritionTherapy', false)}
              >
                {t.no}
              </QuestionCard>
            </div>
            {answers.hadNutritionTherapy && (
              <Textarea
                placeholder={t.nutritionTherapyPlaceholder}
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
          step={22}
          totalSteps={totalSteps}
          title={t.infusionsQuestion}
          canGoBack={true}
          canGoNext={answers.hadNutrientInfusions !== null}
          isLastStep={true}
          onBack={() => goBack('nutritionTherapy')}
          onNext={finishScreening}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <QuestionCard
                selected={answers.hadNutrientInfusions === true}
                onClick={() => updateAnswer('hadNutrientInfusions', true)}
              >
                {t.yes}
              </QuestionCard>
              <QuestionCard
                selected={answers.hadNutrientInfusions === false}
                onClick={() => updateAnswer('hadNutrientInfusions', false)}
              >
                {t.no}
              </QuestionCard>
            </div>
            {answers.hadNutrientInfusions && (
              <Textarea
                placeholder={t.infusionsPlaceholder}
                value={answers.infusionDetails || ''}
                onChange={(e) => updateAnswer('infusionDetails', e.target.value)}
                className="text-senior-base min-h-[100px]"
              />
            )}
          </div>
        </QuestionLayout>
      );

    default:
      return null;
  }
}

export function ScreeningWizard({ 
  patientCode, 
  birthDate, 
  language = 'de',
  onComplete,
  onCancel 
}: ScreeningWizardProps) {
  return (
    <TranslationProvider language={language}>
      <ScreeningWizardContent
        patientCode={patientCode}
        birthDate={birthDate}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </TranslationProvider>
  );
}
