/**
 * Événements de conversion — Vercel Analytics.
 *
 * `<Analytics />` n'est monté que si l'utilisateur a consenti (App.tsx) ;
 * ce garde-fou évite en plus d'émettre un événement pendant le laps de temps
 * où le composant n'est pas encore monté après l'acceptation.
 *
 * Les noms d'événements sont volontairement stables : ils servent de clés
 * dans le dashboard Vercel, un renommage casse l'historique.
 */

import { track } from '@vercel/analytics';

const CONSENT_KEY = 'ghostmeta-analytics-consent';

export type ConversionEvent =
  | 'signup'
  | 'trial_started'
  | 'checkout_click'
  | 'image_cleaned';

export function trackEvent(
  event: ConversionEvent,
  properties?: Record<string, string | number | boolean | null>
): void {
  try {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;
    track(event, properties);
  } catch {
    // La mesure ne doit jamais casser un parcours d'achat ou de nettoyage.
  }
}
