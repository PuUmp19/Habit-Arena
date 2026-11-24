"use client";
import { useState } from "react";
import { useGame } from "@/components/GameProvider";
import { DAYS, STAT_BY_KEY, fromISO, toISO } from "@/lib/game";

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function Historial() {
  const { logs, clears, levels, today } = useGame();
  const t = fromISO(today);
  const [cursor, setCursor] = useState({ y: t.getFullYear(), m: t.getMonth() });
  const [sel, setSel] = useState(today);

  const clearSet = new Set(clears.map((c) => c.day));
  const countBy = {};
  logs.forEach((l) => { countBy[l.log_date] = (countBy[l.log_date] || 0) + 1; });

  // Cuadrícula del mes (lunes primero)
  const first = new Date(cursor.y, cursor.m, 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const total = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => toISO(new Date(cursor.y, cursor.m, i + 1, 12)))];

  const move = (n) => {
    const d = new Date(cursor.y, cursor.m + n, 1, 12);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const selLogs = logs.filter((l) => l.log_date === sel);

  return (
    <div className="g-narrow">
      <h1 className="g-h1">Historial</h1>

      <section className="g-card">
        <div className="g-row-between">
          <button type="button" className="g-icon-btn" onClick={() => move(-1)} aria-label="Mes anterior">‹</button>
          <h2 className="g-h2">{MESES[cursor.m]} {cursor.y}</h2>
          <button type="button" className="g-icon-btn" onClick={() => move(1)} aria-label="Mes siguiente">›</button>
        </div>

        <div className="g-cal">
          {[...DAYS].map((d) => <span key={d.n} className="g-cal-h">{d.short}</span>)}
          {cells.map((iso, i) =>
            iso ? (
              <button
                type="button"
                key={iso}
                className={`g-day ${countBy[iso] ? "has" : ""} ${clearSet.has(iso) ? "full" : ""} ${iso === sel ? "sel" : ""} ${iso === today ? "today" : ""}`}
                onClick={() => setSel(iso)}
                aria-label={`${iso}: ${countBy[iso] || 0} hábitos`}
              >
                {Number(iso.slice(8))}
                {clearSet.has(iso) && <small aria-hidden>🔥</small>}
              </button>
            ) : <span key={`e${i}`} />
          )}
        </div>
        <p className="g-muted">🔥 = día completo (todos los hábitos)</p>
      </section>

      <section className="g-card">
        <h2 className="g-h2">{sel === today ? "Hoy" : sel}</h2>
        {selLogs.length === 0 ? (
          <p className="g-muted">No hay hábitos completados este día.</p>
        ) : (
          <ul className="g-list">
            {selLogs.map((l) => (
              <li key={l.id} className="g-log">
                <span aria-hidden>{l.habit_emoji}</span>
                <span className="g-grow">{l.habit_name}</span>
                <b className="g-muted">+{l.xp_awarded} XP · {STAT_BY_KEY[l.stat].icon}+{l.stat_points}</b>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="g-card">
        <h2 className="g-h2">Niveles alcanzados</h2>
        {levels.length === 0 ? (
          <p className="g-muted">Aún no subes de nivel. ¡Completa hábitos para ganar XP!</p>
        ) : (
          <ul className="g-list">
            {[...levels].reverse().map((l) => (
              <li key={l.level} className="g-log">
                <span aria-hidden>⭐</span>
                <span className="g-grow">Nivel {l.level}</span>
                <b className="g-muted">{new Date(l.reached_at).toLocaleDateString("es-MX")}</b>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
