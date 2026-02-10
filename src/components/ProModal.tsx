import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Package, Download, Shield, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProModal({ open, onClose }: ProModalProps) {
  const { t } = useTranslation();

  const handlePurchase = () => {
    // Placeholder - A remplacer par le lien Stripe plus tard
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md tactical-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00ff41]" />
            GhostMeta Pro
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('pro.desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-lg"
          >
            <p className="text-4xl font-bold text-[#00ff41]">{t('pro.price')}</p>
          </motion.div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Package className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{t('pro.benefit_1')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Download className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{t('pro.benefit_2')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Shield className="w-5 h-5 text-[#00ff41] mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{t('pro.benefit_3')}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handlePurchase}
            className="w-full h-12 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold text-base tracking-wide ghost-glow"
          >
            <Zap className="w-5 h-5 mr-2" />
            {t('pro.btn_action')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
