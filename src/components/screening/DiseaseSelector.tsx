import { CurrentDiseases } from '@/types/screening';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DiseaseSelectorProps {
  value: CurrentDiseases;
  onChange: (value: CurrentDiseases) => void;
}

export function DiseaseSelector({ value, onChange }: DiseaseSelectorProps) {
  const updateDisease = (key: keyof CurrentDiseases, newValue: boolean | string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-4">
      <p className="text-senior-lg text-muted-foreground text-center mb-4">
        Wählen Sie alle zutreffenden Erkrankungen aus
      </p>
      
      <div className="space-y-3">
        {/* Cancer */}
        <div className="touch-card p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Checkbox
              id="cancer"
              checked={value.cancer}
              onCheckedChange={(checked) => updateDisease('cancer', !!checked)}
              className="w-8 h-8"
            />
            <Label htmlFor="cancer" className="text-senior-lg cursor-pointer flex-1">
              Krebs
            </Label>
          </div>
          {value.cancer && (
            <Input
              placeholder="Welche Art von Krebs?"
              value={value.cancerType || ''}
              onChange={(e) => updateDisease('cancerType', e.target.value)}
              className="text-senior-base h-14"
            />
          )}
        </div>

        {/* Pneumonia */}
        <div className="touch-card p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="pneumonia"
              checked={value.pneumonia}
              onCheckedChange={(checked) => updateDisease('pneumonia', !!checked)}
              className="w-8 h-8"
            />
            <Label htmlFor="pneumonia" className="text-senior-lg cursor-pointer flex-1">
              Lungenentzündung
            </Label>
          </div>
        </div>

        {/* Heart Failure */}
        <div className="touch-card p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="heartFailure"
              checked={value.heartFailure}
              onCheckedChange={(checked) => updateDisease('heartFailure', !!checked)}
              className="w-8 h-8"
            />
            <Label htmlFor="heartFailure" className="text-senior-lg cursor-pointer flex-1">
              Schwere Herzinsuffizienz
            </Label>
          </div>
        </div>

        {/* Stroke */}
        <div className="touch-card p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="stroke"
              checked={value.stroke}
              onCheckedChange={(checked) => updateDisease('stroke', !!checked)}
              className="w-8 h-8"
            />
            <Label htmlFor="stroke" className="text-senior-lg cursor-pointer flex-1">
              Schlaganfall
            </Label>
          </div>
        </div>

        {/* Digestive Issues */}
        <div className="touch-card p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Checkbox
              id="digestiveIssues"
              checked={value.digestiveIssues}
              onCheckedChange={(checked) => updateDisease('digestiveIssues', !!checked)}
              className="w-8 h-8"
            />
            <Label htmlFor="digestiveIssues" className="text-senior-lg cursor-pointer flex-1">
              Eingeschränkte Verdauungsleistung
            </Label>
          </div>
          <p className="text-muted-foreground text-senior-base ml-12">
            z.B. chron. entzündliche Darmerkrankungen, Durchfälle, Verstopfung, Kurzdarmsyndrom
          </p>
          {value.digestiveIssues && (
            <Input
              placeholder="Welche Beschwerden genau?"
              value={value.digestiveDetails || ''}
              onChange={(e) => updateDisease('digestiveDetails', e.target.value)}
              className="text-senior-base h-14"
            />
          )}
        </div>

        {/* Other Diseases */}
        <div className="touch-card p-4 space-y-3">
          <Label className="text-senior-lg">Andere Erkrankungen</Label>
          <Input
            placeholder="Falls ja, welche?"
            value={value.otherDiseases || ''}
            onChange={(e) => updateDisease('otherDiseases', e.target.value)}
            className="text-senior-base h-14"
          />
        </div>
      </div>
    </div>
  );
}
