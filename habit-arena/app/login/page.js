import Link from "next/link";

// Página pública → SSR
export default function Login() {
  return (
    <main className="auth">
      <span className="pixel logo-sm">HabitArena</span>
      <h1 className="pixel">Iniciar sesión</h1>
      <form className="form">
        <label>Correo<input type="email" placeholder="tu@correo.com" /></label>
        <label>Contraseña<input type="password" placeholder="••••••••" /></label>
        <Link href="/dashboard" className="btn">Entrar</Link>
      </form>
      <p className="muted">¿Aún no tienes personaje? <Link href="/registro">Regístrate</Link></p>
    </main>
  );
}
