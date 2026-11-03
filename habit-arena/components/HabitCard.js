// Tarjeta de hábito (solo visual, el botón aún no hace nada)
export default function HabitCard({ habito }) {
  return (
    <li className={`habit ${habito.hecho ? "done" : ""}`}>
      <span className="habit-icon" aria-hidden>{habito.icono}</span>
      <div className="habit-info">
        <p>{habito.nombre}</p>
        <p className="muted">+{habito.xp} XP · sube {habito.stat}</p>
      </div>
      <button type="button" className="check" aria-label={habito.hecho ? "Hecho" : "Marcar como hecho"}>
        {habito.hecho ? "✓" : ""}
      </button>
    </li>
  );
}
