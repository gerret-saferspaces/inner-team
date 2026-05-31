// Minimal Express server for "Mein inneres Team".
//
// For the MVP this only serves the static browser app. All data lives in the
// browser (localStorage), so there is no backend storage yet. The /api/health
// route and the structure here are kept deliberately small so that a real
// persistence layer (e.g. a database + REST API) can be added later without
// changing the deployment setup on Render.

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the browser app.
app.use(express.static(join(__dirname, "public")));

// Tiny health/readiness endpoint, handy for Render and future API checks.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", storage: "browser-localStorage", version: "0.1.0" });
});

// SPA fallback: always return the app shell.
app.get("*", (_req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Mein inneres Team läuft auf http://localhost:${PORT}`);
});
