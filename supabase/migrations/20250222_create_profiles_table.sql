-- Migration: Create the base `profiles` table + RLS (reconstruction)
-- Date: 2025-02-22 (datée AVANT 20250223_create_subscriptions_table.sql qui référence profiles)
--
-- CONTEXTE : la table `profiles` avait été créée manuellement dans le dashboard
-- Supabase et n'existait dans AUCUNE migration — donc son RLS n'était ni versionné
-- ni auditable. Cette migration reconstruit fidèlement l'état réel de la table de
-- base (vérifié en live le 2026-06-22) pour rendre la sécurité auditable et
-- reproductible sur un environnement neuf.
--
-- Colonnes ajoutées par des migrations ULTÉRIEURES, volontairement absentes ici
-- (pour préserver l'historique réel) :
--   - is_premium      → ajouté par 20250223_create_subscriptions_table.sql
--   - trial_ends_at   → ajouté par 20260302_add_trial.sql
-- De même, le trigger handle_new_user (auth.users → profiles) appartient à
-- 20260302_add_trial.sql et n'est pas redéfini ici.
--
-- Idempotente : sûre à rejouer (IF NOT EXISTS + DROP POLICY IF EXISTS). Sur la prod
-- existante c'est un no-op ; elle sert au versioning et aux setups neufs.

-- ============================================================================
-- PROFILES TABLE (base)
-- ============================================================================
-- 1 ligne par utilisateur authentifié. La PK est aussi une FK vers auth.users :
-- la suppression d'un compte Auth supprime le profil en cascade.

CREATE TABLE IF NOT EXISTS public.profiles (
    id                  UUID        PRIMARY KEY
                                    REFERENCES auth.users(id) ON DELETE CASCADE,
    email               TEXT,
    full_name           TEXT,
    avatar_url          TEXT,
    has_viewed_metadata BOOLEAN     DEFAULT false,
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Posture (vérifiée live 2026-06-22) : RLS activé avec UNIQUEMENT une policy
-- SELECT sur sa propre ligne. AUCUNE policy INSERT/UPDATE/DELETE → en RLS,
-- l'absence de policy pour une commande = DENY par défaut. Conséquence
-- sécurité : un utilisateur connecté NE PEUT PAS écrire dans `profiles`, donc
-- l'attaque « UPDATE profiles SET is_premium = true WHERE id = auth.uid() » est
-- refusée. Toutes les écritures (is_premium, trial_ends_at, has_viewed_metadata)
-- passent exclusivement par :
--   - le service_role (edge function webhook Lemon Squeezy, qui bypass le RLS) ;
--   - les fonctions SECURITY DEFINER contrôlées (handle_new_user, lock_metadata_view),
--     qui ne touchent que la ligne du caller via auth.uid().
-- NE PAS ajouter de policy UPDATE/INSERT/DELETE côté client sans revue sécurité.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = id);
