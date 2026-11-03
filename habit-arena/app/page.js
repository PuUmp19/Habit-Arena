import Link from "next/link";
import PlayerCard from "@/components/PlayerCard";
import { planes } from "@/lib/data";

// Página pública → SSR (SEO)
export default function Landing() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <span className="pixel logo-sm">HabitArena</span>
        <Link href="/login" className="btn ghost">Entrar</Link>
      </nav>

      <section className="hero">
        <div>
          <h1 className="pixel">Sube de nivel tus hábitos</h1>
          <p className="lead">
            Cada hábito que cumples mejora una estadística de tu personaje.
            Toma agua, lee, haz ejercicio y mira cómo crece tu ficha.
          </p>
          <Link href="/registro" className="btn">Crear mi personaje</Link>
        </div>
        <PlayerCard />
      </section>

      <section className="features">
        <article><span>💧</span><h3>Hábito → Estadística</h3><p>Tomar agua sube Salud. Leer sube Inteligencia.</p></article>
        <article><span>🔥</span><h3>Rachas y niveles</h3><p>Cumple todo el día y gana experiencia.</p></article>
        <article><span>📴</span><h3>Funciona sin internet</h3><p>Instálala en tu celular y marca hábitos sin señal.</p></article>
      </section>

      <section className="plans">
        <h2 className="pixel">Planes</h2>
        <div className="plans-grid">
          {planes.map((p) => (
            <div key={p.nombre} className={`plan ${p.destacado ? "hl" : ""}`}>
              <h3>{p.nombre}</h3>
              <p className="pixel price">{p.precio}</p>
              <ul>{p.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="muted">© 2026 HabitArena · Universidad Tecnológica de Tabasco</footer>
    </main>
  );
}
