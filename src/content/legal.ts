/**
 * Registre des documents légaux.
 * ──────────────────────────────
 * Source de vérité unique = les fichiers Markdown de `/legal-templates/`
 * (générés/audités via le skill legal-compliance-fr-eu, sourcés Légifrance/CNIL).
 * Ils sont importés en `?raw` puis rendus par `LegalPage` (react-markdown).
 *
 * ⚠️ Tant que des marqueurs `[À FOURNIR : …]` subsistent (identité éditeur,
 * SIRET, médiateur…), ces pages NE sont PAS conformes et ne doivent pas être
 * indexées ni mises en avant. LegalPage les marque donc `noindex`.
 */

import mentionsLegales from "../../legal-templates/mentions-legales.md?raw";
import confidentialite from "../../legal-templates/politique-confidentialite.md?raw";
import cgv from "../../legal-templates/cgv.md?raw";
import cgu from "../../legal-templates/cgu.md?raw";

export type LegalDocKey = "mentions-legales" | "confidentialite" | "cgv" | "cgu";

/** Clé i18n du fil d'Ariane + titre, par document. */
export const LEGAL_DOC_KEYS: Record<LegalDocKey, string> = {
  "mentions-legales": "legal.pages.mentions-legales",
  confidentialite: "legal.pages.confidentialite",
  cgv: "legal.pages.cgv",
  cgu: "legal.pages.cgu",
};

const RAW: Record<LegalDocKey, string> = {
  "mentions-legales": mentionsLegales,
  confidentialite,
  cgv,
  cgu,
};

/** Corps Markdown sans l'en-tête de commentaire HTML (sources/avertissement juriste). */
export function legalMarkdown(key: LegalDocKey): string {
  return RAW[key].replace(/^<!--[\s\S]*?-->\s*/, "").trim();
}
