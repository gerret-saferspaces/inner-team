// Leitet aus einem Namen eine eigene Farbe ab – jeder Anteil bekommt so ohne
// zusätzliche Eingabe einen eigenen Charakter (Avatar-Verlauf + Initiale).
export function hueFromName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function avatarStyle(name) {
  const h = hueFromName(name);
  const h2 = (h + 48) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${h} 72% 64%), hsl(${h2} 70% 52%))`,
  };
}

export function initial(name) {
  const t = name.trim();
  return t ? t[0].toUpperCase() : "•";
}
