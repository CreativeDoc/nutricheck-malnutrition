export type PatientLanguage = 'de' | 'en' | 'ru';

export interface Patient {
  id: string;
  patientCode: string;
  initials: string;
  birthDate: string;
  language: PatientLanguage;
  createdAt: Date;
}

export type Gender = 'male' | 'female' | 'diverse';
export type FrequencyPerWeek = '0' | '1-2' | '3-4' | '5-7' | 'daily';
export type DrinkingAmount = '<1l' | '1.5l' | '>1.5l';
export type AppetiteRating = 'normal' | 'limited';
export type SweetPreference = 'like' | 'dislike';

// Aktuelle Erkrankungen (temporär/akut)
export interface AcuteDiseases {
  cancer: boolean | null;
  cancerType?: string;
  acuteInfection: boolean | null;
  acuteInfectionDetails?: string;
}

// Chronische Erkrankungen
export interface ChronicDiseases {
  heartFailure: boolean | null; // Herzschwäche (mit Wasser in den Beinen/Ödemen)
  rheumatism: boolean | null;
  lungDisease: boolean | null;
  kidneyDisease: boolean | null;
  stroke: boolean | null;
  diarrhea: boolean | null;
  nauseaVomiting: boolean | null;
  gastrointestinalSurgery: boolean | null;
  otherDiseases?: string;
}

export interface ScreeningAnswers {
  birthDate: string;
  gender: Gender | null;
  height: number | null;
  weight: number | null;
  normalWeight: number | null; // Normalgewicht
  weightUnknown: boolean;
  hasWeightLoss: boolean | null;
  weightLossAmount: 'none' | '1-3kg' | '3-6kg' | '>6kg' | null;
  clothingLoose: boolean | null;
  
  // Eating habits
  mealsPerDay: number | null;
  portionSize: 100 | 75 | 50 | 25 | null;
  appetiteByOthers: AppetiteRating | null;
  
  // Food frequency (Indikatoren, keine Punkte)
  fruitPerWeek: FrequencyPerWeek | null;
  vegetablesPerWeek: FrequencyPerWeek | null;
  sweetPreference: SweetPreference | null;
  meatPerWeek: FrequencyPerWeek | null;
  carbsPerWeek: FrequencyPerWeek | null;
  
  // Diseases
  acuteDiseases: AcuteDiseases;
  chronicDiseases: ChronicDiseases;
  
  // Physical condition
  feelsWeaker: boolean | null;
  muscleLoss: boolean | null;
  frequentInfections: boolean | null;
  difficultyGettingUp: boolean | null;
  shortnessOfBreath: boolean | null;
  
  // Mobility and swallowing
  mobilityLevel: 'indoor' | 'outdoor' | null;
  drinkingAmount: DrinkingAmount | null;
  hasSwallowingIssues: boolean | null;
  swallowingDetails?: string;
  
  // Medication and supplements
  takesMedication: boolean | null;
  medicationDetails?: string;
  hasSupplementExperience: boolean | null;
  supplementDetails?: string;
  hadNutritionTherapy: boolean | null;
  nutritionTherapyDetails?: string;
  hadNutrientInfusions: boolean | null;
  infusionDetails?: string;
  
  // Final question
  wantsNutritionCounseling: boolean | null;
}

export type MalnutritionLevel = 'none' | 'mild' | 'severe';

export interface ScreeningResult {
  patientCode: string;
  answers: ScreeningAnswers;
  scores: {
    bmi: number; // Nur anzeigen, nicht im Score
    weightLossScore: number;
    nutritionScore: number; // Mahlzeiten x Portionsgröße
    diseaseScore: number;
    physicalConditionScore: number;
    swallowingScore: number;
  };
  totalScore: number;
  malnutritionLevel: MalnutritionLevel;
  isAtRisk: boolean;
  recommendations?: {
    energy: number;
    protein: number;
  };
  createdAt: Date;
}

export type WizardStep = 
  | 'gender'
  | 'height'
  | 'weight'
  | 'normalWeight'
  | 'weightLoss'
  | 'weightLossAmount'
  | 'clothingLoose'
  | 'mealsPerDay'
  | 'portionSize'
  | 'appetiteByOthers'
  | 'fruitPerWeek'
  | 'vegetablesPerWeek'
  | 'sweetPreference'
  | 'meatPerWeek'
  | 'carbsPerWeek'
  | 'acuteDiseases'
  | 'chronicDiseases'
  | 'physicalCondition'
  | 'mobility'
  | 'drinkingAmount'
  | 'swallowing'
  | 'medication'
  | 'supplements'
  | 'nutritionTherapy'
  | 'infusions'
  | 'nutritionCounseling'
  | 'result';

export const initialAnswers: ScreeningAnswers = {
  birthDate: '',
  gender: null,
  height: 165,
  weight: 70,
  normalWeight: null,
  weightUnknown: false,
  hasWeightLoss: null,
  weightLossAmount: null,
  clothingLoose: null,
  mealsPerDay: null,
  portionSize: null,
  appetiteByOthers: null,
  fruitPerWeek: null,
  vegetablesPerWeek: null,
  sweetPreference: null,
  meatPerWeek: null,
  carbsPerWeek: null,
  acuteDiseases: {
    cancer: null,
    acuteInfection: null,
  },
  chronicDiseases: {
    heartFailure: null,
    rheumatism: null,
    lungDisease: null,
    kidneyDisease: null,
    stroke: null,
    diarrhea: null,
    nauseaVomiting: null,
    gastrointestinalSurgery: null,
  },
  feelsWeaker: null,
  muscleLoss: null,
  frequentInfections: null,
  difficultyGettingUp: null,
  shortnessOfBreath: null,
  mobilityLevel: null,
  drinkingAmount: null,
  hasSwallowingIssues: null,
  takesMedication: null,
  hasSupplementExperience: null,
  hadNutritionTherapy: null,
  hadNutrientInfusions: null,
  wantsNutritionCounseling: null,
};
