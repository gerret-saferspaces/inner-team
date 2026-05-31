import { useEffect, useState } from "react";
import { load, save } from "./storage.js";
import Onboarding from "./components/Onboarding.jsx";
import Team from "./components/Team.jsx";

export default function App() {
  const [state, setState] = useState(load);

  useEffect(() => {
    save(state);
  }, [state]);

  if (!state.onboarded) {
    return <Onboarding onComplete={(parts) => setState({ onboarded: true, parts })} />;
  }

  return (
    <Team
      parts={state.parts}
      onAdd={(part) => setState((s) => ({ ...s, parts: [...s.parts, part] }))}
      onRemove={(id) => setState((s) => ({ ...s, parts: s.parts.filter((p) => p.id !== id) }))}
    />
  );
}
