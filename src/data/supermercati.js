// Lista dei supermercati selezionabili nell'onboarding (step 7).
// Ogni voce ha il colore del brand usato per lo sfondo del bottone.
export const supermercati = [
  { id: "lidl", nome: "Lidl", colore: "#0050AA", testo: "#FFFFFF" },
  { id: "eurospin", nome: "Eurospin", colore: "#0A2B6B", testo: "#FFFFFF" },
  { id: "penny", nome: "Penny", colore: "#E1001A", testo: "#FFFFFF" },
  { id: "aldi", nome: "Aldi", colore: "#1E4FA3", testo: "#FFFFFF" },
  { id: "coop", nome: "Coop", colore: "#E2001A", testo: "#FFFFFF" },
  { id: "esselunga", nome: "Esselunga", colore: "#D6004F", testo: "#FFFFFF" },
  { id: "conad", nome: "Conad", colore: "#F39200", testo: "#FFFFFF" },
  { id: "carrefour", nome: "Carrefour", colore: "#004E9F", testo: "#FFFFFF" },
  { id: "bennet", nome: "Bennet", colore: "#3AAA35", testo: "#FFFFFF" },
  { id: "famila", nome: "Famila", colore: "#D9261C", testo: "#FFFFFF" },
];

// Permette di recuperare un supermercato dal suo id.
export const getSupermercato = (id) =>
  supermercati.find((s) => s.id === id) || null;
