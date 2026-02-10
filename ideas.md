# GhostMeta — Brainstorming Design

## Contexte
Application PWA de nettoyage de métadonnées d'images pour vendeurs C2C. Architecture Local-Only. Nom : GhostMeta. Ambiance : Dark Cyber-Sec. Couleurs : fond #0f172a, accents vert terminal #22c55e, ambre alertes.

---

<response>
<idea>

## Idée 1 : "Terminal Hacker" — Esthétique CLI Rétro-Futuriste

**Design Movement** : Rétro-futurisme terminal / Hacker Culture des années 90 revisité avec des technologies modernes.

**Core Principles** :
1. L'interface imite un terminal de commande — monospace, curseurs clignotants, texte qui "tape" à l'écran
2. Minimalisme brutal : zéro décoration superflue, chaque pixel a une fonction
3. L'information est reine : les données (métadonnées) sont affichées comme des logs de terminal
4. Sentiment de contrôle absolu : l'utilisateur se sent "hacker" de ses propres données

**Color Philosophy** :
- Fond : #0a0e17 (noir profond quasi-OLED)
- Texte principal : #22c55e (vert phosphore terminal classique)
- Alertes danger : #f59e0b (ambre CRT)
- Accents secondaires : #06b6d4 (cyan néon pour les liens/actions)
- Surfaces : #0f172a avec bordures 1px #1e293b (grille subtile)

**Layout Paradigm** : Layout en "panneaux de terminal" — l'écran est divisé en zones fonctionnelles comme un IDE ou un dashboard de monitoring. Zone de drop en haut, logs/résultats en bas, sidebar de contrôle à droite.

**Signature Elements** :
1. Texte qui s'affiche caractère par caractère (typewriter effect) pour les messages de statut
2. Bordures en pointillés ou tirets ASCII-art autour des zones de drop
3. Indicateurs de progression en barres ASCII `[████████░░░░] 67%`

**Interaction Philosophy** : Chaque action produit un "feedback terminal" — un log s'ajoute en temps réel. Le drag & drop déclenche une animation de "scan" avec des lignes vertes qui balaient l'image.

**Animation** : Animations minimales mais percutantes — glitch effects subtils sur les titres, scanlines CRT en overlay très léger, curseur clignotant sur les zones actives.

**Typography System** :
- Display : JetBrains Mono (Bold) pour les titres
- Body : JetBrains Mono (Regular) pour tout le reste — cohérence terminal totale
- Tailles : Hiérarchie stricte 14px/16px/24px/32px

</idea>
<probability>0.05</probability>
</response>

<response>
<idea>

## Idée 2 : "Stealth Operations" — Esthétique Militaire/Espionnage Moderne

**Design Movement** : UI tactique inspirée des interfaces HUD militaires et des films d'espionnage (Mission Impossible, Bourne). Design "glassmorphism" sombre avec des éléments géométriques angulaires.

**Core Principles** :
1. Chaque élément UI ressemble à un composant d'interface tactique — coins coupés, bordures angulaires
2. Hiérarchie visuelle par luminosité : les éléments importants "brillent", le reste reste dans l'ombre
3. L'espace négatif crée une tension visuelle — l'app respire le secret et la discrétion
4. Feedback visuel immédiat : chaque action a une réponse visuelle claire et satisfaisante

**Color Philosophy** :
- Fond principal : #0f172a (slate-900 profond — comme un écran de salle de contrôle)
- Surface élevée : #1e293b avec glassmorphism (backdrop-blur + opacité)
- Vert succès : #22c55e (confirmation d'opération réussie — "Target neutralized")
- Ambre alerte : #f59e0b (warning — métadonnées dangereuses détectées)
- Rouge critique : #ef4444 (GPS détecté — menace immédiate)
- Accent cyan : #06b6d4 pour les éléments interactifs et les bordures focus

**Layout Paradigm** : Layout asymétrique vertical — hero compact avec zone de drop massive au centre, résultats qui apparaissent en dessous dans des "cartes tactiques" avec coins coupés. Sur mobile, tout s'empile naturellement. Pas de sidebar — tout est vertical et scrollable.

**Signature Elements** :
1. Coins coupés (clip-path) sur les cartes et boutons — style "badge militaire"
2. Lignes de scan animées qui traversent les images pendant le traitement
3. Badges de statut avec pulse animation : "CLEAN" (vert), "THREAT DETECTED" (rouge pulsant)

**Interaction Philosophy** : L'utilisateur mène une "opération" — le drop déclenche un "scan", les métadonnées sont des "menaces" à "neutraliser". Le bouton principal dit "NEUTRALISER" ou "PURGER". Le feedback est immédiat et dramatique.

**Animation** :
- Entrée des cartes : slide-up avec fade depuis le bas (staggered)
- Scan d'image : ligne horizontale verte qui descend sur la preview
- Suppression : les métadonnées "se dissolvent" avec un effet de glitch
- Boutons : scale légèrement au hover avec glow vert subtil
- Progress : barre avec effet de "pulse" lumineux qui se déplace

**Typography System** :
- Display : Space Grotesk (Bold/SemiBold) — géométrique, moderne, autoritaire
- Body : Inter (Regular/Medium) — lisibilité maximale pour les données techniques
- Monospace : JetBrains Mono pour les valeurs de métadonnées (coordonnées GPS, dates)
- Tailles : 14px données / 16px body / 20px sous-titres / 36px hero / 48px titre principal

</idea>
<probability>0.08</probability>
</response>

<response>
<idea>

## Idée 3 : "Digital Ghost" — Esthétique Spectrale Minimaliste

**Design Movement** : Néo-brutalisme sombre mélangé avec une esthétique "fantôme numérique" — l'app elle-même semble éphémère, comme si elle pouvait disparaître. Inspiré par les interfaces de Signal et ProtonMail.

**Core Principles** :
1. Ultra-minimalisme fonctionnel : pas un seul élément décoratif qui ne serve pas l'UX
2. Transparence et confiance : l'interface communique visuellement "rien n'est caché"
3. Sensation d'éphémérité : les éléments apparaissent et disparaissent avec fluidité
4. Mobile-first radical : conçu pour le pouce, pas pour la souris

**Color Philosophy** :
- Fond : gradient très subtil de #0f172a vers #020617 (profondeur sans être plat)
- Surfaces : #1e293b avec opacité variable (les cartes "flottent" comme des fantômes)
- Vert fantôme : #22c55e avec glow/blur — le vert "irradie" légèrement
- Ambre spectral : #fbbf24 pour les warnings
- Texte principal : #e2e8f0 (pas blanc pur — plus doux pour les yeux)
- Texte secondaire : #94a3b8

**Layout Paradigm** : Single-column centré mais avec des marges généreuses et des éléments qui "flottent" avec des ombres diffuses. La zone de drop est un grand cercle ou rectangle aux bords très arrondis avec un effet de "respiration" (scale animation subtile). Les résultats apparaissent en dessous comme des "apparitions".

**Signature Elements** :
1. Effet de "glow" vert autour des éléments actifs — comme une aura fantôme
2. Le logo fantôme qui "clignote" subtilement (opacity animation)
3. Particules flottantes très subtiles en arrière-plan (comme de la poussière numérique)

**Interaction Philosophy** : L'app est silencieuse et efficace — pas de dramatisation. Drop → Scan silencieux → Résultat clair. Le fantôme "absorbe" les métadonnées. L'expérience est zen et rassurante, pas anxiogène.

**Animation** :
- Zone de drop : "respiration" lente (scale 1.0 → 1.02 en boucle)
- Apparition des résultats : fade-in + slide-up doux (300ms ease-out)
- Suppression des métadonnées : fade-out élégant avec léger blur
- Hover sur boutons : glow vert qui s'intensifie
- Chargement : cercle de progression avec trail lumineux

**Typography System** :
- Display : Space Grotesk (Bold) — moderne et net
- Body : DM Sans (Regular/Medium) — chaleureux mais professionnel
- Monospace : Fira Code pour les données techniques
- Tailles : 13px caption / 15px body / 18px lead / 28px h2 / 40px h1

</idea>
<probability>0.07</probability>
</response>

---

## Décision

**Approche choisie : Idée 2 — "Stealth Operations"**

Cette approche est la plus alignée avec le brief du client ("GHOST PROTOCOL - Esthétique Cyber-Sec") tout en étant la plus professionnelle et la plus impactante visuellement. Les coins coupés et le vocabulaire militaire ("neutraliser", "menace détectée") créent une expérience mémorable et différenciante. Le layout asymétrique vertical est parfaitement adapté au mobile-first. Les animations de scan et les badges de statut pulsants renforcent le sentiment de sécurité et de contrôle.
