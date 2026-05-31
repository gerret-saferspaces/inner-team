import { useState } from "react";

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
      <h2>Mein inneres Team</h2>

      <ul className="list">
        {parts.map((p) => (
          <li key={p.id}>
            {p.name}
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
          placeholder="Weiterer Anteil …"
        />
        <button className="btn" disabled={!name.trim()}>Hinzufügen</button>
      </form>
    </div>
  );
}
