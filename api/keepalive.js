/**
 * api/keepalive.js — Anti-pause heartbeat for Supabase (free tier)
 *
 * Le free tier Supabase met le projet en pause après ~7 jours sans
 * requête → l'auth/login prod se retrouve cassé. Ce endpoint fait une
 * requête REST triviale : ça compte comme activité et repousse le pause.
 *
 * Déclenché par un cron Vercel quotidien (voir "crons" dans vercel.json).
 * On lit uniquement l'URL + la clé anon (jamais la service_role ici).
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return res.status(500).json({
      status: "error",
      reason: "missing SUPABASE_URL or anon key env var",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Requête REST minimale : touche Postgres (donc = activité) sans
    // dépendre du contenu ni du RLS. HEAD + limit 0 = payload nul.
    const ping = await fetch(
      `${url}/rest/v1/subscriptions?select=id&limit=1`,
      {
        method: "HEAD",
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      }
    );

    return res.status(200).json({
      status: "ok",
      db_reachable: ping.ok || ping.status < 500,
      db_status: ping.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(502).json({
      status: "error",
      reason: String(err?.message || err),
      timestamp: new Date().toISOString(),
    });
  }
}
