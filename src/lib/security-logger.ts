/**
 * SEC-019 : Logging structuré des événements de sécurité.
 *
 * Centralise le logging des événements suspects (rejets de fichiers,
 * erreurs auth, crashes) dans un format structuré et extensible.
 *
 * Architecture :
 * - Console uniquement (privacy-first, pas d'envoi serveur)
 * - Format : [GhostMeta:SEC] TYPE | détails
 * - Extensible : ajouter un transport Sentry/Datadog en remplaçant dispatch()
 */

type SecurityEventType =
  | "FILE_REJECTED"       // Fichier rejeté par magic bytes ou taille
  | "VALIDATION_ERROR"    // Erreur de validation inattendue
  | "AUTH_ERROR"          // Erreur d'authentification Supabase
  | "RENDER_CRASH"        // Crash React attrapé par ErrorBoundary
  | "PROCESSING_ERROR";   // Erreur pendant le traitement d'image

interface SecurityEvent {
  type: SecurityEventType;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Dispatch un événement de sécurité.
 * Point d'extension unique : remplacer console par un transport externe.
 */
function dispatch(event: SecurityEvent): void {
  const prefix = `[GhostMeta:SEC] ${event.type}`;
  const detail = event.details
    ? ` | ${JSON.stringify(event.details)}`
    : "";

  console.error(`${prefix} | ${event.message}${detail}`);
}

/**
 * Log un événement de sécurité avec horodatage ISO.
 * Usage : logSecurityEvent("FILE_REJECTED", "Magic bytes invalides", { filename, size })
 */
export function logSecurityEvent(
  type: SecurityEventType,
  message: string,
  details?: Record<string, unknown>
): void {
  dispatch({
    type,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
}
