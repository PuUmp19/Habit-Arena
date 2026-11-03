import StatBar from "./StatBar";
import { jugador } from "@/lib/data";

// Ficha del jugador: la pieza principal de la app
export default function PlayerCard() {
  const pct = (jugador.xp / jugador.xpSiguiente) * 100;
  return (
    <section className="player">
      <header className="player-head">
        <div className="avatar" aria-hidden>🧙</div>
        <div>
          <p className="pixel player-name">{jugador.nombre}</p>
          <p className="muted">Nivel {jugador.nivel} · {jugador.xp}/{jugador.xpSiguiente} XP</p>
        </div>
      </header>

      <div className="xp"><div style={{ width: `${pct}%` }} /></div>

      {jugador.stats.map((s) => (
        <StatBar key={s.id} {...s} />
      ))}

      <p className="streak">🔥 Racha: <strong className="pixel">{jugador.racha}</strong> días</p>
    </section>
  );
}
