import { CurrentDiseases } from '@/types/screening';
import { QuestionCard } from './QuestionCard';
import { Input } from '@/components/ui/input';

interface DiseaseSelectorProps {
  value: CurrentDiseases;
  onChange: (value: CurrentDiseases) => void;
}

export function DiseaseSelector({ value, onChange }: DiseaseSelectorProps) {
  const updateDisease = (key: keyof CurrentDiseases, newValue: boolean | string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-6">
      <p className="text-senior-lg text-muted-foreground text-center mb-6">
        Bitte beantworten Sie für jede Erkrankung, ob diese bei Ihnen vorliegt.
      </p>
      
      {/* Cancer */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">Haben Sie Krebs?</p>
        <div className="grid grid-cols-2 gap-4">
          <QuestionCard
            selected={value.cancer === true}
            onClick={() => updateDisease('cancer', true)}
            size="medium"
          >
            Ja
          </QuestionCard>
          <QuestionCard
            selected={value.cancer === false}
            onClick={() => updateDisease('cancer', false)}
            size="medium"
          >
            Nein
          </QuestionCard>
        </div>
        {value.cancer && (
          <Input
            placeholder="Welche Art von Krebs?"
            value={value.cancerType || ''}
            onChange={(e) => updateDisease('cancerType', e.target.value)}
            className="text-senior-base h-14 mt-2"
          />
        )}
      </div>

      {/* Pneumonia */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">Haben Sie eine Lungenentzündung?</p>
        <div className="grid grid-cols-2 gap-4">
          <QuestionCard
            selected={value.pneumonia === true}
            onClick={() => updateDisease('pneumonia', true)}
            size="medium"
          >
            Ja
          </QuestionCard>
          <QuestionCard
            selected={value.pneumonia === false}
            onClick={() => updateDisease('pneumonia', false)}
            size="medium"
          >
            Nein
          </QuestionCard>
        </div>
      </div>

      {/* Heart Failure */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">Haben Sie eine schwere Herzinsuffizienz?</p>
        <div className="grid grid-cols-2 gap-4">
          <QuestionCard
            selected={value.heartFailure === true}
            onClick={() => updateDisease('heartFailure', true)}
            size="medium"
          >
            Ja
          </QuestionCard>
          <QuestionCard
            selected={value.heartFailure === false}
            onClick={() => updateDisease('heartFailure', false)}
            size="medium"
          >
            Nein
          </QuestionCard>
        </div>
      </div>

      {/* Stroke */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">Hatten Sie einen Schlaganfall?</p>
        <div className="grid grid-cols-2 gap-4">
          <QuestionCard
            selected={value.stroke === true}
            onClick={() => updateDisease('stroke', true)}
            size="medium"
          >
            Ja
          </QuestionCard>
          <QuestionCard
            selected={value.stroke === false}
            onClick={() => updateDisease('stroke', false)}
            size="medium"
          >
            Nein
          </QuestionCard>
        </div>
      </div>

      {/* Digestive Issues */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">
          Haben Sie eine eingeschränkte Verdauungsleistung?
        </p>
        <p className="text-senior-base text-muted-foreground text-center">
          z.B. chron. entzündliche Darmerkrankungen, Durchfälle, Verstopfung, Kurzdarmsyndrom
        </p>
        <div className="grid grid-cols-2 gap-4">
          <QuestionCard
            selected={value.digestiveIssues === true}
            onClick={() => updateDisease('digestiveIssues', true)}
            size="medium"
          >
            Ja
          </QuestionCard>
          <QuestionCard
            selected={value.digestiveIssues === false}
            onClick={() => updateDisease('digestiveIssues', false)}
            size="medium"
          >
            Nein
          </QuestionCard>
        </div>
        {value.digestiveIssues && (
          <Input
            placeholder="Welche Beschwerden genau?"
            value={value.digestiveDetails || ''}
            onChange={(e) => updateDisease('digestiveDetails', e.target.value)}
            className="text-senior-base h-14 mt-2"
          />
        )}
      </div>

      {/* Other Diseases */}
      <div className="space-y-3">
        <p className="text-senior-lg font-medium text-center">
          Haben Sie andere Erkrankungen?
        </p>
        <Input
          placeholder="Falls ja, welche?"
          value={value.otherDiseases || ''}
          onChange={(e) => updateDisease('otherDiseases', e.target.value)}
          className="text-senior-base h-14"
        />
      </div>
    </div>
  );
}
