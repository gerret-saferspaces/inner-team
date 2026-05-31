import { useState } from "react";
import { avatarStyle, initial } from "../visual.js";

// Onboarding, radikal minimal: ein Schritt, eine Aktion.
// 1) Begrüßung   2) Anteile (nur Namen) eintragen
export default function Onboarding({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");

  if (!started) {
    return (
      <div className="screen center">
        <span className="mark">◍</span>
        <h1 className="display">Dein inneres&nbsp;Team</h1>
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
    <div className="screen">
      <h2 className="display">Welche Stimmen<br />gehören zu dir?</h2>

      <form onSubmit={add} className="add-row">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Der Kritiker"
        />
        <button className="btn" disabled={!name.trim()}>+</button>
      </form>

      <ul className="list">
        {parts.map((p, i) => (
          <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
            <span className="avatar" style={avatarStyle(p.name)}>{initial(p.name)}</span>
            <span className="pname">{p.name}</span>
          </li>
        ))}
      </ul>

      {parts.length > 0 && (
        <button className="btn primary wide" onClick={() => onComplete(parts)}>
          Mein Team ist bereit →
        </button>
      )}
    </div>
  );
}
