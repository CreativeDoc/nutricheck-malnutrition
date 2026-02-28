-- Set markus.blanke@2docs.eu as admin
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'markus.blanke@2docs.eu' LIMIT 1);
