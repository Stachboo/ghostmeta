import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configuration manquante → on NE jette PAS au chargement du module.
// Jeter ici remontait jusqu'à <App /> via le ErrorBoundary (RENDER_CRASH),
// crashait toute la page d'accueil et polluait la console de 2 erreurs.
// On dégrade proprement : un avertissement unique (warn, pas error) et un
// client construit avec un placeholder valide — les appels auth échouent
// alors de façon contrôlée (réseau) au lieu de faire planter tout l'arbre
// React au montage.
//
// NB : createClient() exige une URL non vide et parseable + une clé non vide,
// sinon il jette ("supabaseUrl is required."). On fournit donc un placeholder
// inerte plutôt que des chaînes vides.
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[GhostMeta] Variables d\'environnement Supabase manquantes ' +
    '(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
    "L'authentification est désactivée jusqu'à leur configuration."
  );
}

export const supabase = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY
);
