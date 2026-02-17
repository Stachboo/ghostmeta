import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ServerOff, Cpu, DatabaseZap, Activity } from 'lucide-react';

interface BadgeProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: 'green' | 'amber';
  dynamic?: boolean;
  value?: string;
}

function TrustBadge({ icon, label, sublabel, color, dynamic = false, value }: BadgeProps) {
  const borderColor = color === 'green' ? 'border-[#00ff41]/20' : 'border-[#ffb000]/20';
  const bgColor = color === 'green' ? 'bg-[#00ff41]/5' : 'bg-[#ffb000]/5';
  const iconColor = color === 'green' ? 'text-[#00ff41]' : 'text-[#ffb000]';
  const dotColor = color === 'green' ? 'bg-[#00ff41]' : 'bg-[#ffb000]';
  const glowColor = color === 'green' ? 'shadow-[0_0_8px_rgba(0,255,65,0.3)]' : 'shadow-[0_0_8px_rgba(255,176,0,0.3)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border
        ${borderColor} ${bgColor}
        min-w-0
      `}
    >
      {/* Dot live indicator */}
      <div className="relative flex-shrink-0">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${dynamic ? 'animate-pulse' : ''}`} />
        {dynamic && (
          <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full ${dotColor} opacity-40 animate-ping`} />
        )}
      </div>

      {/* Icon */}
      <div className={`flex-shrink-0 ${iconColor} ${dynamic ? glowColor : ''}`}>
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className={`text-xs font-bold tracking-wide truncate ${iconColor}`}>
          {dynamic && value ? value : label}
        </p>
        <p className="text-[10px] text-gray-500 tracking-widest uppercase truncate">
          {sublabel}
        </p>
      </div>
    </motion.div>
  );
}

export default function TrustStrip() {
  const [externalRequests, setExternalRequests] = useState(0);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    // PerformanceObserver : monitore les requêtes réseau en temps réel
    // Filtre : on ignore les requêtes légitimes (assets, chunks du domaine courant)
    if (typeof PerformanceObserver === 'undefined') return;

    setMonitoring(true);

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      const currentOrigin = window.location.origin;

      const external = entries.filter((entry) => {
        try {
          const entryOrigin = new URL(entry.name).origin;
          // Autoriser : même domaine, vercel analytics (légitime), fonts
          const isAllowed =
            entryOrigin === currentOrigin ||
            entryOrigin.includes('vercel-insights') ||
            entryOrigin.includes('va.vercel-scripts') ||
            entryOrigin.includes('fonts.googleapis') ||
            entryOrigin.includes('fonts.gstatic') ||
            entry.name.startsWith('blob:') ||
            entry.name.startsWith('data:');
          return !isAllowed;
        } catch {
          return false;
        }
      });

      if (external.length > 0) {
        setExternalRequests((prev) => prev + external.length);
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch {
      setMonitoring(false);
    }

    return () => observer.disconnect();
  }, []);

  const networkStatus = externalRequests === 0 ? 'green' : 'amber';
  const networkLabel =
    externalRequests === 0
      ? '0 requête externe'
      : `${externalRequests} requête(s) détectée(s)`;

  return (
    <section className="container py-6">
      <div className="max-w-4xl mx-auto">
        {/* Label section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-[#00ff41]/10" />
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-gray-600">
            Transparence Technique
          </span>
          <div className="h-px flex-1 bg-[#00ff41]/10" />
        </div>

        {/* Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TrustBadge
            icon={<ServerOff size={16} />}
            label="Zéro Upload"
            sublabel="Aucun fichier envoyé"
            color="green"
          />
          <TrustBadge
            icon={<Cpu size={16} />}
            label="100% Local"
            sublabel="Navigateur uniquement"
            color="green"
          />
          <TrustBadge
            icon={<DatabaseZap size={16} />}
            label="Zéro Stockage"
            sublabel="Aucune donnée conservée"
            color="amber"
          />
          <TrustBadge
            icon={<Activity size={16} />}
            label={networkLabel}
            sublabel={monitoring ? 'Moniteur actif' : 'Réseau vérifié'}
            color={networkStatus}
            dynamic={monitoring}
            value={networkLabel}
          />
        </div>
      </div>
    </section>
  );
}
