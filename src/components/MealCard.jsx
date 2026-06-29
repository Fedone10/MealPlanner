// Card di un singolo pasto nella schermata "Il tuo piano".
//
// Props:
//  - giorno: nome del giorno (es. "Lunedì")
//  - tipo: "pranzo" | "cena"
//  - ricetta: oggetto ricetta (può essere null se non previsto)
//  - onRigenera: callback per rigenerare il singolo pasto
export default function MealCard({ giorno, tipo, ricetta, onRigenera }) {
  if (!ricetta) return null;

  const etichettaTipo = tipo === "pranzo" ? "Pranzo" : "Cena";

  return (
    <div className="meal-card">
      <div className="meal-card__thumb" aria-hidden="true">
        🍽️
      </div>

      <div className="meal-card__body">
        <div className="meal-card__giorno">
          {giorno} — {etichettaTipo}
        </div>
        <div className="meal-card__nome">{ricetta.nome}</div>
        <div className="meal-card__meta">
          <span>⏱ {ricetta.tempo} min</span>
          <span>€ {ricetta.costo.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className="meal-card__refresh"
        onClick={onRigenera}
        aria-label="Rigenera questo pasto"
        title="Rigenera questo pasto"
      >
        🔄
      </button>
    </div>
  );
}
