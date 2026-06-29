// Riga della lista della spesa: nome ingrediente, porzioni e costo stimato.
export default function ShoppingItem({ voce }) {
  return (
    <div className="shopping-item">
      <div className="shopping-item__info">
        <span className="shopping-item__nome">{voce.nome}</span>
        <span className="shopping-item__qta">{voce.porzioni} porz.</span>
      </div>
      <span className="shopping-item__costo">€ {voce.costo.toFixed(2)}</span>
    </div>
  );
}
