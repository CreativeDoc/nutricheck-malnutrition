import { ScreeningResult, ScreeningAnswers, FrequencyPerWeek, DrinkingAmount } from '@/types/screening';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ScreeningDetailViewProps {
  screening: ScreeningResult;
  onBack: () => void;
}

const formatGender = (gender: string | null) => {
  switch (gender) {
    case 'male': return 'Männlich';
    case 'female': return 'Weiblich';
    case 'diverse': return 'Divers';
    default: return '-';
  }
};

const formatBoolean = (value: boolean | null) => {
  if (value === null) return '-';
  return value ? 'Ja' : 'Nein';
};

const formatFrequency = (freq: FrequencyPerWeek | null) => {
  switch (freq) {
    case '0': return 'Nie';
    case '1-2': return '1-2 mal';
    case '3-4': return '3-4 mal';
    case '5-7': return '5-7 mal';
    case 'daily': return 'Täglich';
    default: return '-';
  }
};

const formatDrinking = (amount: DrinkingAmount | null) => {
  switch (amount) {
    case '<1l': return 'Weniger als 1 Liter';
    case '1.5l': return 'Etwa 1,5 Liter';
    case '>1.5l': return 'Mehr als 1,5 Liter';
    default: return '-';
  }
};

const formatPortion = (portion: number | null) => {
  switch (portion) {
    case 100: return 'Volle Portion';
    case 75: return '¾ Portion';
    case 50: return '½ Portion';
    case 25: return '¼ Portion';
    default: return '-';
  }
};

const formatWeightLoss = (amount: string | null) => {
  switch (amount) {
    case 'none': return 'Keine';
    case '1-3kg': return '1-3 kg';
    case '3-6kg': return '3-6 kg';
    case '>6kg': return 'Mehr als 6 kg';
    default: return '-';
  }
};

export function ScreeningDetailView({ screening, onBack }: ScreeningDetailViewProps) {
  const { answers } = screening;

  const answerRows: { label: string; value: string }[] = [
    // Grunddaten
    { label: 'Geschlecht', value: formatGender(answers.gender) },
    { label: 'Größe', value: answers.height ? `${answers.height} cm` : '-' },
    { label: 'Gewicht', value: answers.weightUnknown ? 'Unbekannt' : answers.weight ? `${answers.weight} kg` : '-' },
    { label: 'Gewichtsverlust', value: formatBoolean(answers.hasWeightLoss) },
    { label: 'Gewichtsverlust Menge', value: formatWeightLoss(answers.weightLossAmount) },
    { label: 'Kleidung weiter geworden', value: formatBoolean(answers.clothingLoose) },
    
    // Essgewohnheiten
    { label: 'Mahlzeiten pro Tag', value: answers.mealsPerDay ? `${answers.mealsPerDay}` : '-' },
    { label: 'Portionsgröße', value: formatPortion(answers.portionSize) },
    { label: 'Appetit (Fremdeinschätzung)', value: answers.appetiteByOthers === 'normal' ? 'Normal' : answers.appetiteByOthers === 'limited' ? 'Eingeschränkt' : '-' },
    
    // Ernährung
    { label: 'Obst pro Woche', value: formatFrequency(answers.fruitPerWeek) },
    { label: 'Gemüse pro Woche', value: formatFrequency(answers.vegetablesPerWeek) },
    { label: 'Süßigkeiten', value: answers.sweetPreference === 'like' ? 'Gern' : answers.sweetPreference === 'dislike' ? 'Nicht so gern' : '-' },
    { label: 'Fleisch/Wurst pro Woche', value: formatFrequency(answers.meatPerWeek) },
    { label: 'Kohlenhydrate pro Woche', value: formatFrequency(answers.carbsPerWeek) },
    
    // Erkrankungen
    { label: 'Krebs', value: formatBoolean(answers.currentDiseases.cancer) },
    ...(answers.currentDiseases.cancer && answers.currentDiseases.cancerType 
      ? [{ label: 'Krebsart', value: answers.currentDiseases.cancerType }] 
      : []),
    { label: 'Lungenentzündung', value: formatBoolean(answers.currentDiseases.pneumonia) },
    { label: 'Schwere Herzinsuffizienz', value: formatBoolean(answers.currentDiseases.heartFailure) },
    { label: 'Schlaganfall', value: formatBoolean(answers.currentDiseases.stroke) },
    { label: 'Verdauungsprobleme', value: formatBoolean(answers.currentDiseases.digestiveIssues) },
    ...(answers.currentDiseases.digestiveIssues && answers.currentDiseases.digestiveDetails 
      ? [{ label: 'Verdauungsprobleme Details', value: answers.currentDiseases.digestiveDetails }] 
      : []),
    ...(answers.currentDiseases.otherDiseases 
      ? [{ label: 'Andere Erkrankungen', value: answers.currentDiseases.otherDiseases }] 
      : []),
    
    // Körperliches Befinden
    { label: 'Fühlt sich schwächer', value: formatBoolean(answers.feelsWeaker) },
    { label: 'Muskelabbau', value: formatBoolean(answers.muscleLoss) },
    { label: 'Häufige Infektionen', value: formatBoolean(answers.frequentInfections) },
    { label: 'Häufig an frischer Luft', value: formatBoolean(answers.getsOutdoors) },
    { label: 'Schwerer aufzustehen', value: formatBoolean(answers.difficultyGettingUp) },
    { label: 'Kurzatmiger geworden', value: formatBoolean(answers.shortnessOfBreath) },
    
    // Trinken & Schlucken
    { label: 'Trinkmenge pro Tag', value: formatDrinking(answers.drinkingAmount) },
    { label: 'Schluckbeschwerden', value: formatBoolean(answers.hasSwallowingIssues) },
    ...(answers.hasSwallowingIssues && answers.swallowingDetails 
      ? [{ label: 'Schluckbeschwerden Details', value: answers.swallowingDetails }] 
      : []),
    
    // Medikamente & Supplemente
    { label: 'Regelmäßige Medikamente', value: formatBoolean(answers.takesMedication) },
    ...(answers.takesMedication && answers.medicationDetails 
      ? [{ label: 'Medikamente Details', value: answers.medicationDetails }] 
      : []),
    { label: 'Nahrungsergänzungsmittel Erfahrung', value: formatBoolean(answers.hasSupplementExperience) },
    ...(answers.hasSupplementExperience && answers.supplementDetails 
      ? [{ label: 'Nahrungsergänzungsmittel Details', value: answers.supplementDetails }] 
      : []),
    { label: 'Ernährungstherapie', value: formatBoolean(answers.hadNutritionTherapy) },
    ...(answers.hadNutritionTherapy && answers.nutritionTherapyDetails 
      ? [{ label: 'Ernährungstherapie Details', value: answers.nutritionTherapyDetails }] 
      : []),
    { label: 'Nährstoff-Infusionen', value: formatBoolean(answers.hadNutrientInfusions) },
    ...(answers.hadNutrientInfusions && answers.infusionDetails 
      ? [{ label: 'Infusionen Details', value: answers.infusionDetails }] 
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Screening Details</h2>
          <p className="text-sm text-muted-foreground">
            Patient: {screening.patientCode} • {format(screening.createdAt, 'dd.MM.yyyy HH:mm', { locale: de })}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
          screening.isAtRisk 
            ? "bg-destructive/10 text-destructive" 
            : "bg-success/10 text-success"
        )}>
          {screening.isAtRisk ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {screening.isAtRisk ? 'Risiko erkannt' : 'Kein Risiko'}
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-2xl font-bold text-primary">{screening.totalScore}</p>
          <p className="text-xs text-muted-foreground">Gesamtscore</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-2xl font-bold">{screening.scores.bmi.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">BMI</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-2xl font-bold">{screening.scores.nutritionScore}</p>
          <p className="text-xs text-muted-foreground">Ernährung</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-2xl font-bold">{screening.scores.diseaseScore}</p>
          <p className="text-xs text-muted-foreground">Erkrankung</p>
        </div>
      </div>

      {/* Answers Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-sm font-semibold">Frage</TableHead>
              <TableHead className="w-1/2 text-sm font-semibold">Antwort</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answerRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="text-sm py-2">{row.label}</TableCell>
                <TableCell className="text-sm py-2 font-medium">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}