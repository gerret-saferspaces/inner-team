// App-Shell: Kopf oben, scrollbarer Inhalt in der Mitte, Eingabe unten im
// Daumenbereich fixiert (mobile-first).
export default function Shell({ eyebrow, title, action, children, dock }) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="display">{title}</h2>}
        </div>
        {action}
      </header>
      <main className="app-body">{children}</main>
      {dock && <div className="dock">{dock}</div>}
    </div>
  );
}
