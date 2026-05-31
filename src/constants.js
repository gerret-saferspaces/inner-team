// Auswahlmöglichkeiten – reine UI-Vorgaben, keine vorausgefüllten Anteile.

export const EMOJIS = [
  "🧐", "😟", "🚀", "🛡️", "🔥", "🌱", "🧭", "🎭",
  "💪", "🤍", "🌙", "⚖️", "🎈", "🦉", "🐯", "🧊",
  "❤️", "🔧", "🎨", "📣", "🤫", "👑",
];

export const COLORS = [
  "#7c6cf0", "#d98a6a", "#5fa888", "#e0a93b",
  "#5b8def", "#c965a8", "#7a8b99", "#8a7cc0",
];

export const KINDS = [
  { value: "blocker", label: "Blocker", hint: "hält mich eher zurück" },
  { value: "neutral", label: "Neutral", hint: "mal so, mal so" },
  { value: "helper", label: "Helfer", hint: "bringt mich weiter" },
];

export const KIND_LABEL = {
  blocker: "Blocker",
  neutral: "Neutral",
  helper: "Helfer",
};
