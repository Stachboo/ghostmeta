<!--
  POLITIQUE DE CONFIDENTIALITÉ — modèle FR (RGPD), réutilisable SaaS B2C.
  SOURCES OFFICIELLES (URL + article) :
  - RGPD (UE) 2016/679 art. 13-14 — information lors de la collecte :
    https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3
  - CNIL — Conformité RGPD : informer les personnes et assurer la transparence :
    https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence
  - CNIL — Les bases légales : https://www.cnil.fr/fr/les-bases-legales
  - CNIL — Droits des personnes : https://www.cnil.fr/fr/passer-laction/les-droits-des-personnes-sur-leurs-donnees
  Éléments obligatoires (RGPD art. 13) : identité/coordonnées du responsable, finalités, base légale,
  destinataires/sous-traitants, transferts hors UE + garanties, durées de conservation, droits +
  modalités d'exercice + réclamation CNIL, source des données, caractère obligatoire/facultatif.
  ⚠️ FAIRE VALIDER PAR UN JURISTE. Remplir les {{PLACEHOLDERS}} et AJUSTER la liste des traitements
  à la réalité technique (ne pas déclarer un traitement inexistant, ni en omettre un réel).
-->

# Politique de confidentialité

_Dernière mise à jour : 23 juin 2026_

La présente politique décrit comment **GhostMeta** (https://www.ghostmeta.online) traite vos données à caractère
personnel, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.

## 1. Responsable du traitement

- **[À FOURNIR : nom / raison sociale de l'éditeur]** — [À FOURNIR : adresse postale]
- Contact pour les questions de données personnelles : **contact@ghostmeta.online**

## 2. Quelles données et pourquoi (finalités & bases légales)

> Source bases légales : https://www.cnil.fr/fr/les-bases-legales

| Traitement | Données concernées | Finalité | Base légale (RGPD art. 6) |
|---|---|---|---|
| Création de compte / authentification | E-mail, nom (via Google OAuth / Supabase) | Permettre la connexion et l'accès au service | **Exécution du contrat** (art. 6.1.b) |
| Gestion de l'abonnement premium | Statut d'abonnement, identifiant client paiement | Fournir les fonctionnalités payantes | **Exécution du contrat** (art. 6.1.b) |
| Mesure d'audience anonyme | Données agrégées/anonymes (Vercel Analytics) | Statistiques de fréquentation | **Intérêt légitime** ou exemption si réellement anonyme `[interprétation — voir cookies]` |
| Suivi des erreurs techniques | Logs d'erreur (Sentry) | Stabilité et sécurité du service | **Intérêt légitime** (art. 6.1.f) |
| Cookies/traceurs non exemptés | cf. [Cookies & consentement](/confidentialite) | cf. ce document | **Consentement** (art. 6.1.a) |

> **Important — traitement local :** le cœur du service (GhostMeta) traite les **images
> entièrement dans le navigateur de l'utilisateur** ; les images et leurs métadonnées **ne sont pas
> téléversées** sur nos serveurs. `[à confirmer techniquement avant publication]`

## 3. Destinataires et sous-traitants

Vos données peuvent être traitées par les sous-traitants suivants, dans le cadre de contrats
conformes à l'article 28 du RGPD :

- **Supabase** — authentification et stockage (e-mail, nom).
- **Vercel** — hébergement et mesure d'audience anonyme.
- **Sentry** — supervision des erreurs.
- **Lemon Squeezy** — traitement des paiements (en tant que Merchant of Record).

_(Adapter cette liste à la réalité ; supprimer ou ajouter selon les outils réellement utilisés.)_

## 4. Transferts hors Union européenne

Certains sous-traitants sont situés aux **États-Unis**. Les transferts s'appuient sur les garanties
prévues par le RGPD (clauses contractuelles types et/ou EU-US Data Privacy Framework).
`[À VÉRIFIER : citer le mécanisme exact figurant dans le DPA de chaque fournisseur (Supabase, Vercel,
Sentry, Lemon Squeezy)]`

## 5. Durées de conservation

- Données de compte : pendant la durée de l'abonnement, puis **[À FOURNIR : durée de conservation après suppression du compte]** après
  suppression du compte.
- Logs techniques / erreurs : **[À FOURNIR : durée de conservation des logs]**.
- Cookies : durée précisée dans la [politique cookies](/confidentialite) (au maximum
  **13 mois** pour les traceurs nécessitant consentement — recommandation CNIL).

## 6. Vos droits

Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants : **accès,
rectification, effacement, limitation, opposition, portabilité**, et retrait du consentement à tout
moment (sans effet rétroactif). Vous pouvez aussi définir des **directives post-mortem**.

> Source : https://www.cnil.fr/fr/passer-laction/les-droits-des-personnes-sur-leurs-donnees

Pour exercer ces droits : **contact@ghostmeta.online**. Nous répondons dans un délai d'un mois.

## 7. Réclamation auprès de la CNIL

Vous pouvez introduire une réclamation auprès de la **CNIL** (Commission nationale de l'informatique
et des libertés), 3 place de Fontenoy, 75007 Paris — https://www.cnil.fr/fr/plaintes.

## 8. Modifications

La présente politique peut être mise à jour. La date de dernière mise à jour figure en tête de
document.
