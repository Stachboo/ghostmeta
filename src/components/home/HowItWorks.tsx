import { useTranslation } from 'react-i18next';
import { MousePointerClick, Scan, FileDigit } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="container py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">{t('info.how_title')} <span className="text-ghost-green">{t('info.how_highlight')}</span></h2>
        <p className="text-muted-foreground">{t('info.how_subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Etape 01 */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-ghost-green/30 transition-colors relative group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-ghost-green/10 rounded-lg text-ghost-green"><MousePointerClick className="w-6 h-6" /></div>
            <span aria-hidden="true" className="text-4xl font-bold text-white/20 group-hover:text-white/30 transition-colors">01</span>
          </div>
          <h3 className="font-bold text-ghost-green mb-2">{t('info.step_1_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('info.step_1_desc')}</p>
        </div>

        {/* Etape 02 */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#ffb000]/30 transition-colors relative group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#ffb000]/10 rounded-lg text-[#ffb000]"><Scan className="w-6 h-6" /></div>
            <span aria-hidden="true" className="text-4xl font-bold text-white/20 group-hover:text-white/30 transition-colors">02</span>
          </div>
          <h3 className="font-bold text-[#ffb000] mb-2">{t('info.step_2_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('info.step_2_desc')}</p>
        </div>

        {/* Etape 03 */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-ghost-green/30 transition-colors relative group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-ghost-green/10 rounded-lg text-ghost-green"><FileDigit className="w-6 h-6" /></div>
            <span aria-hidden="true" className="text-4xl font-bold text-white/20 group-hover:text-white/30 transition-colors">03</span>
          </div>
          <h3 className="font-bold text-ghost-green mb-2">{t('info.step_3_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('info.step_3_desc')}</p>
        </div>
      </div>
    </section>
  );
}
