// Card/bottone selezionabile riutilizzabile negli step dell'onboarding.
//
// Props:
//  - selected: se è attivo (bordo verde)
//  - onClick: callback al click
//  - icon: emoji/icona opzionale mostrata sopra o a sinistra del testo
//  - variant: "pill" (bottone compatto) | "card" (card grande) | "wide" (riga full-width)
//  - style: stile inline opzionale (usato per i colori brand dei supermercati)
export default function StepButton({
  children,
  selected = false,
  onClick,
  icon = null,
  variant = "card",
  style = null,
}) {
  const classi = [
    "step-button",
    `step-button--${variant}`,
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classi}
      onClick={onClick}
      style={style || undefined}
      aria-pressed={selected}
    >
      {icon && <span className="step-button__icon">{icon}</span>}
      <span className="step-button__label">{children}</span>
    </button>
  );
}
