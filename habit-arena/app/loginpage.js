import Link from "next/link";
import "../auth.css";
 
export default function Login() {
  return (
    <main className="ly">
      <Link href="/" className="ly-logo"><span aria-hidden>🏆</span> HabitArena</Link>
      <section className="ly-card">
        <h1>Inicia sesión</h1>
        <p className="ly-sub">Tu personaje te está esperando.</p>
        <form className="ly-form">
          <label>Correo<input type="email" placeholder="tu@correo.com" /></label>
          <label>Contraseña<input type="password" placeholder="••••••••" /></label>
          <Link href="/dashboard" className="ly-btn">Entrar</Link>
        </form>
        <p className="ly-alt">¿Aún no tienes personaje? <Link href="/registro">Regístrate</Link></p>
      </section>
    </main>
  );
}