// Minimaler Express-Server für die gebaute PWA.
//
// Serviert das Vite-Build aus dist/. Die App ist eine reine Browser-PWA
// (Daten in localStorage). Der /api/health-Endpunkt und diese Struktur bleiben
// bewusst klein, damit später eine echte API/DB ergänzt werden kann, ohne den
// Deploy auf Render zu verändern.

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", storage: "browser-localStorage", version: "0.2.0" });
});

if (!existsSync(DIST)) {
  console.warn("⚠  dist/ fehlt – bitte zuerst `npm run build` ausführen.");
}

// Gebaute PWA ausliefern.
app.use(express.static(DIST));

// SPA-Fallback: alle übrigen Routen liefern die App-Shell.
app.get("*", (_req, res) => {
  res.sendFile(join(DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Mein inneres Team läuft auf http://localhost:${PORT}`);
});
