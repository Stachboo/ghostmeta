/**
 * api/indexnow.js — Vercel Serverless Function
 *
 * Soumet toutes les URLs du sitemap à l'API IndexNow (Bing, Yandex, etc.)
 * Appel : POST /api/indexnow avec header Authorization: Bearer <INDEXNOW_SECRET>
 * Ou automatiquement via un Vercel Deploy Hook.
 */

const INDEXNOW_KEY = "ffb631a305804310a69bb3a7eaf4e97d";
const HOST = "www.ghostmeta.online";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/pricing`,
  `https://${HOST}/blog/vinted-securite-photo-guide`,
  `https://${HOST}/blog/supprimer-exif-iphone-android`,
  `https://${HOST}/blog/comprendre-donnees-exif-gps`,
  `https://${HOST}/blog/nettoyage-photo-local-vs-cloud`,
  `https://${HOST}/blog/ghostmeta-manifeste-confidentialite`,
];

export default async function handler(req, res) {
  // SEC-020 : restreindre CORS à notre domaine uniquement
  res.setHeader("Access-Control-Allow-Origin", "https://www.ghostmeta.online");

  // POST uniquement — bloque GET, PUT, DELETE, etc.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth obligatoire — fail closed si INDEXNOW_SECRET non configuré
  const secret = process.env.INDEXNOW_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Service not configured" });
  }

  const auth = req.headers.authorization?.replace("Bearer ", "");
  const query = req.query?.secret;
  if (auth !== secret && query !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const body = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: URLS,
    };

    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    const status = response.status;
    // IndexNow retourne 200 (OK), 202 (Accepted), ou 200 sans body
    const text = await response.text().catch(() => "");

    return res.status(200).json({
      success: status >= 200 && status < 300,
      indexnow_status: status,
      indexnow_response: text || "(empty)",
      urls_submitted: URLS.length,
      urls: URLS,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
