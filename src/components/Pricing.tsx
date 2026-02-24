import { useTranslation } from 'react-i18next';
import { useAuth, CHECKOUT_PENDING_KEY } from '@/hooks/useAuth';
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
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleCheckout = (variantId: string) => {
    if (!user) {
      toast.error(t('pricing.error.not_logged_in', 'Veuillez vous connecter pour continuer'));
      return;
    }

    const baseUrl = `https://ghostmeta.lemonsqueezy.com/checkout/buy/${variantId}`;
    const checkoutUrl = `${baseUrl}?checkout[custom][user_id]=${user.id}&checkout[email]=${encodeURIComponent(user.email || '')}`;

    localStorage.setItem(CHECKOUT_PENDING_KEY, 'true');
    window.open(checkoutUrl, '_blank');
  };

  const handleMonthlyClick = () => {
    if (!LEMON_SQUEEZY_MONTHLY_ID) {
      toast.error('Configuration error: Monthly plan not configured');
      return;
    }
    handleCheckout(LEMON_SQUEEZY_MONTHLY_ID);
  };

  const handleYearlyClick = () => {
    if (!LEMON_SQUEEZY_YEARLY_ID) {
      toast.error('Configuration error: Yearly plan not configured');
      return;
    }
    handleCheckout(LEMON_SQUEEZY_YEARLY_ID);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 mb-6">
            <Shield className="w-4 h-4 text-[#00ff41]" />
            <span className="text-xs font-mono text-[#00ff41] tracking-wider">
              {t('pricing.title', 'SYSTEM STATUS: ACCESS LEVELS')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Choose Your <span className="text-[#00ff41]">Access Level</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Upgrade your privacy protection capabilities. Process more images, unlock unlimited GPS views.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Standard Plan */}
          <div className="relative rounded-2xl border border-[#ffbf00]/30 bg-zinc-900/50 backdrop-blur-md p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffbf00]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#ffbf00]" />
                <span className="text-sm font-mono text-[#ffbf00]">TIER 01</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {t('pricing.standard.name', 'STANDARD OPERATOR')}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{t('pricing.standard.price', '0€')}</span>
                <span className="text-zinc-500">/forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <Image className="w-4 h-4 text-[#ffbf00]" />
                  {t('pricing.standard.batch', '1 image par traitement')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-300">
                  <MapPin className="w-4 h-4 text-[#ffbf00]" />
                  {t('pricing.standard.gps', '1 vue GPS unique')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-500">
                  <Check className="w-4 h-4 text-zinc-600" />
                  Local processing only
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full h-12 border-[#ffbf00]/30 text-[#ffbf00] hover:bg-[#ffbf00]/10 font-mono"
                disabled
              >
                CURRENT ACCESS
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative rounded-2xl border-2 border-[#00ff41] bg-zinc-900/80 backdrop-blur-md p-8 overflow-hidden scale-105 shadow-[0_0_40px_rgba(0,255,65,0.15)]">
            <div className="absolute top-0 right-0 bg-[#00ff41] text-black text-xs font-bold px-4 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#00ff41]" />
                <span className="text-sm font-mono text-[#00ff41]">TIER 02 — ACCÈS COMPLET</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {t('pricing.premium.name', 'ACCÈS COMPLET')}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-[#00ff41]">{t('pricing.premium.price', '5€')}</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 font-mono">
                {t('pricing.premium.yearly_note', 'Ou 40€/an (2 mois offerts)')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Image className="w-4 h-4 text-[#00ff41]" />
                  {t('pricing.premium.batch', '50 images par traitement')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <MapPin className="w-4 h-4 text-[#00ff41]" />
                  {t('pricing.premium.gps', 'Vues GPS illimitées')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Check className="w-4 h-4 text-[#00ff41]" />
                  Priority processing
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Check className="w-4 h-4 text-[#00ff41]" />
                  Advanced EXIF removal
                </li>
              </ul>
              {!loading && user ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleMonthlyClick}
                    className="w-full h-12 bg-[#00ff41] hover:bg-[#00ff41]/90 text-black font-bold font-mono"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {t('pricing.cta.buy', 'OBTENIR LE FULL ACCESS')}
                  </Button>
                  <Button
                    onClick={handleYearlyClick}
                    variant="outline"
                    className="w-full h-10 border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41]/10 font-mono text-xs"
                  >
                    Yearly Plan — Save 33%
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={loading ? undefined : handleAuth}
                  disabled={loading}
                  className="w-full h-12 bg-[#00ff41] hover:bg-[#00ff41]/90 text-black font-bold font-mono"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loading ? '...' : t('pricing.cta.login', 'SE CONNECTER POUR ACTIVER')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Secure Checkout
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-3 h-3" />
              Cancel Anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-3 h-3" />
              No Hidden Fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
