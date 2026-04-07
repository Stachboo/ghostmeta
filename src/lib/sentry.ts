import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry(): void {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Privacy-first : pas de PII
    sendDefaultPii: false,
    beforeSend(event) {
      // Supprimer les données utilisateur potentielles
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },
    // Échantillonnage raisonnable
    tracesSampleRate: 0.1,
  });
}

/**
 * Envoie un événement de sécurité à Sentry.
 * Utilisé par security-logger.ts dispatch().
 */
export function captureSecurityEvent(
  type: string,
  message: string,
  details?: Record<string, unknown>
): void {
  if (!SENTRY_DSN) return;

  Sentry.captureMessage(`[SEC] ${type}: ${message}`, {
    level: "warning",
    tags: { security_event: type },
    extra: details,
  });
}
