import { useState } from "react";
import Onboarding from "./pages/Onboarding.jsx";
import PianoPasti from "./pages/PianoPasti.jsx";
import ListaSpesa from "./pages/ListaSpesa.jsx";
import { generaPiano, rigeneraPasto } from "./utils/generaPiano.js";
import "./App.css";

export default function App() {
  // Navigazione semplice tra le 3 pagine, senza React Router.
  const [pagina, setPagina] = useState("onboarding");
  const [preferenze, setPreferenze] = useState(null);
  const [piano, setPiano] = useState(null);

  // Fine onboarding: genera il piano e mostra la schermata risultato.
  const completaOnboarding = (pref) => {
    setPreferenze(pref);
    setPiano(generaPiano(pref));
    setPagina("piano");
  };

  // Rigenera un singolo pasto (icona 🔄 nella card).
  const rigenera = (indiceGiorno, tipo) => {
    setPiano((prec) =>
      prec.map((g, i) => {
        if (i !== indiceGiorno) return g;
        const nuova = rigeneraPasto(preferenze, tipo, g[tipo]);
        return { ...g, [tipo]: nuova };
      })
    );
  };

  return (
    <div className="app-shell">
      {pagina === "onboarding" && (
        <Onboarding onComplete={completaOnboarding} />
      )}

      {pagina === "piano" && preferenze && piano && (
        <PianoPasti
          preferenze={preferenze}
          piano={piano}
          onRigenera={rigenera}
          onVaiSpesa={() => setPagina("spesa")}
        />
      )}

      {pagina === "spesa" && preferenze && piano && (
        <ListaSpesa
          preferenze={preferenze}
          piano={piano}
          onIndietro={() => setPagina("piano")}
        />
      )}
    </div>
  );
}
