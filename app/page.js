import Link from "next/link";
import "./landing.css";

// Personaje de ejemplo para la portada
const jugador = {
  nivel: 8,
  racha: 12,
  stats: [
    { id: "salud", nombre: "Salud", icono: "❤️", valor: 82 },
    { id: "inteligencia", nombre: "Inteligencia", icono: "🧠", valor: 67 },
    { id: "energia", nombre: "Energía", icono: "⚡", valor: 74 },
  ],
};

// Página pública → SSR (SEO)
export const metadata = {
  title: "HabitArena — Convierte tus hábitos en un personaje",
  description:
    "Cada hábito que cumples sube una estadística de tu personaje: Salud, Inteligencia y Energía.",
};

const COLORES = { Salud: "#FF8F7A", Inteligencia: "#FFB25B", Energía: "#FFD95A" };

const pasos = [
  { titulo: "Elige tus hábitos", texto: "Agrega lo que quieres lograr. Cada uno sube una estadística de tu personaje." },
  { titulo: "Márcalos cada día", texto: "Abre la app unos segundos y toca lo que ya hiciste." },
  { titulo: "Sube de nivel", texto: "Gana experiencia y mantén tu racha de días seguidos." },
];

const grupos = [
  { stat: "Salud", icono: "❤️", texto: "Cuida tu cuerpo", habitos: ["💧 Tomar agua", "🏃 Hacer ejercicio"] },
  { stat: "Inteligencia", icono: "🧠", texto: "Entrena tu mente", habitos: ["📖 Leer 20 minutos", "🗣️ Practicar un idioma"] },
  { stat: "Energía", icono: "⚡", texto: "Recarga pilas", habitos: ["😴 Dormir bien", "🧘 Meditar 10 minutos"] },
];

export default function Landing() {
  const [salud, inteligencia, energia] = jugador.stats;

  return (
    <div className="wm">
      {/* ---------- BARRA ---------- */}
      <header className="wm-top wm-wrap">
        <a href="#inicio" className="wm-logo"><span aria-hidden>🏆</span> HabitArena</a>
        <Link href="/login" className="wm-btn wm-btn-soft wm-btn-sm">Entrar</Link>
      </header>

      <main>
        {/* ---------- INICIO ---------- */}
        <section className="wm-hero wm-wrap" id="inicio">
          <div className="wm-hero-text">
            <h1>Tus hábitos, como un videojuego</h1>
            <p className="wm-lead">
              Cada hábito que cumples sube una estadística de tu personaje.
              Mira cómo crece, gana experiencia y no rompas tu racha.
            </p>
            <div className="wm-actions">
              <Link href="/registro" className="wm-btn wm-btn-main">Crear mi personaje</Link>
              <a href="#como-funciona" className="wm-btn wm-btn-soft">Cómo funciona</a>
            </div>
          </div>

          <div className="wm-stage" aria-label="Personaje de ejemplo">
            <div className="wm-sun"><span aria-hidden>🧙</span></div>
            <p className="wm-chip wm-chip-a" style={{ background: COLORES.Salud }}>
              {salud.icono} {salud.nombre} <b className="wm-pixel">{salud.valor}</b>
            </p>
            <p className="wm-chip wm-chip-b" style={{ background: COLORES.Inteligencia }}>
              {inteligencia.icono} {inteligencia.nombre} <b className="wm-pixel">{inteligencia.valor}</b>
            </p>
            <p className="wm-chip wm-chip-c" style={{ background: COLORES.Energía }}>
              {energia.icono} {energia.nombre} <b className="wm-pixel">{energia.valor}</b>
            </p>
            <p className="wm-level">Nivel {jugador.nivel} · 🔥 {jugador.racha} días</p>
          </div>
        </section>

        {/* ---------- CÓMO FUNCIONA ---------- */}
        <section className="wm-sec wm-wrap" id="como-funciona">
          <h2>Cómo funciona</h2>
          <ol className="wm-steps">
            {pasos.map((p, i) => (
              <li key={p.titulo}>
                <span className="wm-num" aria-hidden>{i + 1}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- HÁBITOS ---------- */}
        <section className="wm-sec wm-wrap" id="habitos">
          <h2>Qué sube cada hábito</h2>
          <div className="wm-groups">
            {grupos.map((g) => (
              <article key={g.stat} className="wm-group">
                <header>
                  <span className="wm-dot" style={{ background: COLORES[g.stat] }} aria-hidden>{g.icono}</span>
                  <div>
                    <h3>{g.stat}</h3>
                    <p>{g.texto}</p>
                  </div>
                </header>
                <ul>
                  {g.habitos.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- LLAMADO FINAL ---------- */}
        <section className="wm-wrap">
          <div className="wm-cta">
            <div>
              <h2>Empieza hoy tu primera partida</h2>
              <p>Crea tu personaje en un minuto.</p>
            </div>
            <Link href="/registro" className="wm-btn wm-btn-coral">Crear mi personaje</Link>
          </div>
        </section>
      </main>

      <footer className="wm-foot wm-wrap">
        <p>HabitArena · Proyecto de Programación de Aplicaciones Web Progresivas · UT Tabasco 2026</p>
      </footer>
    </div>
  );
}
