# Mein inneres Team 🪑

Eine **Progressive Web App** (React + Vite), mit der du dein **inneres Team**
sichtbar machst – die verschiedenen Anteile in dir, die gleichzeitig existieren
und bei Entscheidungen mal lauter, mal leiser sind (nach dem Modell des
*Inneren Teams* von Friedemann Schulz von Thun).

> **Wichtig:** Die App füllt **niemals** Anteile für dich vor. Du legst im
> Onboarding alle Stimmen selbst an.

## Aktueller Stand (Minimalversion)

Bewusst auf das Nötigste reduziert – ein Anteil ist erst mal nur ein **Name**.

1. Begrüßung (eine Aktion: starten).
2. **Anteile eintragen** – Name eingeben, hinzufügen, wiederholen.
3. **Team-Übersicht** – Liste der Anteile, hinzufügen und entfernen.

Installierbar als PWA (Manifest + Service Worker, offline-fähig). Mehr Details
pro Anteil (Bedürfnis, Angst, Blocker/Helfer …) sowie Konferenz- und
Erkenntnis-Ansichten folgen als nächste Schritte – nur wenn nötig.

## Datenhaltung

Alle Daten bleiben **lokal im Browser** (`localStorage`) – kein Account, kein
Server-Speicher. Die Persistenz steckt hinter `src/storage.js` (`load()` /
`save()`); für einen späteren Wechsel auf eine Datenbank werden dort nur die
beiden Funktionen gegen API-Aufrufe getauscht. Der Express-Server bringt dafür
bereits einen `/api/health`-Endpunkt mit.

## Entwicklung

```bash
npm install
npm run dev      # Vite Dev-Server (Hot Reload)
```

Produktion lokal testen:

```bash
npm run build    # erzeugt dist/ inkl. Service Worker
npm start        # Express serviert dist/ → http://localhost:3000
```

PWA-Icons neu generieren (reiner PNG-Encoder, ohne externe Tools):

```bash
npm run icons
```

## Auf Render deployen

Das Repo enthält eine `render.yaml` (Blueprint):

1. In Render **New → Blueprint** wählen, dieses Repo + Branch `main` verbinden.
2. Render baut mit `npm install && npm run build` und startet mit `npm start`.
3. `PORT` setzt Render selbst; der Server liest ihn aus `process.env.PORT`.
   Health-Check läuft gegen `/api/health`.

## Tech

- **React + Vite** (kein eigenes Setup-Boilerplate, schneller Dev-Server)
- **vite-plugin-pwa** für Manifest + Service Worker
- **Express** nur zum Ausliefern des Builds und als Anker für eine spätere API
