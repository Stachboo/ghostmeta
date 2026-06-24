<!--
  INDEX / NOTICE — Templates juridiques B2C SaaS (FR/UE)
  Réutilisables pour GhostMeta et tout futur client SaaS B2C français.
  Sources officielles : voir l'en-tête de CHAQUE fichier.
  Dernière compilation des sources : 2026-06-22.
-->

# Templates juridiques — SaaS B2C (France / UE)

> **⚠️ FAIRE VALIDER PAR UN JURISTE AVANT MISE EN LIGNE.**
> Ces fichiers sont des **modèles paramétrés**, sourcés sur des textes officiels, **pas un avis
> juridique**. Le droit de la consommation évolue (ex. l'ordonnance n°2026-2 ci-dessous est entrée
> en vigueur le **19 juin 2026**). Toute affirmation juridique ici est rattachée à sa source
> (URL + article). Les points marqués `[interprétation — à confirmer]` sont des lectures à faire
> valider, pas du droit établi.

---

## 1. Vérification : aucune skill « prête à l'emploi » ne convient

Les skills/agents juridiques existants pour Claude/Codex/Cursor sont des outils de **revue de
contrats** (CUAD, redlines, NDA, due diligence), orientés **US** ou généralistes — aucun ne
**génère des documents de conformité B2C FR/UE** (mentions légales, CGV, politique RGPD, cookies)
ancrés sur le droit français. Vérifié sur :
- `evolsb/claude-legal-skill` — revue de contrats, redlines style marché US.
- `zubair-trabzada/ai-legal-claude` — revue/risk analysis/NDA, généraliste.
- `Anthropic — Claude for Legal` — revue de contrats / triage NDA pour cabinets, pas de génération
  conformité FR.

→ Conclusion : on **source officiellement** (service-public.fr, CNIL, Légifrance, economie.gouv.fr).

Sources skill-search :
- https://github.com/evolsb/claude-legal-skill
- https://github.com/zubair-trabzada/ai-legal-claude

---

## 2. Fichiers du pack

| Fichier | Objet | Source principale |
|---|---|---|
| `mentions-legales.md` (FR) | Identification éditeur/hébergeur | LCEN art. 1-1 (loi SREN n°2024-449) ; C. conso L111-1 |
| `politique-confidentialite.md` (FR) | RGPD / vie privée | RGPD art. 13-14 ; CNIL |
| `privacy-policy.md` (EN) | Version anglaise de la précédente | idem |
| `cgv.md` (FR) | Conditions générales de **vente** | C. conso L111-1, L221-5, L221-18, L221-21, L221-28, L612-1, L616-1 |
| `terms.md` (EN) | Version anglaise des CGV | idem |
| `cgu.md` (FR) | Conditions d'**utilisation** du service | (contractuel — pas d'obligation légale unique) |
| `cookies-consentement.md` (FR) | Cookies & traceurs | art. 82 loi Informatique et Libertés ; lignes directrices + recommandation CNIL |
| `clause-retractation.md` | Clause de renoncement L221-28 + formulaire-type | C. conso L221-28, annexe art. R221-1 |

Tous les placeholders sont au format `{{NOM}}` — voir la checklist §4.

---

## 3. Le point sensible : Lemon Squeezy « Merchant of Record » (MoR)

**Fait sourcé :** Lemon Squeezy se présente comme **Merchant of Record** — le **revendeur légal** du
produit. Au checkout, le contrat de vente est juridiquement conclu **entre le client final et Lemon
Squeezy**, pas avec l'éditeur du site. Lemon Squeezy collecte/remet la **TVA**, émet la **facture**,
gère **remboursements et chargebacks**.
Sources : https://docs.lemonsqueezy.com/help/payments/merchant-of-record ·
https://www.lemonsqueezy.com/reporting/merchant-of-record

**Conséquence sur les obligations — répartition `[interprétation — à confirmer par un juriste]` :**

| Obligation | Probablement portée par… | Base / raisonnement |
|---|---|---|
| TVA, facturation conforme | **Lemon Squeezy (MoR)** | Doc LS : LS est le vendeur légal et remet la TVA. |
| Vendeur au sens C. conso (contrat de vente, garanties marchandes) | **Lemon Squeezy** `[interpr.]` | LS est la partie contractante au checkout. Le **client achète à LS**. |
| Droit de rétractation L221-28 + clause de renoncement | **À configurer côté Lemon Squeezy** `[interpr.]` | C'est le **vendeur** (LS) qui doit recueillir le consentement exprès + renoncement. **Vérifier que le checkout LS affiche bien la case.** |
| Mentions légales du **site** (LCEN art. 6) | **Éditeur du site** | LCEN vise l'**éditeur du service de communication en ligne**, distinct du vendeur. |
| RGPD (compte, email, analytics, Sentry) | **Éditeur du site** (responsable de traitement) | Les données collectées par le site (Supabase auth, etc.) sont traitées par l'éditeur. |
| Cookies/traceurs sur le site | **Éditeur du site** | Le dépôt a lieu sur le domaine de l'éditeur. |
| Médiation de la consommation (L612-1/L616-1) | **Incertitude** `[interpr.]` | Si LS est le vendeur, l'obligation médiateur peut peser sur LS. **Mais** l'éditeur reste prestataire du service → prudence : prévoir un médiateur OU documenter que la vente est portée par LS. |

> **Honnêteté épistémique :** la frontière exacte MoR ⇆ éditeur en droit **français** n'est pas
> tranchée par un texte unique ; les CGU de Lemon Squeezy règlent la relation LS↔éditeur, pas
> l'opposabilité au consommateur français. **À faire trancher par un juriste.** En pratique, beaucoup
> d'éditeurs publient quand même des CGV « miroir » qui **renvoient** à Lemon Squeezy comme vendeur —
> c'est l'approche retenue dans `cgv.md` (clause MoR explicite).

---

## 4. Checklist « à remplir / vérifier par le propriétaire »

**Identité de l'éditeur (placeholders) :**
- [ ] `[À FOURNIR : nom / raison sociale de l'éditeur]` — nom + prénom (personne physique) ou raison sociale.
- [ ] `[À FOURNIR : statut juridique]` — ex. « Entrepreneur individuel (EI) », « auto-entrepreneur », « SAS »…
- [ ] `[À FOURNIR : adresse postale]` — adresse postale complète (obligatoire, LCEN).
- [ ] `[À FOURNIR : SIRET]` / `[À FOURNIR : RCS le cas échéant]` — numéro d'immatriculation.
- [ ] `[À FOURNIR : n° TVA intra. ou « TVA non applicable, art. 293 B du CGI »]` — n° TVA intracommunautaire (ou mention « non assujetti, art. 293 B CGI » si franchise).
- [x] `contact@ghostmeta.online` — **RÉSOLU 2026-06-23** : adresse unique retenue = `contact@ghostmeta.online` (alignée partout, code + docs).
- [ ] `[À FOURNIR : téléphone]` — un moyen de contact direct est attendu (LCEN « permettant de le contacter »).
- [ ] `[À FOURNIR : directeur de la publication]` — nom du directeur de la publication.

**Hébergeur (LCEN art. 1-1) :**
- [ ] `{{HEBERGEUR_NOM}}` / `{{HEBERGEUR_ADRESSE}}` / `{{HEBERGEUR_TEL}}` — pour GhostMeta : **Vercel
      Inc.** (front/API) et **Supabase** (backend) — vérifier l'adresse à jour de chacun.

**Pseudonymat (tension à arbitrer) :**
- [ ] La LCEN art. 1-1 (II) permet à un éditeur **non professionnel** de ne donner que l'hébergeur et
      de rester pseudonyme. **Mais** vendre des abonnements = activité **professionnelle** →
      l'éditeur **ne peut probablement pas** rester anonyme et doit publier son identité complète.
      `[interprétation — à confirmer]`. **Décision propriétaire requise.**

**Vente / Lemon Squeezy :**
- [ ] Vérifier dans le **checkout Lemon Squeezy** que la **case de consentement exprès + renoncement
      au droit de rétractation** (L221-28) est bien présente pour un produit numérique à exécution
      immédiate (sinon le délai de 14 j s'applique → risque de remboursement).
- [ ] Confirmer que Lemon Squeezy **émet bien la facture** au client et collecte la TVA.
- [ ] Décider si une **période d'essai** (le « Google trial 30j » évoqué) est gérée par LS ou par le site.

**Médiateur de la consommation (L612-1 / L616-1) :**
- [ ] `[À FOURNIR : médiateur de la consommation — nom]` / `[À FOURNIR : site web du médiateur]` / `[À FOURNIR : adresse du médiateur]` — **adhérer à un médiateur
      de la consommation** agréé (ex. via une association de médiation) **si** l'obligation pèse sur
      l'éditeur (cf. §3). Coût annuel modique. Sans cela, mention obligatoire absente = amende
      jusqu'à 15 000 € (personne morale). Source R616-1.

**RGPD / sous-traitants :**
- [ ] Lister les sous-traitants réels : **Supabase** (auth, stockage email/nom), **Vercel** (hébergement
      + Vercel Analytics anonyme), **Sentry** (erreurs), **Lemon Squeezy** (paiement).
- [ ] Vérifier les **garanties de transfert hors UE** (Supabase/Vercel/Sentry/LS = US) : clauses
      contractuelles types (CCT) — à confirmer dans les DPA de chaque fournisseur.
- [ ] `contact@ghostmeta.online` — email dédié aux demandes de droits.

**Dates / divers :**
- [ ] `23 juin 2026` — date de dernière mise à jour de chaque document.
- [ ] `https://www.ghostmeta.online` = `https://www.ghostmeta.online` · `GhostMeta` = « GhostMeta ».
- [ ] **Bouton de rétractation en ligne (NOUVEAU, obligatoire depuis le 19/06/2026, art. L221-21)** :
      si l'éditeur est le vendeur, une **fonctionnalité de rétractation gratuite, clairement
      identifiable, accessible pendant 14 j** doit être fournie. Si Lemon Squeezy est le vendeur,
      vérifier que **LS** la fournit. Source : ordonnance n°2026-2, art. L221-21.

---

## 5. Récapitulatif des textes officiels mobilisés

- **LCEN** (loi n°2004-575) **art. 1-1** (réd. loi SREN n°2024-449) — identification éditeur & hébergeur ; sanctions art. 1-2.
  https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164
- **Service-public.fr** F31228 — mentions obligatoires d'un site marchand (EI vs société).
  https://entreprendre.service-public.gouv.fr/vosdroits/F31228
- **C. conso L111-1 / L221-5** — information précontractuelle.
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044142438
- **C. conso L221-18** — délai de rétractation de 14 jours.
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842
- **C. conso L221-21** (mod. ordonnance n°2026-2, en vigueur 19/06/2026) — fonctionnalité de
  rétractation en ligne obligatoire.
- **C. conso L221-28** — exceptions au droit de rétractation (dont contenu numérique, 13°).
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170
- **Annexe art. R221-1** — modèle de formulaire de rétractation.
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032887061
- **C. conso L612-1 / L616-1 / R616-1** — médiation de la consommation & information.
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032224762 ·
  https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808378
- **RGPD art. 13-14** + **CNIL** — information/transparence.
  https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence
- **Art. 82 loi Informatique et Libertés** + **CNIL cookies** — consentement aux traceurs.
  https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies
- **Lemon Squeezy MoR** — https://docs.lemonsqueezy.com/help/payments/merchant-of-record
