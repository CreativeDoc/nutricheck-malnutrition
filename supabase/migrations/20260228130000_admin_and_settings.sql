-- ============================================
-- Admin support & app_settings
-- ============================================

-- 1. is_admin() helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- 2. Admin RLS policies on practices
CREATE POLICY "admin select all practices"
  ON public.practices FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admin update all practices"
  ON public.practices FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "admin delete all practices"
  ON public.practices FOR DELETE
  USING (public.is_admin());

-- 3. Admin RLS policies on profiles
CREATE POLICY "admin select all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admin update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- 4. Admin RLS policies on screenings
CREATE POLICY "admin select all screenings"
  ON public.screenings FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admin update all screenings"
  ON public.screenings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "admin delete all screenings"
  ON public.screenings FOR DELETE
  USING (public.is_admin());

-- 5. app_settings table
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin select app_settings"
  ON public.app_settings FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admin insert app_settings"
  ON public.app_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "admin update app_settings"
  ON public.app_settings FOR UPDATE
  USING (public.is_admin());

-- Initial CC email setting
INSERT INTO public.app_settings (key, value)
VALUES ('cc_email', 'markus.blanke@2docs.eu');

-- 6. Fix handle_new_user: new signups get role 'user' (not 'admin')
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
    'user'
  );

  RETURN NEW;
END;
$$;
