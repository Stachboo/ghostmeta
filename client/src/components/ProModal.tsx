/**
 * GhostMeta Pro Modal
 * ───────────────────
 * GHOST PROTOCOL — #00ff41 (vert néon)
 * Modal de vente du Pack Pro avec design tactique.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Package, Download, Shield, Lock } from 'lucide-react';

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProModal({ open, onClose }: ProModalProps) {
  const handlePurchase = () => {
    // Placeholder — sera remplacé par un vrai Stripe Payment Link
    // Pour le MVP, on simule l'activation Pro via localStorage
    localStorage.setItem('ghostmeta_pro', JSON.stringify({ active: true, date: new Date().toISOString() }));
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md tactical-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00ff41]" />
            Pack Pro — GhostMeta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Débloquez le traitement par lots pour nettoyer toutes vos photos en une seule opération.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-lg"
          >
            <p className="text-4xl font-bold text-[#00ff41]">9€</p>
            <p className="text-sm text-muted-foreground mt-1">Paiement unique · Accès illimité</p>
          </motion.div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: Package, label: 'Mode Batch', desc: 'Nettoyez jusqu\'à 100 photos d\'un coup' },
              { icon: Download, label: 'Export ZIP', desc: 'Téléchargez tout en un seul fichier' },
              { icon: Shield, label: 'Nettoyage complet', desc: 'EXIF, IPTC, XMP, GPS — tout est supprimé' },
              { icon: Lock, label: 'Zéro trace', desc: 'Pas de compte, pas de données stockées' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <feature.icon className="w-5 h-5 text-[#00ff41] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={handlePurchase}
            className="w-full h-12 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold text-base tracking-wide ghost-glow"
          >
            <Zap className="w-5 h-5 mr-2" />
            ACTIVER LE PACK PRO
          </Button>

          <p className="text-[11px] text-center text-muted-foreground/60">
            Paiement sécurisé via Stripe · TVA non applicable, art. 293 B du CGI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
