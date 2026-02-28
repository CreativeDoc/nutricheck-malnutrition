import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface Scores {
  bmi: number;
  weightLossScore: number;
  nutritionScore: number;
  diseaseScore: number;
  physicalConditionScore: number;
  swallowingScore: number;
}

interface Recommendations {
  energy: number;
  protein: number;
}

interface ScreeningAnswers {
  birthDate: string;
  gender: string | null;
  height: number | null;
  weight: number | null;
  normalWeight: number | null;
  weightUnknown: boolean;
  hasWeightLoss: boolean | null;
  weightLossAmount: string | null;
  clothingLoose: boolean | null;
  mealsPerDay: number | null;
  portionSize: number | null;
  appetiteByOthers: string | null;
  fruitPerWeek: string | null;
  vegetablesPerWeek: string | null;
  sweetPreference: string | null;
  meatPerWeek: string | null;
  carbsPerWeek: string | null;
  acuteDiseases: {
    cancer: boolean | null;
    cancerType?: string;
    acuteInfection: boolean | null;
    acuteInfectionDetails?: string;
  };
  chronicDiseases: {
    heartFailure: boolean | null;
    rheumatism: boolean | null;
    lungDisease: boolean | null;
    kidneyDisease: boolean | null;
    stroke: boolean | null;
    diarrhea: boolean | null;
    nauseaVomiting: boolean | null;
    gastrointestinalSurgery: boolean | null;
    otherDiseases?: string;
  };
  feelsWeaker: boolean | null;
  muscleLoss: boolean | null;
  frequentInfections: boolean | null;
  difficultyGettingUp: boolean | null;
  shortnessOfBreath: boolean | null;
  mobilityLevel: string | null;
  drinkingAmount: string | null;
  hasSwallowingIssues: boolean | null;
  swallowingDetails?: string;
  takesMedication: boolean | null;
  medicationDetails?: string;
  hasSupplementExperience: boolean | null;
  supplementDetails?: string;
  hadNutritionTherapy: boolean | null;
  nutritionTherapyDetails?: string;
  hadNutrientInfusions: boolean | null;
  infusionDetails?: string;
  wantsNutritionCounseling: boolean | null;
}

interface ScreeningRequest {
  patient_code: string;
  patient_birth_date: string;
  total_score: number;
  malnutrition_level: "none" | "mild" | "severe";
  report_text: string;
  wants_counseling: boolean;
  practice_email: string;
  scores: Scores;
  recommendations?: Recommendations;
  answers?: ScreeningAnswers;
}

const levelConfig: Record<
  ScreeningRequest["malnutrition_level"],
  { label: string; color: string; lightBg: string }
> = {
  none:   { label: "Kein Risiko",      color: "#2268B2", lightBg: "#eaf1fb" },
  mild:   { label: "Leichtes Risiko",  color: "#f59e0b", lightBg: "#fffbeb" },
  severe: { label: "Schweres Risiko",  color: "#ef4444", lightBg: "#fef2f2" },
};

const BRAND = "#2268B2";
const BRAND_LIGHT = "#eaf1fb";
const BRAND_DARK = "#1a4f8a";

// --- Helper formatters ---

function fmtBool(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return "Keine Angabe";
  return val ? "Ja" : "Nein";
}

function fmtVal(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "Keine Angabe";
  return String(val);
}

function fmtGender(val: string | null): string {
  if (!val) return "Keine Angabe";
  const map: Record<string, string> = { male: "Männlich", female: "Weiblich", diverse: "Divers" };
  return map[val] || val;
}

function fmtPortionSize(val: number | null): string {
  if (val === null) return "Keine Angabe";
  return `${val}%`;
}

function fmtFrequency(val: string | null): string {
  if (!val) return "Keine Angabe";
  const map: Record<string, string> = {
    "0": "0x / Woche",
    "1-2": "1-2x / Woche",
    "3-4": "3-4x / Woche",
    "5-7": "5-7x / Woche",
    daily: "Täglich",
  };
  return map[val] || val;
}

function fmtAppetite(val: string | null): string {
  if (!val) return "Keine Angabe";
  return val === "normal" ? "Normal" : "Eingeschränkt";
}

function fmtMobility(val: string | null): string {
  if (!val) return "Keine Angabe";
  return val === "indoor" ? "Nur in der Wohnung" : "Auch außerhalb";
}

function fmtDrinking(val: string | null): string {
  if (!val) return "Keine Angabe";
  const map: Record<string, string> = { "<1l": "Weniger als 1 Liter", "1.5l": "Ca. 1,5 Liter", ">1.5l": "Mehr als 1,5 Liter" };
  return map[val] || val;
}

function fmtSweet(val: string | null): string {
  if (!val) return "Keine Angabe";
  return val === "like" ? "Mag Süßes" : "Mag kein Süßes";
}

function fmtWeightLoss(val: string | null): string {
  if (!val) return "Keine Angabe";
  const map: Record<string, string> = { none: "Kein Gewichtsverlust", "1-3kg": "1–3 kg", "3-6kg": "3–6 kg", ">6kg": "Mehr als 6 kg" };
  return map[val] || val;
}

// --- Build detail answer row ---

function answerRow(label: string, value: string, idx: number): string {
  const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
  return `<tr style="background:${bg};">
    <td style="padding:9px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #f3f4f6;width:200px;">${label}</td>
    <td style="padding:9px 16px;font-size:14px;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6;">${value}</td>
  </tr>`;
}

function buildAnswerSection(title: string, rows: [string, string][]): string {
  const rowsHtml = rows.map(([label, value], i) => answerRow(label, value, i)).join("");
  return `<tr>
    <td style="padding:0 40px 28px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">${title}</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;border-collapse:separate;">
        ${rowsHtml}
      </table>
    </td>
  </tr>`;
}

function buildDetailedAnswersHtml(a: ScreeningAnswers): string {
  const sections: string[] = [];

  // Körperdaten
  sections.push(buildAnswerSection("Körperdaten", [
    ["Geschlecht", fmtGender(a.gender)],
    ["Größe", a.height !== null ? `${a.height} cm` : "Keine Angabe"],
    ["Gewicht", a.weight !== null ? `${a.weight} kg` : "Keine Angabe"],
    ["BMI", a.height && a.weight ? (a.weight / ((a.height / 100) ** 2)).toFixed(1) : "Keine Angabe"],
    ["Normalgewicht", a.normalWeight !== null ? `${a.normalWeight} kg` : "Keine Angabe"],
  ]));

  // Gewichtsverlust
  sections.push(buildAnswerSection("Gewichtsverlust", [
    ["Gewichtsverlust", fmtBool(a.hasWeightLoss)],
    ["Menge", fmtWeightLoss(a.weightLossAmount)],
    ["Kleidung weiter", fmtBool(a.clothingLoose)],
  ]));

  // Ernährung
  sections.push(buildAnswerSection("Ernährung", [
    ["Mahlzeiten pro Tag", fmtVal(a.mealsPerDay)],
    ["Portionsgröße", fmtPortionSize(a.portionSize)],
    ["Appetitbeurteilung", fmtAppetite(a.appetiteByOthers)],
  ]));

  // Ernährungshäufigkeit
  sections.push(buildAnswerSection("Ernährungshäufigkeit", [
    ["Obst", fmtFrequency(a.fruitPerWeek)],
    ["Gemüse", fmtFrequency(a.vegetablesPerWeek)],
    ["Süßigkeiten", fmtSweet(a.sweetPreference)],
    ["Fleisch", fmtFrequency(a.meatPerWeek)],
    ["Kohlenhydrate", fmtFrequency(a.carbsPerWeek)],
  ]));

  // Aktuelle Erkrankungen
  const acuteRows: [string, string][] = [
    ["Krebs", fmtBool(a.acuteDiseases?.cancer)],
  ];
  if (a.acuteDiseases?.cancer && a.acuteDiseases.cancerType) {
    acuteRows.push(["Krebsart", a.acuteDiseases.cancerType]);
  }
  acuteRows.push(["Akute Infektionen", fmtBool(a.acuteDiseases?.acuteInfection)]);
  if (a.acuteDiseases?.acuteInfection && a.acuteDiseases.acuteInfectionDetails) {
    acuteRows.push(["Infektionsdetails", a.acuteDiseases.acuteInfectionDetails]);
  }
  sections.push(buildAnswerSection("Aktuelle Erkrankungen", acuteRows));

  // Chronische Erkrankungen
  const cd = a.chronicDiseases;
  const chronicRows: [string, string][] = [
    ["Herzschwäche", fmtBool(cd?.heartFailure)],
    ["Rheuma", fmtBool(cd?.rheumatism)],
    ["Lungenerkrankung", fmtBool(cd?.lungDisease)],
    ["Nierenerkrankung", fmtBool(cd?.kidneyDisease)],
    ["Schlaganfall", fmtBool(cd?.stroke)],
    ["Durchfall", fmtBool(cd?.diarrhea)],
    ["Übelkeit/Erbrechen", fmtBool(cd?.nauseaVomiting)],
    ["Magen-Darm-OP", fmtBool(cd?.gastrointestinalSurgery)],
  ];
  if (cd?.otherDiseases) {
    chronicRows.push(["Sonstige", cd.otherDiseases]);
  }
  sections.push(buildAnswerSection("Chronische Erkrankungen", chronicRows));

  // Körperliches Befinden
  sections.push(buildAnswerSection("Körperliches Befinden", [
    ["Schwäche", fmtBool(a.feelsWeaker)],
    ["Muskelabbau", fmtBool(a.muscleLoss)],
    ["Infektanfälligkeit", fmtBool(a.frequentInfections)],
    ["Schwierigkeit beim Aufstehen", fmtBool(a.difficultyGettingUp)],
    ["Kurzatmigkeit", fmtBool(a.shortnessOfBreath)],
  ]));

  // Mobilität und Schlucken
  const mobilityRows: [string, string][] = [
    ["Mobilität", fmtMobility(a.mobilityLevel)],
    ["Trinkmenge", fmtDrinking(a.drinkingAmount)],
    ["Schluckbeschwerden", fmtBool(a.hasSwallowingIssues)],
  ];
  if (a.hasSwallowingIssues && a.swallowingDetails) {
    mobilityRows.push(["Schluckdetails", a.swallowingDetails]);
  }
  sections.push(buildAnswerSection("Mobilität und Schlucken", mobilityRows));

  // Medikation
  const medRows: [string, string][] = [
    ["Medikamente", fmtBool(a.takesMedication)],
  ];
  if (a.takesMedication && a.medicationDetails) {
    medRows.push(["Medikamentendetails", a.medicationDetails]);
  }
  medRows.push(["Nahrungsergänzung", fmtBool(a.hasSupplementExperience)]);
  if (a.hasSupplementExperience && a.supplementDetails) {
    medRows.push(["Ergänzungsdetails", a.supplementDetails]);
  }
  medRows.push(["Ernährungstherapie", fmtBool(a.hadNutritionTherapy)]);
  if (a.hadNutritionTherapy && a.nutritionTherapyDetails) {
    medRows.push(["Therapiedetails", a.nutritionTherapyDetails]);
  }
  medRows.push(["Infusionen", fmtBool(a.hadNutrientInfusions)]);
  if (a.hadNutrientInfusions && a.infusionDetails) {
    medRows.push(["Infusionsdetails", a.infusionDetails]);
  }
  sections.push(buildAnswerSection("Medikation", medRows));

  return sections.join("");
}

function buildEmailHtml(data: ScreeningRequest): string {
  const lvl = levelConfig[data.malnutrition_level];
  const s = data.scores;

  const birthFormatted = data.patient_birth_date
    ? new Date(data.patient_birth_date).toLocaleDateString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    : "–";

  // Score rows with zebra striping
  const scores: [string, number][] = [
    ["Gewichtsverlust", s.weightLossScore],
    ["Nahrungszufuhr", s.nutritionScore],
    ["Erkrankungen", s.diseaseScore],
    ["Körperliches Befinden", s.physicalConditionScore],
    ["Schluckbeschwerden", s.swallowingScore],
  ];

  const scoreRows = scores.map(([label, val], i) => {
    const bg = i % 2 === 0 ? "#ffffff" : "#f9fafb";
    const valColor = val > 0 ? "#b45309" : "#9ca3af";
    const valBg = val > 0 ? "#fef3c7" : "#f3f4f6";
    return `<tr style="background:${bg};">
      <td style="padding:11px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">${label}</td>
      <td style="padding:11px 16px;font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid #f3f4f6;">
        <span style="display:inline-block;background:${valBg};color:${valColor};padding:2px 14px;border-radius:12px;">${val}</span>
      </td>
    </tr>`;
  }).join("");

  // BMI row
  const bmiRow = `<tr style="background:${scores.length % 2 === 0 ? "#ffffff" : "#f9fafb"};">
    <td style="padding:11px 16px;font-size:13px;color:#9ca3af;font-style:italic;border-bottom:1px solid #e5e7eb;">BMI (nicht im Score)</td>
    <td style="padding:11px 16px;font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid #e5e7eb;">
      <span style="display:inline-block;background:#f3f4f6;color:#9ca3af;padding:2px 14px;border-radius:12px;">${s.bmi.toFixed(1)}</span>
    </td>
  </tr>`;

  // Total row
  const totalRow = `<tr style="background:${lvl.lightBg};">
    <td style="padding:13px 16px;font-size:15px;font-weight:700;color:#111827;">GESAMT</td>
    <td style="padding:13px 16px;text-align:right;">
      <span style="display:inline-block;background:${lvl.color};color:#ffffff;font-size:15px;font-weight:700;padding:4px 18px;border-radius:14px;">${data.total_score} Punkte</span>
    </td>
  </tr>`;

  // Therapy recommendation (only if score >= 3)
  const recHtml = data.recommendations ? `<tr>
    <td style="padding:0 40px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_LIGHT};border:1px solid #b8d4f0;border-radius:8px;">
        <tr><td style="padding:18px 20px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size:15px;font-weight:700;color:${BRAND_DARK};padding-bottom:12px;" colspan="2">Therapie-Empfehlung</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:${BRAND_DARK};padding:4px 0;width:170px;">Energiebedarf:</td>
              <td style="font-size:14px;font-weight:700;color:${BRAND_DARK};padding:4px 0;">${data.recommendations.energy} kcal / Tag</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:${BRAND_DARK};padding:4px 0;">Proteinbedarf:</td>
              <td style="font-size:14px;font-weight:700;color:${BRAND_DARK};padding:4px 0;">${data.recommendations.protein} g / Tag</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>` : "";

  // Counseling box
  const counselingHtml = data.wants_counseling
    ? `<tr><td style="padding:0 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_LIGHT};border:2px solid ${BRAND};border-radius:8px;">
          <tr><td style="padding:16px 20px;font-size:14px;color:${BRAND_DARK};font-weight:700;">
            &#10003;&ensp;Patient wünscht Ernährungsberatung
          </td></tr>
        </table>
      </td></tr>`
    : `<tr><td style="padding:0 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
          <tr><td style="padding:14px 20px;font-size:13px;color:#9ca3af;">
            Ernährungsberatung: nicht gewünscht
          </td></tr>
        </table>
      </td></tr>`;

  // Detailed answers section
  const detailedAnswersHtml = data.answers ? buildDetailedAnswersHtml(data.answers) : "";

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NutriCheck Screening</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">

      <!-- Inner card 600px -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- ===== HEADER ===== -->
        <tr>
          <td style="background:#ffffff;padding:32px 40px 20px;border-bottom:3px solid ${BRAND};">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="width:6px;height:32px;background:${BRAND};border-radius:3px;"></td>
              <td style="padding-left:14px;">
                <span style="font-size:26px;font-weight:700;color:#111827;letter-spacing:-0.5px;">Nutri</span><span style="font-size:26px;font-weight:700;color:${BRAND};letter-spacing:-0.5px;">Check</span>
              </td>
            </tr></table>
            <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">Screening-Ergebnis</p>
          </td>
        </tr>

        <!-- ===== AMPEL BANNER ===== -->
        <tr>
          <td style="padding:24px 40px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${lvl.color};border-radius:10px;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">${lvl.label}</span>
                  <br />
                  <span style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;display:inline-block;">Score ${data.total_score} &mdash; ${data.malnutrition_level === "none" ? "0–2 Punkte" : data.malnutrition_level === "mild" ? "3–4 Punkte" : "&ge;5 Punkte"}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== PATIENTENDATEN ===== -->
        <tr>
          <td style="padding:8px 40px 24px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Patientendaten</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td style="padding:10px 16px;font-size:13px;color:#6b7280;width:160px;border-bottom:1px solid #e5e7eb;">Patienten-Code</td>
                <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#111827;border-bottom:1px solid #e5e7eb;">${data.patient_code}</td>
              </tr>
              <tr style="background:#ffffff;">
                <td style="padding:10px 16px;font-size:13px;color:#6b7280;">Geburtsdatum</td>
                <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#111827;">${birthFormatted}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== SCORE TABLE ===== -->
        <tr>
          <td style="padding:0 40px 28px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Score-Aufschlüsselung</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;border-collapse:separate;">
              ${scoreRows}
              ${bmiRow}
              ${totalRow}
            </table>
          </td>
        </tr>

        <!-- ===== THERAPIE-EMPFEHLUNG ===== -->
        ${recHtml}

        <!-- ===== BERATUNGSWUNSCH ===== -->
        ${counselingHtml}

        <!-- ===== DETAILLIERTE ANTWORTEN ===== -->
        ${detailedAnswersHtml}

        <!-- ===== FOOTER ===== -->
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
              Diese E-Mail wurde automatisch vom NutriCheck Screening-System generiert. Die enthaltenen Daten sind vertraulich und ausschließlich für den angegebenen Empfänger bestimmt. Bitte beachten Sie die geltenden Datenschutzbestimmungen (DSGVO) bei der Verarbeitung patientenbezogener Informationen.
            </p>
          </td>
        </tr>

      </table>
      <!-- /card -->

    </td></tr>
  </table>
  <!-- /wrapper -->

</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body: ScreeningRequest = await req.json();

    const required: (keyof ScreeningRequest)[] = [
      "patient_code",
      "total_score",
      "malnutrition_level",
      "practice_email",
      "scores",
    ];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Read CC email from app_settings via service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[DEBUG] SUPABASE_URL set:", !!supabaseUrl);
    console.log("[DEBUG] SUPABASE_SERVICE_ROLE_KEY set:", !!serviceRoleKey);
    console.log("[DEBUG] SUPABASE_SERVICE_ROLE_KEY length:", serviceRoleKey?.length ?? 0);

    let ccEmail: string | null = null;
    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      const { data: ccRow, error: ccError } = await adminClient
        .from("app_settings")
        .select("value")
        .eq("key", "cc_email")
        .single();

      console.log("[DEBUG] app_settings query result:", JSON.stringify(ccRow));
      console.log("[DEBUG] app_settings query error:", JSON.stringify(ccError));
      ccEmail = ccRow?.value || null;
    } else {
      console.log("[DEBUG] Skipping CC lookup — missing env vars");
    }

    console.log("[DEBUG] ccEmail resolved to:", ccEmail);
    console.log("[DEBUG] practice_email from body:", body.practice_email);

    const config = levelConfig[body.malnutrition_level];
    const subject = `NutriCheck Screening: ${body.patient_code} – ${config.label}`;

    // Build recipients: always include practice_email, add CC if different
    const toAddresses = [body.practice_email];
    if (ccEmail && ccEmail !== body.practice_email) {
      toAddresses.push(ccEmail);
    }

    const emailPayload: Record<string, unknown> = {
      from: "NutriCheck <noreply@staycozy.info>",
      to: toAddresses,
      subject,
      html: buildEmailHtml(body),
    };

    console.log("[DEBUG] Resend payload (without html):", JSON.stringify({
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
    }));

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendRes.json();
    console.log("[DEBUG] Resend response status:", resendRes.status);
    console.log("[DEBUG] Resend response body:", JSON.stringify(resendData));

    if (!resendRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        { status: resendRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: resendData.id,
        debug: {
          to: toAddresses,
          cc_email_from_db: ccEmail,
          service_role_key_set: !!serviceRoleKey,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
