import { ScreeningAnswers, ScreeningResult, MalnutritionLevel } from '@/types/screening';

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function calculateNRSScore(answers: ScreeningAnswers, patientCode: string): ScreeningResult {
  const scores = {
    bmi: 0,
    weightLossScore: 0,
    nutritionScore: 0,
    diseaseScore: 0,
    physicalConditionScore: 0,
    swallowingScore: 0,
  };

  // Calculate BMI (nur anzeigen, nicht im Score)
  if (answers.weight && answers.height && !answers.weightUnknown) {
    scores.bmi = calculateBMI(answers.weight, answers.height);
  }

  // Weight Loss Score (eigene Punktzahl)
  // ≥6 kg = 3 Punkte, 3-6 kg = 2 Punkte, 1-3 kg = 1 Punkt
  if (answers.weightUnknown) {
    if (answers.clothingLoose === true) {
      scores.weightLossScore = 1;
    }
  } else if (answers.hasWeightLoss === true && answers.weightLossAmount) {
    switch (answers.weightLossAmount) {
      case '>6kg':
        scores.weightLossScore = 3;
        break;
      case '3-6kg':
        scores.weightLossScore = 2;
        break;
      case '1-3kg':
        scores.weightLossScore = 1;
        break;
    }
  }

  // Nutrition Score: Mahlzeiten × Portionsgröße
  // Mahlzeiten: 1-2 = 1 Punkt, ≥3 = 0 Punkte
  // Portionsgröße als Multiplikator: 100% = 1, 75% = 0.75, 50% = 0.5, 25% = 0.25
  if (answers.mealsPerDay !== null && answers.portionSize !== null) {
    const mealsPoints = answers.mealsPerDay <= 2 ? 1 : 0;
    const portionMultiplier = answers.portionSize / 100;
    // Berechnung: Mahlzeiten-Punkte, aber effektive Portion berücksichtigen
    // Wenn jemand 3 Mahlzeiten isst (0 Punkte), aber nur halbe Teller, dann:
    // 3 × 0.5 = 1.5 effektive Mahlzeiten, was weniger als 3 ist
    const effectiveMeals = answers.mealsPerDay * portionMultiplier;
    
    if (effectiveMeals < 1.5) {
      scores.nutritionScore = 2;
    } else if (effectiveMeals < 3) {
      scores.nutritionScore = 1;
    } else {
      scores.nutritionScore = 0;
    }
    
    // Mindestens Mahlzeiten-Punkte, wenn 1-2 Mahlzeiten
    scores.nutritionScore = Math.max(scores.nutritionScore, mealsPoints);
  }

  // Disease Score
  // Krebs und schwere Herzschwäche = je 2 Punkte
  // Durchfall, Übelkeit/Erbrechen, Magen-Darm-OP = je 1 Punkt
  // Andere Erkrankungen sind nur Indikatoren
  
  const acute = answers.acuteDiseases;
  const chronic = answers.chronicDiseases;
  
  // Krebs = 2 Punkte
  if (acute.cancer === true) {
    scores.diseaseScore += 2;
  }
  
  // Schwere Herzschwäche = 2 Punkte
  if (chronic.heartFailure === true) {
    scores.diseaseScore += 2;
  }
  
  // Durchfall = 1 Punkt
  if (chronic.diarrhea === true) {
    scores.diseaseScore += 1;
  }
  
  // Übelkeit/Erbrechen = 1 Punkt
  if (chronic.nauseaVomiting === true) {
    scores.diseaseScore += 1;
  }
  
  // Zustand nach Magen-/Darm-Operation = 1 Punkt
  if (chronic.gastrointestinalSurgery === true) {
    scores.diseaseScore += 1;
  }

  // Physical Condition Score
  // 1 Punkt, sobald mindestens eine Frage mit "ja" beantwortet wurde
  if (
    answers.feelsWeaker === true ||
    answers.muscleLoss === true ||
    answers.frequentInfections === true ||
    answers.difficultyGettingUp === true ||
    answers.shortnessOfBreath === true
  ) {
    scores.physicalConditionScore = 1;
  }

  // Swallowing Score
  // 1 Punkt bei "ja"
  if (answers.hasSwallowingIssues === true) {
    scores.swallowingScore = 1;
  }

  // Total Score (ohne BMI und ohne Altersbonus)
  const totalScore = 
    scores.weightLossScore + 
    scores.nutritionScore + 
    scores.diseaseScore + 
    scores.physicalConditionScore +
    scores.swallowingScore;

  // Malnutrition Level: 0-2 = keine, ≥3 = leicht, ≥5 = schwer
  let malnutritionLevel: MalnutritionLevel = 'none';
  if (totalScore >= 5) {
    malnutritionLevel = 'severe';
  } else if (totalScore >= 3) {
    malnutritionLevel = 'mild';
  }

  const isAtRisk = totalScore >= 3;

  // Calculate recommendations if at risk
  let recommendations;
  if (isAtRisk && answers.weight) {
    recommendations = {
      energy: Math.round(30 * answers.weight),
      protein: Math.round(1.0 * answers.weight * 10) / 10,
    };
  }

  return {
    patientCode,
    answers,
    scores,
    totalScore,
    malnutritionLevel,
    isAtRisk,
    recommendations,
    createdAt: new Date(),
  };
}

export function generateReportText(result: ScreeningResult): string {
  const levelText = {
    none: 'Kein Mangelernährungszustand',
    mild: 'Leichter Mangelernährungszustand',
    severe: 'Schwerer Mangelernährungszustand',
  };

  const lines = [
    `Patient: ${result.patientCode}`,
    `Score: ${result.totalScore}`,
    ``,
    `Bewertung: ${levelText[result.malnutritionLevel]}`,
  ];

  if (result.isAtRisk && result.recommendations) {
    lines.push(``);
    lines.push(`Therapie-Empfehlung:`);
    lines.push(`• Energiebedarf: ${result.recommendations.energy} kcal/Tag`);
    lines.push(`• Proteinbedarf: ${result.recommendations.protein} g/Tag`);
  }

  lines.push(``);
  lines.push(`Score-Aufschlüsselung:`);
  lines.push(`• BMI: ${result.scores.bmi.toFixed(1)} (nicht im Score)`);
  lines.push(`• Gewichtsverlust: ${result.scores.weightLossScore}`);
  lines.push(`• Nahrungszufuhr: ${result.scores.nutritionScore}`);
  lines.push(`• Erkrankungen: ${result.scores.diseaseScore}`);
  lines.push(`• Körperliches Befinden: ${result.scores.physicalConditionScore}`);
  lines.push(`• Schluckbeschwerden: ${result.scores.swallowingScore}`);

  if (result.answers.wantsNutritionCounseling) {
    lines.push(``);
    lines.push(`Patient wünscht Ernährungsberatung: Ja`);
  }

  return lines.join('\n');
}
