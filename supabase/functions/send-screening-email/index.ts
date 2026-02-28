import "@supabase/functions-js/edge-runtime.d.ts";

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

    const config = levelConfig[body.malnutrition_level];
    const subject = `NutriCheck Screening: ${body.patient_code} – ${config.label}`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "NutriCheck <noreply@staycozy.info>",
        to: [body.practice_email],
        subject,
        html: buildEmailHtml(body),
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        { status: resendRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
