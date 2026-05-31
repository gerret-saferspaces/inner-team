import { useState } from "react";
import { EMOJIS, COLORS, KINDS } from "../constants.js";
import { uid } from "../storage.js";

// Formular zum Anlegen/Bearbeiten eines Anteils.
// Vorgaben (Emoji/Farbe) sind nur Auswahlhilfen – Inhalte gibt der Nutzer ein.
export default function PartForm({ initial, onSave, onCancel, submitLabel = "Speichern" }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "🎭");
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [role, setRole] = useState(initial?.role ?? "");
  const [needs, setNeeds] = useState(initial?.needs ?? "");
  const [fears, setFears] = useState(initial?.fears ?? "");
  const [says, setSays] = useState(initial?.says ?? "");
  const [kind, setKind] = useState(initial?.kind ?? "neutral");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      id: initial?.id ?? uid(),
      name: trimmed,
      emoji,
      color,
      role: role.trim(),
      needs: needs.trim(),
      fears: fears.trim(),
      says: says.trim(),
      kind,
    });
  };

  return (
    <form className="part-form" onSubmit={submit}>
      <div className="field">
        <label>Wie heißt dieser Anteil?</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Der innere Kritiker, Die Mutige …"
        />
      </div>

      <div className="field">
        <label>Symbol</label>
        <div className="emoji-picker">
          {EMOJIS.map((e) => (
            <button
              type="button"
              key={e}
              className={e === emoji ? "sel" : ""}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Farbe</label>
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={c === color ? "sel" : ""}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label>Rolle / Funktion <span className="opt">(optional)</span></label>
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="z. B. Beschützer, Antreiber" />
      </div>

      <div className="field">
        <label>Was braucht dieser Anteil? <span className="opt">(optional)</span></label>
        <input value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="z. B. Sicherheit, Anerkennung" />
      </div>

      <div className="field">
        <label>Wovor fürchtet er sich? <span className="opt">(optional)</span></label>
        <input value={fears} onChange={(e) => setFears(e.target.value)} placeholder="z. B. Fehler, Kontrollverlust" />
      </div>

      <div className="field">
        <label>Typischer Satz <span className="opt">(optional)</span></label>
        <textarea value={says} onChange={(e) => setSays(e.target.value)} placeholder="Was sagt er, wenn er laut wird?" />
      </div>

      <div className="field">
        <label>Wirkt eher als …</label>
        <div className="kind-picker">
          {KINDS.map((k) => (
            <button
              type="button"
              key={k.value}
              className={kind === k.value ? "sel-" + k.value : ""}
              onClick={() => setKind(k.value)}
            >
              <strong>{k.label}</strong>
              <span>{k.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Abbrechen
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
