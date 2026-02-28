import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://movgzqqbgojhevlacupk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2Cg3t4UERtNqjNg5OciKXw_20lblpDv';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_URL oder VITE_SUPABASE_ANON_KEY sind nicht gesetzt. Verwende hardcoded Fallback-Werte.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
