/**
 * GhostMeta ImageCard
 * ───────────────────
 * GHOST PROTOCOL — #00ff41 (vert néon), #ffb000 (ambre alerte)
 * Carte tactique affichant une image, ses menaces détectées et son statut.
 */

import { ProcessedImage, formatFileSize, ThreatItem } from '@/lib/image-processor';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Calendar,
  Smartphone,
  Code,
  Fingerprint,
  X,
  Download,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: ProcessedImage;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  index: number;
}

function getThreatIcon(type: ThreatItem['type']) {
  switch (type) {
    case 'gps':
      return <MapPin className="w-3.5 h-3.5" />;
    case 'datetime':
      return <Calendar className="w-3.5 h-3.5" />;
    case 'device':
      return <Smartphone className="w-3.5 h-3.5" />;
    case 'software':
      return <Code className="w-3.5 h-3.5" />;
    case 'serial':
      return <Fingerprint className="w-3.5 h-3.5" />;
  }
}

function getSeverityStyles(severity: ThreatItem['severity']) {
  switch (severity) {
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/25';
    case 'warning':
      return 'text-[#ffb000] bg-[#ffb000]/10 border-[#ffb000]/25';
    case 'info':
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
  }
}

function StatusBadge({ status, threatLevel, t }: { status: ProcessedImage['status']; threatLevel?: string; t: (key: string) => string }) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-slate-500/10 text-slate-400 border border-slate-500/20">
          <Shield className="w-3 h-3" />
          {t('card.pending')}
        </span>
      );
    case 'scanning':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('card.scanning')}
        </span>
      );
    case 'scanned':
      if (threatLevel === 'critical') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-red-500/15 text-red-400 border border-red-500/25 animate-pulse-red">
            <ShieldAlert className="w-3 h-3" />
            {t('card.critical')}
          </span>
        );
      }
      if (threatLevel === 'warning') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#ffb000]/15 text-[#ffb000] border border-[#ffb000]/25">
            <AlertTriangle className="w-3 h-3" />
            {t('card.exposed')}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
          <ShieldCheck className="w-3 h-3" />
          {t('card.clean')}
        </span>
      );
    case 'cleaning':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('card.purging')}
        </span>
      );
    case 'cleaned':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/30">
          <CheckCircle2 className="w-3 h-3" />
          {t('card.neutralized')}
        </span>
      );
    case 'error':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertTriangle className="w-3 h-3" />
          {t('card.error')}
        </span>
      );
    default:
      return null;
  }
}

export default function ImageCard({ image, onRemove, onDownload, index }: ImageCardProps) {
  const { t } = useTranslation();
  const { metadata, status } = image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
      className={`
        relative bg-card border rounded-lg overflow-hidden
        ${status === 'cleaned' ? 'border-[#00ff41]/20' : 'border-border'}
        ${status === 'error' ? 'border-red-500/20' : ''}
      `}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-muted/50 flex-shrink-0 overflow-hidden border border-border/30">
            {image.previewUrl ? (
              <img src={image.previewUrl} alt="Aperçu du fichier en cours de nettoyage" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-[180px] sm:max-w-[300px]">
              {image.originalName}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              {formatFileSize(image.originalSize)}
              {image.cleanedSize && (
                <span className="text-[#00ff41] ml-1">→ {formatFileSize(image.cleanedSize)}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={status} threatLevel={metadata?.threatLevel} t={t} />
          <button
            onClick={() => onRemove(image.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive transition-colors"
            aria-label={t('card.remove')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Threats list */}
      {metadata && metadata.threats.length > 0 && status !== 'cleaned' && (
        <div className="px-4 py-3 space-y-1.5">
          {metadata.threats.map((threat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className={`flex items-start gap-2.5 px-3 py-2 rounded border text-xs ${getSeverityStyles(threat.severity)}`}
            >
              <span className="mt-0.5 flex-shrink-0">{getThreatIcon(threat.type)}</span>
              <div className="min-w-0 flex-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">{threat.label}</span>
                <p className="font-mono text-[11px] mt-0.5 opacity-80 break-all leading-relaxed">{threat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No threats */}
      {metadata && metadata.threats.length === 0 && status === 'scanned' && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-[#00ff41] text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('card.no_threats')}</span>
          </div>
        </div>
      )}

      {/* Cleaned */}
      {status === 'cleaned' && (
        <div className="px-4 py-3 bg-[#00ff41]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#00ff41] text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium">{t('card.cleaned_success')}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(image.id)}
              className="h-8 text-xs border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 hover:text-[#00ff41]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {t('card.download')}
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && image.error && (
        <div className="px-4 py-3 bg-red-500/5">
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>{image.error}</span>
          </div>
        </div>
      )}

      {/* Scan animation overlay */}
      {(status === 'scanning' || status === 'cleaning') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41]/60 to-transparent"
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
}
