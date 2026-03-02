/**
 * Breadcrumb — fil d'Ariane + JSON-LD BreadcrumbList
 * ───────────────────────────────────────────────────
 * Utilisé sur SecurityPage, BlogPost, PricingPage.
 * Injecte le schema.org BreadcrumbList via Helmet.
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();

  // Toujours commencer par Accueil
  const crumbs: BreadcrumbItem[] = [
    { label: t('breadcrumb.home'), to: '/' },
    ...items,
  ];

  // JSON-LD BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to
        ? { item: `https://www.ghostmeta.online${item.to}` }
        : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="container px-4 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {crumbs.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
              )}
              {item.to && i < crumbs.length - 1 ? (
                <Link
                  to={item.to}
                  className="hover:text-[#00ff41] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white/70">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
