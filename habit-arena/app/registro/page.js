import Link from "next/link";

// Página pública → SSR
export default function Registro() {
  return (
    <main className="auth">
      <span className="pixel logo-sm">HabitArena</span>
      <h1 className="pixel">Crear personaje</h1>
      <form className="form">
        <label>Nombre de jugador<input type="text" placeholder="PLAYER 01" /></label>
        <label>Correo<input type="email" placeholder="tu@correo.com" /></label>
        <label>Contraseña<input type="password" placeholder="••••••••" /></label>
        <Link href="/dashboard" className="btn">Crear cuenta</Link>
      </form>
      <p className="muted">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
    </main>
  );
}
