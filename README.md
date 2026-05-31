# Mein inneres Team 🪑

Eine kleine Web-App, mit der du dein **inneres Team** sichtbar machst – die
verschiedenen Anteile in dir, die gleichzeitig existieren und bei
Entscheidungen mal lauter, mal leiser sind (nach dem Modell des *Inneren Teams*
von Friedemann Schulz von Thun).

Ziel der App:

- **Anteile erkennen** – nicht nur den inneren Kritiker, sondern auch ganz
  eigene Charaktere benennen.
- **Verstehen, wer du bist** – was jeder Anteil braucht, wovor er sich fürchtet,
  was er typischerweise sagt.
- **Blocker & Helfer identifizieren** – wer hält dich zurück, und welcher Anteil
  könnte in einer Situation weiterhelfen?

## Die drei Bereiche

| Bereich | Wofür |
|---|---|
| **Mein Team** | Anteile anlegen und beschreiben (Name, Symbol, Bedürfnis, Angst, typischer Satz, Wirkung als Blocker/Helfer/Neutral). |
| **Innere Konferenz** | Eine konkrete Frage stellen und einstellen, wie laut sich jeder Anteil meldet, was er sagt – plus Reflexion zu Blocker, Helfer und nächstem Schritt. |
| **Erkenntnisse** | Überblick: wer ist im Schnitt am lautesten, welche Blocker-/Helfer-Muster zeigen sich, das Team auf einen Blick. |

## Datenhaltung

Für diese erste Version bleiben **alle Daten lokal im Browser** (`localStorage`).
Es gibt keinen Account und keinen Server-Speicher. Über **Export/Import** (oben
rechts) kannst du deine Daten als JSON-Datei sichern oder auf ein anderes Gerät
übertragen.

Die Persistenz steckt hinter einer kleinen `Storage`-Abstraktion in
`public/app.js`. Wer später auf eine Datenbank wechseln will, tauscht dort
`load()` / `save()` gegen API-Aufrufe – der Rest der App bleibt unverändert.
Der Express-Server (`server.js`) bringt dafür bereits einen `/api/health`-Endpunkt
und eine Stelle für künftige API-Routen mit.

## Lokal starten

```bash
npm install
npm start
# → http://localhost:3000
```

## Auf Render deployen

Das Repo enthält eine `render.yaml` (Blueprint):

1. In Render **New → Blueprint** wählen und dieses Repository verbinden.
2. Render erkennt den Web-Service automatisch (`npm install` / `npm start`).

Alternativ als normaler Web-Service:

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Render setzt `PORT` selbst; der Server liest ihn aus `process.env.PORT`.

## Tech

Vanilla JS, keine Frameworks, kein Build-Schritt. Express dient nur dazu, die
statischen Dateien auszuliefern und einen sauberen Deploy auf Render zu
ermöglichen.
