import ShoppingItem from "../components/ShoppingItem.jsx";
import { listaSpesa, totaleSpesa } from "../utils/generaPiano.js";

export default function ListaSpesa({ preferenze, piano, onIndietro }) {
  const gruppi = listaSpesa(piano, preferenze.persone);
  const totale = totaleSpesa(gruppi);

  return (
    <div className="page spesa">
      <div className="spesa__top">
        <button type="button" className="back-button" onClick={onIndietro}>
          ←
        </button>
        <h1 className="page-titolo page-titolo--inline">Lista della spesa</h1>
      </div>

      <div className="spesa__gruppi">
        {gruppi.map((gruppo) => (
          <section key={gruppo.categoria} className="spesa-gruppo">
            <header className="spesa-gruppo__header">
              <h2>{gruppo.categoria}</h2>
              <span>€ {gruppo.subtotale.toFixed(2)}</span>
            </header>
            <div className="spesa-gruppo__voci">
              {gruppo.voci.map((voce) => (
                <ShoppingItem key={voce.nome} voce={voce} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="spesa__totale">
        <span>Totale stimato</span>
        <span className="spesa__totale-valore">€ {totale.toFixed(2)}</span>
      </div>
    </div>
  );
}
