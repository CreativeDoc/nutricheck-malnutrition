import { PatientLanguage } from '@/types/screening';

export interface Translations {
  // Common
  yes: string;
  no: string;
  next: string;
  back: string;
  finish: string;
  copied: string;
  dashboard: string;
  newScreening: string;
  copyReport: string;
  
  // Intro
  introTitle: string;
  introText1: string;
  introText2: string;
  introText3: string;
  introText4: string;
  introText5: string;
  introText6: string;
  introText7: string;
  introText8: string;
  introText9: string;
  introText10: string;
  introPrivacy: string;
  introLetsGo: string;
  introContinue: string;
  
  // Patient Form
  patientFormTitle: string;
  patientFormDescription: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  birthDateLabel: string;
  patientCode: string;
  startScreening: string;
  
  // Gender
  genderQuestion: string;
  male: string;
  female: string;
  diverse: string;
  
  // Height & Weight
  heightQuestion: string;
  heightSubtitle: string;
  heightLabel: string;
  heightUnit: string;
  weightQuestion: string;
  weightSubtitle: string;
  weightLabel: string;
  weightUnit: string;
  weightUnknown: string;
  normalWeightQuestion: string;
  normalWeightSubtitle: string;
  normalWeightLabel: string;
  
  // Weight Loss
  weightLossQuestion: string;
  weightLossAmountQuestion: string;
  weightLossAmountSubtitle: string;
  weightLoss1to3: string;
  weightLoss3to6: string;
  weightLossOver6: string;
  clothingLooseQuestion: string;
  clothingLooseSubtitle: string;
  
  // Meals
  mealsPerDayQuestion: string;
  meal1: string;
  meal2: string;
  meal3: string;
  meal4: string;
  meal5plus: string;
  
  // Portions
  portionSizeQuestion: string;
  portionSizeSubtitle: string;
  fullPlate: string;
  fullPlateDesc: string;
  threequarterPlate: string;
  threequarterPlateDesc: string;
  halfPlate: string;
  halfPlateDesc: string;
  quarterPlate: string;
  quarterPlateDesc: string;
  
  // Appetite
  appetiteQuestion: string;
  appetiteNormal: string;
  appetiteLimited: string;
  
  // Frequency
  frequencyLabel: string;
  frequencyNever: string;
  frequency1to2: string;
  frequency3to4: string;
  frequency5to7: string;
  frequencyDaily: string;
  
  // Food questions
  fruitQuestion: string;
  vegetablesQuestion: string;
  sweetQuestion: string;
  sweetLike: string;
  sweetDislike: string;
  meatQuestion: string;
  carbsQuestion: string;
  carbsSubtitle: string;
  
  // Diseases
  acuteDiseasesTitle: string;
  chronicDiseasesTitle: string;
  cancer: string;
  cancerTypePlaceholder: string;
  acuteInfection: string;
  infectionTypePlaceholder: string;
  heartFailure: string;
  rheumatism: string;
  lungDisease: string;
  kidneyDisease: string;
  stroke: string;
  diarrhea: string;
  nauseaVomiting: string;
  gastrointestinalSurgery: string;
  otherDiseases: string;
  otherDiseasesPlaceholder: string;
  
  // Physical Condition
  physicalConditionTitle: string;
  feelsWeaker: string;
  muscleLoss: string;
  frequentInfections: string;
  difficultyGettingUp: string;
  shortnessOfBreath: string;
  
  // Drinking
  drinkingQuestion: string;
  drinkingLess1: string;
  drinking1point5: string;
  drinkingMore1point5: string;
  
  // Swallowing
  swallowingQuestion: string;
  swallowingSubtitle: string;
  swallowingDetailsPlaceholder: string;
  
  // Medication
  medicationQuestion: string;
  medicationPlaceholder: string;
  
  // Supplements
  supplementsQuestion: string;
  supplementsPlaceholder: string;
  
  // Nutrition Therapy
  nutritionTherapyQuestion: string;
  nutritionTherapySubtitle: string;
  nutritionTherapyPlaceholder: string;
  
  // Infusions
  infusionsQuestion: string;
  infusionsPlaceholder: string;
  
  // Final question
  nutritionCounselingQuestion: string;
  
  // Results
  severeMalnutrition: string;
  mildMalnutrition: string;
  noMalnutrition: string;
  malnutritionExplanation: string;
  noMalnutritionExplanation: string;
  scoreLabel: string;
  scoreMild: string;
  scoreSevere: string;
  
  // Counseling
  counselingQuestion: string;
  counselingQuestionNoRisk: string;
  counselingThankYou: string;
  
  // Therapy
  therapyRecommendation: string;
  energy: string;
  protein: string;
  perDay: string;
  
  // Score breakdown
  scoreBreakdown: string;
  bmiLabel: string;
  weightLossScore: string;
  nutritionScore: string;
  diseaseScore: string;
  physicalConditionScore: string;
  swallowingScore: string;
  totalScore: string;
}

export const translations: Record<PatientLanguage, Translations> = {
  de: {
    // Common
    yes: 'Ja',
    no: 'Nein',
    next: 'Weiter',
    back: 'Zurück',
    finish: 'Abschließen',
    copied: 'Kopiert!',
    dashboard: 'Dashboard',
    newScreening: 'Neues Screening',
    copyReport: 'Bericht kopieren',
    
    // Intro
    introTitle: 'Einleitung',
    introText1: 'Mangelernährung bei Menschen ist nicht selten.',
    introText2: 'Die Ursachen sind vielfältig, dazu gehören unter anderem konsumierende Erkrankungen wie Krebs, Rheuma, chronische Lungenerkrankungen, schwere Herzinsuffizienz und viele andere.',
    introText3: 'Auch nach schweren Erkrankungen, Unfällen, Operationen und im Alter kann es zu Mangelernährungszuständen kommen.',
    introText4: 'Appetitlosigkeit ist ein Leitsymptom der Mangelernährung.',
    introText5: 'Folge davon sind nicht nur teilweise beträchtlicher Gewichtsverlust, sondern auch häufig Kraftverlust durch Muskelabbau, Immobilität, Konzentrationsschwäche, Schwindel, Antriebslosigkeit, verringerte Infektabwehr, erhöhte Infektionsgefahr und schlechtere Verträglichkeit von Therapien (z.B. Chemotherapie, Antibiotikatherapie).',
    introText6: 'Auch ungesunde Diäten (z.B. Nulldiät, streng vegane Kost etc.) können zu Mangelzuständen von Vitaminen, Eiweiß und Spurenelementen führen.',
    introText7: 'Jeder Mangelernährungszustand kann behandelt bzw. ausgeglichen werden.',
    introText8: 'Voraussetzung dafür ist die Erfassung des aktuellen Ernährungszustandes.',
    introText9: 'Häufig wird heute in der medizinischen Einrichtung der Ernährungszustand wenig beachtet und daher ein Mangel nicht erkannt und folglich auch nicht behandelt.',
    introText10: 'Aus diesem Grunde wurde der folgende Fragebogen von Ernährungsmedizinern, Diätassistentinnen, Krankenschwestern und Pharmazeuten entwickelt. Nachdem Sie ihn ausgefüllt haben, wird er von Spezialisten ausgewertet und Ihr Ergebnis und die daraus resultierenden Therapievorschläge schnellstmöglich übermittelt.',
    introPrivacy: 'Alle Daten werden verschlüsselt und können nur in Ihrer Praxis von Ihrem vertrauten Arzt/Ärztin oder medizinischem Fachpersonal Ihnen zugeordnet werden. Niemand außerhalb der medizinischen Einrichtung kann die Daten Ihnen zuordnen.',
    introLetsGo: 'Und nun kann es losgehen:',
    introContinue: 'Weiter zur Patientenerfassung',
    
    // Patient Form
    patientFormTitle: 'Neuen Patienten anlegen',
    patientFormDescription: 'Geben Sie die Initialen und das Geburtsdatum ein. Es werden keine Klarnamen gespeichert.',
    firstName: 'Vorname (Initial)',
    firstNamePlaceholder: 'Hans',
    lastName: 'Nachname (Initial)',
    lastNamePlaceholder: 'Müller',
    birthDateLabel: 'Geburtsdatum',
    patientCode: 'Patienten-Code',
    startScreening: 'Screening starten',
    
    // Gender
    genderQuestion: 'Welches Geschlecht haben Sie?',
    male: 'Männlich',
    female: 'Weiblich',
    diverse: 'Divers',
    
    // Height & Weight
    heightQuestion: 'Wie groß sind Sie?',
    heightSubtitle: 'Nutzen Sie die + und - Tasten',
    heightLabel: 'Körpergröße',
    heightUnit: 'cm',
    weightQuestion: 'Wie viel wiegen Sie aktuell?',
    weightSubtitle: 'Schätzen Sie, wenn Sie unsicher sind',
    weightLabel: 'Aktuelles Körpergewicht',
    weightUnit: 'kg',
    weightUnknown: 'Ich weiß es nicht',
    normalWeightQuestion: 'Wie ist Ihr Normalgewicht?',
    normalWeightSubtitle: 'Das Gewicht, bei dem Sie sich normalerweise wohlfühlen',
    normalWeightLabel: 'Normalgewicht',
    
    // Weight Loss
    weightLossQuestion: 'Haben Sie in den letzten 3 Monaten ungewollt abgenommen?',
    weightLossAmountQuestion: 'Wie viel haben Sie abgenommen?',
    weightLossAmountSubtitle: 'In den letzten 3 Monaten',
    weightLoss1to3: '1 bis 3 kg',
    weightLoss3to6: '3 bis 6 kg',
    weightLossOver6: 'Mehr als 6 kg',
    clothingLooseQuestion: 'Ist Ihre Kleidung oder Ihr Schmuck in letzter Zeit weiter geworden?',
    clothingLooseSubtitle: 'Dies hilft uns, Gewichtsverlust einzuschätzen',
    
    // Meals
    mealsPerDayQuestion: 'Wie viele Mahlzeiten nehmen Sie am Tag zu sich?',
    meal1: '1 Mahlzeit',
    meal2: '2 Mahlzeiten',
    meal3: '3 Mahlzeiten',
    meal4: '4 Mahlzeiten',
    meal5plus: '5+ Mahlzeiten',
    
    // Portions
    portionSizeQuestion: 'Wie groß sind Ihre aktuellen Portionen?',
    portionSizeSubtitle: 'Wählen Sie den passenden Teller',
    fullPlate: 'Voller Teller',
    fullPlateDesc: 'Normale Menge',
    threequarterPlate: '3/4 Teller',
    threequarterPlateDesc: 'Etwas weniger',
    halfPlate: 'Halber Teller',
    halfPlateDesc: 'Die Hälfte',
    quarterPlate: '1/4 Teller',
    quarterPlateDesc: 'Sehr wenig',
    
    // Appetite
    appetiteQuestion: 'Wie beurteilen Angehörige oder Freunde Ihren Appetit?',
    appetiteNormal: 'Normal',
    appetiteLimited: 'Eingeschränkt',
    
    // Frequency
    frequencyLabel: 'Anzahl pro Woche',
    frequencyNever: 'Nie / Selten',
    frequency1to2: '1-2 mal',
    frequency3to4: '3-4 mal',
    frequency5to7: '5-7 mal',
    frequencyDaily: 'Täglich',
    
    // Food questions
    fruitQuestion: 'Wie oft essen Sie Obst in der Woche?',
    vegetablesQuestion: 'Wie oft essen Sie Gemüse in der Woche?',
    sweetQuestion: 'Wie gern essen Sie Süßigkeiten?',
    sweetLike: 'Gern',
    sweetDislike: 'Nicht so gern',
    meatQuestion: 'Wie oft essen Sie Fleisch oder Wurstwaren in der Woche?',
    carbsQuestion: 'Wie oft essen Sie Kohlenhydrate?',
    carbsSubtitle: 'z.B. Brot, Brötchen, Nudeln, Reis, Kartoffeln, Müsli',

    // Diseases
    acuteDiseasesTitle: 'Aktuelle Erkrankungen',
    chronicDiseasesTitle: 'Chronische Erkrankungen',
    cancer: 'Krebs',
    cancerTypePlaceholder: 'Welche Art?',
    acuteInfection: 'Akute Infektion',
    infectionTypePlaceholder: 'Welche Art?',
    heartFailure: 'Herzschwäche (mit Wasser in den Beinen/Ödemen)',
    rheumatism: 'Rheuma',
    lungDisease: 'Chronische Lungenerkrankung',
    kidneyDisease: 'Nierenerkrankung',
    stroke: 'Schlaganfall',
    diarrhea: 'Durchfälle',
    nauseaVomiting: 'Übelkeit/Erbrechen',
    gastrointestinalSurgery: 'Zustand nach Magen-/Darm-Operation',
    otherDiseases: 'Andere Erkrankungen',
    otherDiseasesPlaceholder: 'Falls ja, welche?',
    
    // Physical Condition
    physicalConditionTitle: 'Ihr körperliches Befinden',
    feelsWeaker: 'Fühlen Sie sich schwächer als früher?',
    muscleLoss: 'Haben Sie Muskeln abgebaut?',
    frequentInfections: 'Leiden Sie häufiger an Infektionen?',
    difficultyGettingUp: 'Fällt es Ihnen schwerer aufzustehen und etwas zu unternehmen?',
    shortnessOfBreath: 'Sind Sie kurzatmiger geworden, besonders bei Anstrengungen?',
    
    // Drinking
    drinkingQuestion: 'Wie viel trinken Sie am Tag?',
    drinkingLess1: 'Weniger als 1 Liter',
    drinking1point5: 'Etwa 1,5 Liter',
    drinkingMore1point5: 'Mehr als 1,5 Liter',
    
    // Swallowing
    swallowingQuestion: 'Haben Sie Schluckbeschwerden?',
    swallowingSubtitle: 'z.B. bei Entzündungen, durch Strahlentherapie, nach Operationen',
    swallowingDetailsPlaceholder: 'Welche Art von Beschwerden?',
    
    // Medication
    medicationQuestion: 'Nehmen Sie regelmäßig Medikamente ein?',
    medicationPlaceholder: 'Welche Medikamente nehmen Sie ein?',
    
    // Supplements
    supplementsQuestion: 'Haben Sie Erfahrungen mit Nahrungsergänzungsmitteln?',
    supplementsPlaceholder: 'Welche Nahrungsergänzungsmittel haben Sie verwendet?',
    
    // Nutrition Therapy
    nutritionTherapyQuestion: 'Hatten Sie schon mal eine Ernährungstherapie?',
    nutritionTherapySubtitle: 'z.B. verschreibungspflichtige Produkte wie Fresubin',
    nutritionTherapyPlaceholder: 'Welche Produkte oder Therapien?',
    
    // Infusions
    infusionsQuestion: 'Hatten Sie schon mal Infusionen mit Nährstoffen erhalten?',
    infusionsPlaceholder: 'Welche Infusionen und wie oft?',
    
    // Final question
    nutritionCounselingQuestion: 'Wünschen Sie eine Ernährungsberatung / Ernährungstherapie?',
    
    // Results
    severeMalnutrition: 'Schwerer Mangelernährungszustand',
    mildMalnutrition: 'Leichter Mangelernährungszustand',
    noMalnutrition: 'Kein Mangelernährungszustand',
    malnutritionExplanation: 'Bei Ihnen besteht ein Mangelernährungszustand, der therapiert werden kann und sollte.',
    noMalnutritionExplanation: 'Es besteht kein erhöhtes Risiko für Mangelernährung.',
    scoreLabel: 'Score:',
    scoreMild: '(≥3 = leicht)',
    scoreSevere: '(≥5 = schwer)',
    
    // Counseling
    counselingQuestion: 'Möchten Sie eine Beratung hinsichtlich einer für Sie geeigneten Ernährungstherapie?',
    counselingQuestionNoRisk: 'Es wurde kein akutes Ernährungsrisiko festgestellt. Möchten Sie dennoch eine Ernährungsberatung in Anspruch nehmen?',
    counselingThankYou: 'Vielen Dank! Ein spezialisierter Ernährungsmediziner wird sich mit der Praxis in Verbindung setzen, um die weiteren Schritte abzusprechen.',
    
    // Therapy
    therapyRecommendation: 'Therapie-Empfehlung',
    energy: 'Energie',
    protein: 'Protein',
    perDay: '/Tag',
    
    // Score breakdown
    scoreBreakdown: 'Score-Aufschlüsselung',
    bmiLabel: 'BMI',
    weightLossScore: 'Gewichtsverlust',
    nutritionScore: 'Nahrungszufuhr',
    diseaseScore: 'Erkrankungen',
    physicalConditionScore: 'Körperliches Befinden',
    swallowingScore: 'Schluckbeschwerden',
    totalScore: 'Gesamt',
  },
  
  en: {
    // Common
    yes: 'Yes',
    no: 'No',
    next: 'Next',
    back: 'Back',
    finish: 'Finish',
    copied: 'Copied!',
    dashboard: 'Dashboard',
    newScreening: 'New Screening',
    copyReport: 'Copy Report',
    
    // Intro
    introTitle: 'Introduction',
    introText1: 'Malnutrition in humans is not uncommon.',
    introText2: 'The causes are varied, including consuming diseases such as cancer, rheumatism, chronic lung diseases, severe heart failure, and many others.',
    introText3: 'Malnutrition can also occur after serious illnesses, accidents, surgeries, and in old age.',
    introText4: 'Loss of appetite is a key symptom of malnutrition.',
    introText5: 'The consequences include not only significant weight loss, but also often loss of strength due to muscle breakdown, immobility, difficulty concentrating, dizziness, lack of drive, reduced immune defense, increased risk of infection, and poorer tolerance of therapies (e.g., chemotherapy, antibiotic therapy).',
    introText6: 'Unhealthy diets (e.g., fasting, strict vegan diets, etc.) can also lead to deficiencies in vitamins, protein, and trace elements.',
    introText7: 'Every state of malnutrition can be treated or compensated.',
    introText8: 'The prerequisite for this is to assess the current nutritional status.',
    introText9: 'Nowadays, nutritional status is often overlooked in medical facilities, meaning deficiencies are not recognized and therefore not treated.',
    introText10: 'For this reason, the following questionnaire was developed by nutritional medicine specialists, dietitians, nurses, and pharmacists. After you complete it, it will be evaluated by specialists and your results and resulting therapy recommendations will be communicated as soon as possible.',
    introPrivacy: 'All data is encrypted and can only be associated with you by your trusted doctor or medical staff in your practice. No one outside the medical facility can associate the data with you.',
    introLetsGo: 'And now let\'s get started:',
    introContinue: 'Continue to Patient Registration',
    
    // Patient Form
    patientFormTitle: 'Register New Patient',
    patientFormDescription: 'Enter the initials and date of birth. No full names are stored.',
    firstName: 'First Name (Initial)',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name (Initial)',
    lastNamePlaceholder: 'Smith',
    birthDateLabel: 'Date of Birth',
    patientCode: 'Patient Code',
    startScreening: 'Start Screening',
    
    // Gender
    genderQuestion: 'What is your gender?',
    male: 'Male',
    female: 'Female',
    diverse: 'Diverse',
    
    // Height & Weight
    heightQuestion: 'How tall are you?',
    heightSubtitle: 'Use the + and - buttons',
    heightLabel: 'Height',
    heightUnit: 'cm',
    weightQuestion: 'What is your current weight?',
    weightSubtitle: 'Estimate if you are unsure',
    weightLabel: 'Current Weight',
    weightUnit: 'kg',
    weightUnknown: "I don't know",
    normalWeightQuestion: 'What is your normal weight?',
    normalWeightSubtitle: 'The weight at which you usually feel comfortable',
    normalWeightLabel: 'Normal Weight',
    
    // Weight Loss
    weightLossQuestion: 'Have you unintentionally lost weight in the last 3 months?',
    weightLossAmountQuestion: 'How much weight have you lost?',
    weightLossAmountSubtitle: 'In the last 3 months',
    weightLoss1to3: '1 to 3 kg',
    weightLoss3to6: '3 to 6 kg',
    weightLossOver6: 'More than 6 kg',
    clothingLooseQuestion: 'Have your clothes or jewelry become looser recently?',
    clothingLooseSubtitle: 'This helps us estimate weight loss',
    
    // Meals
    mealsPerDayQuestion: 'How many meals do you eat per day?',
    meal1: '1 Meal',
    meal2: '2 Meals',
    meal3: '3 Meals',
    meal4: '4 Meals',
    meal5plus: '5+ Meals',
    
    // Portions
    portionSizeQuestion: 'What are your current portion sizes?',
    portionSizeSubtitle: 'Select the appropriate plate',
    fullPlate: 'Full Plate',
    fullPlateDesc: 'Normal amount',
    threequarterPlate: '3/4 Plate',
    threequarterPlateDesc: 'Somewhat less',
    halfPlate: 'Half Plate',
    halfPlateDesc: 'Half the amount',
    quarterPlate: '1/4 Plate',
    quarterPlateDesc: 'Very little',
    
    // Appetite
    appetiteQuestion: 'How do family or friends rate your appetite?',
    appetiteNormal: 'Normal',
    appetiteLimited: 'Limited',
    
    // Frequency
    frequencyLabel: 'Times per week',
    frequencyNever: 'Never / Rarely',
    frequency1to2: '1-2 times',
    frequency3to4: '3-4 times',
    frequency5to7: '5-7 times',
    frequencyDaily: 'Daily',
    
    // Food questions
    fruitQuestion: 'How often do you eat fruit per week?',
    vegetablesQuestion: 'How often do you eat vegetables per week?',
    sweetQuestion: 'How much do you like sweets?',
    sweetLike: 'I like them',
    sweetDislike: 'Not so much',
    meatQuestion: 'How often do you eat meat or sausages per week?',
    carbsQuestion: 'How often do you eat carbohydrates?',
    carbsSubtitle: 'e.g. bread, rolls, pasta, rice, potatoes, cereal',

    // Diseases
    acuteDiseasesTitle: 'Current Illnesses',
    chronicDiseasesTitle: 'Chronic Illnesses',
    cancer: 'Cancer',
    cancerTypePlaceholder: 'What type?',
    acuteInfection: 'Acute Infection',
    infectionTypePlaceholder: 'What type?',
    heartFailure: 'Heart Failure (with water in legs/edema)',
    rheumatism: 'Rheumatism',
    lungDisease: 'Chronic Lung Disease',
    kidneyDisease: 'Kidney Disease',
    stroke: 'Stroke',
    diarrhea: 'Diarrhea',
    nauseaVomiting: 'Nausea/Vomiting',
    gastrointestinalSurgery: 'Post Gastrointestinal Surgery',
    otherDiseases: 'Other Diseases',
    otherDiseasesPlaceholder: 'If yes, which ones?',
    
    // Physical Condition
    physicalConditionTitle: 'Your Physical Condition',
    feelsWeaker: 'Do you feel weaker than before?',
    muscleLoss: 'Have you lost muscle mass?',
    frequentInfections: 'Do you suffer from infections more often?',
    difficultyGettingUp: 'Is it harder for you to get up and do things?',
    shortnessOfBreath: 'Have you become more short of breath, especially during exertion?',
    
    // Drinking
    drinkingQuestion: 'How much do you drink per day?',
    drinkingLess1: 'Less than 1 liter',
    drinking1point5: 'About 1.5 liters',
    drinkingMore1point5: 'More than 1.5 liters',
    
    // Swallowing
    swallowingQuestion: 'Do you have swallowing difficulties?',
    swallowingSubtitle: 'e.g., due to inflammation, radiation therapy, after surgery',
    swallowingDetailsPlaceholder: 'What kind of difficulties?',
    
    // Medication
    medicationQuestion: 'Do you take medication regularly?',
    medicationPlaceholder: 'Which medications do you take?',
    
    // Supplements
    supplementsQuestion: 'Do you have experience with dietary supplements?',
    supplementsPlaceholder: 'Which supplements have you used?',
    
    // Nutrition Therapy
    nutritionTherapyQuestion: 'Have you ever had nutrition therapy?',
    nutritionTherapySubtitle: 'e.g., prescription products like Fresubin',
    nutritionTherapyPlaceholder: 'Which products or therapies?',
    
    // Infusions
    infusionsQuestion: 'Have you ever received nutrient infusions?',
    infusionsPlaceholder: 'Which infusions and how often?',
    
    // Final question
    nutritionCounselingQuestion: 'Would you like nutrition counseling / therapy?',
    
    // Results
    severeMalnutrition: 'Severe Malnutrition',
    mildMalnutrition: 'Mild Malnutrition',
    noMalnutrition: 'No Malnutrition',
    malnutritionExplanation: 'You have a malnutrition condition that can and should be treated.',
    noMalnutritionExplanation: 'There is no increased risk of malnutrition.',
    scoreLabel: 'Score:',
    scoreMild: '(≥3 = mild)',
    scoreSevere: '(≥5 = severe)',
    
    // Counseling
    counselingQuestion: 'Would you like counseling regarding nutrition therapy suitable for you?',
    counselingQuestionNoRisk: 'No acute nutritional risk was identified. Would you still like to take advantage of nutritional counseling?',
    counselingThankYou: 'Thank you! A specialized nutritional medicine specialist will contact the practice to discuss the next steps with you.',
    
    // Therapy
    therapyRecommendation: 'Therapy Recommendation',
    energy: 'Energy',
    protein: 'Protein',
    perDay: '/day',
    
    // Score breakdown
    scoreBreakdown: 'Score Breakdown',
    bmiLabel: 'BMI',
    weightLossScore: 'Weight Loss',
    nutritionScore: 'Food Intake',
    diseaseScore: 'Diseases',
    physicalConditionScore: 'Physical Condition',
    swallowingScore: 'Swallowing Issues',
    totalScore: 'Total',
  },
  
  ru: {
    // Common
    yes: 'Да',
    no: 'Нет',
    next: 'Далее',
    back: 'Назад',
    finish: 'Завершить',
    copied: 'Скопировано!',
    dashboard: 'Панель управления',
    newScreening: 'Новый скрининг',
    copyReport: 'Копировать отчёт',
    
    // Intro
    introTitle: 'Введение',
    introText1: 'Недоедание у людей не является редкостью.',
    introText2: 'Причины разнообразны: истощающие заболевания, такие как рак, ревматизм, хронические заболевания лёгких, тяжёлая сердечная недостаточность и многие другие.',
    introText3: 'Недоедание также может возникнуть после тяжёлых заболеваний, несчастных случаев, операций и в пожилом возрасте.',
    introText4: 'Потеря аппетита является ключевым симптомом недоедания.',
    introText5: 'Последствия включают не только значительную потерю веса, но и потерю силы из-за атрофии мышц, малоподвижность, нарушение концентрации, головокружение, апатию, снижение иммунитета, повышенный риск инфекций и худшую переносимость терапии (например, химиотерапии, антибиотикотерапии).',
    introText6: 'Нездоровые диеты (голодание, строгое веганство и т.д.) также могут привести к дефициту витаминов, белка и микроэлементов.',
    introText7: 'Любое состояние недоедания можно лечить или компенсировать.',
    introText8: 'Предпосылкой для этого является оценка текущего состояния питания.',
    introText9: 'В настоящее время в медицинских учреждениях состояние питания часто упускается из виду, поэтому дефицит не распознаётся и не лечится.',
    introText10: 'По этой причине следующий опросник был разработан специалистами по нутрициологии, диетологами, медсёстрами и фармацевтами. После его заполнения он будет оценён специалистами, и ваши результаты и рекомендации по терапии будут переданы как можно скорее.',
    introPrivacy: 'Все данные зашифрованы и могут быть связаны с вами только вашим лечащим врачом или медицинским персоналом в вашей клинике. Никто за пределами медицинского учреждения не может связать данные с вами.',
    introLetsGo: 'А теперь начнём:',
    introContinue: 'Перейти к регистрации пациента',
    
    // Patient Form
    patientFormTitle: 'Зарегистрировать нового пациента',
    patientFormDescription: 'Введите инициалы и дату рождения. Полные имена не сохраняются.',
    firstName: 'Имя (инициал)',
    firstNamePlaceholder: 'Иван',
    lastName: 'Фамилия (инициал)',
    lastNamePlaceholder: 'Петров',
    birthDateLabel: 'Дата рождения',
    patientCode: 'Код пациента',
    startScreening: 'Начать скрининг',
    
    // Gender
    genderQuestion: 'Какой у вас пол?',
    male: 'Мужской',
    female: 'Женский',
    diverse: 'Другой',
    
    // Height & Weight
    heightQuestion: 'Какой у вас рост?',
    heightSubtitle: 'Используйте кнопки + и -',
    heightLabel: 'Рост',
    heightUnit: 'см',
    weightQuestion: 'Сколько вы сейчас весите?',
    weightSubtitle: 'Примерно, если не уверены',
    weightLabel: 'Текущий вес',
    weightUnit: 'кг',
    weightUnknown: 'Не знаю',
    normalWeightQuestion: 'Каков ваш нормальный вес?',
    normalWeightSubtitle: 'Вес, при котором вы обычно чувствуете себя комфортно',
    normalWeightLabel: 'Нормальный вес',
    
    // Weight Loss
    weightLossQuestion: 'Вы непреднамеренно похудели за последние 3 месяца?',
    weightLossAmountQuestion: 'Сколько веса вы потеряли?',
    weightLossAmountSubtitle: 'За последние 3 месяца',
    weightLoss1to3: 'От 1 до 3 кг',
    weightLoss3to6: 'От 3 до 6 кг',
    weightLossOver6: 'Более 6 кг',
    clothingLooseQuestion: 'Ваша одежда или украшения стали свободнее?',
    clothingLooseSubtitle: 'Это поможет оценить потерю веса',
    
    // Meals
    mealsPerDayQuestion: 'Сколько приёмов пищи у вас в день?',
    meal1: '1 приём пищи',
    meal2: '2 приёма пищи',
    meal3: '3 приёма пищи',
    meal4: '4 приёма пищи',
    meal5plus: '5+ приёмов пищи',
    
    // Portions
    portionSizeQuestion: 'Какого размера ваши порции?',
    portionSizeSubtitle: 'Выберите подходящую тарелку',
    fullPlate: 'Полная тарелка',
    fullPlateDesc: 'Обычное количество',
    threequarterPlate: '3/4 тарелки',
    threequarterPlateDesc: 'Немного меньше',
    halfPlate: 'Половина тарелки',
    halfPlateDesc: 'Половина порции',
    quarterPlate: '1/4 тарелки',
    quarterPlateDesc: 'Очень мало',
    
    // Appetite
    appetiteQuestion: 'Как родственники или друзья оценивают ваш аппетит?',
    appetiteNormal: 'Нормальный',
    appetiteLimited: 'Сниженный',
    
    // Frequency
    frequencyLabel: 'Раз в неделю',
    frequencyNever: 'Никогда / Редко',
    frequency1to2: '1-2 раза',
    frequency3to4: '3-4 раза',
    frequency5to7: '5-7 раз',
    frequencyDaily: 'Ежедневно',
    
    // Food questions
    fruitQuestion: 'Как часто вы едите фрукты в неделю?',
    vegetablesQuestion: 'Как часто вы едите овощи в неделю?',
    sweetQuestion: 'Насколько вы любите сладкое?',
    sweetLike: 'Люблю',
    sweetDislike: 'Не очень',
    meatQuestion: 'Как часто вы едите мясо или колбасы в неделю?',
    carbsQuestion: 'Как часто вы едите углеводы?',
    carbsSubtitle: 'напр. хлеб, булочки, макароны, рис, картофель, мюсли',

    // Diseases
    acuteDiseasesTitle: 'Текущие заболевания',
    chronicDiseasesTitle: 'Хронические заболевания',
    cancer: 'Рак',
    cancerTypePlaceholder: 'Какой вид?',
    acuteInfection: 'Острая инфекция',
    infectionTypePlaceholder: 'Какого типа?',
    heartFailure: 'Сердечная недостаточность (с отёками ног)',
    rheumatism: 'Ревматизм',
    lungDisease: 'Хроническое заболевание лёгких',
    kidneyDisease: 'Заболевание почек',
    stroke: 'Инсульт',
    diarrhea: 'Диарея',
    nauseaVomiting: 'Тошнота/Рвота',
    gastrointestinalSurgery: 'Состояние после операции на ЖКТ',
    otherDiseases: 'Другие заболевания',
    otherDiseasesPlaceholder: 'Если да, какие?',
    
    // Physical Condition
    physicalConditionTitle: 'Ваше физическое состояние',
    feelsWeaker: 'Чувствуете ли вы себя слабее, чем раньше?',
    muscleLoss: 'Потеряли ли вы мышечную массу?',
    frequentInfections: 'Болеете ли вы инфекциями чаще?',
    difficultyGettingUp: 'Вам стало труднее вставать и что-то делать?',
    shortnessOfBreath: 'Появилась ли одышка, особенно при нагрузках?',
    
    // Drinking
    drinkingQuestion: 'Сколько вы пьёте жидкости в день?',
    drinkingLess1: 'Менее 1 литра',
    drinking1point5: 'Около 1,5 литра',
    drinkingMore1point5: 'Более 1,5 литра',
    
    // Swallowing
    swallowingQuestion: 'Есть ли у вас проблемы с глотанием?',
    swallowingSubtitle: 'например, при воспалениях, после лучевой терапии, после операций',
    swallowingDetailsPlaceholder: 'Какие именно проблемы?',
    
    // Medication
    medicationQuestion: 'Принимаете ли вы регулярно лекарства?',
    medicationPlaceholder: 'Какие лекарства вы принимаете?',
    
    // Supplements
    supplementsQuestion: 'Есть ли у вас опыт приёма пищевых добавок?',
    supplementsPlaceholder: 'Какие добавки вы использовали?',
    
    // Nutrition Therapy
    nutritionTherapyQuestion: 'Проходили ли вы нутритивную терапию?',
    nutritionTherapySubtitle: 'например, рецептурные продукты типа Fresubin',
    nutritionTherapyPlaceholder: 'Какие продукты или терапии?',
    
    // Infusions
    infusionsQuestion: 'Получали ли вы инфузии с питательными веществами?',
    infusionsPlaceholder: 'Какие инфузии и как часто?',
    
    // Final question
    nutritionCounselingQuestion: 'Хотите ли вы консультацию по питанию / нутритивной терапии?',
    
    // Results
    severeMalnutrition: 'Тяжёлое недоедание',
    mildMalnutrition: 'Лёгкое недоедание',
    noMalnutrition: 'Недоедание отсутствует',
    malnutritionExplanation: 'У вас состояние недоедания, которое может и должно быть вылечено.',
    noMalnutritionExplanation: 'Повышенного риска недоедания нет.',
    scoreLabel: 'Баллы:',
    scoreMild: '(≥3 = лёгкое)',
    scoreSevere: '(≥5 = тяжёлое)',
    
    // Counseling
    counselingQuestion: 'Хотите ли вы получить консультацию по подходящей вам нутритивной терапии?',
    counselingQuestionNoRisk: 'Острого риска нарушения питания не выявлено. Хотите ли вы всё же воспользоваться консультацией по питанию?',
    counselingThankYou: 'Спасибо! Специализированный врач-диетолог свяжется с клиникой, чтобы обсудить с вами дальнейшие шаги.',
    
    // Therapy
    therapyRecommendation: 'Рекомендация по терапии',
    energy: 'Энергия',
    protein: 'Белок',
    perDay: '/день',
    
    // Score breakdown
    scoreBreakdown: 'Расшифровка баллов',
    bmiLabel: 'ИМТ',
    weightLossScore: 'Потеря веса',
    nutritionScore: 'Питание',
    diseaseScore: 'Заболевания',
    physicalConditionScore: 'Физическое состояние',
    swallowingScore: 'Проблемы с глотанием',
    totalScore: 'Итого',
  },
};
