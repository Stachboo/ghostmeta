-- Migration: Security hardening (findings des advisors Supabase, 2026-06-10)
--
-- 1. api_usage_daily était SECURITY DEFINER (défaut Postgres pour les vues) :
--    la vue contournait la RLS de api_usage, donc tout utilisateur authentifié
--    pouvait lire les agrégats d'usage de TOUS les utilisateurs (advisor ERROR
--    security_definer_view). En security_invoker, la policy "Users can view own
--    api usage" s'applique au lecteur — le /settings UI ne lit que ses propres
--    lignes, comportement inchangé pour l'usage légitime.
ALTER VIEW public.api_usage_daily SET (security_invoker = true);

-- 2. search_path explicite sur les fonctions trigger qui ne l'avaient pas
--    (advisor WARN function_search_path_mutable).
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.sync_profile_premium_status() SET search_path = public;
