import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const CHECKOUT_PENDING_KEY = 'ghostmeta_checkout_pending';
const POLL_INTERVAL_MS = 3_000;
const POLL_TIMEOUT_MS = 5 * 60 * 1_000; // 5 minutes

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_premium?: boolean;
  has_viewed_metadata?: boolean;
  created_at: string;
}

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        setError(new Error(profileError.message));
        return null;
      }

      setError(null);
      return data as Profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur réseau'));
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user?.id, fetchProfile]);

  // Polling : activé uniquement si un checkout est en cours (flag localStorage)
  // et que l'utilisateur n'est pas encore premium.
  useEffect(() => {
    if (!user?.id) return;

    // Premium vient de s'activer ET un checkout était en attente → toast + cleanup
    if (profile?.is_premium) {
      if (localStorage.getItem(CHECKOUT_PENDING_KEY) === 'true') {
        stopPolling();
        localStorage.removeItem(CHECKOUT_PENDING_KEY);
        toast.success('Bienvenue en Pro ! ✨');
      }
      return;
    }

    // Pas premium + pas de checkout en attente → rien à faire
    if (localStorage.getItem(CHECKOUT_PENDING_KEY) !== 'true') return;

    // Interval déjà actif → ne pas en créer un second
    if (pollIntervalRef.current) return;

    pollIntervalRef.current = setInterval(async () => {
      const profileData = await fetchProfile(user.id);
      if (profileData) setProfile(profileData);
    }, POLL_INTERVAL_MS);

    // Sécurité : stoppe le polling après 5 minutes quoi qu'il arrive
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling();
      localStorage.removeItem(CHECKOUT_PENDING_KEY);
    }, POLL_TIMEOUT_MS);

    return () => {
      stopPolling();
    };
  }, [user?.id, profile?.is_premium, fetchProfile, stopPolling]);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser?.id) {
        const profileData = await fetchProfile(currentUser.id);
        setProfile(profileData);
      }

      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser?.id) {
          const profileData = await fetchProfile(currentUser.id);
          setProfile(profileData);
        } else {
          setProfile(null);
          setError(null);
          stopPolling();
          localStorage.removeItem(CHECKOUT_PENDING_KEY);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      stopPolling();
    };
  }, [fetchProfile, stopPolling]);

  return {
    user,
    profile,
    loading,
    error,
    refreshProfile,
  };
}

export default useAuth;
