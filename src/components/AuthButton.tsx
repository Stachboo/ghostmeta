import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogIn, LogOut, User, Mail, Gift } from "lucide-react";
import { toast } from "sonner";

export default function AuthButton() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success(t("auth.check_email", "Vérifiez votre email !"));
        setDialogOpen(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setDialogOpen(false);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erreur d'authentification";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
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
        <span className="text-xs">
          {t("auth.loading", "Initialisation...")}
        </span>
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
        <span className="text-xs">{t("auth.logout", "Déconnexion")}</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="border-zinc-700/50 bg-zinc-900/50 text-emerald-400 hover:bg-zinc-800/50 hover:text-emerald-300 h-8 glass"
      >
        <LogIn className="w-4 h-4 mr-1" />
        <span className="text-xs">
          {t("auth.login", "Accès Sécurisé")}
        </span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#00ff41]" />
              {isSignUp
                ? t("auth.signup_title", "1 mois offert")
                : t("auth.signin_title", "Connexion")}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {isSignUp
                ? t(
                    "auth.signup_desc",
                    "Créez un compte et profitez de 30 jours d'accès complet gratuit."
                  )
                : t(
                    "auth.signin_desc",
                    "Connectez-vous à votre compte GhostMeta."
                  )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Google OAuth */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-11 border-zinc-700 text-white hover:bg-zinc-800"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth.google", "Continuer avec Google")}
            </Button>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">
                  {t("auth.or", "ou")}
                </span>
              </div>
            </div>

            {/* Formulaire email */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder={t(
                  "auth.email_placeholder",
                  "votre@email.com"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <Input
                type="password"
                placeholder={t(
                  "auth.password_placeholder",
                  "Mot de passe (6+ caractères)"
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold"
              >
                <Mail className="w-4 h-4 mr-2" />
                {submitting
                  ? "..."
                  : isSignUp
                    ? t("auth.signup", "Créer mon compte")
                    : t("auth.signin", "Se connecter")}
              </Button>
            </form>

            {/* Toggle inscription / connexion */}
            <p className="text-center text-xs text-zinc-500">
              {isSignUp
                ? t("auth.has_account", "Déjà un compte ?")
                : t("auth.no_account", "Pas encore de compte ?")}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#00ff41] hover:underline"
              >
                {isSignUp
                  ? t("auth.switch_to_signin", "Se connecter")
                  : t("auth.switch_to_signup", "Créer un compte")}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
