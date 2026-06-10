-- Migration: Function grants + perf RLS (suite des advisors, 2026-06-10)

-- handle_new_user est une fonction trigger (on_auth_user_created) : elle ne doit
-- jamais être exposée comme RPC via /rest/v1/rpc/ (advisor WARN: exécutable par
-- anon et authenticated en SECURITY DEFINER).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- lock_metadata_view est appelée via supabase.rpc() par les utilisateurs connectés
-- (src/hooks/useImageProcessor.ts:82) : on garde authenticated, on retire anon.
REVOKE EXECUTE ON FUNCTION public.lock_metadata_view() FROM PUBLIC, anon;

-- Perf RLS (advisor auth_rls_initplan) : (select auth.uid()) est évalué une fois
-- par requête au lieu d'une fois par ligne.
ALTER POLICY "Users can view own subscriptions" ON public.subscriptions
    USING ((SELECT auth.uid()) = user_id);
ALTER POLICY "Users can view own api keys" ON public.api_keys
    USING ((SELECT auth.uid()) = user_id);
ALTER POLICY "Users can insert own api keys" ON public.api_keys
    WITH CHECK ((SELECT auth.uid()) = user_id);
ALTER POLICY "Users can revoke own api keys" ON public.api_keys
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
ALTER POLICY "Users can view own api usage" ON public.api_usage
    USING ((SELECT auth.uid()) = user_id);
