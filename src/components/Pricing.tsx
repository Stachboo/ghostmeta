import { useTranslation } from 'react-i18next';
import { useAuth, CHECKOUT_PENDING_KEY } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Check, Zap, Shield, Image, MapPin, Gift, Clock } from 'lucide-react';
import { toast } from 'sonner';

const LEMON_SQUEEZY_MONTHLY_ID = import.meta.env.VITE_LEMON_SQUEEZY_MONTHLY_ID;
const LEMON_SQUEEZY_YEARLY_ID = import.meta.env.VITE_LEMON_SQUEEZY_YEARLY_ID;

export default function Pricing() {
  const { t } = useTranslation();
  const { user, loading, isTrialActive, trialDaysLeft, hasFullAccess, profile, signInWithGoogle } = useAuth();

  const handleAuth = async () => {
    await signInWithGoogle();
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghost-green/10 border border-ghost-green/30 mb-6">
            <Shield className="w-4 h-4 text-ghost-green" />
            <span className="text-xs font-mono text-ghost-green tracking-wider">
              {t('pricing.title', 'SYSTEM STATUS: ACCESS LEVELS')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t('pricing.h1_start')} <span className="text-ghost-green">{t('pricing.h1_accent')}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {t('pricing.h1_desc')}
          </p>
        </div>

        {/* Trial Banner */}
        {user && isTrialActive && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-ghost-green/30 bg-ghost-green/5 flex items-center gap-3">
            <Gift className="w-5 h-5 text-ghost-green shrink-0" />
            <p className="text-sm text-ghost-green">
              {t('pricing.trial.active', 'Essai gratuit actif — {{days}} jour(s) restant(s)', { days: trialDaysLeft })}
            </p>
            <span className="ml-auto text-xs font-mono bg-ghost-green/10 text-ghost-green px-2 py-1 rounded">
              {t('pricing.trial.badge', 'TRIAL')}
            </span>
          </div>
        )}

        {user && !isTrialActive && !profile?.is_premium && profile?.trial_ends_at && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-400">
              {t('trial.banner_expired', 'Votre essai gratuit est terminé. Passez à l\'accès complet pour continuer.')}
            </p>
          </div>
        )}

        {!user && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl border border-ghost-green/30 bg-ghost-green/5 flex items-center gap-3">
            <Gift className="w-5 h-5 text-ghost-green shrink-0" />
            <p className="text-sm text-zinc-300">
              {t('pricing.trial.cta_signup', 'Créez un compte et profitez de 30 jours d\'accès complet gratuit !')}
            </p>
          </div>
        )}

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
                {hasFullAccess ? t('pricing.standard.inactive', 'PLAN INACTIF') : 'CURRENT ACCESS'}
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative rounded-2xl border-2 border-ghost-green bg-zinc-900/80 backdrop-blur-md p-8 overflow-hidden scale-105 shadow-[0_0_40px_rgba(0,255,65,0.15)]">
            <div className="absolute top-0 right-0 bg-ghost-green text-black text-xs font-bold px-4 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-ghost-green" />
                <span className="text-sm font-mono text-ghost-green">TIER 02 — ACCÈS COMPLET</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {t('pricing.premium.name', 'ACCÈS COMPLET')}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-ghost-green">{t('pricing.premium.price', '5€')}</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 font-mono">
                {t('pricing.premium.yearly_note', 'Ou 40€/an (2 mois offerts)')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Image className="w-4 h-4 text-ghost-green" />
                  {t('pricing.premium.batch', '50 images par traitement')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <MapPin className="w-4 h-4 text-ghost-green" />
                  {t('pricing.premium.gps', 'Vues GPS illimitées')}
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Check className="w-4 h-4 text-ghost-green" />
                  Priority processing
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-200">
                  <Check className="w-4 h-4 text-ghost-green" />
                  Advanced EXIF removal
                </li>
              </ul>
              {!loading && user ? (
                isTrialActive ? (
                  <Button
                    disabled
                    className="w-full h-12 bg-ghost-green/20 text-ghost-green font-bold font-mono border border-ghost-green/30"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {t('pricing.trial.active_btn', 'ESSAI ACTIF — {{days}}J RESTANTS', { days: trialDaysLeft })}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleMonthlyClick}
                      className="w-full h-12 bg-ghost-green hover:bg-ghost-green/90 text-black font-bold font-mono"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {t('pricing.cta.buy', 'OBTENIR LE FULL ACCESS')}
                    </Button>
                    <Button
                      onClick={handleYearlyClick}
                      variant="outline"
                      className="w-full h-10 border-ghost-green/50 text-ghost-green hover:bg-ghost-green/10 font-mono text-xs"
                    >
                      Yearly Plan — Save 33%
                    </Button>
                  </div>
                )
              ) : (
                <Button
                  onClick={handleAuth}
                  className="w-full h-12 bg-ghost-green hover:bg-ghost-green/90 text-black font-bold font-mono"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {t('pricing.cta.login', 'SE CONNECTER POUR ACTIVER')}
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
