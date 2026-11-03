"use client";
import StatBar from "@/components/StatBar";
import { jugador } from "@/lib/data";

export default function Stats() {
  return (
    <>
      <h2 className="section-title">Estadísticas</h2>
      <section className="card">
        {jugador.stats.map((s) => <StatBar key={s.id} {...s} />)}
      </section>
      <h2 className="section-title">Historial</h2>
      <section className="card">
        <p className="muted">Aquí irá la gráfica de tu semana.</p>
        <div className="week">
          {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
            <div key={d}><i style={{ height: `${30 + ((i * 17) % 50)}px` }} /><span>{d}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
