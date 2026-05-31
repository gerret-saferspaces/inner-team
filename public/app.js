// Mein inneres Team — Browser-App (vanilla JS, kein Build-Schritt).
//
// Datenmodell:
//   part    = { id, name, emoji, role, needs, fears, says, kind, color }
//             kind ∈ "blocker" | "helper" | "neutral"
//   session = { id, title, question, date, notes, blocker, helper, resolution,
//               voices: { [partId]: { volume: 0..10, says: "" } } }
//
// Persistenz läuft komplett über die Storage-Abstraktion unten. Heute schreibt
// sie nach localStorage; später kann sie gegen eine echte API/DB getauscht
// werden, ohne dass der restliche Code etwas davon merkt.

// ----------------------------------------------------------------------------
// Storage (austauschbar)
// ----------------------------------------------------------------------------
const STORAGE_KEY = "inner-team:v1";

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Konnte gespeicherte Daten nicht lesen:", e);
      return null;
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Konnte Daten nicht speichern:", e);
    }
  },
};

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------
const uid = () => Math.random().toString(36).slice(2, 10);

const EMOJIS = [
  "🧐", "😟", "🚀", "🛡️", "🔥", "🌱", "🧭", "🎭",
  "💪", "🤍", "🌙", "⚖️", "🎈", "🦉", "🐯", "🧊",
  "❤️", "🔧", "🎨", "📣", "🤫", "👑",
];

const KIND_LABELS = {
  blocker: "Blocker",
  helper: "Helfer",
  neutral: "Neutral",
};

// Beispiel-Anteile, damit die App beim ersten Start nicht leer ist.
function seedState() {
  return {
    parts: [
      {
        id: uid(),
        name: "Der innere Kritiker",
        emoji: "🧐",
        role: "Bewerter",
        needs: "Qualität, keine Fehler machen",
        fears: "Blamage, Ablehnung",
        says: "Das ist noch nicht gut genug.",
        kind: "blocker",
        color: "#d98a6a",
      },
      {
        id: uid(),
        name: "Die Ängstliche",
        emoji: "😟",
        role: "Beschützerin",
        needs: "Sicherheit",
        fears: "Kontrollverlust, Risiko",
        says: "Was, wenn etwas schiefgeht?",
        kind: "blocker",
        color: "#9a93b8",
      },
      {
        id: uid(),
        name: "Der Abenteurer",
        emoji: "🚀",
        role: "Antreiber",
        needs: "Wachstum, Neues erleben",
        fears: "Stillstand, Langeweile",
        says: "Lass es uns einfach ausprobieren!",
        kind: "helper",
        color: "#5fa888",
      },
    ],
    sessions: [],
    activeSessionId: null,
  };
}

let state = Storage.load() || seedState();
let currentView = "team";

function persist() {
  Storage.save(state);
}

// ----------------------------------------------------------------------------
// DOM-Helfer
// ----------------------------------------------------------------------------
const app = document.getElementById("app");
const modalHost = document.getElementById("modal");
const modalBox = modalHost.querySelector(".modal");

const esc = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

function findPart(id) {
  return state.parts.find((p) => p.id === id);
}

// ----------------------------------------------------------------------------
// View: Mein Team
// ----------------------------------------------------------------------------
function renderTeam() {
  const cards = state.parts
    .map(
      (p) => `
      <article class="part-card" data-edit="${p.id}">
        <span class="swatch" style="background:${esc(p.color)}"></span>
        <div class="part-top">
          <div class="part-emoji">${esc(p.emoji)}</div>
          <div>
            <div class="part-name">${esc(p.name)}</div>
            <div class="part-role">${esc(p.role || "")}</div>
          </div>
        </div>
        <span class="tag ${p.kind}">${tagDot(p.kind)} ${KIND_LABELS[p.kind]}</span>
        ${p.needs ? `<p class="part-line"><span class="label">Braucht</span><br>${esc(p.needs)}</p>` : ""}
        ${p.fears ? `<p class="part-line"><span class="label">Fürchtet</span><br>${esc(p.fears)}</p>` : ""}
        ${p.says ? `<div class="part-says">„${esc(p.says)}"</div>` : ""}
      </article>`
    )
    .join("");

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h2>Mein Team</h2>
        <p>Welche Anteile leben in dir? Halte sie hier fest — den Kritiker, die
        Mutige, den Zweifler. Tippe auf einen Anteil, um ihn zu bearbeiten.</p>
      </div>
      <button class="btn btn-primary" id="addPart">+ Anteil hinzufügen</button>
    </div>
    <div class="grid">
      ${cards}
      <button class="add-card" id="addPart2">
        <span><span class="plus">+</span>Neuen Anteil anlegen</span>
      </button>
    </div>`;

  document.getElementById("addPart").onclick = () => openPartModal();
  document.getElementById("addPart2").onclick = () => openPartModal();
  app.querySelectorAll("[data-edit]").forEach((el) => {
    el.onclick = () => openPartModal(el.dataset.edit);
  });
}

function tagDot(kind) {
  return `<span style="width:7px;height:7px;border-radius:50%;background:currentColor;display:inline-block"></span>`;
}

// ----------------------------------------------------------------------------
// Modal: Anteil bearbeiten / anlegen
// ----------------------------------------------------------------------------
function openPartModal(id) {
  const editing = id ? findPart(id) : null;
  const p = editing || {
    id: uid(),
    name: "",
    emoji: "🎭",
    role: "",
    needs: "",
    fears: "",
    says: "",
    kind: "neutral",
    color: "#7c6cf0",
  };

  modalBox.innerHTML = `
    <h2>${editing ? "Anteil bearbeiten" : "Neuen Anteil anlegen"}</h2>
    <div class="field">
      <label>Name</label>
      <input id="f-name" value="${esc(p.name)}" placeholder="z. B. Der innere Kritiker" />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Rolle / Funktion</label>
        <input id="f-role" value="${esc(p.role)}" placeholder="z. B. Beschützer, Antreiber" />
      </div>
      <div class="field" style="max-width:120px">
        <label>Farbe</label>
        <input id="f-color" type="color" value="${esc(p.color)}" style="height:42px;padding:4px" />
      </div>
    </div>
    <div class="field">
      <label>Symbol</label>
      <div class="emoji-picker" id="f-emoji">
        ${EMOJIS.map(
          (e) =>
            `<button type="button" data-e="${e}" class="${e === p.emoji ? "sel" : ""}">${e}</button>`
        ).join("")}
      </div>
    </div>
    <div class="field">
      <label>Was dieser Anteil braucht</label>
      <input id="f-needs" value="${esc(p.needs)}" placeholder="z. B. Sicherheit, Anerkennung" />
    </div>
    <div class="field">
      <label>Wovor er sich fürchtet</label>
      <input id="f-fears" value="${esc(p.fears)}" placeholder="z. B. Fehler, Kontrollverlust" />
    </div>
    <div class="field">
      <label>Typischer Satz dieses Anteils</label>
      <textarea id="f-says" placeholder="Was sagt er, wenn er laut wird?">${esc(p.says)}</textarea>
    </div>
    <div class="field">
      <label>Wirkt dieser Anteil eher …</label>
      <div class="kind-picker" id="f-kind">
        ${["blocker", "neutral", "helper"]
          .map(
            (k) => `
          <label class="${p.kind === k ? "sel-" + k : ""}" data-k="${k}">
            <input type="radio" name="kind" value="${k}" ${p.kind === k ? "checked" : ""} />
            ${KIND_LABELS[k]}
          </label>`
          )
          .join("")}
      </div>
    </div>
    <div class="modal-actions">
      ${editing ? `<button class="btn btn-danger" id="m-del">Löschen</button>` : "<span></span>"}
      <div class="right">
        <button class="btn btn-ghost" id="m-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="m-save">Speichern</button>
      </div>
    </div>`;

  let chosenEmoji = p.emoji;
  let chosenKind = p.kind;

  modalBox.querySelector("#f-emoji").onclick = (e) => {
    const b = e.target.closest("[data-e]");
    if (!b) return;
    chosenEmoji = b.dataset.e;
    modalBox.querySelectorAll("#f-emoji button").forEach((x) => x.classList.remove("sel"));
    b.classList.add("sel");
  };

  modalBox.querySelector("#f-kind").onclick = (e) => {
    const lab = e.target.closest("[data-k]");
    if (!lab) return;
    chosenKind = lab.dataset.k;
    modalBox
      .querySelectorAll("#f-kind label")
      .forEach((x) => (x.className = ""));
    lab.className = "sel-" + chosenKind;
  };

  modalBox.querySelector("#m-cancel").onclick = closeModal;
  modalBox.querySelector("#m-save").onclick = () => {
    const name = modalBox.querySelector("#f-name").value.trim();
    if (!name) {
      modalBox.querySelector("#f-name").focus();
      return;
    }
    const data = {
      id: p.id,
      name,
      emoji: chosenEmoji,
      role: modalBox.querySelector("#f-role").value.trim(),
      needs: modalBox.querySelector("#f-needs").value.trim(),
      fears: modalBox.querySelector("#f-fears").value.trim(),
      says: modalBox.querySelector("#f-says").value.trim(),
      kind: chosenKind,
      color: modalBox.querySelector("#f-color").value,
    };
    if (editing) {
      Object.assign(editing, data);
    } else {
      state.parts.push(data);
    }
    persist();
    closeModal();
    render();
  };

  if (editing) {
    modalBox.querySelector("#m-del").onclick = () => {
      if (!confirm(`„${editing.name}" wirklich löschen?`)) return;
      state.parts = state.parts.filter((x) => x.id !== editing.id);
      // Auch aus Sessions entfernen.
      state.sessions.forEach((s) => delete s.voices[editing.id]);
      persist();
      closeModal();
      render();
    };
  }

  modalHost.hidden = false;
  modalBox.querySelector("#f-name").focus();
}

function closeModal() {
  modalHost.hidden = true;
  modalBox.innerHTML = "";
}

modalHost.addEventListener("click", (e) => {
  if (e.target === modalHost) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalHost.hidden) closeModal();
});

// ----------------------------------------------------------------------------
// View: Innere Konferenz
// ----------------------------------------------------------------------------
function renderConference() {
  if (state.parts.length === 0) {
    app.innerHTML = emptyState(
      "🪑",
      "Noch keine Anteile",
      "Lege zuerst unter „Mein Team“ ein paar Anteile an, dann kannst du sie zu einer inneren Konferenz einladen."
    );
    return;
  }

  const list = state.sessions
    .slice()
    .reverse()
    .map(
      (s) => `
      <button class="session-item ${s.id === state.activeSessionId ? "is-active" : ""}" data-session="${s.id}">
        <div class="s-title">${esc(s.title || "Ohne Titel")}</div>
        <div class="s-date">${esc(s.date)}</div>
      </button>`
    )
    .join("");

  const active = state.sessions.find((s) => s.id === state.activeSessionId);

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h2>Innere Konferenz</h2>
        <p>Nimm eine konkrete Frage oder Entscheidung und höre hin: Welcher Anteil
        meldet sich wie laut? Was sagt er? Was blockiert — und wer kann helfen?</p>
      </div>
      <button class="btn btn-primary" id="newSession">+ Neue Konferenz</button>
    </div>
    <div class="conf-layout">
      <div class="session-list">
        ${list || '<p class="part-role">Noch keine Konferenzen.</p>'}
      </div>
      <div id="confPanel">
        ${active ? "" : emptyPanel()}
      </div>
    </div>`;

  document.getElementById("newSession").onclick = createSession;
  app.querySelectorAll("[data-session]").forEach((el) => {
    el.onclick = () => {
      state.activeSessionId = el.dataset.session;
      persist();
      renderConference();
    };
  });

  if (active) renderSessionPanel(active);
}

function emptyPanel() {
  return `<div class="conf-panel"><div class="empty"><div class="big">🗣️</div>
    Wähle links eine Konferenz oder starte eine neue, um deine Anteile zu einer
    Frage zu befragen.</div></div>`;
}

function createSession() {
  const s = {
    id: uid(),
    title: "",
    question: "",
    date: new Date().toLocaleDateString("de-DE"),
    notes: "",
    blocker: "",
    helper: "",
    resolution: "",
    voices: {},
  };
  state.parts.forEach((p) => (s.voices[p.id] = { volume: 5, says: "" }));
  state.sessions.push(s);
  state.activeSessionId = s.id;
  persist();
  renderConference();
}

function renderSessionPanel(s) {
  // Sicherstellen, dass alle aktuellen Anteile eine Stimme haben.
  state.parts.forEach((p) => {
    if (!s.voices[p.id]) s.voices[p.id] = { volume: 5, says: "" };
  });

  const panel = document.getElementById("confPanel");
  const voices = state.parts
    .map((p) => {
      const v = s.voices[p.id];
      return `
      <div class="voice-row">
        <div class="voice-head">
          <div class="part-emoji">${esc(p.emoji)}</div>
          <div>
            <div class="part-name" style="font-size:15px">${esc(p.name)}</div>
            <span class="tag ${p.kind}" style="font-size:11px">${KIND_LABELS[p.kind]}</span>
          </div>
          <span class="vol-val" data-vol="${p.id}">${v.volume}/10</span>
        </div>
        <input type="range" min="0" max="10" value="${v.volume}" data-range="${p.id}" />
        <textarea class="voice-says" data-says="${p.id}" placeholder="Was sagt dieser Anteil zu deiner Frage?">${esc(v.says)}</textarea>
      </div>`;
    })
    .join("");

  panel.innerHTML = `
    <div class="conf-panel">
      <div class="field">
        <label>Titel der Konferenz</label>
        <input id="s-title" value="${esc(s.title)}" placeholder="z. B. Soll ich den Job wechseln?" />
      </div>
      <div class="field">
        <label>Worum geht es genau?</label>
        <textarea id="s-question" placeholder="Beschreibe die Frage oder Entscheidung.">${esc(s.question)}</textarea>
      </div>

      <h3 style="margin:20px 0 4px;font-size:17px">Wie laut ist gerade wer?</h3>
      <p class="part-role" style="margin:0 0 8px">Schiebe den Regler je nachdem, wie stark sich ein Anteil meldet.</p>
      ${voices}

      <div class="reflect" style="margin-top:24px">
        <div class="field">
          <label>Was blockiert hier gerade?</label>
          <textarea id="s-blocker" placeholder="Welcher Anteil hält dich zurück — und warum?">${esc(s.blocker)}</textarea>
        </div>
        <div class="field">
          <label>Welcher Anteil könnte helfen?</label>
          <textarea id="s-helper" placeholder="Wer hätte eine gute Antwort? Was würde er sagen?">${esc(s.helper)}</textarea>
        </div>
        <div class="field">
          <label>Lösung / nächster Schritt</label>
          <textarea id="s-resolution" placeholder="Worauf könnt ihr euch als Team einigen?">${esc(s.resolution)}</textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-danger" id="s-del">Konferenz löschen</button>
        <span class="part-role" id="s-saved">Automatisch gespeichert</span>
      </div>
    </div>`;

  // Bindings — alles speichert live.
  const bindText = (sel, key) => {
    const el = panel.querySelector(sel);
    el.oninput = () => {
      s[key] = el.value;
      persist();
    };
  };
  bindText("#s-title", "title");
  bindText("#s-question", "question");
  bindText("#s-blocker", "blocker");
  bindText("#s-helper", "helper");
  bindText("#s-resolution", "resolution");

  panel.querySelectorAll("[data-range]").forEach((el) => {
    el.oninput = () => {
      const id = el.dataset.range;
      s.voices[id].volume = Number(el.value);
      panel.querySelector(`[data-vol="${id}"]`).textContent = el.value + "/10";
      persist();
    };
  });
  panel.querySelectorAll("[data-says]").forEach((el) => {
    el.oninput = () => {
      s.voices[el.dataset.says].says = el.value;
      persist();
    };
  });

  panel.querySelector("#s-del").onclick = () => {
    if (!confirm("Diese Konferenz löschen?")) return;
    state.sessions = state.sessions.filter((x) => x.id !== s.id);
    state.activeSessionId = null;
    persist();
    renderConference();
  };

  // Titel-Änderung soll auch die Liste links aktualisieren.
  panel.querySelector("#s-title").addEventListener("blur", renderConference);
}

// ----------------------------------------------------------------------------
// View: Erkenntnisse
// ----------------------------------------------------------------------------
function renderInsights() {
  const parts = state.parts;
  const blockers = parts.filter((p) => p.kind === "blocker");
  const helpers = parts.filter((p) => p.kind === "helper");

  // Durchschnittliche Lautstärke je Anteil über alle Konferenzen.
  const loud = parts
    .map((p) => {
      const vals = state.sessions
        .map((s) => s.voices[p.id]?.volume)
        .filter((v) => typeof v === "number");
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { part: p, avg, count: vals.length };
    })
    .sort((a, b) => b.avg - a.avg);

  const hasSessions = state.sessions.length > 0;

  const loudBars = loud
    .filter((l) => l.count > 0)
    .map(
      (l) => `
      <div class="loud-bar">
        <span class="ico">${esc(l.part.emoji)}</span>
        <span class="name">${esc(l.part.name)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(l.avg / 10) * 100}%;background:${esc(l.part.color)}"></div></div>
        <span style="width:46px;text-align:right;font-size:13px">${l.avg.toFixed(1)}/10</span>
      </div>`
    )
    .join("");

  // Blocker → Helfer Paarungen aus den Konferenzen ziehen.
  const pairs = state.sessions
    .filter((s) => (s.blocker && s.blocker.trim()) || (s.helper && s.helper.trim()))
    .slice()
    .reverse()
    .map(
      (s) => `
      <div class="pair">
        <div class="when">${esc(s.title || "Ohne Titel")} <span class="part-role">· ${esc(s.date)}</span></div>
        ${s.blocker ? `<div class="flow">⛔ Blockiert: ${esc(s.blocker)}</div>` : ""}
        ${s.helper ? `<div class="flow">🤝 Hilft: ${esc(s.helper)}</div>` : ""}
        ${s.resolution ? `<div class="flow">✅ Schritt: ${esc(s.resolution)}</div>` : ""}
      </div>`
    )
    .join("");

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h2>Erkenntnisse</h2>
        <p>Ein Überblick über dein inneres Team: wer wann laut wird, wer dich
        bremst und wer dir weiterhelfen kann.</p>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="num">${parts.length}</div><div class="lbl">Anteile insgesamt</div></div>
      <div class="stat"><div class="num" style="color:var(--blocker)">${blockers.length}</div><div class="lbl">als Blocker erlebt</div></div>
      <div class="stat"><div class="num" style="color:var(--helper)">${helpers.length}</div><div class="lbl">als Helfer erlebt</div></div>
      <div class="stat"><div class="num">${state.sessions.length}</div><div class="lbl">Konferenzen</div></div>
    </div>

    <div class="insight-section">
      <h3>Wer ist am lautesten?</h3>
      ${
        hasSessions && loudBars
          ? loudBars
          : `<div class="hint">Führe eine innere Konferenz durch, um zu sehen, welche Anteile sich am stärksten melden.</div>`
      }
    </div>

    <div class="insight-section">
      <h3>Blocker & ihre Helfer</h3>
      ${
        pairs
          ? pairs
          : `<div class="hint">Halte in einer Konferenz fest, was blockiert und wer helfen kann — hier siehst du dann das Zusammenspiel.</div>`
      }
    </div>

    <div class="insight-section">
      <h3>Dein Team auf einen Blick</h3>
      <div class="grid">
        ${
          parts
            .map(
              (p) => `
          <div class="part-card" style="cursor:default">
            <span class="swatch" style="background:${esc(p.color)}"></span>
            <div class="part-top">
              <div class="part-emoji">${esc(p.emoji)}</div>
              <div>
                <div class="part-name">${esc(p.name)}</div>
                <span class="tag ${p.kind}">${KIND_LABELS[p.kind]}</span>
              </div>
            </div>
            ${p.needs ? `<p class="part-line"><span class="label">Braucht</span> ${esc(p.needs)}</p>` : ""}
          </div>`
            )
            .join("") || `<div class="hint">Noch keine Anteile angelegt.</div>`
        }
      </div>
    </div>`;
}

// ----------------------------------------------------------------------------
// Empty state helper
// ----------------------------------------------------------------------------
function emptyState(icon, title, text) {
  return `<div class="empty"><div class="big">${icon}</div>
    <h2 style="margin:0 0 6px">${esc(title)}</h2>
    <p style="max-width:42ch;margin:0 auto">${esc(text)}</p></div>`;
}

// ----------------------------------------------------------------------------
// Router / Render
// ----------------------------------------------------------------------------
function render() {
  if (currentView === "team") renderTeam();
  else if (currentView === "conference") renderConference();
  else if (currentView === "insights") renderInsights();
}

document.getElementById("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  currentView = tab.dataset.view;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
  tab.classList.add("is-active");
  render();
});

// ----------------------------------------------------------------------------
// Export / Import
// ----------------------------------------------------------------------------
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inneres-team.json";
  a.click();
  URL.revokeObjectURL(url);
};

document.getElementById("importBtn").onclick = () =>
  document.getElementById("importFile").click();

document.getElementById("importFile").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.parts || !Array.isArray(data.parts)) throw new Error("Format");
      state = {
        parts: data.parts,
        sessions: data.sessions || [],
        activeSessionId: data.activeSessionId || null,
      };
      persist();
      render();
      alert("Daten erfolgreich importiert.");
    } catch (err) {
      alert("Diese Datei konnte nicht gelesen werden.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
};

// ----------------------------------------------------------------------------
// Start
// ----------------------------------------------------------------------------
render();
