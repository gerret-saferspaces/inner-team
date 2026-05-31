// Leitet aus einem Namen einen eigenen, dezenten Farbton ab – jeder Anteil
// bekommt so ohne zusätzliche Eingabe einen ruhigen, eigenen Charakter.
export function hueFromName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

// Gedeckte Pastell-Tönung: heller Hintergrund + tiefer Textton, harmonisch.
export function avatarStyle(name) {
  const h = hueFromName(name);
  return {
    background: `hsl(${h} 32% 91%)`,
    color: `hsl(${h} 34% 40%)`,
  };
}

export function initial(name) {
  const t = name.trim();
  return t ? t[0].toUpperCase() : "•";
}
