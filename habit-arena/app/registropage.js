import Link from "next/link";
import "../auth.css";

export default function Registro() {
  return (
    <main className="ly">
      <Link href="/" className="ly-logo"><span aria-hidden>🏆</span> HabitArena</Link>
      <section className="ly-card">
        <h1>Crea tu personaje</h1>
        <p className="ly-sub">Solo te tomará un minuto.</p>
        <form className="ly-form">
          <label>Nombre de jugador<input type="text" placeholder="PLAYER 01" /></label>
          <label>Correo<input type="email" placeholder="tu@correo.com" /></label>
          <label>Contraseña<input type="password" placeholder="••••••••" /></label>
          <Link href="/dashboard" className="ly-btn">Crear cuenta</Link>
        </form>
        <p className="ly-alt">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
      </section>
    </main>
  );
}