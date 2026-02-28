-- Add app_language to practices for per-practice UI language
ALTER TABLE public.practices ADD COLUMN app_language text NOT NULL DEFAULT 'de';
