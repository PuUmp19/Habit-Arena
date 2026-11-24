"use client";
import { STAT_BY_KEY } from "@/lib/game";

// Fila de hábito con botón para completar / deshacer
export default function HabitItem({ habit, done, onToggle, busy }) {
  const stat = STAT_BY_KEY[habit.stat];
  return (
    <li className={`g-habit ${done ? "done" : ""}`}>
      <span className="g-habit-icon" style={{ "--c": stat.color }} aria-hidden>{habit.emoji}</span>
      <div className="g-grow">
        <p className="g-habit-name">{habit.name}</p>
        <p className="g-muted">+{habit.xp} XP · {stat.icon} {stat.label} +{habit.stat_points}</p>
      </div>
      <button
        type="button"
        className={`g-check ${done ? "on" : ""}`}
        onClick={() => onToggle(habit)}
        disabled={busy}
        aria-pressed={done}
        aria-label={done ? `Deshacer ${habit.name}` : `Completar ${habit.name}`}
      >
        {done ? "✓" : ""}
      </button>
    </li>
  );
}
