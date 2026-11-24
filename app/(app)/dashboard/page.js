"use client";
import { useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import HabitItem from "@/components/HabitItem";
import HabitForm from "@/components/HabitForm";
import WeekChart from "@/components/WeekChart";
import { useGame } from "@/components/GameProvider";
import { isScheduled, motivation } from "@/lib/game";

export default function Dashboard() {
  const { habits, logs, profile, today, busy, completeHabit, undoHabit, seedHabits } = useGame();
  const [formOpen, setFormOpen] = useState(false);

  const todays = habits.filter((h) => isScheduled(h, today));
  const doneIds = new Set(logs.filter((l) => l.log_date === today).map((l) => l.habit_id));
  const pending = todays.filter((h) => !doneIds.has(h.id));
  const done = todays.filter((h) => doneIds.has(h.id));
  const pct = todays.length ? (done.length / todays.length) * 100 : 0;
  const toggle = (h) => (doneIds.has(h.id) ? undoHabit(h) : completeHabit(h));

  return (
    <div className="g-grid">
      <div className="g-col">
        <PlayerCard />
        <WeekChart />
      </div>

      <div className="g-col">
        <p className="g-banner">💬 {motivation({ total: todays.length, done: done.length, streak: profile.streak })}</p>

        <section className="g-card">
          <div className="g-row-between">
            <h2 className="g-h2">Misión de hoy</h2>
            <b className="g-pixel g-small-pixel">{done.length}/{todays.length}</b>
          </div>
          <div className="g-bar g-bar-green"><i style={{ width: `${pct}%` }} /></div>
        </section>

        {habits.length === 0 && (
          <section className="g-card g-empty">
            <p>Aún no tienes hábitos. Crea uno propio o empieza con 5 de ejemplo.</p>
            <button type="button" className="g-btn g-btn-ghost" onClick={seedHabits} disabled={busy}>Agregar hábitos de ejemplo</button>
          </section>
        )}

        {habits.length > 0 && todays.length === 0 && (
          <section className="g-card g-empty"><p>Hoy no tienes hábitos programados. ¡Descansa!</p></section>
        )}

        {pending.length > 0 && (
          <>
            <h3 className="g-h3">Pendientes</h3>
            <ul className="g-list">
              {pending.map((h) => <HabitItem key={h.id} habit={h} done={false} onToggle={toggle} busy={busy} />)}
            </ul>
          </>
        )}

        {done.length > 0 && (
          <>
            <h3 className="g-h3">Completados</h3>
            <ul className="g-list">
              {done.map((h) => <HabitItem key={h.id} habit={h} done onToggle={toggle} busy={busy} />)}
            </ul>
          </>
        )}

        <button type="button" className="g-btn g-btn-full" onClick={() => setFormOpen(true)}>+ Nuevo hábito</button>
      </div>

      {formOpen && <HabitForm onClose={() => setFormOpen(false)} />}
    </div>
  );
}
