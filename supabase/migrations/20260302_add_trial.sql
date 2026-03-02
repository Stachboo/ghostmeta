-- Migration: Ajout de la période d'essai gratuite (30 jours)
-- Les nouveaux utilisateurs reçoivent automatiquement 30 jours d'accès complet.
-- Après expiration → retour au plan gratuit.
-- Les utilisateurs existants ne sont pas affectés (trial_ends_at = NULL).

-- 1. Ajouter la colonne trial_ends_at
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Mettre à jour le trigger handle_new_user pour inclure trial_ends_at
-- Ce trigger est déclenché à chaque INSERT dans auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), profiles.avatar_url);

  RETURN NEW;
END;
$$;

-- 3. S'assurer que le trigger existe sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- NOTE: Activer le provider Email dans Supabase Dashboard
-- Authentication > Providers > Email > Enable
