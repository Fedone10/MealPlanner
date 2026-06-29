// Barra di avanzamento mostrata in cima all'onboarding.
// step = indice corrente (1-based), totale = numero di step.
export default function ProgressBar({ step, totale }) {
  const percentuale = Math.round((step / totale) * 100);

  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentuale}%` }} />
      </div>
      <span className="progress-label">
        {step} di {totale}
      </span>
    </div>
  );
}
