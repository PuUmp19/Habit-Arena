"use client";
import { jugador } from "@/lib/data";

export default function Perfil() {
  return (
    <>
      <section className="card center">
        <div className="avatar big" aria-hidden>🧙</div>
        <p className="pixel player-name">{jugador.nombre}</p>
        <p className="muted">Nivel {jugador.nivel} · Racha {jugador.racha} días</p>
      </section>
      <ul className="list">
        <li className="habit"><span>🔔</span><div className="habit-info"><p>Recordatorios</p></div><span className="muted">Pronto</span></li>
        <li className="habit"><span>⭐</span><div className="habit-info"><p>Pasar a Premium</p></div><span className="muted">Pronto</span></li>
        <li className="habit"><span>🚪</span><div className="habit-info"><p>Cerrar sesión</p></div></li>
      </ul>
    </>
  );
}
