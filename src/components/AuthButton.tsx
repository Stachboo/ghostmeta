import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

export default function AuthButton() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-zinc-700/50 bg-zinc-900/50 text-zinc-400 h-8"
      >
        <User className="w-4 h-4 mr-1" />
        <span className="text-xs">{t('auth.loading', 'Initialisation...')}</span>
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="border-zinc-700/50 bg-zinc-900/50 text-emerald-400 hover:bg-zinc-800/50 hover:text-emerald-300 h-8 glass"
      >
        <LogOut className="w-4 h-4 mr-1" />
        <span className="text-xs">{t('auth.logout', 'Déconnexion')}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignIn}
      className="border-zinc-700/50 bg-zinc-900/50 text-emerald-400 hover:bg-zinc-800/50 hover:text-emerald-300 h-8 glass"
    >
      <LogIn className="w-4 h-4 mr-1" />
      <span className="text-xs">{t('auth.login', 'Accès Sécurisé')}</span>
    </Button>
  );
}
