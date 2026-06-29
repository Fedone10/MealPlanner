import { useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import StepButton from "../components/StepButton.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { supermercati } from "../data/supermercati.js";

// Numero totale di step dell'onboarding.
const TOTALE_STEP = 7;

// Opzioni statiche dei vari step.
const OPZIONI_PERSONE = [
  { val: 1, label: "1" },
  { val: 2, label: "2" },
  { val: 3, label: "3" },
  { val: 4, label: "4" },
  { val: 5, label: "5" },
  { val: 6, label: "6+" },
];

const OPZIONI_PASTI = [
  { id: "solo-pranzo", label: "Solo pranzo" },
  { id: "solo-cena", label: "Solo cena" },
  { id: "pranzo-cena", label: "Pranzo e cena" },
];

const OPZIONI_CATEGORIE = [
  { id: "veloci", label: "Veloci e facili" },
  { id: "high-protein", label: "High protein" },
  { id: "salutari", label: "Piatti salutari" },
  { id: "famiglia", label: "Per tutta la famiglia" },
  { id: "classici", label: "Classici italiani" },
  { id: "poche-calorie", label: "Poche calorie" },
  { id: "economiche", label: "Economiche" },
  { id: "takeaway", label: "Takeaway fatto in casa" },
];

const OPZIONI_ESIGENZE = [
  { id: "nessuna", label: "Nessuna", icon: "🙂" },
  { id: "vegetariano", label: "Vegetariano", icon: "🥗" },
  { id: "vegano", label: "Vegano", icon: "🌱" },
  { id: "pescetariano", label: "Pescetariano", icon: "🐟" },
  { id: "carnivoro", label: "Carnivoro", icon: "🥩" },
  { id: "senza-glutine", label: "Senza glutine", icon: "🌾" },
  { id: "senza-lattosio", label: "Senza lattosio", icon: "🥛" },
  { id: "alta-proteica", label: "Alta quota proteica", icon: "💪" },
];

const OPZIONI_ELETTRODOMESTICI = [
  { id: "microonde", label: "Microonde", icon: "♨️" },
  { id: "fornelli", label: "Fornelli", icon: "🔥" },
  { id: "forno", label: "Forno", icon: "🥧" },
  { id: "friggitrice", label: "Friggitrice ad aria", icon: "🍟" },
  { id: "pentola-pressione", label: "Pentola a pressione", icon: "🍲" },
];

// Titolo e sottotitolo per ogni step.
const TESTI_STEP = {
  1: { titolo: "Per quante persone cucini?", sottotitolo: "Useremo questo dato per le porzioni." },
  2: { titolo: "Per quali pasti vuoi il programma?", sottotitolo: "Scegli cosa pianificare." },
  3: { titolo: "Qual è il tuo budget?", sottotitolo: "Budget settimanale per la spesa." },
  4: { titolo: "Che tipo di pasti vuoi questa settimana?", sottotitolo: "Scegline fino a 3." },
  5: { titolo: "Hai esigenze alimentari?", sottotitolo: "Puoi selezionarne più di una." },
  6: { titolo: "Cosa hai in cucina?", sottotitolo: "Seleziona gli strumenti disponibili." },
  7: { titolo: "Dove fai la spesa?", sottotitolo: "Scegli il tuo supermercato." },
};

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);

  // Stato delle risposte.
  const [persone, setPersone] = useState(null);
  const [pasti, setPasti] = useState(null);
  const [budget, setBudget] = useState(60);
  const [categorie, setCategorie] = useState([]);
  const [esigenze, setEsigenze] = useState([]);
  const [allergie, setAllergie] = useState("");
  const [elettrodomestici, setElettrodomestici] = useState([]);
  const [supermercato, setSupermercato] = useState(null);

  // Toggle generico per i multi-select.
  const toggle = (lista, setLista, id) => {
    setLista(
      lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]
    );
  };

  // Categorie: massimo 3 selezionabili.
  const toggleCategoria = (id) => {
    if (categorie.includes(id)) {
      setCategorie(categorie.filter((x) => x !== id));
    } else if (categorie.length < 3) {
      setCategorie([...categorie, id]);
    }
  };

  // Esigenze: "Nessuna" è esclusiva rispetto alle altre.
  const toggleEsigenza = (id) => {
    if (id === "nessuna") {
      setEsigenze(esigenze.includes("nessuna") ? [] : ["nessuna"]);
      return;
    }
    const senzaNessuna = esigenze.filter((x) => x !== "nessuna");
    toggle(senzaNessuna, setEsigenze, id);
  };

  // Pasti per giorno in base alla scelta, per stimare il costo a pasto.
  const pastiAlGiorno = pasti === "pranzo-cena" ? 2 : 1;
  const costoAPasto = budget / (7 * pastiAlGiorno);

  // Verifica se lo step corrente è completo.
  const stepValido = () => {
    switch (step) {
      case 1:
        return persone !== null;
      case 2:
        return pasti !== null;
      case 3:
        return true; // lo slider ha sempre un valore
      case 4:
        return categorie.length > 0;
      case 5:
        return esigenze.length > 0;
      case 6:
        return elettrodomestici.length > 0;
      case 7:
        return supermercato !== null;
      default:
        return false;
    }
  };

  const avanti = () => {
    if (!stepValido()) return;
    if (step < TOTALE_STEP) {
      setStep(step + 1);
    } else {
      // Ultimo step: raccoglie le preferenze e completa.
      onComplete({
        persone,
        pasti,
        budget,
        categorie,
        esigenze,
        allergie: allergie.trim(),
        elettrodomestici,
        supermercato,
      });
    }
  };

  const indietro = () => {
    if (step > 1) setStep(step - 1);
  };

  const testo = TESTI_STEP[step];

  return (
    <div className="page onboarding">
      <div className="onboarding__top">
        {step > 1 ? (
          <button type="button" className="back-button" onClick={indietro}>
            ←
          </button>
        ) : (
          <span className="back-button back-button--ghost">←</span>
        )}
        <ProgressBar step={step} totale={TOTALE_STEP} />
      </div>

      <div className="onboarding__content">
        <h1 className="step-titolo">{testo.titolo}</h1>
        <p className="step-sottotitolo">{testo.sottotitolo}</p>

        {/* Step 1 — Numero persone */}
        {step === 1 && (
          <div className="grid grid--persone">
            {OPZIONI_PERSONE.map((o) => (
              <StepButton
                key={o.val}
                variant="pill"
                selected={persone === o.val}
                onClick={() => setPersone(o.val)}
              >
                {o.label}
              </StepButton>
            ))}
          </div>
        )}

        {/* Step 2 — Pasti */}
        {step === 2 && (
          <div className="stack">
            {OPZIONI_PASTI.map((o) => (
              <StepButton
                key={o.id}
                variant="wide"
                selected={pasti === o.id}
                onClick={() => setPasti(o.id)}
              >
                {o.label}
              </StepButton>
            ))}
          </div>
        )}

        {/* Step 3 — Budget */}
        {step === 3 && (
          <div className="budget">
            <div className="budget__valore">{budget}€</div>
            <input
              type="range"
              min={30}
              max={120}
              step={5}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="budget__slider"
            />
            <div className="budget__range">
              <span>30€</span>
              <span>120€</span>
            </div>
            <p className="budget__pasto">
              circa <strong>{costoAPasto.toFixed(1)}€</strong> a pasto
            </p>
          </div>
        )}

        {/* Step 4 — Tipo pasti (max 3) */}
        {step === 4 && (
          <>
            <div className="grid grid--due">
              {OPZIONI_CATEGORIE.map((o) => (
                <StepButton
                  key={o.id}
                  selected={categorie.includes(o.id)}
                  onClick={() => toggleCategoria(o.id)}
                >
                  {o.label}
                </StepButton>
              ))}
            </div>
            <p className="hint">{categorie.length}/3 selezionati</p>
          </>
        )}

        {/* Step 5 — Esigenze alimentari */}
        {step === 5 && (
          <>
            <div className="grid grid--due">
              {OPZIONI_ESIGENZE.map((o) => (
                <StepButton
                  key={o.id}
                  icon={o.icon}
                  selected={esigenze.includes(o.id)}
                  onClick={() => toggleEsigenza(o.id)}
                >
                  {o.label}
                </StepButton>
              ))}
            </div>
            <label className="campo-testo">
              <span>Allergie o intolleranze</span>
              <input
                type="text"
                placeholder="Es. noci, crostacei..."
                value={allergie}
                onChange={(e) => setAllergie(e.target.value)}
              />
            </label>
          </>
        )}

        {/* Step 6 — Elettrodomestici */}
        {step === 6 && (
          <div className="grid grid--due">
            {OPZIONI_ELETTRODOMESTICI.map((o) => (
              <StepButton
                key={o.id}
                icon={o.icon}
                selected={elettrodomestici.includes(o.id)}
                onClick={() => toggle(elettrodomestici, setElettrodomestici, o.id)}
              >
                {o.label}
              </StepButton>
            ))}
          </div>
        )}

        {/* Step 7 — Supermercato */}
        {step === 7 && (
          <div className="grid grid--due">
            {supermercati.map((s) => {
              const attivo = supermercato === s.id;
              return (
                <StepButton
                  key={s.id}
                  variant="pill"
                  selected={attivo}
                  onClick={() => setSupermercato(s.id)}
                  style={{
                    backgroundColor: s.colore,
                    color: s.testo,
                    borderColor: attivo ? "#1A1A1A" : s.colore,
                  }}
                >
                  {s.nome}
                </StepButton>
              );
            })}
          </div>
        )}
      </div>

      <div className="onboarding__footer">
        <PrimaryButton onClick={avanti} disabled={!stepValido()}>
          {step === TOTALE_STEP ? "Genera il mio piano →" : "Continua"}
        </PrimaryButton>
      </div>
    </div>
  );
}
