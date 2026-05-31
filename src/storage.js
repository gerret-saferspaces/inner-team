// Persistenz-Abstraktion.
//
// Heute: alles lokal im Browser (localStorage). Es werden NIE Anteile für den
// Nutzer vorausgefüllt – der Startzustand ist bewusst leer und wird erst im
// Onboarding gefüllt.
//
// Später: load()/save() können 1:1 gegen API-Aufrufe (DB) getauscht werden,
// ohne dass die React-Komponenten etwas davon merken.

const STORAGE_KEY = "inner-team:v2";

export const emptyState = () => ({
  onboarded: false,
  parts: [],
});

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    return {
      onboarded: Boolean(data.onboarded),
      parts: Array.isArray(data.parts) ? data.parts : [],
    };
  } catch (e) {
    console.warn("Konnte Daten nicht laden:", e);
    return emptyState();
  }
}

export function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Konnte Daten nicht speichern:", e);
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10);
