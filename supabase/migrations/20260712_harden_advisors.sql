-- Migration: durcissement suite aux advisors sécurité Supabase (2026-07-12)
-- Applique les correctifs remontés par le database linter sur le schéma de base.

-- 1. ERROR security_definer_view : la vue d'agrégat d'usage API doit s'exécuter
--    avec les permissions du caller (security_invoker) et non du créateur, sinon
--    un utilisateur authentifié pourrait lire l'usage API de TOUS les comptes.
ALTER VIEW public.api_usage_daily SET (security_invoker = on);

-- 2. WARN function_search_path_mutable : figer le search_path des fonctions
--    trigger pour éviter tout détournement via un search_path malveillant.
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.sync_profile_premium_status() SET search_path = public;
