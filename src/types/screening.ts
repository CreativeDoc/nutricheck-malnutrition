export interface Patient {
  id: string;
  patientCode: string;
  initials: string;
  birthDate: string;
  createdAt: Date;
}

export type Gender = 'male' | 'female' | 'diverse';
export type FrequencyPerWeek = '0' | '1-2' | '3-4' | '5-7' | 'daily';
export type DrinkingAmount = '<1l' | '1.5l' | '>1.5l';
export type AppetiteRating = 'normal' | 'limited';
export type SweetPreference = 'like' | 'dislike';

export interface CurrentDiseases {
  cancer: boolean;
  cancerType?: string;
  pneumonia: boolean;
  heartFailure: boolean;
  stroke: boolean;
  digestiveIssues: boolean;
  digestiveDetails?: string;
  otherDiseases?: string;
}

export interface ScreeningAnswers {
  birthDate: string;
  gender: Gender | null;
  height: number | null;
  weight: number | null;
  weightUnknown: boolean;
  hasWeightLoss: boolean | null;
  weightLossAmount: 'none' | '1-3kg' | '3-6kg' | '>6kg' | null;
  clothingLoose: boolean | null;
  
  // Eating habits
  mealsPerDay: number | null;
  portionSize: 100 | 75 | 50 | 25 | null;
  appetiteByOthers: AppetiteRating | null;
  
  // Food frequency
  fruitPerWeek: FrequencyPerWeek | null;
  vegetablesPerWeek: FrequencyPerWeek | null;
  sweetPreference: SweetPreference | null;
  meatPerWeek: FrequencyPerWeek | null;
  carbsPerWeek: FrequencyPerWeek | null;
  
  // Current diseases
  currentDiseases: CurrentDiseases;
  
  // Physical condition
  feelsWeaker: boolean | null;
  muscleLoss: boolean | null;
  frequentInfections: boolean | null;
  getsOutdoors: boolean | null;
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
}

export interface ScreeningResult {
  patientCode: string;
  answers: ScreeningAnswers;
  scores: {
    bmi: number;
    bmiScore: number;
    weightLossScore: number;
    nutritionScore: number;
    diseaseScore: number;
    ageBonus: number;
  };
  totalScore: number;
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
  | 'currentDiseases'
  | 'physicalCondition'
  | 'mobility'
  | 'drinkingAmount'
  | 'swallowing'
  | 'medication'
  | 'supplements'
  | 'nutritionTherapy'
  | 'infusions'
  | 'result';

export const initialAnswers: ScreeningAnswers = {
  birthDate: '',
  gender: null,
  height: 165,
  weight: 70,
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
  currentDiseases: {
    cancer: false,
    pneumonia: false,
    heartFailure: false,
    stroke: false,
    digestiveIssues: false,
  },
  feelsWeaker: null,
  muscleLoss: null,
  frequentInfections: null,
  getsOutdoors: null,
  difficultyGettingUp: null,
  shortnessOfBreath: null,
  mobilityLevel: null,
  drinkingAmount: null,
  hasSwallowingIssues: null,
  takesMedication: null,
  hasSupplementExperience: null,
  hadNutritionTherapy: null,
  hadNutrientInfusions: null,
};
