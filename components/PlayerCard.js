"use client";
import { STATS, xpNeeded } from "@/lib/game";
import { useGame } from "./GameProvider";

// Ficha del jugador estilo RPG
export default function PlayerCard() {
  const { profile: p } = useGame();
  const need = xpNeeded(p.level);
  const pct = Math.min(100, (p.xp / need) * 100);

  return (
    <section className="g-card g-player" aria-label="Ficha del jugador">
      <header className="g-player-head">
        <span className="g-avatar" aria-hidden>🧙</span>
        <div className="g-grow">
          <p className="g-pixel g-name">{p.username}</p>
          <p className="g-muted">Aventurero · nivel {p.level}</p>
        </div>
        <span className="g-lvl g-pixel">NV {p.level}</span>
      </header>

      <div>
        <div className="g-row-between">
          <span>⭐ Experiencia</span>
          <b>{p.xp} / {need} XP</b>
        </div>
        <div className="g-bar g-bar-xp"><i style={{ width: `${pct}%` }} /></div>
      </div>

      {STATS.map((s) => (
        <div key={s.key}>
          <div className="g-row-between">
            <span>{s.icon} {s.label}</span>
            <b className="g-pixel g-small-pixel">{p[s.key]}</b>
          </div>
          <div className="g-bar" aria-label={`${s.label}: ${p[s.key]} de 100`}>
            <i style={{ width: `${p[s.key]}%`, background: s.color }} />
          </div>
        </div>
      ))}

      <p className="g-streak">🔥 Racha: <b className="g-pixel g-small-pixel">{p.streak}</b> {p.streak === 1 ? "día" : "días"}</p>
    </section>
  );
}
