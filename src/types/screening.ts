export interface Patient {
  id: string;
  patientCode: string;
  initials: string;
  birthDate: string;
  createdAt: Date;
}

export interface ScreeningAnswers {
  birthDate: string;
  height: number | null;
  weight: number | null;
  weightUnknown: boolean;
  hasWeightLoss: boolean | null;
  weightLossAmount: 'none' | '1-3kg' | '3-6kg' | '>6kg' | null;
  clothingLoose: boolean | null;
  hasReducedEating: boolean | null;
  portionSize: 100 | 75 | 50 | 25 | null;
  mobilityLevel: 'bedridden' | 'indoor' | 'outdoor' | null;
  hasSwallowingIssues: boolean | null;
  hasAcuteIllness: boolean | null;
}

export interface ScreeningResult {
  patientCode: string;
  answers: ScreeningAnswers;
  scores: {
    bmi: number;
    bmiScore: number;
    weightLossScore: number;
    nutritionScore: number;
    illnessScore: number;
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
  | 'birthdate'
  | 'height'
  | 'weight'
  | 'weightLoss'
  | 'weightLossAmount'
  | 'clothingLoose'
  | 'eating'
  | 'portionSize'
  | 'mobility'
  | 'swallowing'
  | 'acuteIllness'
  | 'result';

export const initialAnswers: ScreeningAnswers = {
  birthDate: '',
  height: 165,
  weight: 70,
  weightUnknown: false,
  hasWeightLoss: null,
  weightLossAmount: null,
  clothingLoose: null,
  hasReducedEating: null,
  portionSize: null,
  mobilityLevel: null,
  hasSwallowingIssues: null,
  hasAcuteIllness: null,
};
