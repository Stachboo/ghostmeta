import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Package, Download, Shield, Gift, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProModal({ open, onClose }: ProModalProps) {
  const { t } = useTranslation();
  const { user, isTrialActive, trialDaysLeft, hasFullAccess } = useAuth();

  // Si l'utilisateur a déjà l'accès complet via trial, ne pas afficher le modal
  if (hasFullAccess) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md tactical-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            {!user ? (
              <>
                <Gift className="w-5 h-5 text-[#00ff41]" />
                {t("trial.signup_title", "1 mois offert")}
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-[#00ff41]" />
                GhostMeta Pro
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {!user
              ? t(
                  "trial.signup_desc",
                  "Créez un compte gratuit et profitez de 30 jours d'accès complet."
                )
              : t(
                  "trial.modal_upgrade_cta",
                  "Passez à l'accès complet pour profiter de toutes les fonctionnalités."
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Trial expiré : message */}
          {user && !isTrialActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-amber-400">
                  {t(
                    "trial.banner_expired",
                    "Votre essai gratuit est terminé."
                  )}
                </p>
              </div>
            </motion.div>
          )}

          {/* Non connecté : offre trial */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-lg"
            >
              <p className="text-3xl font-bold text-[#00ff41]">
                {t("pro.price", "30 jours gratuits")}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {t(
                  "trial.no_commitment",
                  "Sans engagement, sans reconduction"
                )}
              </p>
            </motion.div>
          )}

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Package className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">
                  {t("pro.benefit_1", "50 images par lot")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Download className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">
                  {t("pro.benefit_2", "Export ZIP en un clic")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Shield className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">
                  {t("pro.benefit_3", "Vues GPS illimitées")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          {!user ? (
            <Button
              onClick={onClose}
              asChild
              className="w-full h-12 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold text-base tracking-wide ghost-glow"
            >
              <Link to="/pricing">
                <Gift className="w-5 h-5 mr-2" />
                {t(
                  "trial.modal_signup_cta",
                  "Commencer l'essai gratuit"
                )}
              </Link>
            </Button>
          ) : (
            <Button
              onClick={onClose}
              asChild
              className="w-full h-12 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold text-base tracking-wide ghost-glow"
            >
              <Link to="/pricing">
                <Zap className="w-5 h-5 mr-2" />
                {t("pro.btn_action", "Passer à l'accès complet")}
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
