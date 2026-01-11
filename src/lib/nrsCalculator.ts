import { ScreeningAnswers, ScreeningResult } from '@/types/screening';

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
    bmiScore: 0,
    weightLossScore: 0,
    nutritionScore: 0,
    illnessScore: 0,
    ageBonus: 0,
  };

  // Calculate BMI Score
  if (answers.weight && answers.height && !answers.weightUnknown) {
    scores.bmi = calculateBMI(answers.weight, answers.height);
    
    if (scores.bmi < 18.5) {
      scores.bmiScore = 3;
    } else if (scores.bmi < 20.5) {
      scores.bmiScore = 2;
    } else if (scores.bmi >= 18.5 && scores.bmi <= 20.5) {
      scores.bmiScore = 1;
    }
  }

  // Weight Loss Score
  if (answers.weightUnknown) {
    // If weight unknown, use subjective clothing criterion
    if (answers.clothingLoose === true) {
      scores.weightLossScore = 1;
    }
  } else if (answers.hasWeightLoss === true) {
    // Calculate weight loss percentage if we have weight
    if (answers.weight && answers.weightLossAmount) {
      let lossKg = 0;
      switch (answers.weightLossAmount) {
        case '1-3kg':
          lossKg = 2;
          break;
        case '3-6kg':
          lossKg = 4.5;
          break;
        case '>6kg':
          lossKg = 7;
          break;
      }
      
      const previousWeight = answers.weight + lossKg;
      const lossPercentage = (lossKg / previousWeight) * 100;
      
      if (lossPercentage > 5) {
        scores.weightLossScore = 2;
      } else if (lossPercentage > 0) {
        scores.weightLossScore = 1;
      }
    }
  }

  // Nutrition Score (based on portion size)
  if (answers.hasReducedEating === true && answers.portionSize) {
    switch (answers.portionSize) {
      case 75:
        scores.nutritionScore = 1;
        break;
      case 50:
        scores.nutritionScore = 2;
        break;
      case 25:
        scores.nutritionScore = 3;
        break;
    }
  }

  // Illness Score
  if (answers.hasAcuteIllness === true) {
    scores.illnessScore = 1;
  }

  // Age Bonus
  const age = calculateAge(answers.birthDate);
  if (age >= 70) {
    scores.ageBonus = 1;
  }

  // Total Score
  const totalScore = 
    scores.bmiScore + 
    scores.weightLossScore + 
    scores.nutritionScore + 
    scores.illnessScore + 
    scores.ageBonus;

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
    isAtRisk,
    recommendations,
    createdAt: new Date(),
  };
}

export function generateReportText(result: ScreeningResult): string {
  const lines = [
    `Patient: ${result.patientCode}`,
    `NRS-2002 Score: ${result.totalScore}`,
    ``,
    `Risikobewertung: ${result.isAtRisk ? 'RISIKO FÜR MANGELERNÄHRUNG' : 'Kein erhöhtes Risiko'}`,
  ];

  if (result.isAtRisk && result.recommendations) {
    lines.push(``);
    lines.push(`Therapie-Empfehlung:`);
    lines.push(`• Energiebedarf: ${result.recommendations.energy} kcal/Tag`);
    lines.push(`• Proteinbedarf: ${result.recommendations.protein} g/Tag`);
  }

  lines.push(``);
  lines.push(`Score-Aufschlüsselung:`);
  lines.push(`• BMI-Score: ${result.scores.bmiScore} (BMI: ${result.scores.bmi.toFixed(1)})`);
  lines.push(`• Gewichtsverlust: ${result.scores.weightLossScore}`);
  lines.push(`• Nahrungszufuhr: ${result.scores.nutritionScore}`);
  lines.push(`• Akute Krankheit: ${result.scores.illnessScore}`);
  lines.push(`• Alters-Bonus (≥70): ${result.scores.ageBonus}`);

  return lines.join('\n');
}
