import { useState } from "react";
import PartForm from "./PartForm.jsx";
import { KIND_LABEL } from "../constants.js";

// Onboarding: Begrüßung → eigene Anteile definieren → Abschluss.
// Es werden ausschließlich vom Nutzer eingegebene Anteile übernommen.
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState("welcome"); // welcome | build
  const [parts, setParts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addPart = (part) => {
    setParts((prev) => [...prev, part]);
    setShowForm(false);
  };
  const removePart = (id) => setParts((prev) => prev.filter((p) => p.id !== id));

  if (step === "welcome") {
    return (
      <div className="onboard">
        <div className="onboard-card welcome">
          <span className="brand-mark big">◍</span>
          <h1>Dein inneres Team</h1>
          <p className="lead">
            In dir leben viele Stimmen gleichzeitig – der innere Kritiker, die
            Mutige, der Zweifler, die Träumerin. Bei jeder Frage melden sie sich
            mal lauter, mal leiser.
          </p>
          <p className="lead">
            Lass uns zuerst <strong>dein Team</strong> kennenlernen. Du
            definierst alle Anteile selbst – es gibt keine Vorgaben.
          </p>
          <button className="btn btn-primary lg" onClick={() => setStep("build")}>
            Los geht's
          </button>
        </div>
      </div>
    );
  }

  // step === "build"
  return (
    <div className="onboard">
      <div className="onboard-card build">
        <div className="onboard-head">
          <h2>Welche Anteile gehören zu dir?</h2>
          <p>
            Füge die Stimmen hinzu, die du in dir kennst. Ein Name genügt – den
            Rest kannst du jederzeit ergänzen.
          </p>
        </div>

        {parts.length > 0 && (
          <ul className="part-list">
            {parts.map((p) => (
              <li key={p.id} style={{ borderColor: p.color }}>
                <span className="pl-emoji">{p.emoji}</span>
                <span className="pl-body">
                  <span className="pl-name">{p.name}</span>
                  <span className={"pl-kind " + p.kind}>{KIND_LABEL[p.kind]}</span>
                </span>
                <button className="pl-remove" onClick={() => removePart(p.id)} aria-label="Entfernen">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {showForm || parts.length === 0 ? (
          <div className="inline-form">
            <PartForm
              onSave={addPart}
              onCancel={parts.length > 0 ? () => setShowForm(false) : undefined}
              submitLabel="Anteil hinzufügen"
            />
          </div>
        ) : (
          <button className="add-card" onClick={() => setShowForm(true)}>
            <span><span className="plus">+</span>Weiteren Anteil hinzufügen</span>
          </button>
        )}

        {parts.length > 0 && !showForm && (
          <div className="onboard-footer">
            <span className="count">{parts.length} {parts.length === 1 ? "Anteil" : "Anteile"}</span>
            <button className="btn btn-primary" onClick={() => onComplete(parts)}>
              Mein Team ist bereit →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
