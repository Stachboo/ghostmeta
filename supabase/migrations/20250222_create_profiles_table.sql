-- Migration: Create profiles table (base table, required by all later migrations)
-- Date: 2025-02-22 (antidatée : la table existait avant 20250223_create_subscriptions_table
--   mais n'avait jamais été capturée en migration — créée à la main dans le dashboard à
--   l'époque. Reconstruite le 2026-06-10 pour la migration vers le nouveau projet.)
--
-- Schéma dérivé strictement du code existant (aucune colonne inventée) :
--   - id, email, full_name, avatar_url : INSERT de handle_new_user() (20260302_add_trial.sql)
--   - has_viewed_metadata              : lock_metadata_view() (20260227) + interface Profile (useAuth.ts)
--   - created_at                       : interface Profile (useAuth.ts:19)
--   - updated_at                       : lemon-webhook/index.ts:176, lock_metadata_view(), sync_profile_premium_status()
--   - is_premium et trial_ends_at sont ajoutées par 20250223 et 20260302 respectivement.

CREATE TABLE IF NOT EXISTS public.profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT,
    full_name  TEXT,
    avatar_url TEXT,
    has_viewed_metadata BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Le client (useAuth.ts) lit uniquement son propre profil avec la clé anon authentifiée.
-- Les écritures passent par des chemins privilégiés qui contournent RLS :
-- trigger handle_new_user (SECURITY DEFINER), lock_metadata_view (SECURITY DEFINER),
-- webhook Lemon Squeezy (service_role).
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = id);
