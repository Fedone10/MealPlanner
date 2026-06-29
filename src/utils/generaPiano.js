// Logica pura di generazione del piano pasti.
// Nessuno stato, nessun side effect: prende le preferenze dell'utente
// e restituisce un piano settimanale a partire dalle ricette mock.

import { ricettePerTipo } from "../data/ricette.js";

export const GIORNI = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

// Ordine con cui mostrare le categorie nella lista della spesa.
const ORDINE_CATEGORIE = [
  "Verdure",
  "Frutta",
  "Proteine",
  "Latticini",
  "Carboidrati",
  "Dispensa",
];

// Una ricetta è compatibile se può essere cucinata con gli elettrodomestici
// disponibili e se soddisfa tutte le esigenze alimentari selezionate.
function compatibile(ricetta, pref) {
  const elettroOk =
    !pref.elettrodomestici?.length ||
    ricetta.elettrodomestici.every((e) => pref.elettrodomestici.includes(e));

  const esigenzeRichieste = (pref.esigenze || []).filter((e) => e !== "nessuna");
  const esigenzeOk = esigenzeRichieste.every((e) => ricetta.esigenze.includes(e));

  return elettroOk && esigenzeOk;
}

// Punteggio di affinità: più alto = ricetta più adatta alle preferenze.
function punteggio(ricetta, pref) {
  let score = 0;

  // Bonus per ogni categoria preferita che la ricetta soddisfa.
  const match = ricetta.categorie.filter((c) =>
    (pref.categorie || []).includes(c)
  ).length;
  score += match * 3;

  // Il budget influenza leggermente: a parità di affinità si preferiscono
  // le ricette più economiche.
  score -= ricetta.costo * 0.5;

  return score;
}

// Ricette candidate per un tipo di pasto, ordinate dalla più adatta.
// Se i filtri sono troppo stringenti vengono progressivamente rilassati
// così da restituire comunque qualcosa.
export function candidateRicette(pref, tipo) {
  const base = ricettePerTipo(tipo);

  let comp = base.filter((r) => compatibile(r, pref));

  // Rilassa: ignora gli elettrodomestici ma tieni le esigenze alimentari.
  if (comp.length === 0) {
    const esigenzeRichieste = (pref.esigenze || []).filter(
      (e) => e !== "nessuna"
    );
    comp = base.filter((r) =>
      esigenzeRichieste.every((e) => r.esigenze.includes(e))
    );
  }

  // Ultima spiaggia: usa tutte le ricette del tipo.
  if (comp.length === 0) comp = base;

  return [...comp].sort((a, b) => punteggio(b, pref) - punteggio(a, pref));
}

// Genera il piano settimanale (7 giorni) in base alle preferenze.
export function generaPiano(pref) {
  const includePranzo =
    pref.pasti === "solo-pranzo" || pref.pasti === "pranzo-cena";
  const includeCena =
    pref.pasti === "solo-cena" || pref.pasti === "pranzo-cena";

  const poolPranzo = candidateRicette(pref, "pranzo");
  const poolCena = candidateRicette(pref, "cena");

  // Il round-robin sui candidati ordinati dà varietà durante la settimana
  // evitando ripetizioni finché il pool non si esaurisce.
  return GIORNI.map((giorno, i) => ({
    giorno,
    pranzo: includePranzo ? poolPranzo[i % poolPranzo.length] : null,
    cena: includeCena ? poolCena[i % poolCena.length] : null,
  }));
}

// Rigenera un singolo pasto scegliendone uno diverso tra i candidati.
export function rigeneraPasto(pref, tipo, ricettaAttuale) {
  const cand = candidateRicette(pref, tipo);
  const altre = cand.filter((r) => r.id !== ricettaAttuale?.id);
  const pool = altre.length ? altre : cand;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Costo totale stimato del piano (somma dei pasti × numero di persone).
export function costoTotale(piano, persone) {
  let tot = 0;
  piano.forEach((g) => {
    if (g.pranzo) tot += g.pranzo.costo * persone;
    if (g.cena) tot += g.cena.costo * persone;
  });
  return tot;
}

// Numero di pasti totali nel piano.
export function contaPasti(piano) {
  let n = 0;
  piano.forEach((g) => {
    if (g.pranzo) n++;
    if (g.cena) n++;
  });
  return n;
}

// Aggrega tutti gli ingredienti del piano in una lista della spesa,
// raggruppata per categoria, con costo e porzioni stimate.
export function listaSpesa(piano, persone) {
  const mappa = {};

  const aggiungi = (ricetta) => {
    if (!ricetta) return;
    ricetta.ingredienti.forEach((ing) => {
      if (!mappa[ing.nome]) {
        mappa[ing.nome] = {
          nome: ing.nome,
          categoria: ing.categoria,
          costo: 0,
          occorrenze: 0,
        };
      }
      mappa[ing.nome].costo += ing.costo * persone;
      mappa[ing.nome].occorrenze += 1;
    });
  };

  piano.forEach((g) => {
    aggiungi(g.pranzo);
    aggiungi(g.cena);
  });

  // Raggruppa per categoria.
  const perCategoria = {};
  Object.values(mappa).forEach((item) => {
    if (!perCategoria[item.categoria]) perCategoria[item.categoria] = [];
    perCategoria[item.categoria].push({
      ...item,
      porzioni: item.occorrenze * persone,
    });
  });

  // Ordina le categorie secondo ORDINE_CATEGORIE, le altre in coda.
  const categorie = Object.keys(perCategoria).sort((a, b) => {
    const ia = ORDINE_CATEGORIE.indexOf(a);
    const ib = ORDINE_CATEGORIE.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return categorie.map((cat) => ({
    categoria: cat,
    voci: perCategoria[cat].sort((a, b) => a.nome.localeCompare(b.nome)),
    subtotale: perCategoria[cat].reduce((s, v) => s + v.costo, 0),
  }));
}

// Totale complessivo della lista della spesa.
export function totaleSpesa(gruppi) {
  return gruppi.reduce((s, g) => s + g.subtotale, 0);
}
