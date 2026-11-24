"use client";
import { useState } from "react";
import HabitForm from "@/components/HabitForm";
import { useGame } from "@/components/GameProvider";
import { STAT_BY_KEY, frequencyLabel } from "@/lib/game";

export default function Habitos() {
  const { habits, busy, deleteHabit, seedHabits } = useGame();
  const [editing, setEditing] = useState(null); // null | "new" | habit

  const remove = (h) => {
    if (window.confirm(`¿Eliminar “${h.name}”? Tu historial se conserva.`)) deleteHabit(h.id);
  };

  return (
    <div className="g-narrow">
      <div className="g-row-between">
        <h1 className="g-h1">Mis hábitos</h1>
        <button type="button" className="g-btn" onClick={() => setEditing("new")}>+ Nuevo</button>
      </div>

      {habits.length === 0 && (
        <section className="g-card g-empty">
          <p>Todavía no hay hábitos.</p>
          <button type="button" className="g-btn g-btn-ghost" onClick={seedHabits} disabled={busy}>Agregar hábitos de ejemplo</button>
        </section>
      )}

      <ul className="g-list">
        {habits.map((h) => {
          const s = STAT_BY_KEY[h.stat];
          return (
            <li key={h.id} className="g-habit">
              <span className="g-habit-icon" style={{ "--c": s.color }} aria-hidden>{h.emoji}</span>
              <div className="g-grow">
                <p className="g-habit-name">{h.name}</p>
                <p className="g-muted">{h.category} · {frequencyLabel(h)}</p>
                <p className="g-muted">+{h.xp} XP · {s.icon} {s.label} +{h.stat_points}</p>
              </div>
              <div className="g-actions">
                <button type="button" className="g-icon-btn" onClick={() => setEditing(h)} aria-label={`Editar ${h.name}`}>✏️</button>
                <button type="button" className="g-icon-btn" onClick={() => remove(h)} disabled={busy} aria-label={`Eliminar ${h.name}`}>🗑️</button>
              </div>
            </li>
          );
        })}
      </ul>

      {editing && (
        <HabitForm habit={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
