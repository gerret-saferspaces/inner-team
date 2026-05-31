import { useState } from "react";
import PartForm from "./PartForm.jsx";
import { KIND_LABEL } from "../constants.js";

// Übersicht des definierten Teams nach dem Onboarding.
// Anteile lassen sich hinzufügen, bearbeiten und entfernen.
export default function Team({ parts, onAdd, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(null); // part object | "new" | null

  const closeModal = () => setEditing(null);
  const handleSave = (part) => {
    if (editing === "new") onAdd(part);
    else onUpdate(part);
    closeModal();
  };

  return (
    <div className="team">
      <header className="team-head">
        <div className="brand">
          <span className="brand-mark">◍</span>
          <div>
            <h1>Mein inneres Team</h1>
            <p className="tagline">Anteile erkennen · verstehen · zusammenbringen</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          + Anteil
        </button>
      </header>

      <div className="grid">
        {parts.map((p) => (
          <article key={p.id} className="part-card" onClick={() => setEditing(p)}>
            <span className="swatch" style={{ background: p.color }} />
            <div className="part-top">
              <div className="part-emoji">{p.emoji}</div>
              <div>
                <div className="part-name">{p.name}</div>
                {p.role && <div className="part-role">{p.role}</div>}
              </div>
            </div>
            <span className={"tag " + p.kind}>{KIND_LABEL[p.kind]}</span>
            {p.needs && (
              <p className="part-line"><span className="label">Braucht</span><br />{p.needs}</p>
            )}
            {p.fears && (
              <p className="part-line"><span className="label">Fürchtet</span><br />{p.fears}</p>
            )}
            {p.says && <div className="part-says">„{p.says}“</div>}
          </article>
        ))}

        <button className="add-card" onClick={() => setEditing("new")}>
          <span><span className="plus">+</span>Anteil hinzufügen</span>
        </button>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing === "new" ? "Neuer Anteil" : "Anteil bearbeiten"}</h2>
              {editing !== "new" && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm(`„${editing.name}“ wirklich entfernen?`)) {
                      onRemove(editing.id);
                      closeModal();
                    }
                  }}
                >
                  Entfernen
                </button>
              )}
            </div>
            <PartForm
              initial={editing === "new" ? null : editing}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
