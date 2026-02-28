import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('VITE_SUPABASE_URL oder VITE_SUPABASE_ANON_KEY sind nicht gesetzt. Supabase-Client wird mit Fallback-Werten initialisiert.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
