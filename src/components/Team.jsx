import { useState } from "react";
import { avatarStyle, initial } from "../visual.js";

// Team-Übersicht, minimal: Liste der Namen, hinzufügen, entfernen.
export default function Team({ parts, onAdd, onRemove }) {
  const [name, setName] = useState("");

  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onAdd({ id: crypto.randomUUID(), name: n });
    setName("");
  };

  return (
    <div className="screen">
      <p className="eyebrow">◍ Mein inneres Team</p>
      <h2 className="display">{parts.length} {parts.length === 1 ? "Stimme" : "Stimmen"}</h2>

      <ul className="list">
        {parts.map((p, i) => (
          <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
            <span className="avatar" style={avatarStyle(p.name)}>{initial(p.name)}</span>
            <span className="pname">{p.name}</span>
            <button className="x" onClick={() => onRemove(p.id)} aria-label="Entfernen">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="add-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Weitere Stimme …"
        />
        <button className="btn" disabled={!name.trim()}>+</button>
      </form>
    </div>
  );
}
