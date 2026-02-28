-- ============================================
-- Fix: Reset all users to 'user', then set admin
-- ============================================

-- 1. Reset ALL existing profiles to 'user'
UPDATE public.profiles SET role = 'user';

-- 2. Set only the designated admin
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'markus.blanke@2docs.eu' LIMIT 1);

-- 3. Ensure is_admin() exists and is correct (idempotent)
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

-- 4. Ensure admin RLS policies exist (drop + create to be idempotent)

-- practices
DROP POLICY IF EXISTS "admin select all practices" ON public.practices;
CREATE POLICY "admin select all practices"
  ON public.practices FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin update all practices" ON public.practices;
CREATE POLICY "admin update all practices"
  ON public.practices FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin delete all practices" ON public.practices;
CREATE POLICY "admin delete all practices"
  ON public.practices FOR DELETE
  USING (public.is_admin());

-- profiles
DROP POLICY IF EXISTS "admin select all profiles" ON public.profiles;
CREATE POLICY "admin select all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin update all profiles" ON public.profiles;
CREATE POLICY "admin update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- screenings
DROP POLICY IF EXISTS "admin select all screenings" ON public.screenings;
CREATE POLICY "admin select all screenings"
  ON public.screenings FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin update all screenings" ON public.screenings;
CREATE POLICY "admin update all screenings"
  ON public.screenings FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin delete all screenings" ON public.screenings;
CREATE POLICY "admin delete all screenings"
  ON public.screenings FOR DELETE
  USING (public.is_admin());
