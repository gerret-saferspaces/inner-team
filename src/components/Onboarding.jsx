import { useState } from "react";
import Shell from "./Shell.jsx";
import { avatarStyle, initial } from "../visual.js";

// Onboarding, minimal: ein Schritt, eine Aktion.
// 1) Begrüßung   2) Anteile (nur Namen) eintragen
export default function Onboarding({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");

  if (!started) {
    return (
      <div className="screen center">
        <span className="mark">◍</span>
        <h1 className="display">Dein inneres Team</h1>
        <p className="lead">
          In dir leben viele Stimmen. Lass uns sie aufschreiben – eine nach der
          anderen.
        </p>
        <button className="btn lg" onClick={() => setStarted(true)}>
          Los geht's
        </button>
      </div>
    );
  }

  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setParts((p) => [...p, { id: crypto.randomUUID(), name: n }]);
    setName("");
  };

  return (
    <Shell
      eyebrow="Schritt für Schritt"
      title="Welche Stimmen gehören zu dir?"
      action={
        parts.length > 0 && (
          <button className="link-btn" onClick={() => onComplete(parts)}>
            Fertig →
          </button>
        )
      }
      dock={
        <form onSubmit={add} className="add-row">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Der Kritiker"
          />
          <button className="btn round" disabled={!name.trim()} aria-label="Hinzufügen">+</button>
        </form>
      }
    >
      {parts.length === 0 ? (
        <p className="hint">Tippe unten den ersten Anteil ein.</p>
      ) : (
        <ul className="list">
          {parts.map((p, i) => (
            <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
              <span className="avatar" style={avatarStyle(p.name)}>{initial(p.name)}</span>
              <span className="pname">{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
