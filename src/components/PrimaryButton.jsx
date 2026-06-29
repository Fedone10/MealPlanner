// Bottone primario verde a pillola, full-width, usato per le azioni principali.
export default function PrimaryButton({ children, onClick, disabled = false }) {
  return (
    <button
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
