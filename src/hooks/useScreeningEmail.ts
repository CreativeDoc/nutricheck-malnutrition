import { useState, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ScreeningEmailParams {
  patient_code: string;
  patient_birth_date: string;
  total_score: number;
  malnutrition_level: 'none' | 'mild' | 'severe';
  report_text: string;
  wants_counseling: boolean;
  practice_email: string;
  scores: {
    bmi: number;
    weightLossScore: number;
    nutritionScore: number;
    diseaseScore: number;
    physicalConditionScore: number;
    swallowingScore: number;
  };
  recommendations?: {
    energy: number;
    protein: number;
  };
}

export function useScreeningEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendScreeningEmail = useCallback(async (params: ScreeningEmailParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/send-screening-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(params),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Email konnte nicht gesendet werden');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendScreeningEmail, isLoading, error };
}
