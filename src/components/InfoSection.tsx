import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle2, Server, Globe, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

export default function InfoSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Globe,
      title: t('info.geo_title'),
      desc: t('info.geo_desc'),
      color: "text-red-500"
    },
    {
      icon: Eye,
      title: t('info.meta_title'),
      desc: t('info.meta_desc'),
      color: "text-amber-500"
    },
    {
      icon: Lock,
      title: t('info.privacy_title'),
      desc: t('info.privacy_desc'),
      color: "text-[#00ff41]"
    }
  ];

  const steps = [
    { id: "01", title: t('info.step_1') },
    { id: "02", title: t('info.step_2') },
    { id: "03", title: t('info.step_3') }
  ];

  return (
    <div className="space-y-20">
      
      {/* 1. WHY */}
      <section className="text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold">
            {t('info.why_title')} <span className="text-red-500">{t('info.why_title_highlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('info.why_desc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-[#00ff41]/20 transition-colors"
            >
              <f.icon className={`w-8 h-8 mb-4 ${f.color}`} />
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. HOW */}
      <section className="text-center space-y-10">
        <h2 className="text-3xl font-bold">
          {t('info.how_title')} <span className="text-[#00ff41]">{t('info.how_highlight')}</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative p-6 border border-[#00ff41]/20 rounded-lg bg-[#00ff41]/5">
              <span className="absolute -top-4 -left-4 text-4xl font-black text-[#00ff41]/20 select-none">
                {s.id}
              </span>
              <h3 className="font-bold text-lg">{s.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ZERO KNOWLEDGE */}
      <section className="text-center space-y-6 py-10 border-y border-border/30 bg-secondary/20 rounded-3xl">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          {t('info.arch_title')} <span className="text-[#00ff41]">{t('info.arch_highlight')}</span>
        </h2>
        <div className="flex justify-center gap-8 text-sm font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-red-500" /> NO SERVERS
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> WASM CORE
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">{t('info.faq_title')}</h2>
        <Accordion type="single" collapsible className="w-full">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <AccordionItem key={num} value={`item-${num}`}>
              <AccordionTrigger className="text-left">
                {t(`info.q${num}`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`info.a${num}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </div>
  );
}
