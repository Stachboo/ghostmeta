import { lazy, type ComponentType } from "react";

/**
 * Résilience au chargement des chunks lazy.
 *
 * Problème : à chaque déploiement, Vite re-hashe les noms de fichiers JS. Un
 * onglet resté ouvert avant un déploiement garde l'ancien index.html en
 * mémoire ; naviguer ensuite vers une route lazy demande l'ancien chunk, qui
 * peut avoir disparu (ou échouer sur un blip réseau mobile) → l'import
 * dynamique rejette et l'utilisateur tombe sur l'ErrorBoundary "SYSTEM_FAILURE"
 * alors que la situation est parfaitement récupérable.
 *
 * Stratégie : réessayer une fois (couvre un blip réseau), puis, si ça échoue
 * encore avec une erreur de chunk, recharger la page UNE seule fois pour
 * récupérer le nouvel index.html. Un drapeau en sessionStorage empêche toute
 * boucle de rechargement si le reload ne résout pas le problème.
 */

const RELOAD_KEY = "gm-chunk-reloaded";

/** Détecte une erreur de chargement de module dynamique / modulepreload. */
export function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /dynamically imported module|Importing a module script failed|Failed to fetch|ChunkLoadError|error loading dynamically imported module|expected a JavaScript(?:-or-Wasm)? module/i.test(
    msg
  );
}

/**
 * Recharge la page une seule fois pour récupérer un chunk périmé.
 * @returns true si un rechargement a été déclenché.
 */
export function reloadOnceForStaleChunk(): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return false;
    sessionStorage.setItem(RELOAD_KEY, "1");
  } catch {
    /* sessionStorage indisponible (navigation privée stricte) → on recharge quand même */
  }
  window.location.reload();
  return true;
}

/** Réarme le garde-fou après un chargement de chunk réussi. */
function clearStaleChunkFlag(): void {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Équivalent de React.lazy() mais résilient : retry unique puis reload de
 * secours sur erreur de chunk. À utiliser à la place de lazy() pour toutes
 * les routes découpées en chunks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      clearStaleChunkFlag();
      return mod;
    } catch (err) {
      if (!isChunkLoadError(err)) throw err;
      // 1 retry immédiat (blip réseau transitoire)
      try {
        const mod = await factory();
        clearStaleChunkFlag();
        return mod;
      } catch (err2) {
        // Toujours en échec → chunk vraisemblablement périmé : reload unique.
        if (reloadOnceForStaleChunk()) {
          // Promesse jamais résolue : le rechargement prend le relais.
          return new Promise<{ default: T }>(() => {});
        }
        throw err2;
      }
    }
  });
}
