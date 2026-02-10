/**
 * GhostMeta InfoSection
 * ─────────────────────
 * GHOST PROTOCOL — #00ff41 (vert néon), #ffb000 (ambre alerte)
 * Sections : menaces, fonctionnement, Zero-Knowledge, Pro, FAQ.
 */

import { motion } from 'framer-motion';
import { Shield, WifiOff, EyeOff, Eye, Server, HardDrive, Lock, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SCAN_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-3_1770726694000_na1fn_Z2hvc3RtZXRhLXNjYW4tZWZmZWN0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2UtaW1nLTNfMTc3MDcyNjY5NDAwMF9uYTFmbl9aMmh2YzNSdFpYUmhMWE5qWVc0dFpXWm1aV04wLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=twLze8fBhWRAeXA-ZduyhqoPb4UAc9XaJ8940DzoFSplumzcXlv7qB1BDpnxjzN5qLTTWHal5ajaLp37nzQUO6ba4Tw-wLUQdGgNPYi1d3Zxta8LGHMs0fRqvPWCZDLfp3Uytvzim94eBHn~vPONftZw-bFBz~NYFgRbyvfw4tf311h1gQgtLFLxSvh2VgZu1n~BfhE~9O1yaDo2IXBIvXjlhOUxRBVUQcVWt2p236Pyp6JHG0i3W9b1lj3zFR1Ff2aAjKUJyqdhvCz0I8V1wi28cmSczwI7l81M1uJALrImbArl~rM05CkadftAjadb5TyIuZNgAB8IipZ99iYL8g__';

const SHIELD_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se_1770726694647_na1fn_Z2hvc3RtZXRhLXNoaWVsZA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2VfMTc3MDcyNjY5NDY0N19uYTFmbl9aMmh2YzNSdFpYUmhMWE5vYVdWc1pBLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=j-RcYfWc8jgkoKUBcYlVfFcQ8Y6DZFThE30fFX8gFxpri7UDVcfN5~FBw7mI6qyTsk3nczlyirg9boGlgwzRHcCv2ju6PMb3mh~5oOeBcOs8r-H5HQzRhTJXWunKH5KKGhKrz5RqABOgpVxmi8sxYXWsMGOcLMtB4HWCkqrnAn-fRnEbqFGOGEYZDbkROSa5JS3h63CqOCmf-nUjngooWogsKL07whYqTphVu17RXCQ7wBlDB5LMNb1LJM4I8gdmUix6sLTSD634maL8H~U9FWY8Dvfdf9Lu7qfXH6gHZ36a-8ov3zsUPISR8L6fu2yMOkAqiFp1lSRk05EBI4Ypaw__';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function InfoSection() {
  return (
    <div className="space-y-20">
      {/* ─── Section 1: Why your photos betray you ─── */}
      <section>
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Pourquoi vos photos vous <span className="text-red-400">trahissent</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Chaque photo prise avec un smartphone contient des métadonnées invisibles. 
            Quand vous publiez sur Vinted, Leboncoin ou eBay, ces données peuvent révéler 
            votre adresse exacte, vos habitudes et votre équipement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl overflow-hidden border border-border max-w-3xl mx-auto"
        >
          <img src={SCAN_IMG} alt="Visualisation des métadonnées extraites d'une photo" className="w-full h-auto" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
          {[
            {
              icon: AlertTriangle,
              color: 'text-red-400',
              bg: 'bg-red-500/8 border-red-500/20',
              title: 'Géolocalisation GPS',
              desc: 'Coordonnées exactes de votre domicile intégrées dans chaque photo prise avec un smartphone.',
            },
            {
              icon: Eye,
              color: 'text-[#ffb000]',
              bg: 'bg-[#ffb000]/8 border-[#ffb000]/20',
              title: 'Profilage temporel',
              desc: 'Dates et heures de prise de vue révélant vos routines de présence et d\'absence.',
            },
            {
              icon: HardDrive,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/8 border-cyan-500/20',
              title: 'Fingerprinting matériel',
              desc: 'Modèle d\'appareil, objectif et numéros de série identifiant votre équipement.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`p-5 rounded-lg border ${item.bg}`}
            >
              <item.icon className={`w-7 h-7 ${item.color} mb-3`} />
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Section 2: How it works ─── */}
      <section>
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Comment ça <span className="text-[#00ff41]">fonctionne</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Trois étapes. Zéro upload. Vos photos restent sur votre appareil.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', title: 'Déposez vos photos', desc: 'Glissez-déposez ou sélectionnez vos images. JPEG, PNG, WebP et HEIC supportés.', color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { step: '02', title: 'Scan des menaces', desc: 'GhostMeta analyse chaque image et identifie les métadonnées sensibles (GPS, date, appareil).', color: 'text-[#ffb000]', border: 'border-[#ffb000]/20' },
            { step: '03', title: 'Neutralisation', desc: 'Un clic pour supprimer toutes les métadonnées. Téléchargez vos images propres.', color: 'text-[#00ff41]', border: 'border-[#00ff41]/20' },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className={`p-6 rounded-lg border ${item.border} bg-card/50 relative`}
            >
              <span className={`text-3xl font-bold ${item.color} opacity-20 absolute top-4 right-4 font-mono`}>{item.step}</span>
              <h3 className={`font-semibold ${item.color} mb-2 text-sm`}>{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Section 3: Zero-Knowledge ─── */}
      <section>
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Architecture <span className="text-[#00ff41]">Zero-Knowledge</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Vos photos ne quittent jamais votre appareil. Tout le traitement est effectué localement dans votre navigateur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border border-red-500/20 bg-red-500/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-red-400 text-xs uppercase tracking-wider">Autres outils</h3>
            </div>
            <div className="space-y-3">
              {['Upload vers un serveur distant', 'Photos accessibles par des tiers', 'Risque de récupération de données'].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-red-400/60 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex justify-center"
          >
            <img src={SHIELD_IMG} alt="Bouclier GhostMeta" className="w-40 h-40 object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.2)]" loading="lazy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg border border-[#00ff41]/20 bg-[#00ff41]/5 ghost-glow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#00ff41]" />
              <h3 className="font-semibold text-[#00ff41] text-xs uppercase tracking-wider">GhostMeta</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: WifiOff, text: 'Aucun upload — 100% local' },
                { icon: EyeOff, text: 'Personne ne voit vos photos' },
                { icon: Lock, text: 'Fonctionne même hors-ligne' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-[#00ff41]/80 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 4: Pro features ─── */}
      <section>
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            <Zap className="w-7 h-7 text-[#00ff41] inline mr-2" />
            Pack Pro — <span className="text-[#00ff41]">9€</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Paiement unique. Pas d'abonnement. Pas de compte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            { title: 'Gratuit', features: ['Nettoyage illimité (photo par photo)', 'Scan des métadonnées', 'Téléchargement unitaire', 'Support JPEG, PNG, WebP, HEIC'], highlight: false },
            { title: 'Pack Pro', features: ['Jusqu\'à 100 images simultanément', 'Mode Batch (tout d\'un coup)', 'Export ZIP en un clic', 'Tout ce qui est gratuit, en batch'], highlight: true },
          ].map((plan, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`p-6 rounded-lg border ${
                plan.highlight
                  ? 'border-[#00ff41]/30 bg-[#00ff41]/5 ghost-glow'
                  : 'border-border bg-card/50'
              }`}
            >
              <h3 className={`font-bold text-lg mb-4 ${plan.highlight ? 'text-[#00ff41]' : 'text-foreground'}`}>
                {plan.title}
                {plan.highlight && <span className="text-sm font-normal ml-2 opacity-70">9€ unique</span>}
              </h3>
              <ul className="space-y-2.5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-[#00ff41]' : 'text-muted-foreground/40'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Section 5: FAQ ─── */}
      <section className="max-w-2xl mx-auto">
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Questions fréquentes</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {[
            { q: 'Mes photos sont-elles envoyées sur un serveur ?', a: 'Non, jamais. GhostMeta utilise une architecture "Local-Only". Le traitement est effectué exclusivement dans votre navigateur web. Aucune donnée n\'est transférée. Vous pouvez même utiliser l\'outil en mode avion.' },
            { q: 'Quels formats d\'images sont supportés ?', a: 'JPEG, PNG, WebP et HEIC (iPhone). Le format HEIC est automatiquement converti en JPEG haute qualité (95%) lors du nettoyage.' },
            { q: 'Quelles métadonnées sont supprimées ?', a: 'Toutes : EXIF (GPS, date, appareil, numéro de série), IPTC (auteur, copyright), et XMP (profils Adobe, historique de retouche). L\'image est ré-encodée proprement.' },
            { q: 'La qualité de l\'image est-elle affectée ?', a: 'La perte est imperceptible. JPEG ré-encodé à 95% de qualité, visuellement identique à l\'original. PNG sans perte.' },
            { q: 'Pourquoi le Mode Batch est-il payant ?', a: 'Le nettoyage photo par photo est gratuit et illimité. Le Pack Pro (9€, paiement unique) débloque le traitement par lots + export ZIP, essentiels pour les vendeurs qui gèrent de gros volumes.' },
            { q: 'Les plateformes ne nettoient-elles pas déjà les métadonnées ?', a: 'Partiellement. Le danger vient des échanges "hors plateforme" : quand un acheteur demande "plus de photos" par email ou WhatsApp, il reçoit les fichiers bruts avec toutes les métadonnées.' },
          ].map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4 bg-card/50">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:text-[#00ff41] transition-colors py-4 text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
