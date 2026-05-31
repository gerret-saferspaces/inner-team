import { useState } from "react";
import Shell from "./Shell.jsx";
import { PROMPTS } from "../prompts.js";
import { avatarStyle, initial } from "../visual.js";

// Geführte Entdeckung des inneren Teams:
// 1) Einführung  2) Frage für Frage Stimmen aufspüren & benennen  3) Überblick
export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | discover | summary
  const [idx, setIdx] = useState(0);
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");

  const total = PROMPTS.length;

  const next = (add) => {
    let nextParts = parts;
    if (add && name.trim()) {
      nextParts = [...parts, { id: crypto.randomUUID(), name: name.trim() }];
      setParts(nextParts);
    }
    setName("");
    if (idx + 1 < total) setIdx(idx + 1);
    else setPhase("summary");
  };

  // ---------- Einführung ----------
  if (phase === "intro") {
    return (
      <div className="screen center">
        <span className="mark">◍</span>
        <h1 className="display">Entdecke dein inneres Team</h1>
        <p className="lead">
          In dir sprechen viele Stimmen – mal laut, mal leise. Ein paar Fragen
          helfen dir, sie aufzuspüren und ihnen einen Namen zu geben.
        </p>
        <button className="btn lg" onClick={() => setPhase("discover")}>
          Auf Entdeckung gehen
        </button>
      </div>
    );
  }

  // ---------- Überblick ----------
  if (phase === "summary") {
    return (
      <div className="screen">
        <p className="eyebrow">Dein inneres Team</p>
        <h1 className="display">
          {parts.length === 0
            ? "Noch keine Stimme"
            : `${parts.length} ${parts.length === 1 ? "Stimme" : "Stimmen"} entdeckt`}
        </h1>
        {parts.length > 0 && (
          <ul className="list">
            {parts.map((p, i) => (
              <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
                <span className="avatar" style={avatarStyle(p.name)}>{initial(p.name)}</span>
                <span className="pname">{p.name}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="lead" style={{ marginTop: 22 }}>
          Du kannst jederzeit weitere hinzufügen oder bestehende entfernen.
        </p>
        <button className="btn wide" onClick={() => onComplete(parts)}>
          {parts.length > 0 ? "Das ist mein Team →" : "Selbst eintragen →"}
        </button>
      </div>
    );
  }

  // ---------- Entdeckung (eine Frage pro Schritt) ----------
  const prompt = PROMPTS[idx];
  return (
    <Shell
      eyebrow={`Frage ${idx + 1} von ${total}`}
      action={
        <button className="link-btn" onClick={() => next(false)}>
          {idx + 1 < total ? "Überspringen" : "Fertig"}
        </button>
      }
      dock={
        <form onSubmit={(e) => { e.preventDefault(); next(true); }} className="add-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wie nennst du diese Stimme?"
          />
          <button className="btn round" disabled={!name.trim()} aria-label="Weiter">→</button>
        </form>
      }
    >
      <h2 className="question display">{prompt.question}</h2>

      {prompt.examples.length > 0 && (
        <>
          <p className="chips-label">Zur Inspiration – tippen zum Übernehmen:</p>
          <div className="chips">
            {prompt.examples.map((ex) => (
              <button key={ex} className="chip" onClick={() => setName(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </>
      )}

      {parts.length > 0 && (
        <p className="found">Bisher entdeckt: {parts.map((p) => p.name).join(" · ")}</p>
      )}
    </Shell>
  );
}
