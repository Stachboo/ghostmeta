import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Check, Zap, Shield, Image, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const LEMON_SQUEEZY_MONTHLY_ID = import.meta.env.VITE_LEMON_SQUEEZY_MONTHLY_ID;
const LEMON_SQUEEZY_YEARLY_ID = import.meta.env.VITE_LEMON_SQUEEZY_YEARLY_ID;

export default function Pricing() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  const handleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const handleCheckout = (variantId: string) => {
    if (!user) {
      toast.error(t('pricing.error.login', 'Veuillez vous connecter pour continuer'));
      return;
    }
    const baseUrl = `https://ghostmeta.lemonsqueezy.com/checkout/buy/${variantId}`;
    const checkoutUrl = `${baseUrl}?checkout[custom][user_id]=${user.id}&checkout[email]=${encodeURIComponent(user.email || '')}`;
    window.open(checkoutUrl, '_blank');
  };

  const handleMonthlyClick = () => {
    if (!LEMON_SQUEEZY_MONTHLY_ID) {
      toast.error('Erreur: ID Mensuel non configuré dans Vercel');
      return;
    }
    handleCheckout(LEMON_SQUEEZY_MONTHLY_ID);
  };

  const handleYearlyClick = () => {
    if (!LEMON_SQUEEZY_YEARLY_ID) {
      toast.error('Erreur: ID Annuel non configuré dans Vercel');
      return;
    }
    handleCheckout(LEMON_SQUEEZY_YEARLY_ID);
  };

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#00ff41]">INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your <span className="text-[#00ff41]">Access Level</span></h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Standard */}
          <div className="rounded-2xl border border-[#ffbf00]/30 bg-zinc-900/50 p-8">
            <h3 className="text-2xl font-bold mb-6 text-[#ffbf00]">STANDARD</h3>
            <Button variant="outline" className="w-full border-[#ffbf00]/30 text-[#ffbf00]" disabled>CURRENT ACCESS</Button>
          </div>

          {/* Plan Premium */}
          <div className="rounded-2xl border-2 border-[#00ff41] bg-zinc-900/80 p-8 shadow-[0_0_40px_rgba(0,255,65,0.15)]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#00ff41]" />
              <span className="text-sm font-mono text-[#00ff41]">TIER 02 — ACCÈS COMPLET</span>
            </div>
            <h3 className="text-2xl font-bold mb-6">ACCÈS COMPLET</h3>
            
            {user ? (
              <div className="space-y-3">
                <Button onClick={handleMonthlyClick} className="w-full bg-[#00ff41] hover:bg-[#00ff41]/90 text-black font-bold">
                  OBTENIR LE FULL ACCESS (5€/MOIS)
                </Button>
                <Button onClick={handleYearlyClick} variant="outline" className="w-full border-[#00ff41]/50 text-[#00ff41] text-xs">
                  PLAN ANNUEL — 40€/AN
                </Button>
              </div>
            ) : (
              <Button onClick={handleAuth} className="w-full bg-[#00ff41] text-black font-bold">
                SE CONNECTER POUR ACTIVER
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
