"use client";
import { useState } from "react";
import { CATEGORIES, DAYS, EMOJIS, STATS } from "@/lib/game";
import { useGame } from "./GameProvider";

// Formulario (ventana emergente) para crear o editar un hábito
export default function HabitForm({ habit, onClose }) {
  const { createHabit, updateHabit, busy } = useGame();
  const [f, setF] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    emoji: habit?.emoji || "✨",
    category: habit?.category || CATEGORIES[0],
    frequency: habit?.frequency || "daily",
    days: habit?.days || [],
    stat: habit?.stat || "health",
    xp: habit?.xp ?? 10,
    stat_points: habit?.stat_points ?? 5,
  });
  const [err, setErr] = useState("");

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const toggleDay = (n) => set("days", f.days.includes(n) ? f.days.filter((d) => d !== n) : [...f.days, n]);

  const submit = async (e) => {
    e.preventDefault();
    const name = f.name.trim();
    if (!name) return setErr("Escribe un nombre para el hábito.");
    if (f.frequency === "weekly" && f.days.length === 0) return setErr("Elige al menos un día de la semana.");
    const values = {
      name,
      description: f.description.trim(),
      emoji: f.emoji.trim() || "✨",
      category: f.category,
      frequency: f.frequency,
      days: f.frequency === "weekly" ? f.days : [],
      stat: f.stat,
      xp: Math.min(100, Math.max(1, Number(f.xp) || 1)),
      stat_points: Math.min(20, Math.max(1, Number(f.stat_points) || 1)),
    };
    const ok = habit ? await updateHabit(habit.id, values) : await createHabit(values);
    if (ok) onClose();
  };

  return (
    <div className="g-modal" role="dialog" aria-modal="true" aria-label={habit ? "Editar hábito" : "Nuevo hábito"} onClick={onClose}>
      <form className="g-form" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h2 className="g-pixel g-form-title">{habit ? "Editar hábito" : "Nuevo hábito"}</h2>

        <label>Nombre
          <input value={f.name} maxLength={60} onChange={(e) => set("name", e.target.value)} placeholder="Ej. Tomar agua" autoFocus />
        </label>

        <label>Descripción (opcional)
          <input value={f.description} maxLength={140} onChange={(e) => set("description", e.target.value)} placeholder="Ej. 2 litros al día" />
        </label>

        <div>
          <span className="g-label">Icono</span>
          <div className="g-emojis">
            {EMOJIS.map((em) => (
              <button type="button" key={em} className={f.emoji === em ? "on" : ""} onClick={() => set("emoji", em)} aria-label={`Icono ${em}`}>{em}</button>
            ))}
          </div>
        </div>

        <label>Categoría
          <select value={f.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <div>
          <span className="g-label">Estadística que mejora</span>
          <div className="g-seg">
            {STATS.map((s) => (
              <button type="button" key={s.key} className={f.stat === s.key ? "on" : ""} onClick={() => set("stat", s.key)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="g-label">Frecuencia</span>
          <div className="g-seg">
            <button type="button" className={f.frequency === "daily" ? "on" : ""} onClick={() => set("frequency", "daily")}>Todos los días</button>
            <button type="button" className={f.frequency === "weekly" ? "on" : ""} onClick={() => set("frequency", "weekly")}>Días específicos</button>
          </div>
          {f.frequency === "weekly" && (
            <div className="g-days">
              {DAYS.map((d) => (
                <button type="button" key={d.n} className={f.days.includes(d.n) ? "on" : ""} onClick={() => toggleDay(d.n)} aria-label={d.name} aria-pressed={f.days.includes(d.n)}>
                  {d.short}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="g-two">
          <label>XP que otorga
            <input type="number" min="1" max="100" value={f.xp} onChange={(e) => set("xp", e.target.value)} />
          </label>
          <label>Puntos de estadística
            <input type="number" min="1" max="20" value={f.stat_points} onChange={(e) => set("stat_points", e.target.value)} />
          </label>
        </div>

        {err && <p className="g-error" role="alert">{err}</p>}

        <div className="g-form-actions">
          <button type="button" className="g-btn g-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="g-btn" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}
