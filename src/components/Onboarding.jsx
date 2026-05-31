import { useState } from "react";

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
        <h1>Dein inneres Team</h1>
        <p className="lead">
          In dir leben viele Stimmen. Lass uns sie aufschreiben – eine nach der
          anderen.
        </p>
        <button className="btn" onClick={() => setStarted(true)}>
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
      <h2>Welche Anteile gehören zu dir?</h2>

      <form onSubmit={add} className="add-row">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Der Kritiker"
        />
        <button className="btn" disabled={!name.trim()}>Hinzufügen</button>
      </form>

      <ul className="list">
        {parts.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {parts.length > 0 && (
        <button className="btn primary wide" onClick={() => onComplete(parts)}>
          Fertig
        </button>
      )}
    </div>
  );
}
