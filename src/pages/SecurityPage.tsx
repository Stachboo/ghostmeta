/**
 * SecurityPage — Page "Securite & Confidentialite" / "Security & Privacy"
 *
 * Route : /securite (langue via i18next, comme les autres pages)
 * SEO : Helmet, hreflang, JSON-LD (WebPage)
 * i18n : toutes les chaines via react-i18next (cles security.*)
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Shield, Code2, Scale, CheckCircle,
  Cookie, EyeOff, ShieldCheck, FileCheck, ArrowRight,
  Cloud, Lock, Terminal, Monitor, Smartphone, Server, ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

/* ─── Scroll-triggered reveal ─── */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.unobserve(el); } },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Grain overlay ─── */
function GrainOverlay() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 50, opacity: 0.022, mixBlendMode: 'overlay' }}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/* ─── Divider ─── */
function Divider() {
  return (
    <div className="my-20 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41]/35" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/* ─── Section heading ─── */
const ICONS = { Shield, Code2, Scale, CheckCircle } as const;
type IconName = keyof typeof ICONS;

function SectionH2({ icon, children }: { icon: IconName; children: ReactNode }) {
  const Icon = ICONS[icon];
  return (
    <div className="flex items-center gap-3.5 mb-8">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#00ff41]/5 border border-[#00ff41]/15">
        <Icon size={20} className="text-[#00ff41]" strokeWidth={1.8} />
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
        {children}
      </h2>
    </div>
  );
}

/* ─── Body paragraph ─── */
function P({ children }: { children: ReactNode }) {
  return <p className="text-sm md:text-base leading-relaxed mb-4 text-[#c8c8d8]">{children}</p>;
}

/* ═══════ FLOW DIAGRAM ═══════ */
function FlowStep({ icon: Icon, label, variant }: { icon: typeof Smartphone; label: string; variant: 'safe' | 'danger' }) {
  const color = variant === 'safe' ? '#00ff41' : '#ff4466';
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <Icon size={18} style={{ color }} strokeWidth={1.5} />
      </div>
      <span className="text-xs text-center leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}

function FlowArrow({ variant }: { variant: 'safe' | 'danger' }) {
  const color = variant === 'safe' ? '#00ff41' : '#ff4466';
  return (
    <div className="flex items-center px-0.5">
      <div className="w-3 md:w-7 h-px" style={{ background: `${color}40` }} />
      <ChevronRight size={11} style={{ color, marginLeft: -3, opacity: 0.6 }} />
    </div>
  );
}

function FlowDiagram() {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-4 my-10">
      {/* GhostMeta local */}
      <div className="rounded-xl overflow-hidden bg-[#111119] border border-[#00ff41]/15">
        <div className="px-4 py-2.5 flex items-center gap-2 bg-[#00ff41]/5 border-b border-[#00ff41]/10">
          <Shield size={13} className="text-[#00ff41]" />
          <span className="text-[#00ff41] font-mono text-xs font-bold tracking-wider uppercase">
            {t('security.flow.local_title')}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-around gap-1">
            <FlowStep icon={Smartphone} label={t('security.flow.your_photo')} variant="safe" />
            <FlowArrow variant="safe" />
            <FlowStep icon={Monitor} label={t('security.flow.your_browser')} variant="safe" />
            <FlowArrow variant="safe" />
            <FlowStep icon={CheckCircle} label={t('security.flow.cleaned')} variant="safe" />
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
              <Lock size={11} /> {t('security.flow.local_badge')}
            </span>
          </div>
        </div>
      </div>
      {/* Traditional upload */}
      <div className="rounded-xl overflow-hidden bg-[#111119] border border-[#ff4466]/15">
        <div className="px-4 py-2.5 flex items-center gap-2 bg-[#ff4466]/5 border-b border-[#ff4466]/10">
          <Cloud size={13} className="text-[#ff4466]" />
          <span className="text-[#ff4466] font-mono text-xs font-bold tracking-wider uppercase">
            {t('security.flow.upload_title')}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-around gap-1">
            <FlowStep icon={Smartphone} label={t('security.flow.your_photo')} variant="danger" />
            <FlowArrow variant="danger" />
            <FlowStep icon={Server} label={t('security.flow.server')} variant="danger" />
            <FlowArrow variant="danger" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ff446610', border: '1px dashed #ff446630' }}>
                <span className="text-lg font-bold text-[#ff4466]">?</span>
              </div>
              <span className="text-xs text-muted-foreground/50">???</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff4466]/10 text-[#ff4466] border border-[#ff4466]/15">
              {t('security.flow.upload_badge')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ TERMINAL BLOCK ═══════ */
function TerminalBlock() {
  const { t } = useTranslation();
  const steps = [
    t('security.terminal.s1'),
    t('security.terminal.s2'),
    t('security.terminal.s3'),
    t('security.terminal.s4'),
    t('security.terminal.s5'),
  ];
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-[#00ff41]/15" style={{ background: '#06060b', boxShadow: '0 0 40px #00ff4106, 0 20px 60px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#00ff41]/5 border-b border-[#00ff41]/10">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-[#00ff41]" />
          <span className="text-[#00ff41] font-mono text-xs font-bold tracking-wider">
            {t('security.terminal.title')}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
      </div>
      <div className="p-5 md:p-6 font-mono">
        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs mt-px select-none text-[#00ff41]/40">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`text-sm leading-relaxed ${i === steps.length - 1 ? 'font-bold text-[#00ff41]' : 'text-[#c8c8d8]'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 flex items-center gap-2 border-t border-[#00ff41]/10">
          <span className="text-xs text-muted-foreground/50">{t('security.terminal.result_label')}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
            <CheckCircle size={12} /> {t('security.terminal.result')}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════ COMPARISON TABLE ═══════ */
function ComparisonTable() {
  const { t } = useTranslation();
  const rows = Array.from({ length: 5 }, (_, i) => ({
    c: t(`security.table.r${i + 1}.c`),
    g: t(`security.table.r${i + 1}.g`),
    s: t(`security.table.r${i + 1}.s`),
  }));

  return (
    <div className="my-10 rounded-xl overflow-hidden border border-border">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="w-full text-sm bg-[#16161f]">
          <thead>
            <tr>
              <th className="text-left p-4 font-semibold w-1/4 text-muted-foreground border-b border-border">{t('security.table.header_criteria')}</th>
              <th className="text-left p-4 font-bold w-5/12 text-[#00ff41] border-b-2 border-[#00ff41]/40 bg-[#00ff41]/5">
                <div className="flex items-center gap-2"><Shield size={14} /> GhostMeta</div>
              </th>
              <th className="text-left p-4 font-bold w-5/12 text-[#ff4466] border-b-2 border-[#ff4466]/30 bg-[#ff4466]/5">
                <div className="flex items-center gap-2"><Cloud size={14} /> {t('security.table.header_upload')}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i < rows.length - 1 ? 'border-b border-border' : ''}>
                <td className="p-4 font-medium text-white">{r.c}</td>
                <td className="p-4 bg-[#00ff41]/[0.03]">
                  <span className="flex items-start gap-2 text-sm text-[#00ff41]">
                    <CheckCircle size={14} className="mt-0.5 shrink-0" strokeWidth={2} /> {r.g}
                  </span>
                </td>
                <td className="p-4 bg-[#ff4466]/[0.02]">
                  <span className="flex items-start gap-2 text-sm text-[#ff4466]">
                    <span className="mt-0.5 shrink-0 font-bold">&#10007;</span> {r.s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="md:hidden bg-[#16161f]">
        {rows.map((r, i) => (
          <div key={i} className={`p-4 space-y-2 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground font-mono">{r.c}</div>
            <div className="flex items-start gap-2 text-sm text-[#00ff41]">
              <CheckCircle size={13} className="mt-0.5 shrink-0" /> <span>{r.g}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#ff4466]">
              <span className="mt-0.5 shrink-0 font-bold">&#10007;</span> <span>{r.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ COMMITMENT CARDS ═══════ */
const COMMIT_ICONS = [Cookie, EyeOff, ShieldCheck, FileCheck] as const;

function CommitCards() {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {COMMIT_ICONS.map((Icon, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="rounded-xl p-5 h-full bg-[#111119] border border-border hover:border-[#00ff41]/30 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#00ff41]/5 border border-[#00ff41]/10">
                <Icon size={17} className="text-[#00ff41]" strokeWidth={1.7} />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1.5 text-white">{t(`security.commits.c${i + 1}.title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`security.commits.c${i + 1}.desc`)}</p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function SecurityPage() {
  const { t, i18n } = useTranslation();

  // Supprimer le bot-content injecte par le prerender
  useEffect(() => {
    document.getElementById('bot-content')?.remove();
  }, []);

  const canonical = 'https://www.ghostmeta.online/securite';
  const hreflangEn = 'https://www.ghostmeta.online/securite?lng=en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonical,
    url: canonical,
    name: t('security.seo.title'),
    description: t('security.seo.description'),
    inLanguage: i18n.language === 'fr' ? 'fr' : 'en',
    isPartOf: { '@id': 'https://www.ghostmeta.online/#website' },
  };

  const steps = Array.from({ length: 4 }, (_, i) => t(`security.how.step${i + 1}`));

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-white relative">
      <Helmet>
        <title>{t('security.seo.title')}</title>
        <meta name="description" content={t('security.seo.description')} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="fr" href={canonical} />
        <link rel="alternate" hrefLang="en" href={hreflangEn} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GhostMeta" />
        <meta property="og:title" content={t('security.seo.og_title')} />
        <meta property="og:description" content={t('security.seo.og_desc')} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('security.seo.og_title')} />
        <meta name="twitter:description" content={t('security.seo.og_desc')} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <GrainOverlay />

      <Header />
      <Breadcrumb items={[{ label: t('breadcrumb.security') }]} />

      {/* Content */}
      <main className="flex-1 relative">
        {/* Radial glow behind hero */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #00ff4105, transparent)' }}
        />

        <div className="relative max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-28">

          {/* ══════ HERO ══════ */}
          <Reveal>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#00ff41]/10 border border-[#00ff41]/20">
                <Lock size={15} className="text-[#00ff41]" strokeWidth={1.8} />
              </div>
              <span className="text-[#00ff41] font-mono text-xs font-bold tracking-widest uppercase">
                {t('security.badge')}
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight mb-8 text-white">
              {t('security.h1.line1')}
              <br />
              {t('security.h1.line2')}{' '}
              <span className="text-[#00ff41]" style={{ textShadow: '0 0 40px #00ff4120' }}>
                {t('security.h1.accent')}
              </span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-muted-foreground/50">
                {t('security.h1.line3')}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl text-muted-foreground">
              {t('security.intro')}
            </p>
          </Reveal>

          <Divider />

          {/* ══════ S1: PHOTOS NEVER LEAVE ══════ */}
          <Reveal>
            <SectionH2 icon="Shield">{t('security.s1.title')}</SectionH2>
            <P>{t('security.s1.p1')}</P>
            <P>{t('security.s1.p2')}</P>
            <P>{t('security.s1.p3')}</P>
            <FlowDiagram />
          </Reveal>

          <Divider />

          {/* ══════ S2: HOW IT WORKS ══════ */}
          <Reveal>
            <SectionH2 icon="Code2">{t('security.s2.title')}</SectionH2>
            <P>{t('security.s2.intro')}</P>

            <div className="space-y-3 mb-6">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
                    {i + 1}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed pt-0.5 text-[#c8c8d8]">{step}</p>
                </div>
              ))}
            </div>

            <p className="text-sm font-semibold mb-10 text-white">
              {t('security.s2.no_network')}
            </p>

            <div className="flex items-center gap-2.5 mb-4">
              <ShieldCheck size={18} className="text-[#00ff41]" strokeWidth={1.8} />
              <h3 className="text-lg md:text-xl font-bold text-white">
                {t('security.verify.title')}
              </h3>
            </div>
            <TerminalBlock />
            <P>{t('security.verify.proof')}</P>
          </Reveal>

          <Divider />

          {/* ══════ S3: WHY SAFER ══════ */}
          <Reveal>
            <SectionH2 icon="Scale">{t('security.s3.title')}</SectionH2>
            <P>{t('security.s3.intro')}</P>
            <ComparisonTable />
            <p className="text-sm md:text-base font-semibold text-center text-white">
              {t('security.s3.conclusion')}
            </p>
          </Reveal>

          <Divider />

          {/* ══════ S4: COMMITMENTS ══════ */}
          <Reveal>
            <SectionH2 icon="CheckCircle">{t('security.s4.title')}</SectionH2>
          </Reveal>
          <CommitCards />

          {/* ══════ CTA ══════ */}
          <div className="mt-20 mb-8 text-center">
            <Reveal>
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 bg-[#00ff41] text-[#0a0a0c] hover:-translate-y-0.5 hover:scale-[1.02]"
                style={{ boxShadow: '0 0 30px #00ff4120, 0 4px 16px rgba(0,0,0,0.4)' }}
              >
                {t('security.cta.button')}
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-sm text-muted-foreground/50">
                {t('security.cta.sub')}
              </p>
            </Reveal>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
