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
    <div className="space-y-3">
      {/* Cancer */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border">
        <span className="text-sm font-medium flex-1">Krebs</span>
        <div className="flex gap-2">
          <QuestionCard selected={value.cancer === true} onClick={() => updateDisease('cancer', true)} size="compact" className="w-16">Ja</QuestionCard>
          <QuestionCard selected={value.cancer === false} onClick={() => updateDisease('cancer', false)} size="compact" className="w-16">Nein</QuestionCard>
        </div>
      </div>
      {value.cancer && (
        <Input placeholder="Welche Art?" value={value.cancerType || ''} onChange={(e) => updateDisease('cancerType', e.target.value)} className="text-sm h-10" />
      )}

      {/* Pneumonia */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border">
        <span className="text-sm font-medium flex-1">Lungenentzündung</span>
        <div className="flex gap-2">
          <QuestionCard selected={value.pneumonia === true} onClick={() => updateDisease('pneumonia', true)} size="compact" className="w-16">Ja</QuestionCard>
          <QuestionCard selected={value.pneumonia === false} onClick={() => updateDisease('pneumonia', false)} size="compact" className="w-16">Nein</QuestionCard>
        </div>
      </div>

      {/* Heart Failure */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border">
        <span className="text-sm font-medium flex-1">Schwere Herzinsuffizienz</span>
        <div className="flex gap-2">
          <QuestionCard selected={value.heartFailure === true} onClick={() => updateDisease('heartFailure', true)} size="compact" className="w-16">Ja</QuestionCard>
          <QuestionCard selected={value.heartFailure === false} onClick={() => updateDisease('heartFailure', false)} size="compact" className="w-16">Nein</QuestionCard>
        </div>
      </div>

      {/* Stroke */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border">
        <span className="text-sm font-medium flex-1">Schlaganfall</span>
        <div className="flex gap-2">
          <QuestionCard selected={value.stroke === true} onClick={() => updateDisease('stroke', true)} size="compact" className="w-16">Ja</QuestionCard>
          <QuestionCard selected={value.stroke === false} onClick={() => updateDisease('stroke', false)} size="compact" className="w-16">Nein</QuestionCard>
        </div>
      </div>

      {/* Digestive Issues */}
      <div className="flex items-center justify-between p-2 rounded-lg border border-border">
        <span className="text-sm font-medium flex-1">Verdauungsprobleme</span>
        <div className="flex gap-2">
          <QuestionCard selected={value.digestiveIssues === true} onClick={() => updateDisease('digestiveIssues', true)} size="compact" className="w-16">Ja</QuestionCard>
          <QuestionCard selected={value.digestiveIssues === false} onClick={() => updateDisease('digestiveIssues', false)} size="compact" className="w-16">Nein</QuestionCard>
        </div>
      </div>
      {value.digestiveIssues && (
        <Input placeholder="Welche Beschwerden?" value={value.digestiveDetails || ''} onChange={(e) => updateDisease('digestiveDetails', e.target.value)} className="text-sm h-10" />
      )}

      {/* Other Diseases */}
      <div className="p-2 rounded-lg border border-border">
        <span className="text-sm font-medium block mb-2">Andere Erkrankungen</span>
        <Input placeholder="Falls ja, welche?" value={value.otherDiseases || ''} onChange={(e) => updateDisease('otherDiseases', e.target.value)} className="text-sm h-10" />
      </div>
    </div>
  );
}
