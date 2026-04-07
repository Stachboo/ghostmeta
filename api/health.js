/**
 * api/health.js — Health check endpoint
 *
 * Returns service status, timestamp, and build info.
 * Used for monitoring and deployment verification.
 */

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    environment: process.env.VERCEL_ENV || "development",
  });
}
