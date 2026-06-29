import { useState } from "react";
import MealCard from "../components/MealCard.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { getSupermercato } from "../data/supermercati.js";
import { costoTotale, contaPasti } from "../utils/generaPiano.js";

// Etichette leggibili per il tipo di pasti scelto.
const LABEL_PASTI = {
  "solo-pranzo": "Solo pranzo",
  "solo-cena": "Solo cena",
  "pranzo-cena": "Pranzo e cena",
};

export default function PianoPasti({ preferenze, piano, onRigenera, onVaiSpesa }) {
  const includePranzo =
    preferenze.pasti === "solo-pranzo" || preferenze.pasti === "pranzo-cena";
  const includeCena =
    preferenze.pasti === "solo-cena" || preferenze.pasti === "pranzo-cena";

  // Tab attiva: di default il primo pasto disponibile.
  const [tab, setTab] = useState(includePranzo ? "pranzo" : "cena");

  const supermercato = getSupermercato(preferenze.supermercato);
  const costo = costoTotale(piano, preferenze.persone);
  const numeroPasti = contaPasti(piano);
  const mostraTab = includePranzo && includeCena;

  return (
    <div className="page piano">
      <h1 className="page-titolo">Il tuo piano</h1>

      {/* Card riepilogo */}
      <div className="riepilogo-card">
        <div className="riepilogo-card__header">
          {supermercato && (
            <span
              className="riepilogo-card__market"
              style={{ backgroundColor: supermercato.colore, color: supermercato.testo }}
            >
              {supermercato.nome}
            </span>
          )}
          <span className="riepilogo-card__costo">~ {Math.round(costo)}€</span>
        </div>
        <div className="riepilogo-card__griglia">
          <div>
            <span className="riepilogo-card__label">Persone</span>
            <span className="riepilogo-card__valore">{preferenze.persone}</span>
          </div>
          <div>
            <span className="riepilogo-card__label">Pasti</span>
            <span className="riepilogo-card__valore">{numeroPasti}</span>
          </div>
          <div>
            <span className="riepilogo-card__label">Tipo</span>
            <span className="riepilogo-card__valore">
              {LABEL_PASTI[preferenze.pasti]}
            </span>
          </div>
        </div>
        <PrimaryButton onClick={onVaiSpesa}>Lista della spesa →</PrimaryButton>
      </div>

      {/* Tab Pranzo / Cena */}
      {mostraTab && (
        <div className="tabs">
          <button
            type="button"
            className={`tab ${tab === "pranzo" ? "is-active" : ""}`}
            onClick={() => setTab("pranzo")}
          >
            Pranzo
          </button>
          <button
            type="button"
            className={`tab ${tab === "cena" ? "is-active" : ""}`}
            onClick={() => setTab("cena")}
          >
            Cena
          </button>
        </div>
      )}

      {/* Lista pasti */}
      <div className="meal-list">
        {piano.map((g, i) => {
          const tipo = mostraTab ? tab : includePranzo ? "pranzo" : "cena";
          const ricetta = tipo === "pranzo" ? g.pranzo : g.cena;
          return (
            <MealCard
              key={`${g.giorno}-${tipo}`}
              giorno={g.giorno}
              tipo={tipo}
              ricetta={ricetta}
              onRigenera={() => onRigenera(i, tipo)}
            />
          );
        })}
      </div>
    </div>
  );
}
