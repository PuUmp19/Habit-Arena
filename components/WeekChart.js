"use client";
import { addDays, dow, DAYS } from "@/lib/game";
import { useGame } from "./GameProvider";

// Gráfico sencillo: hábitos completados en los últimos 7 días
export default function WeekChart() {
  const { logs, today } = useGame();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const counts = days.map((d) => logs.filter((l) => l.log_date === d).length);
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <section className="g-card" aria-label="Progreso semanal">
      <div className="g-row-between">
        <h2 className="g-h2">Esta semana</h2>
        <b className="g-muted">{total} completados</b>
      </div>
      <div className="g-week">
        {days.map((d, i) => (
          <div key={d} className={d === today ? "hoy" : ""} title={`${counts[i]} hábitos`}>
            <b>{counts[i]}</b>
            <i style={{ height: `${Math.max(6, (counts[i] / max) * 90)}px` }} />
            <span>{DAYS.find((x) => x.n === dow(d)).short}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
