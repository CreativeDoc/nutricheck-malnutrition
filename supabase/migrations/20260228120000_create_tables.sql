-- ============================================
-- NutriCheck: practices, profiles, screenings
-- ============================================

-- 1. Tables
-- ---------

CREATE TABLE public.practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  practice_id uuid NOT NULL REFERENCES public.practices ON DELETE CASCADE,
  display_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.screenings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid NOT NULL REFERENCES public.practices ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users ON DELETE SET NULL,
  patient_code text NOT NULL,
  birth_date date,
  language text NOT NULL DEFAULT 'de',
  answers jsonb,
  scores jsonb,
  total_score integer,
  malnutrition_level text CHECK (malnutrition_level IN ('none', 'mild', 'severe')),
  is_at_risk boolean,
  wants_counseling boolean,
  practice_email text,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Helper function: get current user's practice_id
-- ---------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_practice_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT practice_id FROM public.profiles WHERE id = auth.uid()
$$;

-- 3. Row Level Security
-- ---------------------

ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;

-- practices: users see/update only their own practice
CREATE POLICY "select own practice"
  ON public.practices FOR SELECT
  USING (id = public.get_practice_id());

CREATE POLICY "update own practice"
  ON public.practices FOR UPDATE
  USING (id = public.get_practice_id());

-- profiles: users see/update only their own profile
CREATE POLICY "select own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- screenings: users see/insert screenings for their practice
CREATE POLICY "select practice screenings"
  ON public.screenings FOR SELECT
  USING (practice_id = public.get_practice_id());

CREATE POLICY "insert practice screenings"
  ON public.screenings FOR INSERT
  WITH CHECK (practice_id = public.get_practice_id());

CREATE POLICY "update practice screenings"
  ON public.screenings FOR UPDATE
  USING (practice_id = public.get_practice_id());

-- 4. Auto-create practice + profile on signup
-- --------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_practice_id uuid;
BEGIN
  INSERT INTO public.practices (name, email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'practice_name', 'Meine Praxis'),
    NEW.email
  )
  RETURNING id INTO new_practice_id;

  INSERT INTO public.profiles (id, practice_id, display_name, role)
  VALUES (
    NEW.id,
    new_practice_id,
    COALESCE(NEW.raw_user_meta_data->>'practice_name', ''),
    'admin'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
